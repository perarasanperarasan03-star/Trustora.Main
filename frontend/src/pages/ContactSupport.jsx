import React, { useState } from 'react';
import { contactSupport } from '../services/api';

function ContactSupport() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [issue, setIssue] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactSupport({ name, email, issue });
      setStatus('Request sent! We will contact you soon.');
      setName(''); setEmail(''); setIssue('');
    } catch {
      setStatus('Failed to send. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Contact Support</h2>
        {status && <p style={styles.status}>{status}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Your Name" value={name}
            onChange={(e) => setName(e.target.value)} required />
          <input style={styles.input} type="email" placeholder="Your Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <textarea style={styles.textarea} placeholder="Describe your issue..." value={issue}
            onChange={(e) => setIssue(e.target.value)} required />
          <button style={styles.button} type="submit">Send Request</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A' },
  card: { backgroundColor: '#2D2D2D', borderRadius: '16px', padding: '40px', width: '400px', border: '1px solid #FF6A00' },
  title: { color: '#FF6A00', fontSize: '24px', fontWeight: '800', marginBottom: '20px', textAlign: 'center' },
  status: { color: '#00C851', textAlign: 'center', marginBottom: '16px', fontSize: '14px' },
  input: { width: '100%', padding: '12px', marginBottom: '14px', border: '2px solid #FF6A00', borderRadius: '8px', backgroundColor: '#1A1A1A', color: '#FFF', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' },
  textarea: { width: '100%', padding: '12px', marginBottom: '14px', border: '2px solid #FF6A00', borderRadius: '8px', backgroundColor: '#1A1A1A', color: '#FFF', height: '100px', resize: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' },
  button: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }
};

export default ContactSupport;