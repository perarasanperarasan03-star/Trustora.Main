import React, { useEffect, useState } from 'react';
import { getAllClaims, updateClaimStatus, deleteItem, getAllItems } from '../services/api';

function AdminPanel() {
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('CLAIMS');

  useEffect(() => {
    getAllClaims().then((res) => setClaims(res.data)).catch(console.log);
    getAllItems().then((res) => setItems(res.data)).catch(console.log);
  }, []);

  const handleStatus = (claimId, status) => {
    updateClaimStatus(claimId, status).then(() => {
      setClaims(claims.map(c => c.id === claimId ? { ...c, status } : c));
      if (status === 'APPROVED') {
        alert('Claim APPROVED! OTP generated — Check Eclipse Console for OTP. Share it with the claimer!');
      } else {
        alert('Claim REJECTED!');
      }
      setSelected(null);
    }).catch(() => alert('Failed!'));
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(itemId).then(() => {
        setItems(items.filter(i => i.id !== itemId));
        alert('Item deleted successfully!');
      }).catch(() => alert('Failed to delete!'));
    }
  };

  const getProofUrl = (message) => {
    if (!message) return null;
    const match = message.match(/\[PROOF:(.*?)\]/);
    return match ? 'http://localhost:8080' + match[1] : null;
  };

  const getCleanMessage = (message) => {
    if (!message) return '';
    return message.replace(/\[PROOF:.*?\]/, '').trim();
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.navIcon}>TR</div>
          <span style={styles.navTitle}>Trustora Admin</span>
        </div>
        <a href="/home" style={styles.navLink}>Back to Home</a>
      </nav>

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>Admin Dashboard</h2>
        </div>

        <div style={styles.tabs}>
          <button onClick={() => setTab('CLAIMS')}
            style={{ ...styles.tab, ...(tab === 'CLAIMS' ? styles.tabActive : {}) }}>
            Claims ({claims.length})
          </button>
          <button onClick={() => setTab('ITEMS')}
            style={{ ...styles.tab, ...(tab === 'ITEMS' ? styles.tabActive : {}) }}>
            Manage Items ({items.length})
          </button>
        </div>

        {tab === 'CLAIMS' && (
          <>
            {claims.length === 0 ? (
              <div style={styles.empty}>No claims yet!</div>
            ) : (
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Item</th>
                      <th style={styles.th}>Claimer Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Phone</th>
                      <th style={styles.th}>Message</th>
                      <th style={styles.th}>Proof</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim) => (
                      <tr key={claim.id} style={styles.tr}>
                        <td style={styles.td}>#{claim.id}</td>
                        <td style={styles.td}><strong style={{ color: '#FF6A00' }}>{claim.item?.title}</strong></td>
                        <td style={styles.td}><strong style={{ color: '#FFFFFF' }}>{claim.claimer?.name}</strong></td>
                        <td style={styles.td}><span style={{ color: '#FFC107' }}>{claim.claimer?.email}</span></td>
                        <td style={styles.td}><span style={{ color: '#FFC107' }}>{claim.claimer?.phone}</span></td>
                        <td style={styles.td}><div style={styles.message}>{getCleanMessage(claim.message)}</div></td>
                        <td style={styles.td}>
                          {getProofUrl(claim.message) ? (
                            <img src={getProofUrl(claim.message)} alt="proof" style={styles.proofThumb}
                              onClick={() => setSelected(getProofUrl(claim.message))} />
                          ) : (
                            <span style={styles.noProof}>No proof</span>
                          )}
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: claim.status === 'APPROVED' ? '#1A3D1A' : claim.status === 'REJECTED' ? '#3D1A1A' : '#3D2A00',
                            color: claim.status === 'APPROVED' ? '#FFC107' : claim.status === 'REJECTED' ? '#E53935' : '#FF6A00'
                          }}>
                            {claim.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {claim.status === 'PENDING' && (
                            <div style={styles.actionBtns}>
                              <button onClick={() => handleStatus(claim.id, 'APPROVED')} style={styles.approveBtn}>Approve</button>
                              <button onClick={() => handleStatus(claim.id, 'REJECTED')} style={styles.rejectBtn}>Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'ITEMS' && (
          <>
            {items.length === 0 ? (
              <div style={styles.empty}>No items yet!</div>
            ) : (
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Image</th>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Location</th>
                      <th style={styles.th}>Posted By</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} style={styles.tr}>
                        <td style={styles.td}>#{item.id}</td>
                        <td style={styles.td}>
                          {item.imageUrl ? (
                            <img src={`http://localhost:8080${item.imageUrl}`} alt={item.title} style={styles.itemThumb} />
                          ) : (
                            <span style={styles.noProof}>No image</span>
                          )}
                        </td>
                        <td style={styles.td}><strong style={{ color: '#FF6A00' }}>{item.title}</strong></td>
                        <td style={styles.td}><span style={{ color: '#FFC107' }}>{item.category}</span></td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: item.status === 'LOST' ? '#3D1A1A' : '#1A3D00',
                            color: item.status === 'LOST' ? '#E53935' : '#FF6A00'
                          }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={styles.td}><span style={{ color: '#888', fontSize: '12px' }}>{item.location?.substring(0, 40)}</span></td>
                        <td style={styles.td}><span style={{ color: '#FFC107' }}>{item.user?.name}</span></td>
                        <td style={styles.td}>
                          <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <div style={styles.modal} onClick={() => setSelected(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelected(null)}>X</button>
            <img src={selected} alt="proof" style={styles.modalImg} />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#1A1A1A' },
  nav: { backgroundColor: '#2D2D2D', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', borderBottom: '2px solid #FF6A00' },
  navBrand: { display: 'flex', alignItems: 'center', gap: '12px' },
  navIcon: { width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navTitle: { color: '#FF6A00', fontSize: '18px', fontWeight: '800' },
  navLink: { color: '#FFC107', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  content: { padding: '32px' },
  pageHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '22px', fontWeight: '800', color: '#FF6A00', margin: 0 },
  tabs: { display: 'flex', gap: '10px', marginBottom: '24px' },
  tab: { padding: '10px 24px', borderRadius: '8px', border: '2px solid #FF6A00', backgroundColor: 'transparent', color: '#FF6A00', cursor: 'pointer', fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
  tabActive: { background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', borderColor: 'transparent' },
  empty: { textAlign: 'center', padding: '60px', color: '#555', fontSize: '18px' },
  tableWrap: { overflowX: 'auto', borderRadius: '14px', border: '1px solid #FF6A00' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#2D2D2D' },
  thead: { background: 'linear-gradient(135deg, #FF6A00, #E53935)' },
  th: { padding: '14px 16px', color: '#FFFFFF', textAlign: 'left', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #1A1A1A' },
  td: { padding: '16px', color: '#FFFFFF', fontSize: '14px', verticalAlign: 'middle' },
  message: { maxWidth: '180px', color: '#888', fontSize: '13px' },
  proofThumb: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: '2px solid #FF6A00' },
  itemThumb: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #FF6A00' },
  noProof: { color: '#555', fontSize: '12px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  actionBtns: { display: 'flex', gap: '8px' },
  approveBtn: { background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: 'Inter, sans-serif' },
  rejectBtn: { backgroundColor: '#3D1A1A', color: '#E53935', border: '1px solid #E53935', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: 'Inter, sans-serif' },
  deleteBtn: { backgroundColor: '#3D1A1A', color: '#E53935', border: '1px solid #E53935', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: 'Inter, sans-serif' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { position: 'relative', backgroundColor: '#2D2D2D', borderRadius: '16px', padding: '20px', maxWidth: '600px', width: '90%', border: '2px solid #FF6A00' },
  closeBtn: { position: 'absolute', top: '10px', right: '10px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' },
  modalImg: { width: '100%', borderRadius: '8px' }
};

export default AdminPanel;