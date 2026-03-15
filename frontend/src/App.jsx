import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' });

  // Fetch leads from the backend
  const fetchLeads = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leads');
      setLeads(response.data);
    } catch (err) { console.error("Error fetching leads", err); }
  };

  // Load leads when the page opens
  useEffect(() => { fetchLeads(); }, []);

  // Add a new lead
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/leads', formData);
      setFormData({ name: '', email: '', notes: '' }); // Clear the form
      fetchLeads(); // Refresh the list
    } catch (err) { console.error("Error adding lead", err); }
  };

  // Update a lead's status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${id}`, { status: newStatus });
      fetchLeads(); // Refresh the list
    } catch (err) { console.error("Error updating status", err); }
  };

  // Delete a lead
  const deleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await axios.delete(`http://localhost:5000/api/leads/${id}`);
        fetchLeads(); // Refresh the list
      } catch (err) { console.error("Error deleting lead", err); }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>💼 Mini CRM Dashboard</h1>
        <p>Total Leads: <strong>{leads.length}</strong></p>
      </div>

      <form className="lead-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Client Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="text" placeholder="Follow-up Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
        <button type="submit" className="btn-add">+ Add Lead</button>
      </form>

      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.notes || '-'}</td>
              <td>
                <select 
                  className={`status-tag ${lead.status}`} 
                  value={lead.status} 
                  onChange={(e) => updateStatus(lead._id, e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Converted">Converted</option>
                </select>
              </td>
              <td>
                <button className="delete-btn" onClick={() => deleteLead(lead._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;