import React, { useState } from 'react';
import { login } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await login({ email, password });
    const token = res.data.token;   // 👈 maathunga
    const role = res.data.role;     // 👈 maathunga
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('email', email);
    window.location.href = '/home';
  } catch (err) {
    setError('Invalid email or password!');
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>TR</div>
          <h1 style={styles.title}>Trustora</h1>
          <p style={styles.subtitle}>Trust. Find. Return.</p>
        </div>
        {error && <div style={styles.errorBox}>{error}</div>}
        <form onSubmit={handleLogin}>
          <label style={styles.label}>Email Address</label>
          <input style={styles.input} type="email" placeholder="Enter your email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" placeholder="Enter your password"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button style={styles.button} type="submit">Sign In</button>
        </form>
        <p style={styles.footer}>
          Don't have an account? <a href="/register" style={styles.link}>Register</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A' },
  card: { backgroundColor: '#2D2D2D', borderRadius: '16px', padding: '48px 40px', width: '400px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid #FF6A00' },
  header: { textAlign: 'center', marginBottom: '32px' },
  iconCircle: { width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', letterSpacing: '1px' },
title: { fontSize: '26px', fontWeight: '800', color: '#FF6A00', margin: '0 0 6px' },
  subtitle: { color: '#FFC107', fontSize: '14px', margin: 0 },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#FFC107', marginBottom: '6px', marginTop: '16px' },
  input: { width: '100%', padding: '12px 14px', border: '2px solid #FF6A00', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#FFFFFF', backgroundColor: '#1A1A1A', fontFamily: 'Inter, sans-serif' },
  button: { width: '100%', padding: '13px', marginTop: '24px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif' },
  errorBox: { backgroundColor: '#3D1A1A', border: '1px solid #E53935', color: '#FF6A00', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  footer: { textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '14px' },
  link: { color: '#FF6A00', fontWeight: '700', textDecoration: 'none' }
};

export default Login;