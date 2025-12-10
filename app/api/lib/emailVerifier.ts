/**
 * Email Verifier Multi-API for Next.js
 * Cascades between multiple free APIs
 */

type VerifyFunction = (email: string) => Promise<EmailResult>;

type EmailResult = {
  email: string;
  valid: boolean;
  status: string;
  confidence: string;
  details: string;
  provider?: string;
  score?: number;
};

type ApiProvider = {
  name: string;
  enabled: () => boolean;
  verify: VerifyFunction;
  errorCodes: number[];
};

// Provider status tracking (in-memory, resets on cold start)
const providerStatus: Record<string, { exhausted: boolean; lastError: string | null; errorCount: number }> = {};

// Sleep utility
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// PROVIDER IMPLEMENTATIONS
// ============================================

async function verifyWithVerifalia(email: string): Promise<EmailResult> {
  const username = process.env.VERIFALIA_USERNAME;
  const password = process.env.VERIFALIA_PASSWORD;
  
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  
  const createResponse = await fetch('https://api.verifalia.com/v2.5/email-validations', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      entries: [{ inputData: email }],
      quality: 'Standard'
    })
  });

  if (!createResponse.ok) {
    const error: any = new Error(`Verifalia error: ${createResponse.status}`);
    error.statusCode = createResponse.status;
    throw error;
  }

  const job = await createResponse.json();
  
  if (job.overview.status === 'Completed') {
    return mapVerifaliaResult(email, job.entries[0]);
  }

  const jobId = job.overview.id;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    await sleep(1000);
    
    const statusResponse = await fetch(`https://api.verifalia.com/v2.5/email-validations/${jobId}`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    
    if (!statusResponse.ok) {
      const error: any = new Error(`Verifalia polling error: ${statusResponse.status}`);
      error.statusCode = statusResponse.status;
      throw error;
    }
    
    const statusData = await statusResponse.json();
    
    if (statusData.overview.status === 'Completed') {
      return mapVerifaliaResult(email, statusData.entries[0]);
    }
    
    attempts++;
  }
  
  throw new Error('Verifalia timeout');
}

function mapVerifaliaResult(email: string, entry: any): EmailResult {
  const classification = entry.classification;
  
  let valid = false;
  let status = 'unknown';
  let confidence = 'low';
  let details = '';

  switch (classification) {
    case 'Deliverable':
      valid = true;
      status = 'valid';
      confidence = 'high';
      details = 'Email verified and deliverable';
      break;
    case 'Undeliverable':
      valid = false;
      status = 'invalid';
      confidence = 'high';
      details = 'Email address does not exist';
      break;
    case 'Risky':
      valid = true;
      status = 'risky';
      confidence = 'medium';
      details = 'Risky email (catch-all or temporary)';
      break;
    case 'Unknown':
      valid = false;
      status = 'unknown';
      confidence = 'low';
      details = 'Cannot verify with certainty';
      break;
    default:
      details = `Classification: ${classification}`;
  }

  return { email, valid, status, confidence, details };
}

