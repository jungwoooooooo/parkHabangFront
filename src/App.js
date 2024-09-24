import React, { useEffect } from 'react';
import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Box, Button } from '@mui/material';
import { FaBars } from 'react-icons/fa';
import Login from './pages/Login';
import MapContainer from './container/MapContainer';
import ParkingLotDetail from './pages/ParkingLotDetail';
import Reservation from './pages/Reservation';
import RegisterParkingLot from './pages/RegisterParkingLot';
import SignupForm from './pages/Signup';
import AdminReservations from './pages/AdminReservations';
import Home from './pages/Home';
import ServiceIntro from './pages/ServiceIntro';
import Partnership from './pages/Partnership';
import ParkingShareInfo from './pages/ParkingShareInfo';
import './App.css';
import logo from './assert/배경_없는거.png';
import ReportIllegalParking from './pages/ReportIllegalParking';
import MyParkingLots from './pages/MyParkingLots';
import IllegalParkingInfo from './pages/IllegalParkingInfo';
import MileageInfo from './pages/MileageInfo';
import MyReservations from './pages/MyReservations';
import EditParkingLot from './pages/EditParkingLot';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [parkingLots, setParkingLots] = React.useState([]);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setIsAdmin(userData.isAdmin);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const navigate = useNavigate();

  const handleExperienceClick = () => {
    navigate('/map');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      navigate('/admin-reservations');
    }
  }, [isLoggedIn, isAdmin, navigate]);

  return (
    <div>
      {isLoggedIn && isAdmin ? (
        <Routes>
          <Route path="/admin-reservations" element={<AdminReservations />} />
          <Route path="*" element={<Navigate to="/admin-reservations" />} />
        </Routes>
      ) : (
        <>
          <header className="header">
            <div className="logo-container">
              <Link to="/">
                <img src={logo} alt="로고" className="logo" />
              </Link>
            </div>
            <nav className="nav">
              <FaBars className="menu-icon" onClick={toggleMenu} />
              <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
                <li><Link to="/">홈</Link></li>
                <li><Link to="/service-intro">서비스 소개</Link></li>
                <li><Link to="/map">인천 주차장 지도</Link></li>
                <li><Link to="/partnership">제휴/협력</Link></li>
                <li className="dropdown">
                  <span>주차 대여 서비스</span>
                  <div className="dropdown-content">
                    <Link to="/parking-share-info">주차 공유 안내</Link>
                    <Link to="/register-parking-lot">주차장 등록</Link>
                  </div>
                </li>
                <li className="dropdown">
                  <span>불법주차</span>
                  <div className="dropdown-content">
                    <Link to="/report-illegal-parking">불법주차 신고</Link>
                    <Link to="/illegal-parking-info">불법주차 구역 정보</Link>
                    <Link to="/mileage-info">신고 마일리지 정보</Link>
                  </div>
                </li>
                {isLoggedIn ? (
                  <>
                    <li className="dropdown">
                      <span>마이페이지</span>
                      <div className="dropdown-content">
                        <Link to="/my-reservations">내 예약</Link>
                        <Link to="/my-parking-lots">내 주차장 관리</Link>
                      </div>
                    </li>
                    <li>
                      <Link to="/" onClick={handleLogout} style={{ textDecoration: 'none', color: 'inherit' }}>
                        로그아웃
                      </Link>
                    </li>
                    {isAdmin && <li><Link to="/admin-reservations">관리자 페이지</Link></li>}
                  </>
                ) : (
                  <li><Link to="/login">로그인</Link></li>
                )}
              </ul>
            </nav>
          </header>
          <div style={{ position: 'relative', zIndex: 0 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/service-intro" element={<ServiceIntro />} />
              <Route path="/map" element={<MapContainer setParkingLots={setParkingLots} />} />
              <Route path="/partnership" element={<Partnership />} />
              <Route path="/parking-share-info" element={<ParkingShareInfo />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/login" element={isLoggedIn || isMobile ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
              <Route path="/parking-lot/:id" element={<ParkingLotDetail parkingLots={parkingLots} />} />
              <Route path="/reservation" element={<Reservation parkingLots={parkingLots} />} />
              <Route path="/register-parking-lot" element={<RegisterParkingLot />} />
              <Route path="/admin-reservations" element={isAdmin ? <AdminReservations /> : <Navigate to="/" />} />
              <Route path="/report-illegal-parking" element={<ReportIllegalParking />} />
              <Route path="/illegal-parking-info" element={<IllegalParkingInfo />} />
              <Route path="/mileage-info" element={<MileageInfo />} />
              <Route path="/my-parking-lots" element={<MyParkingLots />} />
              <Route path="/my-reservations" element={<MyReservations />} />
              <Route path="/edit-parking-lot/:id" element={<EditParkingLot />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

export default App;