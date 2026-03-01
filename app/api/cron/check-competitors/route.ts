import { NextResponse } from 'next/server';
import path from 'path';

import { supabase } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import OpenAI from 'openai';
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import puppeteerRender from 'puppeteer';
import { install, resolveBuildId, Browser, BrowserPlatform } from '@puppeteer/browsers';
import os from 'os';
import * as fs from 'fs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 300; // 5 minutes for multiple browser tasks

export async function GET(req: Request) {
    // Basic auth check for cron (Vercel sets CRON_SECRET)
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { data: competitors, error: compError } = await supabase
            .from('competitors')
            .select('*');

        if (compError) throw compError;
        if (!competitors || competitors.length === 0) {
            return NextResponse.json({ message: 'No competitors found' });
        }

        const results = [];
        for (const competitor of competitors) {
            const result = await processCompetitor(competitor);
            results.push(result);
        }

        return NextResponse.json({ results });
    } catch (error: any) {
        console.error('Cron Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function processCompetitor(competitor: any) {
    let browser = null;
    try {
        let executablePath: string;
        let p: any;

        if (process.env.RENDER) {
            // Standard Puppeteer for Render: force dynamic installation at runtime
            p = puppeteerRender;
            const cacheDir = path.join(os.tmpdir(), 'puppeteer-dynamic');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            process.env.PUPPETEER_CACHE_DIR = cacheDir;

            // Explicitly install the browser right now
            const buildId = await resolveBuildId(Browser.CHROME, BrowserPlatform.LINUX, '127.0.6533.88');
            const installOptions = {
                cacheDir,
                browser: Browser.CHROME,
                buildId,
            };
            const installedBrowser = await install(installOptions);
            executablePath = installedBrowser.executablePath;
            console.log("Dynamically installed chrome to", executablePath);
        } else {
            // Sparticuz Chromium for Vercel
            p = puppeteerCore;
            executablePath = await chromium.executablePath(
                "https://github.com/sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar"
            );
        }

        browser = await p.launch({
            args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath || undefined,
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        // Anti-bot stealth and longer timeouts
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7' });
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto(competitor.url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait 5s as requested
        await new Promise(r => setTimeout(r, 5000));

        // Generic cookie banner removal (very basic)
        const cookieSelectors = [
            'button[id*="cookie"]', 'button[class*="cookie"]',
            'button[id*="accept"]', 'button[class*="accept"]',
            '#onetrust-accept-btn-handler'
        ];
        for (const selector of cookieSelectors) {
            try {
                const btn = await page.$(selector);
                if (btn) await btn.click();
            } catch (e) {
                // ignore
            }
        }

        const screenshot = await page.screenshot({ encoding: 'base64' });
        const screenshotBuffer = Buffer.from(screenshot, 'base64');

        // Upload to Supabase Storage
        const fileName = `${competitor.id}/${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('screenshots')
            .upload(fileName, screenshotBuffer, { contentType: 'image/png' });

        if (uploadError) throw uploadError;

        const screenshotUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/screenshots/${fileName}`;

        // Get previous snapshot
        const { data: lastSnapshot } = await supabase
            .from('snapshots')
            .select('*')
            .eq('competitor_id', competitor.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        let aiReport: any = { change_detected: false };

        if (lastSnapshot) {
            aiReport = await compareWithAI(lastSnapshot.screenshot_url, screenshotUrl);
        }

        // Save new snapshot
        const { error: insertError } = await supabase.from('snapshots').insert({
            competitor_id: competitor.id,
            screenshot_url: screenshotUrl,
            change_detected: aiReport.change_detected,
            category: aiReport.category,
            description: aiReport.description,
            impact_score: aiReport.impact_score,
        });

        if (insertError) throw insertError;

        // Send Email if change detected
        if (aiReport.change_detected) {
            await resend.emails.send({
                from: 'CompetitorWatch <alerts@yourdomain.com>',
                to: 'notifications@charlesbonnet.com',
                subject: `Alert: Change detected on ${competitor.name}`,
                html: `
                    <h2>Change detected on ${competitor.name}</h2>
                    <p><strong>Category:</strong> ${aiReport.category}</p>
                    <p><strong>Description:</strong> ${aiReport.description}</p>
                    <p><strong>Impact Score:</strong> ${aiReport.impact_score}/5</p>
                    <hr/>
                    <a href="${competitor.url}">Visit Site</a>
                `
            });
        }

        return { competitor: competitor.name, change: aiReport.change_detected };

    } catch (e: any) {
        console.error(`Error processing ${competitor.name}:`, e);
        return { competitor: competitor.name, error: e.message };
    } finally {
        if (browser) await browser.close();
    }
}

async function compareWithAI(oldUrl: string, newUrl: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `Tu es un Analyste en Intelligence Compétitive spécialisé dans l'e-commerce et les abonnements presse.

Ta mission :
Comparer deux captures d'écran (Hier vs Aujourd'hui) d'une page de vente de concurrent.
Ignorer : Les changements d'articles de presse, les publicités tierces et les modifications mineures de mise en page.
Cibler : Les changements de prix, l'apparition de badges 'Promo', les nouveaux paliers d'abonnement, ou les changements de 'Call to Action'.

Sortie : Un rapport JSON structuré avec : change_detected (booléen), category (Price/Design/Product), description (courte et précise), et impact_score (1 à 5).`
            },
            {
                role: "user",
                content: [
                    { type: "text", text: "Voici la capture d'hier et celle d'aujourd'hui. Analyse les changements significatifs." },
                    { type: "image_url", image_url: { url: oldUrl } },
                    { type: "image_url", image_url: { url: newUrl } }
                ],
            },
        ],
        response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
}
