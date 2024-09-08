import React, { useEffect } from 'react';
import '../css/ParkingLotList.css'; // CSS 파일을 임포트합니다.

const ParkingLotList = ({ parkingLots, onMouseOverListItem, onMouseOutListItem, onClickListItem, highlightedLot }) => {
  useEffect(() => {
    console.log('Highlighted lot changed:', highlightedLot); // 하이라이트된 주차장 변경 시 콘솔 출력
  }, [highlightedLot]);

  return (
    <div style={{ width: '300px', height: 'calc(100vh - 200px)', overflowY: 'scroll', position: 'absolute', left: 0, top: '180px', backgroundColor: 'white', zIndex: 10, padding: '10px' }}>
      <h2>주차장 리스트</h2>
      <ul>
        {parkingLots.map((lot, index) => (
          <li 
            key={index} 
            className={`parking-lot-item ${highlightedLot === lot ? 'highlighted' : ''}`} // 하이라이트 클래스 추가
            onMouseOver={() => {
              console.log('Mouse over:', lot); // 마우스 오버 시 콘솔 출력
              onMouseOverListItem && onMouseOverListItem(lot);  // 마우스 오버 시 해당 로직 실행
            }}  
            onMouseOut={() => {
              console.log('Mouse out:', lot); // 마우스 아웃 시 콘솔 출력
              onMouseOutListItem && onMouseOutListItem(lot);    // 마우스 아웃 시 해당 로직 실행
            }}    
            onClick={() => onClickListItem && onClickListItem(lot)}             // 클릭 시 해당 로직 실행
          >
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