import React from 'react';
// Animation styles for card entrance and hover
const cardAnimStyle = `
@keyframes cardEnter {
  0% { opacity: 0; transform: translateY(30px) scale(0.96); }
  60% { opacity: 1; transform: translateY(-6px) scale(1.03); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.card-animate {
  animation: cardEnter 0.7s cubic-bezier(.68,-0.55,.27,1.55);
  transition: transform 0.25s, box-shadow 0.25s;
}
.card-animate:hover {
  transform: scale(1.04) translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
`;
import { Card, CardContent, Typography, Chip, Box, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function InvestmentList({ transactions, onEdit, onDelete }) {
  // Inject animation styles
  React.useEffect(() => {
    if (!document.getElementById('card-anim-style')) {
      const style = document.createElement('style');
      style.id = 'card-anim-style';
      style.innerHTML = cardAnimStyle;
      document.head.appendChild(style);
    }
  }, []);
  if (!transactions || transactions.length === 0) {
    return (
      <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
        No transactions yet.
      </Typography>
    );
  }

  // Sort by date descending
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Box>
      {sorted.map((t) => (
        <Card key={t.id} className="card-animate" sx={{ mb: 2, borderRadius: 3, boxShadow: 2, bgcolor: t.type === 'received' ? '#e8f5e9' : '#e3f2fd' }}>
          <CardContent>
            {t.type === 'invest' ? (
              <>
                <Typography variant="subtitle1" fontWeight={700} color="primary">
                  Invested: <span style={{ color: '#1976d2' }}>₹{t.amount}</span>
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Date: {t.date}
                </Typography>
                <Chip label={t.mode} size="small" sx={{ mt: 1, mb: 1 }} />
              </>
            ) : (
              <>
                <Typography variant="subtitle1" fontWeight={700} color="success.main">
                  Received: ₹{t.amount}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Date: {t.date}
                </Typography>
                {t.info && (
                  <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                    Info: {t.info}
                  </Typography>
                )}
              </>
            )}
            {/* Action Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Box
                component="button"
                sx={{ px: 2, py: 0.5, borderRadius: 2, bgcolor: '#1976d2', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: 14, boxShadow: 1, transition: 'background 0.2s', '&:hover': { bgcolor: '#1565c0' } }}
                onClick={() => onEdit && onEdit(t)}
              >
                <EditIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} /> Edit
              </Box>
              <Box
                component="button"
                sx={{ px: 2, py: 0.5, borderRadius: 2, bgcolor: '#d32f2f', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: 14, boxShadow: 1, transition: 'background 0.2s', '&:hover': { bgcolor: '#b71c1c' } }}
                onClick={() => onDelete && onDelete(t.id)}
              >
                <DeleteIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} /> Delete
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
