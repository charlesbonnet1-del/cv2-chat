'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// 1. LE DICTIONNAIRE DE CONTENU
const content = {
  fr: {
    title: "Envisagez-vous une collaboration ?",
    subtitle: "Mon clone numérique filtre les opportunités. Vérifions en 3 clics si nos visions s'alignent.",
    btnStart: "Démarrer le test",
    q1: "Q1/3 : C'est mardi matin. Comment évaluez-vous ma performance en télétravail ?",
    a1_fail: "Je vérifie votre statut Slack.",
    a1_pass: "Je regarde les livrables produits.",
    q2: "Q2/3 : Un membre du Board veut une fonctionnalité, mais la Data prédit un échec.",
    a2_fail: "On l'intègre pour faire plaisir.",
    a2_pass: "On refuse avec les chiffres à l'appui.",
    q3: "Q3/3 : Innovation IA : Risque d'image vs Gain de productivité x4.",
    a3_fail: "On ne prend aucun risque.",
    a3_pass: "On lance un pilote contrôlé.",
    failTitle: "Culture Mismatch",
    failText: "Nos modes de fonctionnement diffèrent trop. Je vous fais gagner du temps : je ne serais pas le bon fit pour vous.",
    successTitle: "Match Confirmé",
    successText: "Vous valorisez l'autonomie et la Data. C'est le terrain de jeu que je cherche.",
    btnMail: "Me contacter par email"
  },
  en: {
    title: "Considering a collaboration?",
    subtitle: "My digital clone filters opportunities. Let's check in 3 clicks if our visions align.",
    btnStart: "Start the check",
    q1: "Q1/3: It's Tuesday morning. How do you assess my remote work performance?",
    a1_fail: "I check your Slack status.",
    a1_pass: "I look at the deliverables produced.",
    q2: "Q2/3: A Board member wants a feature, but Data predicts failure.",
    a2_fail: "We build it to please them.",
    a2_pass: "We refuse based on the data.",
    q3: "Q3/3: AI Innovation: Image risk vs 4x productivity gain.",
    a3_fail: "We take zero risk.",
    a3_pass: "We launch a controlled pilot.",
    failTitle: "Culture Mismatch",
    failText: "Our working styles are too different. I'll save you time: I wouldn't be the right fit for you.",
    successTitle: "Match Confirmed",
    successText: "You value autonomy and Data. That's exactly the playground I'm looking for.",
    btnMail: "Contact me via email"
  }
}

