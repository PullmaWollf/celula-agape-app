// api/schedule-alarm.js — Salva alarmes diários de lanche no banco para o cron disparar
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).end();

  const { escala_id, alarm_ts, members } = req.body;
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!escala_id || !alarm_ts || !members) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // alarm_ts é a data da célula (ex: "2024-05-20")
  const cellDate = new Date(alarm_ts + 'T12:00:00-03:00'); // Garante 12:00 BRT
  const userIds = members.map(m => m.id);

  // Lógica: Notificar todos os dias de segunda-feira até o dia da célula às 12:00 BRT (GMT-3)
  // 12:00 BRT é 15:00 UTC
  const dayOfWeek = cellDate.getDay(); // 0 (Dom) a 6 (Sab)
  
  // Ajuste para encontrar a segunda-feira da mesma semana da célula
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(cellDate);
  monday.setDate(cellDate.getDate() + diffToMonday);
  monday.setHours(12, 0, 0, 0); // 12:00 Local (Brasília no servidor configurado ou compensado)

  const horarios = [];
  let current = new Date(monday);

  // Loop de segunda até o dia da célula
  while (current <= cellDate) {
    // Definir 12:00 BRT (15:00 UTC)
    const fireAt = new Date(current);
    fireAt.setUTCHours(15, 0, 0, 0); 

    horarios.push({
      key: `esc-${escala_id}-daily-${fireAt.toISOString().split('T')[0]}`,
      fire_at: fireAt.toISOString()
    });
    current.setDate(current.getDate() + 1);
  }

  // Limpar alarmes antigos desta escala antes de inserir novos (evita duplicados)
  await fetch(`${SUPA_URL}/rest/v1/push_alarms?alarm_key=like.esc-${escala_id}-*`, {
    method: 'DELETE',
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
  });

  for (const h of horarios) {
    await fetch(`${SUPA_URL}/rest/v1/push_alarms`, {
      method: 'POST',
      headers: {
        apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json', Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        alarm_key:       h.key,
        fire_at:         h.fire_at,
        title:           'Bom dia!!! Você está escalado para o lanche da semana, organize-se!',
        body:            'Lembrete da Escala Ágape',
        target_user_ids: userIds,
        url:             '/?page=escala',
        sent:            false
      })
    });
  }

  return res.status(200).json({ scheduled: horarios.length });
}
