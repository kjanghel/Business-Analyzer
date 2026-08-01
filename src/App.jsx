
import React from 'react';
import { InvestmentsProvider } from './context/InvestmentsContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Home';
import TransactionsSection from './components/TransactionsSection';
import investmentsData from './data/investments.json';
import MainLayout from './components/MainLayout';
import PrivateRoute from './components/PrivateRoute';


function App() {
  // Transaction logic will be handled in context-aware components

  return (
    <InvestmentsProvider>
  <BrowserRouter basename="/Business-Analyzer">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/transactions" element={
            <PrivateRoute>
              <MainLayout>
                <TransactionsSection />
              </MainLayout>
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </InvestmentsProvider>
  );
}

export default App;
