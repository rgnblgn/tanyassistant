// src/pages/Meeting.jsx
import React, { useState, useEffect } from 'react';
import './Meeting.css';

const API_URL = 'https://tanyassistant.onrender.com/api/meetings';

const Meeting = () => {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error('GET failed:', err));
  }, []);

  const handleSave = () => {
    const token = localStorage.getItem('authToken');

    const newNote = {
      title,
      content,
      date: new Date().toLocaleString('tr-TR')
    };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newNote)
    })
      .then(res => res.json())
      .then(saved => {
        setNotes([saved, ...notes]);
        setTitle('');
        setContent('');
        setShowForm(false);
      })
      .catch(err => console.error('POST failed:', err));
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setNotes(notes.filter(note => note._id !== id));
        setSelectedNote(null);
      })
      .catch(err => console.error('DELETE failed:', err));
  };

  return (
    <div className="meeting-container">
      <h2 className="meeting-title">Toplantı Notları</h2>
      <button className="create-button" onClick={() => setShowForm(true)}>
        + Yeni Toplantı Notu
      </button>

      {showForm && (
        <div className="note-form">
          <h3>Yeni Not</h3>
          <input
            type="text"
            placeholder="Toplantı Başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows="5"
            placeholder="Toplantı Notları"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="form-actions">
            <button onClick={handleSave}>Kaydet</button>
            <button className="cancel" onClick={() => setShowForm(false)}>İptal</button>
          </div>
        </div>
      )}

      <div className="note-grid">
        {notes.map(note => (
          <div
            key={note._id}
            className="note-card"
            onClick={() => setSelectedNote(note)}
          >
            <h4>{note.title}</h4>
            <span>{note.date}</span>
          </div>
        ))}
      </div>

      {selectedNote && (
        <div className="note-detail">
          <h3>{selectedNote.title}</h3>
          <p className="note-date">{selectedNote.date}</p>
          <p>{selectedNote.content}</p>
          <button onClick={() => setSelectedNote(null)}>Kapat</button>
          <button className="delete-button" onClick={() => handleDelete(selectedNote._id)}>Sil</button>
        </div>
      )}
    </div>
  );
};

export default Meeting;