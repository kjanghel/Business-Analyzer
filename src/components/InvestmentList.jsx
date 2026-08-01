import React from 'react';
import { formatINR } from '../utils/formatINR';
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

    // Sort transactions by date descending (if needed)
    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      <Box>
        {sorted.map((t) => {
          let cardColor = '#e3f2fd';
          let label = '';
          let labelColor = 'primary';
          if (t.type === 'invest') {
            cardColor = '#e3f2fd';
            label = 'Invested';
            labelColor = 'primary';
          } else if (t.type === 'withdraw') {
            cardColor = '#fffde7';
            label = 'Withdrawn';
            labelColor = 'warning.main';
          } else if (t.type === 'profit') {
            cardColor = '#e8f5e9';
            label = 'Profit';
            labelColor = 'success.main';
          } else if (t.type === 'loss') {
            cardColor = '#ffebee';
            label = 'Loss';
            labelColor = 'error.main';
          }
          return (
            <Card key={t.id} className="card-animate" sx={{ mb: 2, borderRadius: 3, boxShadow: 2, bgcolor: cardColor }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} color={labelColor}>
                  {label}: <span style={{ color: labelColor }}>₹{formatINR(t.amount)}</span>
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Date: {t.date}
                </Typography>
                {t.mode && t.type === 'invest' && (
                  <Chip label={t.mode} size="small" sx={{ mt: 1, mb: 1 }} />
                )}
                {t.info && (
                  <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                    Info: {t.info}
                  </Typography>
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
          );
        })}
      </Box>
    );
  }
