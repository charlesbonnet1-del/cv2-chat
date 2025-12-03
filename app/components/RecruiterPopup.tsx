'use client'

import { useState, useEffect } from 'react'

// 1. LE DICTIONNAIRE DE CONTENU (Facile à éditer)
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
    btnCalendar: "Réserver un entretien",
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
    btnCalendar: "Book a meeting",
    btnMail: "Contact me via email"
  }
}

export default function RecruiterPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState('intro') 
  const [lang, setLang] = useState<'fr' | 'en'>('fr') // Langue par défaut
  
  // Le texte actif basé sur la langue
  const t = content[lang]

  useEffect(() => {
    // 1. Détection automatique de la langue du navigateur
    const browserLang = navigator.language.startsWith('fr') ? 'fr' : 'en'
    setLang(browserLang)

    // 2. Timer d'apparition (10 secondes)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10000)
    
    return () => clearTimeout(timer)
  }, [])

  const closePopup = () => setIsVisible(false)
  const toggleLang = () => setLang(prev => prev === 'fr' ? 'en' : 'fr')

  // STYLES
  const styles = {
    overlay: {
      position: 'fixed' as 'fixed', bottom: '30px', right: '30px', width: '380px', zIndex: 9999,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
      pointerEvents: isVisible ? 'auto' as 'auto' : 'none' as 'none',
    },
    card: {
      background: '#FDFBF7', 
      borderRadius: '20px', padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.03)',
      textAlign: 'center' as 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#666',
      position: 'relative' as 'relative'
    },
    title: {
      fontFamily: '"Times New Roman", Times, serif', fontStyle: 'italic', fontSize: '1.2rem',
      color: '#333', marginBottom: '15px', marginTop: 0
    },
    text: { marginBottom: '25px', fontSize: '0.95rem', lineHeight: 1.5 },
    btn: {
      display: 'block', width: '100%', padding: '12px 20px', margin: '10px 0',
      background: '#FFF', border: '1px solid #EAEAEA', borderRadius: '50px',
      color: '#666', cursor: 'pointer', fontSize: '0.9rem', transition: '0.3s'
    },
    btnPrimary: { background: '#333', color: '#FFF', border: 'none' },
    topControls: { position: 'absolute' as 'absolute', top: '15px', right: '20px', display: 'flex', gap: '10px', alignItems: 'center' },
    close: { cursor: 'pointer', fontSize: '20px', color: '#BBB' },
    langSwitch: { 
      cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' as 'bold', color: '#BBB', 
      border: '1px solid #EEE', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' as 'uppercase'
    }
  }

  if (!isVisible) return null

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        
        {/* CONTROLS (Lang + Close) */}
        <div style={styles.topControls}>
          <span style={styles.langSwitch} onClick={toggleLang}>{lang}</span>
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
            <button style={{...styles.btn, ...styles.btnPrimary}} onClick={() => window.open('https://calendly.com/TON-LIEN', '_blank')}>{t.btnCalendar}</button>
            <button style={styles.btn} onClick={() => window.location.href='mailto:tonemail@exemple.com'}>{t.btnMail}</button>
          </div>
        )}
      </div>
    </div>
  )
}
