import React, { useState } from 'react';
import axios from 'axios';

function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const email = localStorage.getItem('pendingEmail');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/auth/verify-otp?email=${email}&otp=${otp}`);
      setSuccess('Verified! Please login.');
      localStorage.removeItem('pendingEmail');
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (err) {
      setError('Invalid OTP!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>TR</div>
          <h2 style={styles.title}>Verify OTP</h2>
          <p style={styles.subtitle}>OTP sent to: {email}</p>
          <p style={styles.hint}>Check Eclipse Console for OTP</p>
        </div>
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}
        <form onSubmit={handleVerify}>
          <label style={styles.label}>Enter OTP</label>
          <input style={styles.input} type="text" placeholder="Enter 6-digit OTP"
            value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
          <button style={styles.button} type="submit">Verify OTP</button>
        </form>
        <p style={styles.footer}>
          <a href="/login" style={styles.link}>Back to Login</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A' },
  card: { backgroundColor: '#2D2D2D', borderRadius: '16px', padding: '48px 40px', width: '400px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid #FF6A00' },
  header: { textAlign: 'center', marginBottom: '32px' },
  iconCircle: { width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#FF6A00', margin: '0 0 8px' },
  subtitle: { color: '#FFC107', fontSize: '14px', margin: '0 0 4px' },
  hint: { color: '#888', fontSize: '12px', margin: 0 },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#FFC107', marginBottom: '8px' },
  input: { width: '100%', padding: '16px', border: '2px solid #FF6A00', borderRadius: '10px', fontSize: '24px', outline: 'none', boxSizing: 'border-box', color: '#FFFFFF', backgroundColor: '#1A1A1A', fontFamily: 'Inter, sans-serif', textAlign: 'center', letterSpacing: '8px' },
  button: { width: '100%', padding: '13px', marginTop: '24px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  errorBox: { backgroundColor: '#3D1A1A', border: '1px solid #E53935', color: '#E53935', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  successBox: { backgroundColor: '#1A3D1A', border: '1px solid #00C851', color: '#00C851', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  footer: { textAlign: 'center', marginTop: '20px' },
  link: { color: '#FF6A00', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }
};

export default VerifyOtp;