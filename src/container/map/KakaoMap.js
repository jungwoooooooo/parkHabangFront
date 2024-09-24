import React, { useEffect, useState } from 'react';
import { useMap } from './MapContext';
import '../css/KakaoMap.css'; // CSS 파일을 import

const { kakao } = window;

const KakaoMap = ({ center }) => {
  const { map, setMap } = useMap();
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [isTrafficVisible, setIsTrafficVisible] = useState(false);

  useEffect(() => {
    const loadKakaoMap = () => {
      const { kakao } = window;
      if (kakao && kakao.maps) {
        const container = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 0,
          maxLevel: 30, // 최대 확대 줌 레벨 설정
          draggable: true,
          scrollwheel: true,
          disableDoubleClickZoom: false,
          touch: true,
          tileAnimation: true // 타일 애니메이션 활성화
        };

        // 기존 지도 인스턴스가 있으면 제거
        if (map) {
          map.destroy();
        }

        const newMap = new kakao.maps.Map(container, options);

        // 지도 컨트롤러 추가
        const mapTypeControl = new kakao.maps.MapTypeControl();
        newMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 스카이뷰 텍스트 변경
        setTimeout(() => {
          const skyviewButton = document.querySelector('.maptypecontrol .btn_skyview .ico_comm');
          if (skyviewButton) {
            skyviewButton.textContent = '새 텍스트'; // 원하는 텍스트로 변경
          }
        }, 1000); // 1초 후에 텍스트 변경 시도

        const zoomControl = new kakao.maps.ZoomControl();
        newMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        setMap(newMap);

        // 현재 위치로 이동
        moveToCurrentLocation(newMap);
      } else {
        console.error("Kakao Maps API is not loaded.");
      }
    };

    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=29187a8aea804dffe76ce4693aee5c9b&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(loadKakaoMap);
      };
      document.head.appendChild(script);
    }
  }, [setMap]);

  useEffect(() => {
    if (map && center) {
      const moveLatLng = new kakao.maps.LatLng(center.lat, center.lng);
      map.panTo(moveLatLng);

      // 기존 마커 제거
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
      }

      // 새 마커 생성
      const marker = new kakao.maps.Marker({
        position: moveLatLng,
        map: map
      });

      setCurrentLocationMarker(marker);
    }
  }, [center, map]);

  const moveToCurrentLocation = (mapInstance = map) => {
    console.log("현재 위치 버튼이 눌렸습니다."); // 로그 추가
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
        },
        (error) => {
          console.error("Error getting current location:", error);
          if (error.code === error.PERMISSION_DENIED) {
            alert("위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.");
          } else {
            alert(`현재 위치를 가져올 수 없습니다. 오류 코드: ${error.code}, 메시지: ${error.message}`);
          }
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

  const zoomIn = () => {
    if (map) {
      map.setLevel(map.getLevel() - 1, { animate: true });
    }
  };

  const zoomOut = () => {
    if (map) {
      map.setLevel(map.getLevel() + 1, { animate: true });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div id="map" className="map-container" style={{ width: '100%', height: '100%' }}></div>
      
      <button 
        onClick={() => moveToCurrentLocation()}
        className="highlight-button current-location-button"
        title="현재 위치로 이동"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }} // 스타일 수정
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/128/67/67335.png" 
          alt="현재 위치" 
          className="button-icon"
        />
        <span style={{ 
          whiteSpace: 'nowrap', 
          fontWeight: 'bold', 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          padding: '2px 5px', 
          borderRadius: '3px' 
        }}>현위치</span>
      </button>

      <button 
        onClick={toggleTraffic}
        className="highlight-button traffic-button"
        title={isTrafficVisible ? '교통 정보 끄기' : '교통 정보 켜기'}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }} // 스타일 수정
      >
        <img 
          src={isTrafficVisible 
            ? "https://cdn-icons-png.flaticon.com/512/8727/8727737.png"
            : "https://cdn-icons-png.flaticon.com/512/8727/8727737.png"
          } 
          alt={isTrafficVisible ? '교통 정보 끄기' : '교통 정보 켜기'} 
          className="button-icon"
        />
        <span style={{ 
          whiteSpace: 'nowrap', 
          fontWeight: 'bold', 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          padding: '2px 5px', 
          borderRadius: '3px' 
        }}>실시간 교통 상황</span>
      </button>
    </div>
  );
};

export default KakaoMap;