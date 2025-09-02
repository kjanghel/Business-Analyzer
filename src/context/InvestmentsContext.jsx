import React, { createContext, useContext, useState } from 'react';
import investmentsData from '../data/investments.json';

const InvestmentsContext = createContext();

export function InvestmentsProvider({ children }) {
  // Load from localStorage if available, else start with empty array
  function getInitialInvestments() {
    try {
      const stored = localStorage.getItem('investments');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }
  const [investments, setInvestments] = useState(getInitialInvestments());

  // Persist to localStorage whenever investments change
  React.useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

  // Replace investments with uploaded data
  const uploadInvestments = (newData) => {
    setInvestments(newData);
  };

  // Add new transaction
  const addInvestment = (tx) => {
    setInvestments((prev) => [
      { ...tx, id: Date.now().toString() },
      ...prev,
    ]);
  };

  // Edit transaction
  const editInvestment = (updatedTx) => {
    setInvestments((prev) => prev.map((tx) => tx.id === updatedTx.id ? updatedTx : tx));
  };

  // Delete transaction
  const deleteInvestment = (id) => {
    setInvestments((prev) => prev.filter((tx) => tx.id !== id));
  };

  return (
    <InvestmentsContext.Provider value={{ investments, uploadInvestments, addInvestment, editInvestment, deleteInvestment }}>
      {children}
    </InvestmentsContext.Provider>
  );
}

export function useInvestments() {
  return useContext(InvestmentsContext);
}
