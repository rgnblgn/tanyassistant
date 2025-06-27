const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ result: data.response });
  } catch (err) {
    console.error('AI error:', err);
    res.status(500).json({ error: 'AI failed' });
  }
});

module.exports = router;
