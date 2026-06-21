import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getAllItems } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const lostIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const foundIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function MapView() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAllItems().then((res) => setItems(res.data)).catch(console.log);
  }, []);

  const itemsWithLocation = items.filter(i => i.latitude && i.longitude);

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.navIcon}>TR</div>
          <span style={styles.navTitle}>Trustora Map</span>
        </div>
        <a href="/home" style={styles.navLink}>Back to Home</a>
      </nav>

      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.title}>Item Location Map</h2>
          <div style={styles.legend}>
            <span style={styles.legendItem}>
              <span style={{ color: '#E53935' }}>●</span> Lost Items ({items.filter(i => i.status === 'LOST').length})
            </span>
            <span style={styles.legendItem}>
              <span style={{ color: '#00C851' }}>●</span> Found Items ({items.filter(i => i.status === 'FOUND').length})
            </span>
          </div>
        </div>

        {itemsWithLocation.length === 0 ? (
          <div style={styles.noMap}>
            <p style={styles.noMapText}>No items with GPS location yet!</p>
            <p style={styles.noMapSub}>Post items with GPS location to see them on map</p>
            <a href="/post-item" style={styles.postLink}>Post Item with GPS</a>
          </div>
        ) : (
          <div style={styles.mapContainer}>
            <MapContainer
              center={[itemsWithLocation[0].latitude, itemsWithLocation[0].longitude]}
              zoom={13}
              style={{ height: '100%', width: '100%', borderRadius: '12px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {itemsWithLocation.map((item) => (
                <Marker
                  key={item.id}
                  position={[item.latitude, item.longitude]}
                  icon={item.status === 'LOST' ? lostIcon : foundIcon}
                >
                  <Popup>
                    <div style={{ minWidth: '200px' }}>
                      <strong style={{ color: item.status === 'LOST' ? '#E53935' : '#00C851' }}>
                        {item.status}
                      </strong>
                      <h3 style={{ margin: '4px 0' }}>{item.title}</h3>
                      <p style={{ margin: '4px 0', color: '#666' }}>{item.category}</p>
                      <p style={{ margin: '4px 0', color: '#888', fontSize: '12px' }}>{item.location?.substring(0, 80)}</p>
                      {item.imageUrl && (
                        <img src={`http://localhost:8080${item.imageUrl}`} alt={item.title}
                          style={{ width: '100%', borderRadius: '6px', marginTop: '8px' }} />
                      )}
                      <span style={{
                        display: 'inline-block', marginTop: '8px', padding: '2px 8px',
                        backgroundColor: item.trackingStatus === 'RETURNED' ? '#00C851' : '#FF6A00',
                        color: 'white', borderRadius: '10px', fontSize: '11px'
                      }}>
                        {item.trackingStatus}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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
  navTitle: { color: '#FF6A00', fontSize: '18px', fontWeight: '800' },
  navLink: { color: '#FFC107', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '8px 16px', border: '1px solid #FF6A00', borderRadius: '8px' },
  content: { padding: '24px 32px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '800', color: '#FF6A00', margin: 0 },
  legend: { display: 'flex', gap: '16px' },
  legendItem: { color: '#FFFFFF', fontSize: '14px', fontWeight: '500' },
  mapContainer: { height: '600px', borderRadius: '12px', border: '2px solid #FF6A00', overflow: 'hidden' },
  noMap: { textAlign: 'center', padding: '80px', backgroundColor: '#2D2D2D', borderRadius: '12px', border: '2px solid #FF6A00' },
  noMapText: { color: '#FF6A00', fontSize: '20px', fontWeight: '700', marginBottom: '8px' },
  noMapSub: { color: '#888', fontSize: '14px', marginBottom: '24px' },
  postLink: { color: '#FF6A00', fontWeight: '600', textDecoration: 'none', border: '2px solid #FF6A00', padding: '10px 24px', borderRadius: '8px' }
};

export default MapView;