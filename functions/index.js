const { onValueCreated } = require('firebase-functions/v2/database');

// Private ntfy.sh topic — subscribe to this exact name in the ntfy app to receive pushes.
const NTFY_TOPIC = 'cart-dispatch-a9b6e905b17f';

const TYPE_ICONS = { People: '🧑‍🤝‍🧑', Luggage: '🧳' };

exports.notifyNewRequest = onValueCreated('/requests/{requestId}', async (event) => {
  const r = event.data.val();
  if (!r) return;
  const type = r.type || 'Other';
  const icon = TYPE_ICONS[type] || '✳️';
  await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: 'POST',
    headers: { Title: 'New cart request' },
    body: `${icon} ${r.location} — ${type}`
  });
});
