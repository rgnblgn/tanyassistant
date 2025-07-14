// src/pages/AiNotes.jsx
import React, { useState } from 'react';

const AiNotes = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleAnalyze = async () => {
    try {
      const res = await fetch('https://tanyassistant.onrender.com//generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral', // Ollama modeli (mistral, llama2, vs.)
          prompt: `Lütfen bu notu analiz et: ${input}`,
          stream: false
        })
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse('❌ Hata oluştu: ' + error.message);
    }
  };

  return (
    <div className="ainotes-container">
      <h2>AI Destekli Not Analizi</h2>
      <textarea
        placeholder="Toplantı notunu buraya gir..."
        rows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAnalyze}>Analiz Et</button>

      {response && (
        <div className="ai-response">
          <h3>AI Yorumu:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default AiNotes;
