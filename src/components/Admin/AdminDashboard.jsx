import React, { useState } from 'react';
import './AdminDashboard.css';
import './Panels/panels.css';
import { Line } from 'react-chartjs-2';
import { Routes,Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faGamepad, faMoneyBillTransfer, 
  faChartLine, faCog, faSignOutAlt, faTachometerAlt,
  faTimes, faArrowUp, faArrowDown, faTrophy,
  faPhotoFilm
} from '@fortawesome/free-solid-svg-icons';
import UsersPanel from './Panels/UsersPanel';
import GamesPanel from './Panels/GamesPanel';
import TransactionsPanel from './Panels/TransactionsPanel';
import AnalyticsPanel from './Panels/AnalyticsPanel';
import DepositRequestPanel from './Panels/DepositRequestPanel';
import WithdrawRequestPanel from './Panels/WithdrawRequestPanel';
import BetRecordsPanel from './Panels/BetRecordsPanel';
import DeclareResultPanel from './Panels/DeclareResultPanel';
import UserDetails from "./Panels/UserDetails";
import BetnumberHistory from './Panels/BetnumberHistory';
import Uploadphoto from './Panels/UploadPhoto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [activePanel, setActivePanel] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const renderPanel = () => {
    switch(activePanel) {
      case 'users': return <UsersPanel />;
      
      case 'transactions': return <TransactionsPanel />;
      case 'analytics': return <AnalyticsPanel />;
      case 'deposits': return <DepositRequestPanel />;
      case 'withdrawals': return <WithdrawRequestPanel />;
      case 'betrecords': return <BetRecordsPanel />;
      case 'declare-result': return <DeclareResultPanel />;
      case 'BetnumberHistory': return <BetnumberHistory />;
      case 'uploadphoto': return <Uploadphoto />;


      default: return <AnalyticsPanel />;
    }
  };
   const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
    navigate("/admin");
  };

  return (
    <div className="admin-dashboard dark">
      <div className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <FontAwesomeIcon icon={faTachometerAlt} className="dashboard-icon" />
            <h2>Admin Panel</h2>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="admin-nav">
          <button 
            className={`nav-item ${activePanel === 'analytics' ? 'active' : ''}`}
            onClick={() => setActivePanel('analytics')}
          >
            <FontAwesomeIcon icon={faChartLine} /> Overview
          </button>
          <button 
            className={`nav-item ${activePanel === 'users' ? 'active' : ''}`}
            onClick={() => setActivePanel('users')}
          >
            <FontAwesomeIcon icon={faUsers} /> Users
          </button>
          {/* <button 
            className={`nav-item ${activePanel === 'games' ? 'active' : ''}`}
            onClick={() => setActivePanel('games')}
          >
            <FontAwesomeIcon icon={faGamepad} /> Rounds
          </button> */}
          <button 
            className={`nav-item ${activePanel === 'transactions' ? 'active' : ''}`}
            onClick={() => setActivePanel('transactions')}
          >
            <FontAwesomeIcon icon={faMoneyBillTransfer} /> Transactions
          </button>
          <button 
            className={`nav-item ${activePanel === 'betrecords' ? 'active' : ''}`}
            onClick={() => setActivePanel('betrecords')}
          >
            <FontAwesomeIcon icon={faGamepad} /> Entry Records
          </button>
          <button 
            className={`nav-item ${activePanel === 'declare-result' ? 'active' : ''}`}
            onClick={() => setActivePanel('declare-result')}
          >
            <FontAwesomeIcon icon={faTrophy} /> Declare Result
          </button>
          <button 
            className={`nav-item ${activePanel === 'deposits' ? 'active' : ''}`}
            onClick={() => setActivePanel('deposits')}
          >
            <FontAwesomeIcon icon={faArrowUp} /> Add Coins Requests
          </button>
          <button 
            className={`nav-item ${activePanel === 'withdrawals' ? 'active' : ''}`}
            onClick={() => setActivePanel('withdrawals')}
          >
            <FontAwesomeIcon icon={faArrowDown} /> Redeem Requests
          </button>
            <button 
            className={`nav-item ${activePanel === 'BetnumberHistory' ? 'active' : ''}`}
            onClick={() => setActivePanel('BetnumberHistory')}
          >
            <FontAwesomeIcon icon={faGamepad} /> Entry Numbers
          </button>
            <button 
            className={`nav-item ${activePanel === 'uploadphoto' ? 'active' : ''}`}
            onClick={() => setActivePanel('uploadphoto')}
          >
            <FontAwesomeIcon icon={faPhotoFilm} /> Upload Photo
          </button>
          
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </div>

       {/* ...sidebar code... */}
      <div className="admin-main">
        {!sidebarOpen && (
          <button className="open-sidebar" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
        )}
        <Routes>
          <Route path="/" element={renderPanel()} />
          <Route path="user/:userId" element={<UserDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;