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
    child: 'https://cdn-icons-png.flaticon.com/512/3097/3097048.png',
    cctv: 'https://cdn-icons-png.flaticon.com/512/2089/2089795.png'
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
            image: new kakao.maps.MarkerImage(categoryIcons[parking.category], new kakao.maps.Size(32, 32))
          });

          kakao.maps.event.addListener(marker, 'click', () => {
            if (activeInfoWindow) {
              activeInfoWindow.close();
            }

            const content = `
              <div>
                <h2>상세정보</h2>
                <h3>${parking.location}</h3>
                <p>카테고리: ${parking.category}</p>
                <p>위치: ${parking.latitude}, ${parking.longitude}</p>
                <p>구역: ${parking.district || '정보 없음'}</p>
                <p>단속 지점: ${parking.enforcement_point || '정보 없음'}</p>
              </div>
            `;

            const infowindow = new kakao.maps.InfoWindow({
              content,
              position: marker.getPosition(),
            });

            infowindow.open(map, marker);
            setActiveInfoWindow(infowindow);
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

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
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
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default IncheonIllegalParkingLayer;