export default function RecruiterPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState('intro')
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [isMobile, setIsMobile] = useState(false) // Pour gérer le design mobile
  const pathname = usePathname()

  const t = content[lang]

  // Désactiver sur /coinhouse
  const isDisabledRoute = pathname === '/coinhouse'

  useEffect(() => {
    // 1. Detection Mobile & Langue
    if (typeof window !== 'undefined') {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)

        const browserLang = navigator.language.startsWith('fr') ? 'fr' : 'en'
        setLang(browserLang)

        // Nettoyage event listener
        return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    // 2. Timer d'apparition - seulement si pas sur route désactivée
    if (isDisabledRoute) return

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10000) // 10 secondes

    return () => clearTimeout(timer)
  }, [isDisabledRoute])

  const closePopup = () => setIsVisible(false)
  const toggleLang = () => setLang(prev => prev === 'fr' ? 'en' : 'fr')

  // STYLES DYNAMIQUES
  const styles = {
    overlay: {
      position: 'fixed' as const, 
      zIndex: 9999,
      // LOGIQUE MOBILE : Centré si mobile, sinon en bas à droite
      bottom: isMobile ? '20px' : '30px', 
      right: isMobile ? 'auto' : '30px', 
      left: isMobile ? '50%' : 'auto',
      width: isMobile ? '90%' : '380px', // Plus large sur mobile
      
      opacity: isVisible ? 1 : 0,
      // TRANSFORMATION : On ajoute le translateX(-50%) sur mobile pour centrer parfaitement
      transform: isVisible 
        ? (isMobile ? 'translateX(-50%) translateY(0)' : 'translateY(0)') 
        : (isMobile ? 'translateX(-50%) translateY(20px)' : 'translateY(20px)'),
      
      transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
      pointerEvents: (isVisible ? 'auto' : 'none') as 'auto' | 'none',
    },
    card: {
      background: '#FDFBF7', 
      borderRadius: '20px', padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.03)',
      textAlign: 'center' as const,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#666',
      position: 'relative' as const
    },
    title: {
      fontFamily: '"Times New Roman", Times, serif', fontStyle: 'italic', fontSize: '1.2rem',
      color: '#333', 
      marginBottom: '15px', 
      marginTop: '30px' // AJOUT D'ESPACE ICI pour ne pas toucher les boutons
    },
    text: { marginBottom: '25px', fontSize: '0.95rem', lineHeight: 1.5 },
    btn: {
      display: 'block', width: '100%', padding: '12px 20px', margin: '10px 0',
      background: '#FFF', border: '1px solid #EAEAEA', borderRadius: '50px',
      color: '#666', cursor: 'pointer', fontSize: '0.9rem', transition: '0.3s'
    },
    btnPrimary: { background: '#333', color: '#FFF', border: 'none' },
    topControls: { position: 'absolute' as const, top: '15px', right: '20px', display: 'flex', gap: '10px', alignItems: 'center' },
    close: { cursor: 'pointer', fontSize: '20px', color: '#BBB' },
    langSwitch: { 
      cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', color: '#BBB', 
      border: '1px solid #EEE', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase'
    }
  }

  if (!isVisible || isDisabledRoute) return null

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        
        {/* CONTROLS */}
        <div style={styles.topControls}>
          {/* Inversion du texte du bouton : affiche la langue CIBLE */}
          <span style={styles.langSwitch} onClick={toggleLang}>{lang === 'fr' ? 'EN' : 'FR'}</span>
          <span style={styles.close} onClick={closePopup}>×</span>
        </div>

        {/* INTRO */}
        {step === 'intro' && (
          <div>
            <h2 style={styles.title}>{t.title}</h2>
            <p style={styles.text}>{t.subtitle}</p>
            <button style={{...styles.btn, ...styles.btnPrimary}} onClick={() => setStep('1')}>{t.btnStart}</button>
          </div>
        )}

        {/* Q1 */}
        {step === '1' && (
          <div>
            <p style={{marginBottom:'20px'}}><strong>{t.q1}</strong></p>
            <button style={styles.btn} onClick={() => setStep('fail')}>{t.a1_fail}</button>
            <button style={styles.btn} onClick={() => setStep('2')}>{t.a1_pass}</button>
          </div>
        )}

        {/* Q2 */}
        {step === '2' && (
          <div>
            <p style={{marginBottom:'20px'}}><strong>{t.q2}</strong></p>
            <button style={styles.btn} onClick={() => setStep('fail')}>{t.a2_fail}</button>
            <button style={styles.btn} onClick={() => setStep('3')}>{t.a2_pass}</button>
          </div>
        )}

        {/* Q3 */}
        {step === '3' && (
          <div>
            <p style={{marginBottom:'20px'}}><strong>{t.q3}</strong></p>
            <button style={styles.btn} onClick={() => setStep('fail')}>{t.a3_fail}</button>
            <button style={styles.btn} onClick={() => setStep('success')}>{t.a3_pass}</button>
          </div>
        )}

        {/* FAIL */}
        {step === 'fail' && (
          <div>
            <h2 style={{...styles.title, color: '#A74646', fontStyle: 'normal'}}>{t.failTitle}</h2>
            <p style={styles.text}>{t.failText}</p>
          </div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <div>
            <h2 style={{...styles.title, color: '#4F8A5E', fontStyle: 'normal'}}>{t.successTitle}</h2>
            <p style={styles.text}>{t.successText}</p>
            <button 
                style={{...styles.btn, ...styles.btnPrimary}} 
                onClick={() => window.location.href='mailto:charles.bonnet@pm.me'}
            >
                {t.btnMail}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
