import React, { useEffect, useState } from 'react';
import { getAllItems } from '../services/api';

function Profile() {
  const [myItems, setMyItems] = useState([]);
  const userEmail = localStorage.getItem('email') || '';
  const username = localStorage.getItem('username') || 'User';

  useEffect(() => {
    getAllItems().then((res) => {
      const mine = res.data.filter(item => item.user?.email === userEmail);
      setMyItems(mine);
    }).catch(console.log);
  }, [userEmail]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.avatar}>{username.charAt(0).toUpperCase()}</div>
        <h2 style={styles.name}>{username}</h2>
        <p style={styles.email}>{userEmail}</p>
      </div>

      <h3 style={styles.sectionTitle}>My Posted Items ({myItems.length})</h3>

      <div style={styles.grid}>
        {myItems.length === 0 ? (
          <p style={styles.empty}>You haven't posted any items yet.</p>
        ) : (
          myItems.map(item => (
            <div key={item.id} style={styles.card}>
              {item.imageUrl ? (
                <img src={`http://localhost:8080${item.imageUrl}`} alt={item.title} style={styles.cardImg} />
              ) : (
                <div style={styles.cardImgPlaceholder}>No Image</div>
              )}
              <div style={styles.cardBody}>
                <span style={{ ...styles.badge, backgroundColor: item.status === 'LOST' ? '#E53935' : '#FF6A00' }}>
                  {item.status}
                </span>
                <h4 style={styles.cardTitle}>{item.title}</h4>
                <p style={styles.cardDesc}>{item.description}</p>
                <p style={styles.cardStatus}>Status: {item.trackingStatus || 'REPORTED'}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <a href="/home" style={styles.backLink}>← Back to Home</a>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#1A1A1A', padding: '40px 32px' },
  header: { textAlign: 'center', marginBottom: '32px' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFF', fontSize: '32px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  name: { color: '#FFFFFF', fontSize: '24px', fontWeight: '800', margin: '0 0 4px' },
  email: { color: '#FFC107', fontSize: '14px' },
  sectionTitle: { color: '#FF6A00', fontSize: '18px', fontWeight: '700', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#2D2D2D', borderRadius: '14px', overflow: 'hidden', border: '1px solid #FF6A00' },
  cardImg: { width: '100%', height: '160px', objectFit: 'cover' },
  cardImgPlaceholder: { width: '100%', height: '100px', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' },
  cardBody: { padding: '16px' },
  badge: { color: '#FFF', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  cardTitle: { color: '#FFF', fontSize: '16px', fontWeight: '700', margin: '8px 0 4px' },
  cardDesc: { color: '#888', fontSize: '13px', margin: '0 0 8px' },
  cardStatus: { color: '#FFC107', fontSize: '12px', fontWeight: '600' },
  empty: { color: '#555', gridColumn: '1/-1', textAlign: 'center' },
  backLink: { display: 'block', textAlign: 'center', marginTop: '32px', color: '#FF6A00', fontWeight: '600', textDecoration: 'none' }
};

export default Profile;