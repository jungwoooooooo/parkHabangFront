import React, { useEffect, useState } from 'react';
import { useMap } from '../map/MapContext';

const { kakao } = window;

const IncheonIllegalParkingLayer = ({ incheonIllegalParkingData }) => {
  const { map } = useMap();
  const [markers, setMarkers] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [visibleCategories, setVisibleCategories] = useState({
    fire: false,
    child: false,
    cctv: false
  });

  const categoryIcons = {
    fire: 'https://cdn-icons-png.flaticon.com/512/353/353902.png',
    child: 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/3c1ad7636808a88d4b3250d95329dd28-removebg-preview.png?raw=true',
    cctv: 'https://cdn-icons-png.flaticon.com/512/4017/4017956.png'
  };

  useEffect(() => {
    if (!map || !incheonIllegalParkingData.length) return;

    // 현재 표시된 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers = incheonIllegalParkingData
      .filter(parking => visibleCategories[parking.category])
      .map(parking => {
        if (parking.longitude && parking.latitude) {
          const position = new kakao.maps.LatLng(parking.latitude, parking.longitude);

          const marker = new kakao.maps.Marker({
            position,
            map,
            title: parking.location,
            image: new kakao.maps.MarkerImage(
              categoryIcons[parking.category],
              new kakao.maps.Size(45, 45),  // 여기서 아이콘 크기를 조절합니다 (예: 40x40 픽셀)
              { offset: new kakao.maps.Point(20, 20) }  // 앵커 포인트 설정 (선택사항)
            )
          });

          return marker;
        }
        return null;
      }).filter(marker => marker !== null);

    setMarkers(newMarkers);

    kakao.maps.event.addListener(map, 'click', () => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
        setActiveInfoWindow(null);
      }
    });

  }, [map, incheonIllegalParkingData, visibleCategories]);

  const toggleCategory = (category) => {
    setVisibleCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleAllCategories = () => {
    const allCategoriesActive = Object.values(visibleCategories).every(value => value);
    const newState = Object.keys(visibleCategories).reduce((acc, category) => {
      acc[category] = !allCategoriesActive;
      return acc;
    }, {});
    setVisibleCategories(newState);
  };

  return (
    <div style={{ position: 'absolute', top: 10, left: 300, zIndex: 1000 }}>
      <button 
        onClick={toggleAllCategories}
        style={{ 
          marginRight: '10px', 
          backgroundColor: Object.values(visibleCategories).every(value => value) ? '#4CAF50' : '#f44336',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          textAlign: 'center',
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: '16px',
          margin: '4px 2px',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
      >
        전체 {Object.values(visibleCategories).every(value => value) ? '끄기' : '켜기'}
      </button>
      {Object.keys(visibleCategories).map(category => (
        <button 
          key={category} 
          onClick={() => toggleCategory(category)}
          style={{ 
            marginRight: '10px', 
            backgroundColor: visibleCategories[category] ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            margin: '4px 2px',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          <img 
            src={categoryIcons[category]} 
            alt={category} 
            style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }} 
          />
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default IncheonIllegalParkingLayer;