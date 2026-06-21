import React, { useState } from 'react';
import { postItem } from '../services/api';
import axios from 'axios';

function PostItem() {
  const [form, setForm] = useState({ title: '', description: '', category: '', status: 'LOST', location: '', imageUrl: '', latitude: '', longitude: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const getGPS = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          setForm(f => ({ ...f, location: res.data.display_name, latitude: latitude.toString(), longitude: longitude.toString() }));
        } catch {
          setForm(f => ({ ...f, location: `${latitude}, ${longitude}` }));
        }
        setGpsLoading(false);
      }, () => { alert('GPS access denied!'); setGpsLoading(false); });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const res = await axios.post('http://localhost:8080/api/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrl = res.data;
      }
      await postItem({ ...form, imageUrl });
      setSuccess('Item posted successfully!');
      setTimeout(() => window.location.href = '/home', 2000);
    } catch { setError('Failed to post item!'); }
    finally { setUploading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>Post an Item</h2>
          <p style={styles.subtitle}>Report a lost or found item</p>
        </div>
        {success && <div style={styles.successBox}>{success}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Item Title</label>
              <input style={styles.input} type="text" name="title" placeholder="e.g. iPhone 14" value={form.title} onChange={handleChange} required />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Category</label>
              <input style={styles.input} type="text" name="category" placeholder="e.g. Phone, Wallet" value={form.category} onChange={handleChange} />
            </div>
          </div>
          <label style={styles.label}>Description</label>
          <textarea style={styles.textarea} name="description" placeholder="Describe the item..." value={form.description} onChange={handleChange} />
          <label style={styles.label}>Location</label>
          <div style={styles.locationRow}>
            <input style={{ ...styles.input, flex: 1 }} type="text" name="location" placeholder="Enter location or use GPS" value={form.location} onChange={handleChange} />
            <button type="button" onClick={getGPS} style={styles.gpsBtn} disabled={gpsLoading}>
              {gpsLoading ? 'Getting...' : 'Use GPS'}
            </button>
          </div>
          <label style={styles.label}>Status</label>
          <div style={styles.statusRow}>
            {['LOST', 'FOUND'].map(s => (
              <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                style={{ ...styles.statusBtn, ...(form.status === s ? (s === 'LOST' ? styles.lostActive : styles.foundActive) : {}) }}>
                {s === 'LOST' ? 'Lost Item' : 'Found Item'}
              </button>
            ))}
          </div>
          <label style={styles.label}>Image (Optional)</label>
          <div style={styles.uploadBox}>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="fileInput" />
            <label htmlFor="fileInput" style={styles.uploadLabel}>
              {preview ? <img src={preview} alt="preview" style={styles.preview} /> : <span>Click to upload image</span>}
            </label>
          </div>
          <button style={styles.submitBtn} type="submit" disabled={uploading}>
            {uploading ? 'Posting...' : 'Post Item'}
          </button>
        </form>
        <p style={styles.footer}><a href="/home" style={styles.link}>Back to Home</a></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' },
  card: { backgroundColor: '#2D2D2D', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '640px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', border: '1px solid #FF6A00' },
  cardHeader: { marginBottom: '28px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#FF6A00', margin: '0 0 6px' },
  subtitle: { color: '#FFC107', fontSize: '14px', margin: 0 },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#FFC107', marginBottom: '6px', marginTop: '16px' },
  input: { width: '100%', padding: '11px 14px', border: '2px solid #FF6A00', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#FFFFFF', backgroundColor: '#1A1A1A', fontFamily: 'Inter, sans-serif' },
  textarea: { width: '100%', padding: '11px 14px', border: '2px solid #FF6A00', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', height: '90px', resize: 'vertical', color: '#FFFFFF', backgroundColor: '#1A1A1A', fontFamily: 'Inter, sans-serif' },
  row: { display: 'flex', gap: '16px' },
  col: { flex: 1 },
  locationRow: { display: 'flex', gap: '10px', alignItems: 'flex-end' },
  gpsBtn: { padding: '11px 18px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' },
  statusRow: { display: 'flex', gap: '12px', marginTop: '8px' },
  statusBtn: { flex: 1, padding: '12px', border: '2px solid #FF6A00', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', backgroundColor: 'transparent', color: '#FF6A00', fontFamily: 'Inter, sans-serif' },
  lostActive: { background: 'linear-gradient(135deg, #E53935, #B71C1C)', borderColor: '#E53935', color: '#FFFFFF' },
  foundActive: { background: 'linear-gradient(135deg, #FF6A00, #E53935)', borderColor: '#FF6A00', color: '#FFFFFF' },
  uploadBox: { marginTop: '8px', border: '2px dashed #FF6A00', borderRadius: '10px', overflow: 'hidden' },
  uploadLabel: { display: 'block', padding: '24px', textAlign: 'center', cursor: 'pointer', color: '#FFC107', fontSize: '14px', fontWeight: '500' },
  preview: { width: '100%', maxHeight: '200px', objectFit: 'cover' },
  submitBtn: { width: '100%', padding: '13px', marginTop: '24px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  successBox: { backgroundColor: '#1A3D1A', border: '1px solid #FFC107', color: '#FFC107', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  errorBox: { backgroundColor: '#3D1A1A', border: '1px solid #E53935', color: '#FF6A00', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  footer: { textAlign: 'center', marginTop: '20px' },
  link: { color: '#FF6A00', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }
};

export default PostItem;