import React, { useEffect, useState } from 'react';
import { useMap } from './MapContext';

const { kakao } = window;

const KakaoMap = () => {
  const { map, setMap } = useMap();
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [isTrafficVisible, setIsTrafficVisible] = useState(false);

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3
    };
    const newMap = new kakao.maps.Map(container, options);

    // 지도 컨트롤러 추가
    const mapTypeControl = new kakao.maps.MapTypeControl();
    newMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    const zoomControl = new kakao.maps.ZoomControl();
    newMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    setMap(newMap);

    // 현재 위치로 이동
    moveToCurrentLocation(newMap);

  }, [setMap]);

  const moveToCurrentLocation = (mapInstance = map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const moveLatLng = new kakao.maps.LatLng(lat, lng);
          
          mapInstance.panTo(moveLatLng);

          // 기존 마커 제거
          if (currentLocationMarker) {
            currentLocationMarker.setMap(null);
          }

          // 새 마커 생성
          const marker = new kakao.maps.Marker({
            position: moveLatLng,
            map: mapInstance
          });

          setCurrentLocationMarker(marker);

          // 선택적: 인포윈도우 추가
          const iwContent = '<div style="padding:5px;">현재 위치</div>';
          const infowindow = new kakao.maps.InfoWindow({
            content: iwContent
          });
          infowindow.open(mapInstance, marker);
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("현재 위치를 가져올 수 없습니다.");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
    }
  };

  const toggleTraffic = () => {
    if (map) {
      if (isTrafficVisible) {
        map.removeOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
      } else {
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
      }
      setIsTrafficVisible(!isTrafficVisible);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
      <button 
        onClick={() => moveToCurrentLocation()}
        style={{
          position: 'absolute',
          bottom: '150px',
          right: '20px',
          zIndex: 10,
          padding: '10px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        현재 위치로 이동
      </button>
      <button 
        onClick={toggleTraffic}
        style={{
          position: 'absolute',
          bottom: '100px',
          right: '20px',
          zIndex: 10,
          padding: '10px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {isTrafficVisible ? '교통 정보 끄기' : '교통 정보 켜기'}
      </button>
    </div>
  );
};

export default KakaoMap;