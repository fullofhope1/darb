import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { transactions } from '../api';

export default function Chat({ user }) {
  const { transactionId } = useParams();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [txn, setTxn] = useState(null);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    transactions.list().then((list) => {
      const t = list.find((x) => x.id === transactionId);
      if (t) setTxn(t);
    }).catch(() => {});

    const token = localStorage.getItem('token');
    const s = io(window.location.origin, { auth: { token } });
    socketRef.current = s;

    s.emit('join', transactionId);

    s.on('message', (msg) => {
      setMsgs((prev) => [...prev, msg]);
    });

    // Load history
    fetch(`/api/messages/${transactionId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setMsgs(Array.isArray(data) ? data : []))
      .catch(() => {});

    return () => {
      s.emit('leave', transactionId);
      s.disconnect();
    };
  }, [transactionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socketRef.current?.emit('message', { transaction_id: transactionId, content: input });
    setInput('');
  };

  const partnerName = txn
    ? (txn.client_id === user?.id ? txn.provider_name : txn.client_name)
    : '';

  return (
    <div className="card" style={{ maxWidth: 700, margin: '20px auto', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '70vh' }}>
      <div style={{ background: '#1B6B3E', color: 'white', padding: '12px 16px' }}>
        <p className="m-0 font-bold">{partnerName || 'المحادثة'}</p>
        <p className="m-0 text-xs opacity-80">{txn?.amount?.toLocaleString()} ريال</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.map((m) => {
          const isMe = m.sender_id === user?.id;
          return (
            <div key={m.id || Math.random()} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-start' : 'flex-end' }}>
              <div style={{
                maxWidth: '80%', padding: '8px 14px', borderRadius: 16,
                background: isMe ? '#1B6B3E' : '#e5e7eb',
                color: isMe ? 'white' : '#1f2937',
                fontSize: 14, lineHeight: 1.5,
                borderBottomRightRadius: isMe ? 4 : 16,
                borderBottomLeftRadius: isMe ? 16 : 4,
              }}>
                {m.content}
              </div>
              <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                {m.created_at ? new Date(m.created_at).toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #e5e7eb', background: 'white' }}>
        <input className="input-field" style={{ flex: 1 }} value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب رسالة..." />
        <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>إرسال</button>
      </form>
    </div>
  );
}
