import React, { useState, useEffect } from 'react';
import api from './endpoints/api';
import ReactMarkdown from 'react-markdown';
import logo from './Images/DrFlora.png';
import menuIcon from './Icons/menu.svg';
import plusIcon from './Icons/plus.svg';
import deleteIcon from './Icons/delete.svg';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from './endpoints/api';

// --- SUB-COMPONENT: HISTORY DRAWER ---
function HistoryDrawer({ onSelectSession }) {
  const [historyList, setHistoryList] = useState([]);

  const fetchHistory = () => {
    api.get('sessions/', { withCredentials: true })
      .then(res => setHistoryList(res.data.history))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm("Do you really want to delete this chat?")) return;
    try {
      await api.delete(`delete-session/${sessionId}/`, { withCredentials: true });
      setHistoryList(prev => prev.filter(item => item.id !== sessionId));
    } catch (err) {
      alert("Failed to delete session.");
    }
  };

  return (
    <div className="list-group list-group-flush">
      {historyList.map((item) => (
        <div key={item.id} className="d-flex align-items-center list-group-item list-group-item-action p-0">
          <button 
            className="btn text-start flex-grow-1 py-3 border-0 shadow-none"
            onClick={() => onSelectSession(item.id)}
          >
            <h6 className="mb-0 fw-bold">{item.label}</h6>
          </button>
          <button className="btn btn-link text-danger p-3" onClick={(e) => handleDelete(e, item.id)}>
            <img src={deleteIcon} alt="Delete" className="icon" style={{width:'20px'}} />
          </button>
        </div>
      ))}
    </div>
  );
}

