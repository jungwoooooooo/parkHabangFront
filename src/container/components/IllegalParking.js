import React, { useEffect, useState } from 'react';
import { useMap } from '../map/MapContext'; // 경로를 필요에 따라 조정하세요

const IllegalParkingLayer = ({ illegalParkingData }) => {
  const { map } = useMap();
  const [markers, setMarkers] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);

  useEffect(() => {
    if (!map || !illegalParkingData) return;

    console.log('Illegal Parking Data:', illegalParkingData); // 데이터 확인
    console.log('Map Instance:', map);

    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const illegalParkingIconUrl = 'https://cdn-icons-png.flaticon.com/512/4956/4956198.png';

    const newMarkers = illegalParkingData.map(parking => {
      if (parking.lon && parking.lat) {
        const position = new kakao.maps.LatLng(parking.lat, parking.lon);

        const marker = new kakao.maps.Marker({
          position,
          map,
          title: parking.cctv_jibun,
          image: new kakao.maps.MarkerImage(illegalParkingIconUrl, new kakao.maps.Size(32, 32))
        });

        kakao.maps.event.addListener(marker, 'click', () => {
          if (activeInfoWindow) {
            activeInfoWindow.close();
          }

          const content = `
            <div>
              <h2>상세정보</h2>
              <h3>${parking.cctv_jibun}</h3>
              <p>카테고리: ${parking.category}</p>
              <p>위치: ${parking.lat}, ${parking.lon}</p>
              <p>구역: ${parking.district}</p>
              <p>단속 지점: ${parking.enforcement_point}</p>
              <p>주차장 유형: ${parking.site_type}</p>
            </div>
          `;

          const infowindow = new kakao.maps.InfoWindow({
            content,
            position: marker.getPosition(),
          });

          infowindow.open(map, marker);
          setActiveInfoWindow(infowindow);

          kakao.maps.event.addListener(map, 'click', () => {
            infowindow.close();
            setActiveInfoWindow(null);
          });
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

  }, [map, illegalParkingData]);

  return null;
};

export default IllegalParkingLayer;
