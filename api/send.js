export default async function handler(req, res) {
  // Разрешаем запросы только методом POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  const TOKEN = process.env.TG_BOT_TOKEN;
  const CHAT_ID = process.env.TG_CHAT_ID;

  // Проверяем, заданы ли переменные окружения в Vercel
  if (!TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Server configuration error: missing tokens' });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: CHAT_ID, 
        text: text
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(400).json({ error: data.description });
    }

    return res.status(200).json({ success: true, result: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
