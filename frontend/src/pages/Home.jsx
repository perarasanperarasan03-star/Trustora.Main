import React, { useEffect, useState } from 'react';
import { getAllItems, getItemsByStatus, createClaim, deleteItem, getExchangePartner, giveReview } from '../services/api';
import axios from 'axios';
import ChatBox from './ChatBox';
import Notification from '../components/Notification';

function Home() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRoom, setChatRoom] = useState('general');
  const [claimModal, setClaimModal] = useState(null);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimProof, setClaimProof] = useState(null);
  const currentUser = localStorage.getItem('username') || 'User';
  const [notification, setNotification] = useState(null);

  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => { fetchItems(filter); }, [filter]);

  const fetchItems = (status) => {
    if (status === 'ALL') {
      getAllItems().then((res) => setItems(res.data)).catch(console.log);
    } else {
      getItemsByStatus(status).then((res) => setItems(res.data)).catch(console.log);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleClaim = (itemId) => {
    setClaimModal(itemId);
    setClaimMessage('');
    setClaimProof(null);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteItem(itemId);
      showNotification('Item deleted successfully!', 'success');
      fetchItems(filter);
    } catch {
      showNotification('Failed to delete item!', 'error');
    }
  };

  const submitClaim = async () => {
    if (!claimMessage) return alert('Please enter a message!');
    try {
      let proofUrl = '';
      if (claimProof) {
        const formData = new FormData();
        formData.append('file', claimProof);
        const uploadRes = await axios.post('http://localhost:8080/api/files/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        proofUrl = uploadRes.data;
      }
      await createClaim(claimModal, claimMessage + (proofUrl ? ' [PROOF:' + proofUrl + ']' : ''));
      showNotification('Claim submitted successfully!', 'success');
      setClaimModal(null);
      fetchItems(filter);
    } catch { showNotification('Failed to submit claim!', 'error'); }
  };

  const checkMatch = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/items/${itemId}/check-match`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = res.data;
      showNotification(response, response.includes('Match found') ? 'success' : 'warning');
      if (response.includes('ChatRoom:')) {
        const roomId = response.split('ChatRoom:')[1].trim();
        setChatRoom(roomId);
        setChatOpen(true);
      }
      fetchItems(filter);
    } catch { alert('Failed to check match!'); }
  };

  const verifyOtp = async (itemId) => {
    const otp = prompt('Enter OTP received from Admin:');
    if (!otp) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:8080/api/items/${itemId}/verify-otp?otp=${otp}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification(res.data, 'success');
      fetchItems(filter);
    } catch { showNotification('Invalid OTP! Try again.', 'error'); }
  };

  const handleReviewClick = async (item) => {
    try {
      const res = await getExchangePartner(item.id);
      setReviewModal({ itemId: item.id, itemTitle: item.title, partnerEmail: res.data.email, partnerName: res.data.name });
      setReviewRating(5);
      setReviewComment('');
    } catch {
      showNotification('Could not find exchange partner!', 'error');
    }
  };

  const submitReview = async () => {
    try {
      const userEmail = localStorage.getItem('email');
      await giveReview({
        fromEmail: userEmail,
        toEmail: reviewModal.partnerEmail,
        rating: reviewRating,
        comment: reviewComment
      });
      showNotification('Review submitted successfully!', 'success');
      setReviewModal(null);
    } catch {
      showNotification('Failed to submit review!', 'error');
    }
  };

  const getTrackingSteps = () => ['REPORTED', 'MATCHED', 'CLAIMED', 'APPROVED', 'RETURNED'];

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    (item.location || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.navIcon}>TR</div>
          <span style={styles.navTitle}>Trustora</span>
        </div>
        <div style={styles.navLinks}>
          <a href="/profile" style={styles.navLink}>👤 Profile</a>
          <a href="/support" style={styles.navLink}>Support</a>
          <a href="/my-items" style={styles.navLink}>My Items</a>
          <a href="/post-item" style={styles.navLink}>Post Item</a>
          <a href="/map" style={styles.navLink}>Map View</a>
          {localStorage.getItem('role') === 'ADMIN' && (
            <a href="/admin" style={styles.navLink}>Admin</a>
          )}
          <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Trustora</h2>
        <p style={styles.heroSub}>Trust. Find. Return.</p>
        <input style={styles.searchInput} type="text"
          placeholder="Search by title, location or category..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div style={styles.dashboard}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{items.length}</div>
          <div style={styles.statLabel}>Total Items</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#E53935' }}>
            {items.filter(i => i.status === 'LOST').length}
          </div>
          <div style={styles.statLabel}>Lost Items</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#FF6A00' }}>
            {items.filter(i => i.status === 'FOUND').length}
          </div>
          <div style={styles.statLabel}>Found Items</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#00C851' }}>
            {items.filter(i => i.trackingStatus === 'RETURNED').length}
          </div>
          <div style={styles.statLabel}>Returned</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#FFC107' }}>
            {items.filter(i => i.trackingStatus === 'CLAIMED').length}
          </div>
          <div style={styles.statLabel}>Claimed</div>
        </div>
      </div>

      <div style={styles.filterSection}>
        {['ALL', 'LOST', 'FOUND'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}>
            {f === 'ALL' ? 'All Items' : f === 'LOST' ? 'Lost Items' : 'Found Items'}
          </button>
        ))}
        <span style={styles.itemCount}>{filteredItems.length} items</span>
      </div>

      <div style={styles.grid}>
        {filteredItems.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No items found</p>
            <a href="/post-item" style={styles.postLink}>Post an item</a>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
  key={item.id}
  style={{
    ...styles.card,
    opacity: item.trackingStatus === 'RETURNED' ? 0.75 : 1,
    filter:
      item.trackingStatus === 'RETURNED'
        ? 'grayscale(20%)'
        : 'none'
  }}
>
              {item.imageUrl ? (
                <img
                  src={`http://localhost:8080${item.imageUrl}`}
                  alt={item.title}
                  style={styles.cardImg}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={styles.cardImgPlaceholder}>No Image</div>
              )}
              <div style={styles.cardBody}>
                <div style={styles.cardTop}>
                  <span style={{ ...styles.badge, backgroundColor: item.status === 'LOST' ? '#E53935' : '#FF6A00' }}>
                    {item.status}
                  </span>
                  {item.category && <span style={styles.category}>{item.category}</span>}
                  {item.trackingStatus === 'RETURNED' && (
                    <span style={styles.returnedBadge}>✅ RETURNED</span>
                  )}
                </div>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                {item.location && <p style={styles.cardLocation}>{item.location.substring(0, 60)}{item.location.length > 60 ? '...' : ''}</p>}
                {item.description && <p style={styles.cardDesc}>{item.description}</p>}

                <div style={styles.trackingContainer}>
                  <p style={styles.trackingTitle}>Status Tracking</p>
                  <div style={styles.trackingBar}>
                    {getTrackingSteps().map((step, index) => {
                      const steps = getTrackingSteps();
                      const currentIndex = steps.indexOf(item.trackingStatus || 'REPORTED');
                      const isDone = index <= currentIndex;
                      return (
                        <div key={step} style={styles.trackingStep}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                              ...styles.trackingDot,
                              backgroundColor: isDone ? '#FF6A00' : '#444',
                              boxShadow: isDone ? '0 0 8px #FF6A00' : 'none'
                            }} />
                            {index < 4 && (
                              <div style={{
                                ...styles.trackingLine,
                                backgroundColor: index < currentIndex ? '#FF6A00' : '#444'
                              }} />
                            )}
                          </div>
                          <span style={{
                            ...styles.trackingLabel,
                            color: isDone ? '#FF6A00' : '#555'
                          }}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

               {item.trackingStatus === 'RETURNED' ? (
  <div>
    <div style={styles.returnedOverlay}>
      <span style={styles.returnedText}>✅ Item Successfully Returned!</span>
    </div>
    <button onClick={() => handleReviewClick(item)} style={styles.reviewBtn}>
      ⭐ Rate this Exchange
    </button>
  </div>
) : (
  <div>
    <button onClick={() => handleClaim(item.id)} style={styles.claimBtn}>Submit Claim</button>
    <div style={styles.matchBtns}>
      <button onClick={() => checkMatch(item.id)} style={styles.matchBtn}>Check Match</button>
      <button onClick={() => verifyOtp(item.id)} style={styles.otpBtn}>Verify OTP</button>
    </div>
    <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>Delete</button>
  </div>
)}
              </div>
            </div>
          ))
        )}
      </div>

      {claimModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.claimModalBox}>
            <h3 style={styles.modalTitle}>Submit Claim</h3>
            <label style={styles.modalLabel}>Describe your claim:</label>
            <textarea
              style={styles.modalTextarea}
              placeholder="e.g. Black wallet with ID card..."
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
            />
            <label style={styles.modalLabel}>Upload Proof (Optional):</label>
            <input type="file" accept="image/*"
              onChange={(e) => setClaimProof(e.target.files[0])}
              style={styles.fileInput} />
            <div style={styles.modalBtns}>
              <button onClick={submitClaim} style={styles.submitClaimBtn}>Submit</button>
              <button onClick={() => setClaimModal(null)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {reviewModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.claimModalBox}>
            <h3 style={styles.modalTitle}>Rate {reviewModal.partnerName}</h3>
            <label style={styles.modalLabel}>Rating:</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => setReviewRating(star)}
                  style={{ fontSize: '28px', cursor: 'pointer', color: star <= reviewRating ? '#FFC107' : '#444' }}>
                  ★
                </span>
              ))}
            </div>
            <label style={styles.modalLabel}>Comment:</label>
            <textarea
              style={styles.modalTextarea}
              placeholder="Share your experience..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
            <div style={styles.modalBtns}>
              <button onClick={submitReview} style={styles.submitClaimBtn}>Submit Review</button>
              <button onClick={() => setReviewModal(null)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setChatOpen(!chatOpen)} style={styles.floatingBtn}>💬</button>

      {chatOpen && (
        <ChatBox roomId={chatRoom} currentUser={currentUser} onClose={() => setChatOpen(false)} />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#1A1A1A' },
  nav: { backgroundColor: '#2D2D2D', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', borderBottom: '2px solid #FF6A00' },
  navBrand: { display: 'flex', alignItems: 'center', gap: '12px' },
  navIcon: { width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navTitle: { color: '#FF6A00', fontSize: '20px', fontWeight: '800' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '8px' },
  navLink: { color: '#FFC107', textDecoration: 'none', fontSize: '14px', padding: '6px 14px', borderRadius: '6px', fontWeight: '500' },
  logoutBtn: { background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  hero: { background: 'linear-gradient(135deg, #2D2D2D, #1A1A1A)', padding: '48px 32px', textAlign: 'center', borderBottom: '1px solid #FF6A00' },
  heroTitle: { fontSize: '36px', fontWeight: '800', color: '#FF6A00', marginBottom: '8px' },
  heroSub: { color: '#FFC107', fontSize: '16px', marginBottom: '24px' },
  searchInput: { width: '100%', maxWidth: '600px', padding: '14px 20px', border: '2px solid #FF6A00', borderRadius: '30px', fontSize: '15px', outline: 'none', backgroundColor: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Inter, sans-serif' },
  dashboard: { display: 'flex', gap: '16px', padding: '20px 32px', backgroundColor: '#2D2D2D', borderBottom: '1px solid #FF6A00', overflowX: 'auto' },
  statCard: { flex: 1, minWidth: '120px', backgroundColor: '#1A1A1A', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #FF6A00' },
  statNumber: { fontSize: '28px', fontWeight: '800', color: '#FF6A00', marginBottom: '4px' },
  statLabel: { fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  filterSection: { padding: '20px 32px', display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid #2D2D2D' },
  filterBtn: { padding: '8px 20px', borderRadius: '20px', border: '2px solid #FF6A00', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#FF6A00', fontFamily: 'Inter, sans-serif' },
  filterActive: { background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', borderColor: 'transparent' },
  itemCount: { marginLeft: 'auto', color: '#FFC107', fontSize: '13px', fontWeight: '500' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '24px 32px' },
  card: { backgroundColor: '#2D2D2D', borderRadius: '14px', overflow: 'hidden', border: '1px solid #FF6A00' },
  cardImg: { width: '100%', height: '200px', objectFit: 'cover' },
  cardImgPlaceholder: { width: '100%', height: '120px', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '14px' },
  cardBody: { padding: '20px' },
  cardTop: { display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' },
  badge: { color: '#FFFFFF', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' },
  category: { color: '#FFC107', fontSize: '12px', backgroundColor: '#1A1A1A', padding: '3px 10px', borderRadius: '20px', fontWeight: '500', border: '1px solid #FFC107' },
  cardTitle: { fontSize: '17px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 8px' },
  cardLocation: { fontSize: '13px', color: '#FFC107', margin: '0 0 6px' },
  cardDesc: { fontSize: '13px', color: '#888', margin: '0 0 12px' },
  trackingContainer: { backgroundColor: '#1A1A1A', borderRadius: '8px', padding: '12px', marginBottom: '12px' },
  trackingTitle: { color: '#FFC107', fontSize: '11px', fontWeight: '700', marginBottom: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' },
  trackingBar: { display: 'flex', alignItems: 'flex-start' },
  trackingStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 },
  trackingDot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
  trackingLine: { height: '2px', flex: 1, minWidth: '20px' },
  trackingLabel: { fontSize: '8px', fontWeight: '700', textAlign: 'center', marginTop: '4px', letterSpacing: '0.3px' },
  claimBtn: { width: '100%', padding: '10px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif', marginBottom: '8px' },
  matchBtns: { display: 'flex', gap: '8px', marginTop: '4px' },
  matchBtn: { flex: 1, padding: '8px', backgroundColor: '#FFC107', color: '#1A1A1A', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', fontFamily: 'Inter, sans-serif' },
  otpBtn: { flex: 1, padding: '8px', backgroundColor: '#1A1A1A', color: '#FFC107', border: '1px solid #FFC107', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', fontFamily: 'Inter, sans-serif' },
  emptyState: { gridColumn: '1/-1', textAlign: 'center', padding: '60px' },
  emptyText: { color: '#555', fontSize: '18px', marginBottom: '16px' },
  postLink: { color: '#FF6A00', fontWeight: '600', textDecoration: 'none', border: '2px solid #FF6A00', padding: '10px 24px', borderRadius: '8px' },
  floatingBtn: { position: 'fixed', bottom: '20px', right: '20px', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,106,0,0.4)', zIndex: 999 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  claimModalBox: { backgroundColor: '#2D2D2D', borderRadius: '16px', padding: '32px', width: '400px', border: '2px solid #FF6A00' },
  modalTitle: { color: '#FF6A00', fontSize: '20px', fontWeight: '800', marginBottom: '20px' },
  modalLabel: { display: 'block', color: '#FFC107', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '16px' },
  modalTextarea: { width: '100%', padding: '12px', backgroundColor: '#1A1A1A', border: '2px solid #FF6A00', borderRadius: '8px', color: '#FFFFFF', fontSize: '14px', height: '100px', resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' },
  fileInput: { width: '100%', color: '#FFFFFF', marginTop: '8px' },
  modalBtns: { display: 'flex', gap: '12px', marginTop: '24px' },
  submitClaimBtn: { flex: 1, padding: '12px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif' },
  cancelBtn: { flex: 1, padding: '12px', backgroundColor: '#1A1A1A', color: '#FF6A00', border: '2px solid #FF6A00', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif' },
  returnedBadge: { backgroundColor: '#1A3D1A', color: '#00C851', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', border: '1px solid #00C851' },
  deleteBtn: { width: '100%', padding: '8px', marginTop: '8px', backgroundColor: 'transparent', color: '#E53935', border: '1px solid #E53935', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', fontFamily: 'Inter, sans-serif' },
  returnedOverlay: { backgroundColor: 'rgba(0,200,81,0.1)', border: '1px solid #00C851', borderRadius: '8px', padding: '10px', textAlign: 'center', marginBottom: '8px' },
returnedText: { color: '#00C851', fontWeight: '700', fontSize: '13px' },
  reviewBtn: { width: '100%', padding: '10px', marginTop: '8px', backgroundColor: '#FFC107', color: '#1A1A1A', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: 'Inter, sans-serif' },
};

export default Home;
