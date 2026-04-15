import React from 'react';

export default function BGA2Page() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 99999, backgroundColor: '#fff' }}>
      <iframe 
        src="/bga2_raw.html" 
        style={{ width: '100vw', height: '100vh', border: 'none', display: 'block' }}
        title="BGA2 Redesign"
      />
    </div>
  );
}
