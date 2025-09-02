import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';

const paymentModes = [
  'Bank Transfer',
  'UPI',
  'Cash',
  'Card',
  'Other'
];

export default function AddInvestmentDialog({ open, onClose, onAdd, initialData }) {
  const [type, setType] = useState(initialData?.type || 'invest');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [mode, setMode] = useState(initialData?.mode || paymentModes[0]);
  const [info, setInfo] = useState(initialData?.info || '');

  const handleSubmit = () => {
    if (!amount || !date || (type === 'invest' && !mode)) return;
    const tx = {
      ...(initialData || {}),
      type,
      amount: Number(amount),
      date,
      mode: type === 'invest' ? mode : undefined,
      info: type === 'received' ? info : undefined,
    };
    onAdd(tx);
    setAmount('');
    setDate('');
    setMode(paymentModes[0]);
    setType('invest');
    setInfo('');
    onClose();
  };

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'invest');
      setAmount(initialData.amount?.toString() || '');
      setDate(initialData.date || '');
      setMode(initialData.mode || paymentModes[0]);
      setInfo(initialData.info || '');
    }
  }, [initialData]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, boxShadow: 6, bgcolor: '#f6f9fb', p: 0 } }}>
  <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText', py: 1.5, px: 3, borderTopLeftRadius: 16, borderTopRightRadius: 16, minHeight: 56 }}>
        {type === 'invest' ? (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#1976d2"/><path d="M7 17l5-5 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12V7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#388e3c"/><path d="M17 7l-5 5-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        )}
        <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: 1 }}>Add Transaction</span>
      </DialogTitle>
  <DialogContent sx={{marginTop: 2, pt: 2, pb: 1.5, px: 3 }}>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={(_, val) => val && setType(val)}
          sx={{ mb: 3, width: '100%', bgcolor: '#e3f2fd', borderRadius: 3, boxShadow: 1 }}
        >
          <ToggleButton value="invest" sx={{ flex: 1, fontWeight: 700, fontSize: '1rem', color: '#1976d2', borderRadius: 2 }}>Invested</ToggleButton>
          <ToggleButton value="received" sx={{ flex: 1, fontWeight: 700, fontSize: '1rem', color: '#388e3c', borderRadius: 2 }}>Received</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={e => setAmount(e.target.value)}
          sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
          InputProps={{ style: { fontWeight: 700, fontSize: '1.1rem' } }}
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={e => setDate(e.target.value)}
          sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
          InputLabelProps={{ shrink: true }}
          InputProps={{ style: { fontWeight: 500, fontSize: '1rem' } }}
        />
        {type === 'invest' && (
          <TextField
            label="Mode of Payment"
            select
            fullWidth
            value={mode}
            onChange={e => setMode(e.target.value)}
            sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
            InputProps={{ style: { fontWeight: 500, fontSize: '1rem' } }}
          >
            {paymentModes.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </TextField>
        )}
        {type === 'received' && (
          <TextField
            label="Payment Info"
            fullWidth
            value={info}
            onChange={e => setInfo(e.target.value)}
            sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
            placeholder="e.g. UPI ref, bank, cash, etc."
            InputProps={{ style: { fontWeight: 500, fontSize: '1rem' } }}
          />
        )}
      </DialogContent>
  <DialogActions sx={{ px: 3, pb: 1.5, pt: 1, justifyContent: 'space-between', bgcolor: '#e3f2fd', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <Button onClick={onClose} sx={{ fontWeight: 700, color: '#1976d2', bgcolor: '#fff', borderRadius: 2, boxShadow: 1, px: 3, py: 1, '&:hover': { bgcolor: '#e3f2fd' } }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ fontWeight: 700, bgcolor: 'primary.main', borderRadius: 2, px: 3, py: 1, boxShadow: 2, fontSize: '1rem' }}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