async function verifyWithHunter(email: string): Promise<EmailResult> {
  const apiKey = process.env.HUNTER_API_KEY;
  
  const response = await fetch(
    `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${apiKey}`
  );

  if (!response.ok) {
    const error: any = new Error(`Hunter error: ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }

  const data = await response.json();
  
  if (data.errors) {
    const error: any = new Error(data.errors[0]?.details || 'Hunter API error');
    error.statusCode = 402;
    throw error;
  }

  return mapHunterResult(email, data.data);
}

function mapHunterResult(email: string, result: any): EmailResult {
  const status = result.status;
  
  let valid = false;
  let confidence = 'low';
  let details = '';

  switch (status) {
    case 'valid':
      valid = true;
      confidence = 'high';
      details = 'Email verified and exists';
      break;
    case 'invalid':
      valid = false;
      confidence = 'high';
      details = 'Email address does not exist';
      break;
    case 'accept_all':
      valid = true;
      confidence = 'medium';
      details = 'Catch-all server (accepts all addresses)';
      break;
    case 'webmail':
      valid = result.score >= 50;
      confidence = 'low';
      details = 'Webmail address - limited verification';
      break;
    case 'disposable':
      valid = false;
      confidence = 'high';
      details = 'Temporary/disposable email';
      break;
    default:
      valid = result.score >= 70;
      confidence = 'low';
      details = `Status: ${status}`;
  }

  if (result.score) {
    details += ` (Score: ${result.score}/100)`;
  }

  return { email, valid, status, confidence, details, score: result.score };
}

async function verifyWithAbstract(email: string): Promise<EmailResult> {
  const apiKey = process.env.ABSTRACT_API_KEY;
  
  const response = await fetch(
    `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    const error: any = new Error(`AbstractAPI error: ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }

  const data = await response.json();
  
  if (data.error) {
    const error: any = new Error(data.error.message || 'AbstractAPI error');
    error.statusCode = 402;
    throw error;
  }

  return mapAbstractResult(email, data);
}

function mapAbstractResult(email: string, data: any): EmailResult {
  const deliverability = data.deliverability;
  
  let valid = deliverability === 'DELIVERABLE';
  let status = deliverability.toLowerCase();
  let confidence = data.is_smtp_valid?.value ? 'high' : 'medium';
  
  let details = '';
  if (valid) {
    details = 'Email verified and deliverable';
  } else if (deliverability === 'UNDELIVERABLE') {
    details = 'Email address does not exist';
  } else {
    details = 'Uncertain status';
  }

  if (data.is_disposable_email?.value) {
    valid = false;
    status = 'disposable';
    details = 'Temporary/disposable email';
  }

  if (data.is_catchall_email?.value) {
    status = 'accept_all';
    confidence = 'medium';
    details = 'Catch-all server';
  }

  return { email, valid, status, confidence, details };
}

async function verifyWithZeroBounce(email: string): Promise<EmailResult> {
  const apiKey = process.env.ZEROBOUNCE_API_KEY;
  
  const response = await fetch(
    `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    const error: any = new Error(`ZeroBounce error: ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }

  const data = await response.json();
  
  if (data.error) {
    const error: any = new Error(data.error || 'ZeroBounce error');
    error.statusCode = 402;
    throw error;
  }

  return mapZeroBounceResult(email, data);
}

function mapZeroBounceResult(email: string, data: any): EmailResult {
  const zbStatus = data.status;
  
  let valid = zbStatus === 'valid';
  let status = zbStatus;
  let confidence = 'medium';
  let details = data.sub_status || '';

  switch (zbStatus) {
    case 'valid':
      valid = true;
      confidence = 'high';
      details = 'Email verified and valid';
      break;
    case 'invalid':
      valid = false;
      confidence = 'high';
      details = data.sub_status || 'Address does not exist';
      break;
    case 'catch-all':
      valid = true;
      status = 'accept_all';
      confidence = 'medium';
      details = 'Catch-all server';
      break;
    case 'spamtrap':
      valid = false;
      confidence = 'high';
      details = 'Spam trap address';
      break;
    case 'abuse':
      valid = false;
      confidence = 'high';
      details = 'Known abuse reporter';
      break;
    case 'do_not_mail':
      valid = false;
      confidence = 'high';
      details = 'Do not mail';
      break;
    default:
      details = `Status: ${zbStatus}`;
  }

  return { email, valid, status, confidence, details };
}

async function verifyWithEmailListVerify(email: string): Promise<EmailResult> {
  const apiKey = process.env.EMAILLISTVERIFY_API_KEY;
  
  const response = await fetch(
    `https://apps.emaillistverify.com/api/verifyEmail?secret=${apiKey}&email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    const error: any = new Error(`EmailListVerify error: ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }

  const text = await response.text();
  return mapEmailListVerifyResult(email, text.trim());
}

function mapEmailListVerifyResult(email: string, result: string): EmailResult {
  let valid = false;
  let status = result.toLowerCase();
  let confidence = 'medium';
  let details = '';

  switch (result.toLowerCase()) {
    case 'ok':
      valid = true;
      status = 'valid';
      confidence = 'high';
      details = 'Email verified and valid';
      break;
    case 'fail':
    case 'invalid':
      valid = false;
      status = 'invalid';
      confidence = 'high';
      details = 'Address does not exist';
      break;
    case 'unknown':
      valid = false;
      status = 'unknown';
      confidence = 'low';
      details = 'Cannot verify';
      break;
    case 'catch_all':
      valid = true;
      status = 'accept_all';
      confidence = 'medium';
      details = 'Catch-all server';
      break;
    case 'disposable':
      valid = false;
      status = 'disposable';
      confidence = 'high';
      details = 'Temporary email';
      break;
    default:
      details = `Result: ${result}`;
  }

  return { email, valid, status, confidence, details };
}

// ============================================
// MAIN API
// ============================================

const API_PROVIDERS: ApiProvider[] = [
  {
    name: 'Verifalia',
    enabled: () => !!process.env.VERIFALIA_USERNAME && !!process.env.VERIFALIA_PASSWORD,
    verify: verifyWithVerifalia,
    errorCodes: [402, 429]
  },
  {
    name: 'Hunter',
    enabled: () => !!process.env.HUNTER_API_KEY,
    verify: verifyWithHunter,
    errorCodes: [402, 429]
  },
  {
    name: 'AbstractAPI',
    enabled: () => !!process.env.ABSTRACT_API_KEY,
    verify: verifyWithAbstract,
    errorCodes: [402, 429, 422]
  },
  {
    name: 'ZeroBounce',
    enabled: () => !!process.env.ZEROBOUNCE_API_KEY,
    verify: verifyWithZeroBounce,
    errorCodes: [402, 429]
  },
  {
    name: 'EmailListVerify',
    enabled: () => !!process.env.EMAILLISTVERIFY_API_KEY,
    verify: verifyWithEmailListVerify,
    errorCodes: [402, 429]
  }
];

// Initialize provider status
API_PROVIDERS.forEach(p => {
  if (!providerStatus[p.name]) {
    providerStatus[p.name] = { exhausted: false, lastError: null, errorCount: 0 };
  }
});

export async function verifyEmail(email: string): Promise<EmailResult> {
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      email,
      valid: false,
      status: 'invalid_format',
      confidence: 'high',
      details: 'Invalid email format',
      provider: 'local'
    };
  }

  const enabledProviders = API_PROVIDERS.filter(p => p.enabled());
  
  if (enabledProviders.length === 0) {
    return {
      email,
      valid: false,
      status: 'no_api_configured',
      confidence: 'low',
      details: 'No API configured. Add at least one API key.',
      provider: 'none'
    };
  }

  for (const provider of enabledProviders) {
    if (providerStatus[provider.name]?.exhausted) {
      console.log(`⏭️ Skip ${provider.name} (exhausted)`);
      continue;
    }

    try {
      console.log(`🔍 Trying ${provider.name} for ${email}`);
      const result = await provider.verify(email);
      
      console.log(`✅ ${provider.name} responded: ${result.status}`);
      return {
        ...result,
        provider: provider.name
      };

    } catch (error: any) {
      console.error(`❌ ${provider.name} error:`, error.message);
      
      if (provider.errorCodes.includes(error.statusCode) || 
          error.message.includes('limit') || 
          error.message.includes('quota') ||
          error.message.includes('credit')) {
        
        console.log(`💳 ${provider.name} seems exhausted, moving to next...`);
        providerStatus[provider.name] = { 
          exhausted: true, 
          lastError: error.message,
          errorCount: (providerStatus[provider.name]?.errorCount || 0) + 1
        };
        continue;
      }
      
      providerStatus[provider.name] = {
        ...providerStatus[provider.name],
        lastError: error.message,
        errorCount: (providerStatus[provider.name]?.errorCount || 0) + 1
      };
    }
  }

  return {
    email,
    valid: false,
    status: 'all_apis_exhausted',
    confidence: 'low',
    details: 'All API credits exhausted. Try again tomorrow or add more API keys.',
    provider: 'none'
  };
}

export function getProvidersStatus() {
  return API_PROVIDERS.map(p => ({
    name: p.name,
    configured: p.enabled(),
    status: providerStatus[p.name] || { exhausted: false, errorCount: 0 },
    limit: 'varies'
  }));
}

export function resetProviderStatus() {
  for (const provider of API_PROVIDERS) {
    providerStatus[provider.name] = { 
      exhausted: false, 
      lastError: null,
      errorCount: 0 
    };
  }
}
