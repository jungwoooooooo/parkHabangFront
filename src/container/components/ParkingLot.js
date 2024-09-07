import React, { useEffect, useState } from 'react';
import { useMap } from '../map/MapContext';

const { kakao } = window;

const ParkingLotLayer = ({ parkingLots }) => {
  const { map } = useMap();
  const [markers, setMarkers] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);

  useEffect(() => {
    if (!map || !parkingLots) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    // 새로운 마커 생성
    const newMarkers = parkingLots.map(lot => {
      if (lot.경도 && lot.위도) {
        const position = new kakao.maps.LatLng(lot.위도, lot.경도);

        // 요금 정보에 따른 아이콘 URL 설정
        const iconUrl = lot.요금정보 === '무료' 
          ? 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/free-removebg-preview.png?raw=true' // 무료 주차장 아이콘 URL
          : lot.요금정보 === '유료'
          ? 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/fee.png?raw=true' // 유료 주차장 아이콘 URL
          : 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/mixed.png?raw=true'; // 혼합 주차장 아이콘 URL

        const markerImage = new kakao.maps.MarkerImage(
          iconUrl,
          new kakao.maps.Size(100, 100), // 아이콘 크기 조정
          { offset: new kakao.maps.Point(16, 32) } // 아이콘 중심점 조정
        );

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position,
          map,
          image: markerImage
        });

        // 마커 클릭 이벤트 추가
        kakao.maps.event.addListener(marker, 'click', () => {
          console.log('Marker clicked:', lot);

          if (activeInfoWindow) {
            activeInfoWindow.close();
          }

          // 상세 정보를 표시하는 인포윈도우 콘텐츠 생성
          const detailContent = `
            <div style="padding:5px; background-color:white; border:1px solid black; border-radius:5px;">
              <div><strong>${lot.주차장명}</strong></div>
              <div>요금: ${lot.요금정보}</div>
              <div>잔여 수: ${lot.잔여수}</div>
            </div>
          `;

          const infowindow = new kakao.maps.InfoWindow({
            content: detailContent,
            position: marker.getPosition(),
          });

          infowindow.open(map, marker);
          setActiveInfoWindow(infowindow);

          console.log('InfoWindow opened:', lot);

          // 지도 클릭 시 인포윈도우 닫기
          kakao.maps.event.addListener(map, 'click', () => {
            infowindow.close();
            setActiveInfoWindow(null);
            console.log('InfoWindow closed');
          });
        });

        return marker;
      }
      return null;
    }).filter(marker => marker !== null);

    setMarkers(newMarkers);

    // 지도 클릭 시 활성화된 인포윈도우 닫기
    kakao.maps.event.addListener(map, 'click', () => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
        setActiveInfoWindow(null);
        console.log('InfoWindow closed by map click');
      }
    });

  }, [map, parkingLots]);

  return null;
};

export default ParkingLotLayer;