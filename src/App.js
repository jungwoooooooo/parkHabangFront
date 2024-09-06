import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapContainer from './container/MapContainer';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
