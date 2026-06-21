import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8080/api/items/my-items', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setItems(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.navIcon}>TR</div>
          <span style={styles.navTitle}>Trustora</span>
        </div>
        <a href="/home" style={styles.navLink}>Back to Home</a>
      </nav>

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>My Items</h2>
          <span style={styles.countBadge}>{items.length} Items</span>
        </div>

        {items.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No items posted yet!</p>
            <a href="/post-item" style={styles.postLink}>Post an item</a>
          </div>
        ) : (
          <div style={styles.grid}>
            {items.map((item) => (
              <div key={item.id} style={styles.card}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} style={styles.cardImg} />
                ) : (
                  <div style={styles.cardImgPlaceholder}>No Image</div>
                )}
                <div style={styles.cardBody}>
                  <div style={styles.cardTop}>
                    <span style={{ ...styles.badge, backgroundColor: item.status === 'LOST' ? '#E53935' : '#FF6A00' }}>
                      {item.status}
                    </span>
                    {item.category && <span style={styles.category}>{item.category}</span>}
                  </div>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  {item.location && <p style={styles.cardLocation}>{item.location.substring(0, 60)}{item.location.length > 60 ? '...' : ''}</p>}
                  {item.description && <p style={styles.cardDesc}>{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#1A1A1A' },
  nav: { backgroundColor: '#2D2D2D', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', borderBottom: '2px solid #FF6A00' },
  navBrand: { display: 'flex', alignItems: 'center', gap: '12px' },
  navIcon: { width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navTitle: { color: '#FF6A00', fontSize: '20px', fontWeight: '800' },
  navLink: { color: '#FFC107', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '8px 16px', border: '1px solid #FF6A00', borderRadius: '8px' },
  content: { padding: '32px' },
  pageHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  pageTitle: { fontSize: '22px', fontWeight: '800', color: '#FF6A00', margin: 0 },
  countBadge: { background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#2D2D2D', borderRadius: '14px', overflow: 'hidden', border: '1px solid #FF6A00' },
  cardImg: { width: '100%', height: '200px', objectFit: 'cover' },
  cardImgPlaceholder: { width: '100%', height: '120px', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '14px' },
  cardBody: { padding: '20px' },
  cardTop: { display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' },
  badge: { color: '#FFFFFF', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' },
  category: { color: '#FFC107', fontSize: '12px', backgroundColor: '#1A1A1A', padding: '3px 10px', borderRadius: '20px', fontWeight: '500', border: '1px solid #FFC107' },
  cardTitle: { fontSize: '17px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 8px' },
  cardLocation: { fontSize: '13px', color: '#FFC107', margin: '0 0 6px' },
  cardDesc: { fontSize: '13px', color: '#888', margin: 0 },
  emptyState: { textAlign: 'center', padding: '60px' },
  emptyText: { color: '#555', fontSize: '18px', marginBottom: '16px' },
  postLink: { color: '#FF6A00', fontWeight: '600', textDecoration: 'none', border: '2px solid #FF6A00', padding: '10px 24px', borderRadius: '8px' }
};

export default MyItems;