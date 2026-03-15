import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Fetch leads
  const fetchLeads = async () => {
    try {
      const response = await axios.get('https://future-fs-02-48c9.onrender.com/');
      setLeads(response.data);
    } catch (err) { console.error("Error fetching leads", err); }
  };

  useEffect(() => { fetchLeads(); }, []);

  // 2. Add lead
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://future-fs-02-48c9.onrender.com/', formData);
      setFormData({ name: '', email: '', notes: '' });
      fetchLeads();
    } catch (err) { console.error("Error adding lead", err); }
  };

  // 3. Update status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`https://future-fs-02-48c9.onrender.com/${id}`, { status: newStatus });
      fetchLeads();
    } catch (err) { console.error("Error updating status", err); }
  };

  // 4. Delete lead
  const deleteLead = async (id) => {
    if (window.confirm("Delete this lead permanently?")) {
      try {
        await axios.delete(`https://future-fs-02-48c9.onrender.com/${id}`);
        fetchLeads();
      } catch (err) { console.error("Error deleting lead", err); }
    }
  };

  // --- UI CALCULATIONS FOR ANALYTICS CARDS ---
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        
        {/* HEADER */}
        <div className="header">
          <div className="header-titles">
            <h1>Client Lead Management System (Mini CRM)</h1>
            <p>Manage and convert your incoming leads seamlessly.</p>
          </div>
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* ANALYTICS DASHBOARD */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-title">📊 Total Leads</span>
            <h2 className="stat-value">{totalLeads}</h2>
          </div>
          <div className="stat-card" style={{borderBottom: '4px solid #3b82f6'}}>
            <span className="stat-title">🆕 New Leads</span>
            <h2 className="stat-value">{newLeads}</h2>
          </div>
          <div className="stat-card" style={{borderBottom: '4px solid #f59e0b'}}>
            <span className="stat-title">📞 Contacted</span>
            <h2 className="stat-value">{contactedLeads}</h2>
          </div>
          <div className="stat-card" style={{borderBottom: '4px solid #10b981'}}>
            <span className="stat-title">🤝 Converted</span>
            <h2 className="stat-value">{convertedLeads}</h2>
          </div>
        </div>

        {/* DATA ENTRY FORM */}
        <div className="lead-form-container">
          <h3 className="form-title">Add New Client Lead</h3>
          <form className="lead-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Client Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <input type="text" placeholder="Meeting / Follow-up Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            <button type="submit" className="btn-add">➕ Add Lead</button>
          </form>
        </div>

        {/* DATA TABLE */}
        <div className="table-container">
          <table className="lead-table">
            <thead>
              <tr>
                <th>Client Info</th>
                <th>Contact Details</th>
                <th>Notes</th>
                <th>Pipeline Status</th>
                <th style={{textAlign: 'center'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead._id}>
                  <td style={{fontWeight: '600'}}>{lead.name}</td>
                  <td style={{color: 'var(--text-muted)'}}>{lead.email}</td>
                  <td>{lead.notes || <span style={{opacity: 0.5}}>No notes</span>}</td>
                  <td>
                    <select 
                      className={`status-select ${lead.status}`} 
                      value={lead.status} 
                      onChange={(e) => updateStatus(lead._id, e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </td>
                  <td style={{textAlign: 'center'}}>
                    <button className="delete-btn" title="Delete Lead" onClick={() => deleteLead(lead._id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <div style={{fontSize: '3rem', marginBottom: '10px'}}>📭</div>
                    No leads in the pipeline. Add your first client above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default App;