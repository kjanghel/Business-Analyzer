import React, { useState } from 'react';
import AddInvestmentDialog from './AddInvestmentDialog';
import { useInvestments } from '../context/InvestmentsContext';
import { Box, Typography, Card, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InvestmentList from './InvestmentList';

export default function TransactionsSection({ transactions, onAddTransaction }) {
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const { investments, addInvestment, editInvestment, deleteInvestment } = useInvestments();

  // Edit handler
  const handleEdit = (tx) => {
    setEditTx(tx);
  };
  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      deleteInvestment(id);
    }
  };
  // Save edit
  const handleSaveEdit = (updatedTx) => {
    editInvestment(updatedTx);
    setEditTx(null);
  };

  // Filtered transactions
  const filtered =
    filter === 'all'
      ? investments
      : filter === 'invest'
      ? investments.filter((t) => t.type === 'invest')
      : investments.filter((t) => t.type === 'received');

  // ...existing code...
  return (
    <Box sx={{ px: 2, pt: 2, maxWidth: 430, mx: 'auto', position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky header and filter using fixed positioning */}
      <Box sx={{ position: 'fixed', top: 56, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, zIndex: 1200, bgcolor: '#f6f9fb', boxShadow: 2 }}>
        <Card sx={{ borderRadius: 0, boxShadow: 0, bgcolor: '#e3f2fd', p: 2 }}>
          <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 1 }}>
            Transactions
          </Typography>
          {/* Filter Section */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Box
              component="button"
              sx={{ flex: 1, py: 1, borderRadius: 2, bgcolor: filter === 'all' ? '#bbdefb' : '#fff', border: '1px solid #90caf9', color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setFilter('all')}
            >
              All
            </Box>
            <Box
              component="button"
              sx={{ flex: 1, py: 1, borderRadius: 2, bgcolor: filter === 'invest' ? '#c8e6c9' : '#fff', border: '1px solid #66bb6a', color: '#2e7d32', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setFilter('invest')}
            >
              Invested
            </Box>
            <Box
              component="button"
              sx={{ flex: 1, py: 1, borderRadius: 2, bgcolor: filter === 'received' ? '#f8bbd0' : '#fff', border: '1px solid #f06292', color: '#ad1457', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setFilter('received')}
            >
              Received
            </Box>
          </Box>
        </Card>
      </Box>
      {/* Scrollable transaction list starts right after sticky header */}
      <Box sx={{ flex: 1, overflowY: 'auto', pb: 10, mt: '110px', pt: 2, maxHeight: 'calc(100vh - 210px)', bgcolor: '#f6f9fb', borderRadius: 3 }}>
        <InvestmentList
          transactions={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>
      {/* FAB for adding transactions */}
      <Box sx={{ position: 'fixed', bottom: 80, right: '50%', transform: 'translateX(180px)', zIndex: 1200, maxWidth: 430, mx: 'auto' }}>
        <Fab color="primary" aria-label="add" sx={{ boxShadow: 3 }} onClick={() => setShowAdd(true)}>
          <AddIcon />
        </Fab>
      </Box>
      <AddInvestmentDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={addInvestment}
      />
      {/* Edit dialog (reuse AddInvestmentDialog for simplicity) */}
      {editTx && (
        <AddInvestmentDialog
          open={!!editTx}
          onClose={() => setEditTx(null)}
          onAdd={handleSaveEdit}
          initialData={editTx}
        />
      )}
    </Box>
  );
}
