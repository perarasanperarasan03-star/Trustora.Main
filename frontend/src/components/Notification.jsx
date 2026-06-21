import React, { useState, useEffect } from 'react';

function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: '#1A3D1A', border: '#00C851', color: '#00C851' },
    error: { bg: '#3D1A1A', border: '#E53935', color: '#E53935' },
    info: { bg: '#3D2A00', border: '#FF6A00', color: '#FF6A00' },
    warning: { bg: '#3D3A00', border: '#FFC107', color: '#FFC107' }
  };

  const style = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: style.bg,
      border: `2px solid ${style.border}`,
      color: style.color,
      padding: '16px 20px',
      borderRadius: '12px',
      zIndex: 9999,
      maxWidth: '320px',
      boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: '600',
      fontSize: '14px',
      animation: 'slideIn 0.3s ease'
    }}>
      <span style={{ fontSize: '20px' }}>
        {type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '🔔'}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: style.color,
        cursor: 'pointer', fontSize: '16px', fontWeight: '800'
      }}>✕</button>
    </div>
  );
}

export default Notification;