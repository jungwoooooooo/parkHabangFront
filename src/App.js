import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MapContainer from './container/MapContainer';
import ParkingLotDetail from './pages/ParkingLotDetail';
import Reservation from './pages/Reservation';
import RegisterParkingLot from './pages/RegisterParkingLot';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [parkingLots, setParkingLots] = React.useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/parking-lot/:id" element={<ParkingLotDetail parkingLots={parkingLots} />} />
        <Route path="/reservation" element={<Reservation parkingLots={parkingLots} />} />
        <Route path="/register-parking-lot" element={<RegisterParkingLot />} />
        <Route path="/" element={isLoggedIn ? <MapContainer setParkingLots={setParkingLots} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;