// --- MAIN COMPONENT: CHAT CONTAINER ---
export const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [userId, setUserId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  useEffect(() => {
    api.get('user/', { withCredentials: true })
      .then(res => {
        const uname = Array.isArray(res.data) ? res.data[0]?.username : res.data?.username;
        if (uname) { setUserId(uname); setIsReady(true); }
      })
      .catch(err => console.error("User fetch error:", err));
  }, []);

  const triggerDownload = async (sessionId) => {
    try {
      const res = await api.get(`download-report/${sessionId}/`, { 
        withCredentials: true, 
        responseType: 'blob' 
      });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `Garden_Report_${sessionId.substring(0, 8)}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Download failed.");
    }
  };

  const loadPastSession = async (sessionId) => {
    try {
      const response = await api.get(`chat-history/${sessionId}/`, { withCredentials: true });
      setMessages(response.data.messages); // Messages now contain is_diagnosis flags
      setCurrentSessionId(sessionId);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    const newId = `user_${userId}_sess_${new Date().getTime()}`;
    setCurrentSessionId(newId);
    setIsDrawerOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !isReady) return;
    let sessionId = currentSessionId || `user_${userId}_sess_${new Date().getTime()}`;
    if (!currentSessionId) setCurrentSessionId(sessionId);

    const userMsg = { text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await api.post('chat/', { message: userMsg.text, session_id: sessionId }, { withCredentials: true });
      setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Connection lost.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file || !isReady) return;
    const localImageUrl = URL.createObjectURL(file);
    setMessages(prev => [...prev, { 
      text: <img src={localImageUrl} alt="Leaf" style={{maxWidth: '200px', borderRadius: '10px'}} />, 
      sender: 'user' 
    }]);

    const formData = new FormData();
    formData.append('image', file);
    let sessionId = currentSessionId || `user_${userId}_sess_${new Date().getTime()}`;
    if (!currentSessionId) setCurrentSessionId(sessionId);
    formData.append('session_id', sessionId);

    setIsTyping(true);
    try {
      const response = await api.post('chat/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      const isHealthy = response.data.display_name.toLowerCase().includes('healthy');
      setMessages(prev => [...prev, { 
        text: response.data.reply, 
        sender: 'bot',
        is_diagnosis: true,
        is_healthy: isHealthy,
        display_name: response.data.display_name,
        confidence: response.data.confidence
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Analysis failed.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = async () => {
        const success = await logout();
        if (success) {
            alert("Logged out successfully!");
            navigate('/login');
        }
    };

  return (
    <div className="vh-100 d-flex flex-column" style={{ backgroundColor: 'rgb(212, 252, 212)' }}>
      {/* NAVBAR */}
      <nav className="navbar px-3 shadow-sm" style={{ backgroundColor: 'rgb(0, 54, 0)', height: '70px' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center p-0">
          <img src={logo} alt="Dr. Flora" style={{ height: '45px' }} />
          <button className="btn p-0 border-0 shadow-none" onClick={toggleDrawer}>
            <img src={menuIcon} alt="Menu" style={{ height: "25px" }} />
          </button>
        </div>
      </nav>

      {/* DRAWER */}
      <div className={`offcanvas offcanvas-end ${isDrawerOpen ? 'show' : ''}`} style={{ visibility: isDrawerOpen ? 'visible' : 'hidden' }}>
        <div className="offcanvas-header" style={{ backgroundColor: 'rgb(0, 54, 0)', color: 'white' }}>
          <h5 className="offcanvas-title">Menu and History</h5>
          <button type="button" className="btn-close btn-close-white" onClick={toggleDrawer}></button>
        </div>
        <div className="offcanvas-body p-0">
          <div className="list-group list-group-flush py-2 border-bottom">
              <Link to="/" className="list-group-item list-group-item-action py-3 px-4 border-0" style={{ color: 'rgb(0, 54, 0)' , fontFamily:"fredoka, sans-serif"}} onClick={toggleDrawer}>
                  <h5>Home</h5>
              </Link>
              <Link to="/chatbot" className="list-group-item list-group-item-action py-3 px-4 border-0" style={{ color: 'rgb(0, 54, 0)', fontFamily:"fredoka, sans-serif" }} onClick={toggleDrawer}>
                  <h5>Chatbot</h5>
              </Link>
              <Link to="/change-password" className="list-group-item list-group-item-action py-3 px-4 border-0" style={{ color: 'rgb(0, 54, 0)', fontFamily:"fredoka, sans-serif" }} onClick={toggleDrawer}>
                  <h5>Change Password</h5>
              </Link>
              <button onClick={handleLogout} className="list-group-item list-group-item-action py-3 px-4 border-0" style={{ backgroundColor: '#ff4d4d', color: 'white' ,fontFamily:"fredoka, sans-serif"}}>
                  <h5>Logout</h5>
              </button>
              <Link to="/delete-account" className="list-group-item list-group-item-action py-3 px-4 border-0" style={{ backgroundColor: '#331010', color: 'white', fontFamily:"fredoka, sans-serif" }} onClick={toggleDrawer}>
                  <h5>Delete Account</h5>
              </Link>
          </div>
          <HistoryDrawer onSelectSession={loadPastSession} />
          <div className="p-3"><button className="btn btn-success w-100" onClick={startNewChat}>New Chat</button></div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-grow-1 overflow-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className="p-3 shadow-sm" style={{ 
              maxWidth: '75%', borderRadius: '15px',
              backgroundColor: msg.sender === 'user' ? '#1a3310' : '#ffffff',
              color: msg.sender === 'user' ? '#ffffff' : '#000000'
            }}>
              {/* Diagnosis Header (For both history and new messages) */}
              {msg.is_diagnosis && (
                <div style={{ 
                  backgroundColor: msg.is_healthy ? '#d4edda' : '#f8d7da', 
                  color: msg.is_healthy ? '#155724' : '#721c24',
                  padding: '10px', borderRadius: '8px', marginBottom: '10px', border: '1px solid currentColor'
                }}>
                  <strong>Vision Analysis Result</strong>
                  {msg.display_name && <div>{msg.display_name} ({msg.confidence}%)</div>}
                </div>
              )}

              {typeof msg.text === 'string' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              
              {/* Download button for all bot messages */}
              {msg.sender === 'bot' && currentSessionId && (
                <div className="mt-3 pt-2 border-top">
                  <button onClick={() => triggerDownload(currentSessionId)} className="btn btn-sm btn-light w-100" style={{fontWeight:'bold'}}>
                    📥 Download Report
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="d-flex justify-content-start mb-3">
            <div className="p-3 bg-white shadow-sm" style={{ borderRadius: '15px 15px 15px 5px' }}>
              <div className="d-flex gap-1">
                <div className="spinner-grow spinner-grow-sm text-success" style={{ animationDelay: '0s' }}></div>
                <div className="spinner-grow spinner-grow-sm text-success" style={{ animationDelay: '0.2s' }}></div>
                <div className="spinner-grow spinner-grow-sm text-success" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4">
        <div className="input-group container" style={{ maxWidth: '800px' }}>
          <input type="file" id="leaf-upload" className="d-none" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
          <label htmlFor="leaf-upload" className="btn btn-dark" style={{backgroundColor:"rgb(0, 54, 0)"}}>
            <img src={plusIcon} alt="+" style={{ width: '25px' }} />
          </label>
          <input type="text" className="form-control" placeholder="Ask Dr. Flora..." value={inputText}
            onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
          <button className="btn text-white" style={{ backgroundColor: 'rgb(0, 54, 0)' }} onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};