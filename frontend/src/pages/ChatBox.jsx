import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function ChatBox({ roomId, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/chat/${roomId}`, (msg) => {
          const body = JSON.parse(msg.body);
          setMessages(prev => [...prev, body]);
        });
      },
      onDisconnect: () => setConnected(false),
    });
    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify({ sender: currentUser, content: input, roomId })
    });
    setInput('');
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.chatBox}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar}>💬</div>
            <div>
              <div style={styles.headerTitle}>Chat Room</div>
              <div style={styles.headerSub}>{connected ? '🟢 Connected' : '🔴 Connecting...'}</div>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.messages}>
          {messages.length === 0 && (
            <div style={styles.emptyMsg}>No messages yet. Start the conversation!</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{
              ...styles.msgRow,
              justifyContent: msg.sender === currentUser ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                ...styles.bubble,
                background: msg.sender === currentUser
                  ? 'linear-gradient(135deg, #FF6A00, #E53935)'
                  : '#2D2D2D',
                borderRadius: msg.sender === currentUser
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px'
              }}>
                <div style={styles.msgSender}>{msg.sender}</div>
                <div style={styles.msgContent}>{msg.content}</div>
                <div style={styles.msgTime}>{msg.timestamp}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            style={styles.input}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} style={styles.sendBtn} disabled={!connected}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 },
  chatBox: { width: '360px', height: '500px', backgroundColor: '#1A1A1A', borderRadius: '16px', border: '2px solid #FF6A00', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
  header: { backgroundColor: '#2D2D2D', padding: '16px', borderRadius: '14px 14px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #FF6A00' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { fontSize: '24px' },
  headerTitle: { color: '#FF6A00', fontWeight: '700', fontSize: '15px' },
  headerSub: { color: '#888', fontSize: '12px', marginTop: '2px' },
  closeBtn: { background: 'none', border: 'none', color: '#FF6A00', fontSize: '18px', cursor: 'pointer', fontWeight: '700' },
  messages: { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  emptyMsg: { textAlign: 'center', color: '#555', fontSize: '13px', marginTop: '20px' },
  msgRow: { display: 'flex' },
  bubble: { maxWidth: '240px', padding: '10px 14px', color: '#FFFFFF' },
  msgSender: { fontSize: '11px', color: '#FFC107', fontWeight: '600', marginBottom: '4px' },
  msgContent: { fontSize: '14px', lineHeight: '1.4' },
  msgTime: { fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', textAlign: 'right' },
  inputArea: { padding: '12px', borderTop: '1px solid #FF6A00', display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '10px 14px', backgroundColor: '#2D2D2D', border: '1px solid #FF6A00', borderRadius: '20px', color: '#FFFFFF', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif' },
  sendBtn: { padding: '10px 18px', background: 'linear-gradient(135deg, #FF6A00, #E53935)', color: '#FFFFFF', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: 'Inter, sans-serif' }
};

export default ChatBox;