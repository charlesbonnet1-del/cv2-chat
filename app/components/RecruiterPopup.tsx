'use client'

import { useState, useEffect } from 'react'

export default function RecruiterPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState('intro') // intro, 1, 2, 3, success, fail
  const [isClosing, setIsClosing] = useState(false)

  // Le Timer de 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  const closePopup = () => {
    setIsVisible(false)
  }

  // Styles (Intégrés pour éviter les fichiers CSS externes)
  const styles = {
    overlay: {
      position: 'fixed' as 'fixed', bottom: '30px', right: '30px', width: '380px', zIndex: 9999,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
      pointerEvents: isVisible ? 'auto' as 'auto' : 'none' as 'none',
    },
    card: {
      background: '#FDFBF7', // Ton fond crème
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.03)',
      textAlign: 'center' as 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#666'
    },
    title: {
      fontFamily: '"Times New Roman", Times, serif',
      fontStyle: 'italic',
      fontSize: '1.2rem',
      color: '#333',
      marginBottom: '15px',
      marginTop: 0
    },
    btn: {
      display: 'block', width: '100%', padding: '12px 20px', margin: '10px 0',
      background: '#FFF', border: '1px solid #EAEAEA', borderRadius: '50px',
      color: '#666', cursor: 'pointer', fontSize: '0.9rem', transition: '0.3s'
    },
    btnPrimary: {
      background: '#333', color: '#FFF', border: 'none'
    },
    close: {
      position: 'absolute' as 'absolute', top: '15px', right: '20px', cursor: 'pointer', fontSize: '20px', color: '#BBB'
    }
  }

  if (!isVisible && !isClosing) return null

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <span style={styles.close} onClick={closePopup}>×</span>

        {/* INTRO */}
        {step === 'intro' && (
          <div>
            <h2 style={styles.title}>Envisagez-vous une collaboration ?</h2>
            <p style={{marginBottom: '25px', fontSize: '0.95rem'}}>Mon clone numérique filtre les opportunités. Vérifions en 3 clics si nos visions s'alignent.</p>
            <button style={{...styles.btn, ...styles.btnPrimary}} onClick={() => setStep('1')}>Démarrer le test</button>
          </div>
        )}

        {/* Q1 */}
        {step === '1' && (
          <div>
            <p style={{marginBottom:'20px'}}><strong>Q1/3 :</strong> C'est mardi matin. Comment évaluez-vous ma performance en télétravail ?</p>
            <button style={styles.btn} onClick={() => setStep('fail')}>Je vérifie votre statut Slack.</button>
            <button style={styles.btn} onClick={() => setStep('2')}>Je regarde les livrables produits.</button>
          </div>
        )}

        {/* Q2 */}
        {step === '2' && (
          <div>
            <p style={{marginBottom:'20px'}}><strong>Q2/3 :</strong> Un membre du Board veut une fonctionnalité, mais la Data prédit un échec.</p>
            <button style={styles.btn} onClick={() => setStep('fail')}>On l'intègre pour faire plaisir.</button>
            <button style={styles.btn} onClick={() => setStep('3')}>On refuse avec les chiffres à l'appui.</button>
          </div>
        )}

        {/* Q3 */}
        {step === '3' && (
          <div>
            <p style={{marginBottom:'20px'}}><strong>Q3/3 :</strong> Innovation IA : Risque d'image vs Gain de productivité x4.</p>
            <button style={styles.btn} onClick={() => setStep('fail')}>On ne prend aucun risque.</button>
            <button style={styles.btn} onClick={() => setStep('success')}>On lance un pilote contrôlé.</button>
          </div>
        )}

        {/* FAIL */}
        {step === 'fail' && (
          <div>
            <h2 style={{...styles.title, color: '#A74646', fontStyle: 'normal'}}>Culture Mismatch</h2>
            <p>Nos modes de fonctionnement diffèrent trop. Je vous fais gagner du temps : je ne serais pas le bon fit pour vous.</p>
          </div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <div>
            <h2 style={{...styles.title, color: '#4F8A5E', fontStyle: 'normal'}}>Match Confirmé</h2>
            <p style={{marginBottom:'20px'}}>Vous valorisez l'autonomie et la Data. C'est le terrain de jeu que je cherche.</p>
            <button style={styles.btn} onClick={() => window.location.href='mailto:tonemail@exemple.com'}>Me contacter par email</button>
          </div>
        )}
      </div>
    </div>
  )
}
