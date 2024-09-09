import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/ParkingLotList.css';

const ParkingLotList = ({ parkingLots, onMouseOverListItem, onMouseOutListItem, onClickListItem, highlightedLot, onRadiusIncrease }) => {
  const [showRadiusPrompt, setShowRadiusPrompt] = useState(false);

  useEffect(() => {
    console.log('Highlighted lot changed:', highlightedLot);
    
    // 주차장 수가 10개 이하인 경우 프롬프트 표시
    if (parkingLots.length <= 10) {
      setShowRadiusPrompt(true);
    } else {
      setShowRadiusPrompt(false);
    }
  }, [highlightedLot, parkingLots]);

  const handleRadiusIncrease = () => {
    if (typeof onRadiusIncrease === 'function') {
      onRadiusIncrease();
      setShowRadiusPrompt(false);
    } else {
      console.error('onRadiusIncrease is not a function');
    }
  };

  return (
    <div style={{ width: '300px', height: 'calc(100vh - 200px)', overflowY: 'scroll', position: 'absolute', left: 0, top: '180px', backgroundColor: 'white', zIndex: 10, padding: '10px' }}>
      <h2>주차장 리스트</h2>
      {showRadiusPrompt && (
        <div className="radius-prompt">
          <p>반경 내에 주차장이 10개 이하입니다. 반경을 넓히시겠습니까?</p>
          <button onClick={handleRadiusIncrease}>네</button>
          <button onClick={() => setShowRadiusPrompt(false)}>아니오</button>
        </div>
      )}
      <ul>
        {parkingLots.map((lot, index) => (
          <li 
            key={index} 
            className={`parking-lot-item ${highlightedLot && highlightedLot.id === lot.id ? 'highlighted' : ''}`} // 하이라이트 클래스 추가
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
            잔여 수: {lot.가능한주차면}<br />
            <Link to={`/parking-lot/${lot.id}`}>
              <button>상세 페이지 가기</button>
            </Link>
            <Link to={`/reservation?lotId=${lot.id}`}>
              <button>예약하기</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParkingLotList;