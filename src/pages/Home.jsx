import React, { useState } from 'react';
import investmentsData from '../data/investments.json';
import { useInvestments } from '../context/InvestmentsContext';
// import InvestmentList from '../components/InvestmentList';
import InvestmentGraph from '../components/InvestmentGraph';
import AddInvestmentDialog from '../components/AddInvestmentDialog';
import {
    Box,
    Typography,
    IconButton,
    AppBar,
    Toolbar,
    Avatar,
    Card,
    CardContent,
    BottomNavigation,
    BottomNavigationAction,
    Fab,
} from '@mui/material';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { getLoggedInUsername } from '../utils/auth';
import { formatINR } from '../utils/formatINR';
import BusinessPerformanceAreaChart, { getBusinessPerformanceData } from '../components/BusinessPerformanceAreaChart';

export default function Dashboard({ transactions, onAddTransaction }) {
    // Use investments from context
        const { investments, uploadInvestments, addInvestment } = useInvestments();

    // Upload handler for investments.json
    const handleUploadInvestments = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                if (Array.isArray(json) && json.every(item => item.id && item.type && item.amount && item.date)) {
                    uploadInvestments(json);
                } else {
                    alert('Invalid investments.json format.');
                }
            } catch {
                alert('Error parsing investments.json file.');
            }
        };
        reader.readAsText(file);
    };

    // Download investments.json handler
    const handleDownloadInvestments = () => {
        const blob = new Blob([JSON.stringify(investments, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'investments.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [initialData, setInitialData] = useState({});
    const username = getLoggedInUsername();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Investment summary
    const investedTx = investments.filter((t) => t.type === 'invest');
    const withdrawTx = investments.filter((t) => t.type === 'withdraw');
    const profitTx = investments.filter((t) => t.type === 'profit');
    const lossTx = investments.filter((t) => t.type === 'loss');

    const totalInvested = investedTx.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdraw = withdrawTx.reduce((sum, t) => sum + t.amount, 0);
    const totalProfit = profitTx.reduce((sum, t) => sum + t.amount, 0);
    const totalLoss = lossTx.reduce((sum, t) => sum + t.amount, 0);

    // Current Value = Invested + Profit - Loss - Withdrawn
    const currentValue = totalInvested + totalProfit - totalLoss - totalWithdraw;
    // Overall Profit/Loss = Profit - Loss
    const overallPL = totalProfit - totalLoss;
    // % Profit/Loss = (overallPL * 100) / totalInvested
    const percentPL = totalInvested > 0 ? ((overallPL * 100) / totalInvested).toFixed(2) : '0.00';

  // Additional KPIs
    const numInvestments = investedTx.length;
    const numWithdraw = withdrawTx.length;

  // Date & amount metrics
    const firstInvestObj = investedTx.length > 0 ? investedTx.reduce((min, t) => new Date(t.date) < new Date(min.date) ? t : min, investedTx[0]) : null;
    const lastInvestObj = investedTx.length > 0 ? investedTx.reduce((max, t) => new Date(t.date) > new Date(max.date) ? t : max, investedTx[0]) : null;
    const lastWithdrawObj = withdrawTx.length > 0 ? withdrawTx.reduce((max, t) => new Date(t.date) > new Date(max.date) ? t : max, withdrawTx[0]) : null;
    // Investment duration (days between first investment and today)
    let investDuration = '--';
    if (firstInvestObj) {
        const start = new Date(firstInvestObj.date);
        const end = new Date(); // today's date
        investDuration = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24))) + ' days';
    }

  // Prepare graph data points (group by date, sum invested/received)
    const graphData = [];
    const dateMap = {};
    investments.forEach((t) => {
        if (!dateMap[t.date]) {
            dateMap[t.date] = { date: t.date, invested: 0, withdraw: 0 };
        }
        if (t.type === 'invest') {
            dateMap[t.date].invested += t.amount;
        } else if (t.type === 'withdraw') {
            dateMap[t.date].withdraw += t.amount;
        }
    });
    Object.values(dateMap)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach((d) => graphData.push(d));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f6f9fb', pb: 8, width: '100vw', position: 'relative', overflowX: 'hidden' }}>
        <Box sx={{ mx: 'auto', width: '100%', maxWidth: 430, minHeight: '100vh', position: 'relative', boxShadow: { xs: 0, md: 2 }, borderRadius: { xs: 0, md: 4 } }}>

            {/* Filter section moved to TransactionsSection */}
            {/* Welcome Card & Profile Section */}
            <Box sx={{ mt: 4, px: 2 }}>
                {/* Top Widget: User Card with Total Return */}
                <Box sx={{ mb: 3, overflow: 'hidden' }}>
                    {/* Card and Actions in a single row */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        {/* Card on left */}
                        <Card sx={{ flex: 1, borderRadius: 4, boxShadow: 3, overflow: 'hidden', minHeight: 110 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'primary.main', color: 'primary.contrastText', p: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.contrastText', color: 'primary.main', width: 48, height: 48, mr: 2, fontWeight: 700 }}>
                                    {username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="h6" fontWeight={700} sx={{ color: 'primary.contrastText', fontSize: '1.1rem' }}>
                                    {username.toLocaleUpperCase()}
                                </Typography>
                            </Box>
                            <Box sx={{ bgcolor: '#fffde7', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, mb: 1, width: '100%' }}>
                                    {/* Current Value Row */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, width: '100%' }}>
                                        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ minWidth: 110, fontSize: '1.1rem', textAlign: 'left' }}>Current Value:</Typography>
                                        <AttachMoneyIcon color="primary" sx={{ fontSize: 24 }} />
                                        <Typography variant="h5" fontWeight={800} color={currentValue >= 0 ? 'success.main' : 'error'} sx={{ fontSize: '1.6rem', textAlign: 'left' }}>
                                            ₹{formatINR(currentValue)}
                                        </Typography>
                                    </Box>
                                    {/* Total Profit/Loss Row */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, width: '100%' }}>
                                        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ minWidth: 110, fontSize: '1.1rem', textAlign: 'left' }}>Total {overallPL >= 0 ? 'Profit' : 'Loss'}:</Typography>
                                        {overallPL >= 0 ? (
                                            <TrendingUpIcon color="success" sx={{ fontSize: 24 }} />
                                        ) : (
                                            <TrendingDownIcon color="error" sx={{ fontSize: 24 }} />
                                        )}
                                        <Typography variant="h5" fontWeight={800} color={overallPL >= 0 ? 'success.main' : 'error.main'} sx={{ fontSize: '1.6rem', textAlign: 'left' }}>
                                            ₹{formatINR(overallPL)}
                                        </Typography>
                                    </Box>
                                    {/* % Profit/Loss Row */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ minWidth: 110, fontSize: '1.1rem', textAlign: 'left' }}>% {overallPL >= 0 ? 'Profit' : 'Loss'}:</Typography>
                                        {overallPL >= 0 ? (
                                            <TrendingUpIcon color="success" sx={{ fontSize: 24 }} />
                                        ) : (
                                            <TrendingDownIcon color="error" sx={{ fontSize: 24 }} />
                                        )}
                                        <Typography variant="h5" fontWeight={800} sx={{ color: overallPL >= 0 ? 'success.main' : 'error.main', fontSize: '1.6rem', textAlign: 'left' }}>
                                            {percentPL}%
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                                                {/* Action buttons in 4 rows on right */}
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                <IconButton color="success" size="large" aria-label="Add Withdraw" onClick={() => {setInitialData({type: 'withdraw'}); setShowAdd(true)}}>
                                                                    <CallReceivedIcon sx={{ fontSize: 22, color: '#388e3c', mb: 1 }} />
                                                                    
                                                                </IconButton>
                                                                <IconButton color="success" size="large" aria-label="Add Profit" onClick={() => {setInitialData({type: 'profit'}); setShowAdd(true)}}>
                                                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#2e7d32"/><path d="M12 7v10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 12l5-5 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                                    </span>
                                                                </IconButton>
                                                                <IconButton color="success" size="large" aria-label="Add Loss" onClick={() => {setInitialData({type: 'loss'}); setShowAdd(true)}}>
                                                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#d32f2f"/><path d="M12 17V7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 12l-5 5-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                                    </span>
                                                                </IconButton>
                                                                <IconButton color="info" size="large" aria-label="Upload investments.json" component="label">
                                                                      <input type="file" accept="application/json" hidden onChange={handleUploadInvestments} />
                                                                    <UploadFileIcon />
                                                                </IconButton>

                                                                <IconButton color="secondary" size="large" aria-label="Download investments.json" onClick={handleDownloadInvestments}>
                                                                    <DownloadForOfflineIcon />
                                                                </IconButton>
                                                            </Box>
                                            </Box>
                    
                    
                </Box>

            {/* Dashboard KPIs - Modern Layout */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2 }}>
                {/* Main Metrics - Financial Dashboard Style & KPIs - All in one scrollable row */}
                <style>{`
                @keyframes fall {
                    0% { transform: translateY(-20px) rotate(-10deg); opacity: 0.7; }
                    60% { transform: translateY(10px) rotate(10deg); opacity: 1; }
                    80% { transform: translateY(-5px) rotate(-5deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                }
                @keyframes rise {
                    0% { transform: translateY(20px) scale(0.8); opacity: 0.7; }
                    60% { transform: translateY(-10px) scale(1.1); opacity: 1; }
                    80% { transform: translateY(5px) scale(0.95); }
                    100% { transform: translateY(0) scale(1); }
                }
                .falling {
                    animation: fall 1s cubic-bezier(.68,-0.55,.27,1.55) both;
                }
                .rising {
                    animation: rise 1s cubic-bezier(.68,-0.55,.27,1.55) both;
                }
                .card-animate {
                    transition: transform 0.3s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s;
                }
                .card-animate:hover {
                    transform: scale(1.04) translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                }
                `}</style>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0, mb: 2, overflowX: 'auto', pb: 1, width: '100%', scrollSnapType: 'x mandatory' }}>
                {/* Invested */}
                <Card className="card-animate" sx={{ minWidth: 220, maxWidth: 220, bgcolor: '#e3f2fd', borderRadius: 4, boxShadow: 3, p: 3, textAlign: 'center', flex: '0 0 auto', mx: 1, scrollSnapAlign: 'center' }}>
                    <AttachMoneyIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#1976d2', fontSize: '1.1rem', mb: 0.5 }}>Invested</Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#1976d2', mt: 1, fontSize: '2.2rem', lineHeight: 1.1 }}>₹{formatINR(totalInvested)}</Typography>
                </Card>
                {/* Withdrawn*/}
                <Card className="card-animate" sx={{ minWidth: 220, maxWidth: 220, bgcolor: '#fffde7', borderRadius: 4, boxShadow: 3, p: 3, textAlign: 'center', flex: '0 0 auto', mx: 1, scrollSnapAlign: 'center' }}>
                    <CallReceivedIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#388e3c', fontSize: '1.1rem', mb: 0.5 }}>Withdrawn</Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#388e3c', mt: 1, fontSize: '2.2rem', lineHeight: 1.1 }}>₹{formatINR(totalWithdraw)}</Typography>
                </Card>
                {/* Total Profits */}
                <Card className="card-animate" sx={{ minWidth: 220, maxWidth: 220, bgcolor: '#e8f5e9', borderRadius: 4, boxShadow: 3, p: 3, textAlign: 'center', flex: '0 0 auto', mx: 1, scrollSnapAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#2e7d32', fontSize: '1.1rem', mb: 0.5 }}>Total Profits</Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#2e7d32', mt: 1, fontSize: '2.2rem', lineHeight: 1.1 }}>₹{formatINR(totalProfit)}</Typography>
                </Card>
                {/* Total Loss */}
                <Card className="card-animate" sx={{ minWidth: 220, maxWidth: 220, bgcolor: '#ffebee', borderRadius: 4, boxShadow: 3, p: 3, textAlign: 'center', flex: '0 0 auto', mx: 1, scrollSnapAlign: 'center' }}>
                    <TrendingDownIcon sx={{ fontSize: 40, color: '#d32f2f', mb: 1 }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#d32f2f', fontSize: '1.1rem', mb: 0.5 }}>Total Loss</Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#d32f2f', mt: 1, fontSize: '2.2rem', lineHeight: 1.1 }}>₹{formatINR(totalLoss)}</Typography>
                </Card>
                {/* Overall Profit/Loss */}
                <Card className="card-animate" sx={{ minWidth: 220, maxWidth: 220, bgcolor: overallPL >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 4, boxShadow: 3, p: 3, textAlign: 'center', flex: '0 0 auto', mx: 1, scrollSnapAlign: 'center' }}>
                    {overallPL >= 0 ? (
                        <TrendingUpIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                    ) : (
                        <TrendingDownIcon sx={{ fontSize: 40, color: '#d32f2f', mb: 1 }} />
                    )}
                    <Typography variant="caption" fontWeight={700} sx={{ color: overallPL >= 0 ? '#388e3c' : '#d32f2f', fontSize: '1.1rem', mb: 0.5 }}>Overall {overallPL >= 0 ? 'Profit' : 'Loss'}</Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: overallPL >= 0 ? '#388e3c' : '#d32f2f', mt: 1, fontSize: '2.2rem', lineHeight: 1.1 }}>₹{formatINR(overallPL)}</Typography>
                </Card>
                {/* # Investments count*/}
                <Card className="card-animate" sx={{ minWidth: 220, maxWidth: 220, bgcolor: '#f3e5f5', borderRadius: 4, boxShadow: 3, p: 3, textAlign: 'center', flex: '0 0 auto', mx: 1, scrollSnapAlign: 'center' }}>
                    <AllInclusiveIcon sx={{ fontSize: 40, color: '#7b1fa2', mb: 1 }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#7b1fa2', fontSize: '1.1rem', mb: 0.5 }}># Investments</Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#7b1fa2', mt: 1, fontSize: '2.2rem', lineHeight: 1.1 }}>{numInvestments}</Typography>
                </Card>
                {/* # Withdrawals count*/}
                <Card className="card-animate" sx={{ minWidth: 220, maxWidth: 220, bgcolor: '#ffe0b2', borderRadius: 4, boxShadow: 3, p: 3, textAlign: 'center', flex: '0 0 auto', mx: 1, scrollSnapAlign: 'center' }}>
                    <CallReceivedIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#f57c00', fontSize: '1.1rem', mb: 0.5 }}># Withdrawals</Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#f57c00', mt: 1, fontSize: '2.2rem', lineHeight: 1.1 }}>{numWithdraw}</Typography>
                </Card>
                {/* Investment Duration */}
                <Card className="card-animate" sx={{ minWidth: 220, maxWidth: 220, bgcolor: '#e0f7fa', borderRadius: 4, boxShadow: 3, p: 3, textAlign: 'center', flex: '0 0 auto', mx: 1, scrollSnapAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: '#0288d1', mb: 1 }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#0288d1', fontSize: '1.1rem', mb: 0.5 }}>Invest Duration</Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#0288d1', mt: 1, fontSize: '2.2rem', lineHeight: 1.1 }}>{investDuration}</Typography>
                </Card>
                </Box>
            </Box>
            <Box sx={{ mb: 3, p: 2, bgcolor: '#fff', borderRadius: 4, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: 'primary.main' }}>Business Performance</Typography>
                <BusinessPerformanceAreaChart data={getBusinessPerformanceData(investments)} />
            </Box>
            {/* <Box sx={{ mb: 3, p: 2, bgcolor: '#fff', borderRadius: 4, boxShadow: 2 }}>
                <InvestmentGraph data={graphData} />
            </Box> */}
            {/* Date & Amount Metrics - Stylish Card */}
            <Card sx={{ bgcolor: '#fff', borderRadius: 4, boxShadow: 2, p: 2, mb: 3 }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CallReceivedIcon color="success" sx={{ fontSize: 28, mb: 0.5 }} />
                    <Typography variant="caption" color="success.main" fontWeight={600}>Last Withdrawn</Typography>
                    <Typography variant="body1" fontWeight={700} color="success.main" sx={{ mt: 0.5 }}>
                    {lastWithdrawObj ? `₹${formatINR(lastWithdrawObj.amount)}` : '--'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {lastWithdrawObj ? new Date(lastWithdrawObj.date).toLocaleDateString() : '--'}
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon color="info" sx={{ fontSize: 28, mb: 0.5 }} />
                    <Typography variant="caption" color="info.main" fontWeight={600}>Last Invested</Typography>
                    <Typography variant="body1" fontWeight={700} color="info.main" sx={{ mt: 0.5 }}>
                    {lastInvestObj ? `₹${formatINR(lastInvestObj.amount)}` : '--'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {lastInvestObj ? new Date(lastInvestObj.date).toLocaleDateString() : '--'}
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <AttachMoneyIcon color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
                    <Typography variant="caption" color="primary" fontWeight={600}>First Invested</Typography>
                    <Typography variant="body1" fontWeight={700} color="primary.main" sx={{ mt: 0.5 }}>
                    {firstInvestObj ? `₹${formatINR(firstInvestObj.amount)}` : '--'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {firstInvestObj ? new Date(firstInvestObj.date).toLocaleDateString() : '--'}
                    </Typography>
                </Box>
                </CardContent>
            </Card>



            {/* Investment/Received Graph - prominent and open */}
            {/* Move graph below metrics and date/amount card */}
            </Box>
        </Box>

        {/* Transaction list moved to Transactions section */}

        {/* Notifications/Badges removed as per user request */}

        {/* Quick Actions (FAB) */}
        <Box sx={{ position: 'fixed', bottom: 80, right: '50%', transform: 'translateX(180px)', zIndex: 1200, maxWidth: 430, mx: 'auto' }}>
            <Fab color="primary" aria-label="add" sx={{ boxShadow: 3 }} onClick={() => setShowAdd(true)}>
                <AddIcon />
            </Fab>
        </Box>
        <AddInvestmentDialog
            open={showAdd}
            initialData={initialData}
            onClose={() => setShowAdd(false)}
            onAdd={addInvestment}
        />
    </Box>
  );
}
