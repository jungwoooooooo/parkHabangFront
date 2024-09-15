import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Box, Button } from '@mui/material';
import Login from './pages/Login';
import MapContainer from './container/MapContainer';
import ParkingLotDetail from './pages/ParkingLotDetail';
import Reservation from './pages/Reservation';
import RegisterParkingLot from './pages/RegisterParkingLot';
import SignupForm from './pages/Signup';
import AdminReservations from './pages/AdminReservations';

const App = () => {
  // 로그인 상태와 주차장 목록을 관리하는 상태를 생성합니다.
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [parkingLots, setParkingLots] = React.useState([]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setIsAdmin(userData.isAdmin);
  };

  return (
    // 라우터를 설정하여 각 경로에 대한 컴포넌트를 지정합니다.
    <Router>
      <Routes>
        {/* 로그인 페이지 라우트 */}
        <Route path="/login" element={isLoggedIn || isMobile ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        {/* 회원가입 페이지 라우트 */}
        <Route path="/signup" element={<SignupForm />} />
        {/* 주차장 상세 정보 페이지 라우트 */}
        <Route path="/parking-lot/:id" element={<ParkingLotDetail parkingLots={parkingLots} />} />
        {/* 예약 페이지 라우트 */}
        <Route path="/reservation" element={<Reservation parkingLots={parkingLots} />} />
        {/* 주차장 등록 페이지 라우트 */}
        <Route path="/register-parking-lot" element={<RegisterParkingLot />} />
        {/* 메인 페이지 라우트 (로그인 여부에 따라 다른 컴포넌트 렌더링) */}
        <Route path="/" element={isLoggedIn || isMobile ? (
          <>
            <MapContainer setParkingLots={setParkingLots} />
            {isAdmin && (
              <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
                <Button 
                  component={Link} 
                  to="/admin/reservations" 
                  variant="contained" 
                  color="primary"
                >
                  관리자 페이지
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Navigate to="/login" />
        )} />
        
        {/* 관리자 예약 관리 페이지 라우트 */}
        <Route 
          path="/admin/reservations" 
          element={isAdmin ? <AdminReservations /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;