import React from 'react';

const ParkingLotList = ({ parkingLots }) => {
  return (
    <div style={{ width: '300px', height: '100vh', overflowY: 'scroll', position: 'absolute', left: 0, top: 0, backgroundColor: 'white', zIndex: 10, padding: '10px' }}>
      <h2>주차장 리스트</h2>
      <ul>
        {parkingLots.map((lot, index) => (
          <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <strong>{lot.주차장명}</strong><br />
            요금: {lot.요금정보}<br />
            잔여 수: {lot.가능한주차면}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParkingLotList;