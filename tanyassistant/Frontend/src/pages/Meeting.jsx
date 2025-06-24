// src/pages/Meeting.jsx
import React, { useState } from 'react';
import './Meeting.css';

const Meeting = () => {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  const handleSave = () => {
    const newNote = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleString('tr-TR')
    };
    setNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
    setShowForm(false);

    
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
            key={note.id}
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
        </div>
      )}
    </div>
  );
};

export default Meeting;