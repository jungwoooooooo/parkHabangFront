import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useMap } from '../map/MapContext';
import ParkingLotList from './ParkingLotList';
import { getCarDirection } from './getCarDirection';

// 카카오맵 초기화
const { kakao } = window;

// 주차장 레이어 컴포넌트
const ParkingLotLayer = ({ parkingLots }) => {
  // 카카오맵 초기화
  const { map } = useMap();
  // 마커 상태 관리
  const [markers, setMarkers] = useState([]);
  // 활성화된 정보 창 상태 관리
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  // 보이는 주차장 상태 관리
  const [visibleParkingLots, setVisibleParkingLots] = useState([]);
  // 강조된 주차장 상태 관리
  const [highlightedLot, setHighlightedLot] = useState(null);
  // 반경 반지름 상태 관리
  const [radius, setRadius] = useState(800);
  // 지도 중심 상태 관리
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  // 마커 맵 상태 관리
  const [markerMap, setMarkerMap] = useState({});
  // 경로 상태 관리
  const [routePath, setRoutePath] = useState(null);
  // 사용자 위치 상태 관리
  const [userLocation, setUserLocation] = useState(null);
  // 하이라이트 원 상태 관리
  const [highlightCircle, setHighlightCircle] = useState(null);

  // 정보 창 생성 함수
  const createInfoWindowContent = useCallback((lot) => {
    return `
      <div style="padding:5px; background-color:white; border:1px solid black; border-radius:5px;">
        <div><strong>${lot.주차장명}</strong></div>
        <div>요금: ${lot.요금정보}</div>
        <div>기본 요금: ${lot.주차기본요금}</div>
        <div>구분: ${lot.주차장구분}</div>
        <div>운영요일: ${lot.운영요일}</div>
        <div>잔여 수: ${lot.가능한주차면}</div>
        <button onclick="window.handleFindRoute('${lot.id}')" style="margin-top:5px;">길찾기</button>
      </div>
    `;
  }, []);

  // 주차장 선택 시 처리
  const handleClickListItem = useCallback(async (lot) => {
    const position = new kakao.maps.LatLng(lot.위도, lot.경도);
    map.panTo(position, {
      duration: 1000
    });
  
    if (activeInfoWindow) {
      activeInfoWindow.close();
    }
  
    // 정보 창 생성
    const infowindow = new kakao.maps.InfoWindow({
      content: createInfoWindowContent(lot),
      position: position,
      zIndex: 9999,
    });
  
    // 정보 창 열기
    infowindow.open(map);
    setActiveInfoWindow(infowindow);

    // 현재 사용자 위치에서 주차장까지의 경로를 가져옵니다
    try {
      if (!userLocation) {
        throw new Error("사용자 위치를 가져올 수 없습니다.");
      }

      // 경로 데이터 가져오기
      const routeData = await getCarDirection(
        userLocation,
        { lat: lot.위도, lng: lot.경도 }
      );
      
      console.log('Route data:', JSON.stringify(routeData, null, 2));

      // 기존 경로가 있다면 제거합니다
      if (routePath) {
        routePath.setMap(null);
      }

      // 경로 데이터가 유효하다면 경로 표시
      if (routeData.routes && routeData.routes.length > 0 && routeData.routes[0].sections) {
        const path = routeData.routes[0].sections[0].roads.flatMap(road =>
          road.vertexes.reduce((acc, coord, index) => {
            if (index % 2 === 0) {
              acc.push(new kakao.maps.LatLng(road.vertexes[index + 1], coord));
            }
            return acc;
          }, [])
        );

        // 경로 표시
        if (path.length > 0) {
          const polyline = new kakao.maps.Polyline({
            path: path,
            strokeWeight: 5,
            strokeColor: '#424242',
            strokeOpacity: 0.7,
            strokeStyle: 'solid'
          });

          polyline.setMap(map);
          setRoutePath(polyline);
        } else {
          console.warn('경로 좌표가 없습니다.');
          alert('경로를 표시할 수 없습니다. 출발지와 도착지가 너무 가깝습니다.');
        }
      } else {
        console.warn('유효한 경로 데이터가 없습니다.');
        alert('경로를 찾을 수 없습니다. 출발지와 도착지를 확인해 주세요.');
      }
    } catch (error) {
      console.error('경로를 가져오는 데 실패했습니다:', error);
      if (error.message.includes('5 m 이내')) {
        alert('출발지와 도착지가 너무 가깝습니다. 다른 주차장을 선택해 주세요.');
      } else if (error.message.includes('사용자 위치를 가져올 수 없습니다')) {
        alert('사용자 위치를 가져올 수 없습니다. 위치 서비스를 확인해 주세요.');
      } else {
        alert('경로를 가져오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    }
  }, [map, activeInfoWindow, createInfoWindowContent, routePath, userLocation]);

  useEffect(() => {
    // 전역 함수로 길찾기 핸들러 추가
    window.handleFindRoute = (lotId) => {
      const lot = parkingLots.find(l => l.id === lotId);
      if (lot) {
        handleClickListItem(lot);
      }
    };

    return () => {
      // 컴포넌트 언마운트 시 전역 함수 제거
      delete window.handleFindRoute;
    };
  }, [parkingLots, handleClickListItem]);

  const handleRadiusIncrease = useCallback(() => {
    const newRadius = radius + 200;
    setRadius(newRadius);
    const level = calculateZoomLevel(newRadius);
    map.setLevel(level);
    const center = map.getCenter();
    map.setCenter(center);
  }, [radius, map]);

  // 줌 레벨 계산 함수
  const calculateZoomLevel = useCallback((radius) => {
    if (radius <= 500) return 3;
    if (radius <= 1000) return 5;
    if (radius <= 2000) return 6;
    if (radius <= 4000) return 7;
    if (radius <= 8000) return 8;
    return 10;
  }, []);

  const createMarkerImage = useCallback((lot, size = 40) => {
    const iconUrl = lot.요금정보 === '무료' 
      ? 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/%EB%AC%B4%EB%A3%8C%EC%9D%B4%EB%AF%B8%EC%A7%80.png?raw=true'
      : lot.요금정보 === '유료'
      ? 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/%EC%9C%A0%EB%A3%8C%EC%9D%B4%EB%AF%B8%EC%A7%80.png?raw=true'
      : 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/%ED%98%BC%ED%95%A9.png?raw=true';

    return new kakao.maps.MarkerImage(
      iconUrl,
      new kakao.maps.Size(size, size),
      { offset: new kakao.maps.Point(size / 2, size / 2) }
    );
  }, []);

  const updateMarkerHighlight = useCallback((lot, highlighted) => {
    if (highlightCircle) {
      highlightCircle.setMap(null);
      setHighlightCircle(null);
    }

    if (highlighted && lot && markerMap[lot.id]) {
      const marker = markerMap[lot.id];
      const position = marker.getPosition();
      
      // 하이라이트 원 생성
      const circle = new kakao.maps.Circle({
        center: position,//중심
        radius: 28,//반지름
        strokeWeight: 3,//선 두께
        strokeColor: '#FA58D0',//선 색상
        strokeOpacity: 0.8,//선 투명도
        strokeStyle: 'solid',//선 스타일
        fillColor: '#FA58D0',//채우기 색상
        fillOpacity: 0.3//채우기 투명도
      });

      circle.setMap(map);
      setHighlightCircle(circle);

      marker.setZIndex(10);
    } else {
      Object.values(markerMap).forEach(marker => marker.setZIndex(0));
    }
  }, [map, markerMap, highlightCircle]);

  // 주차장 선택 시 처리
  const handleMouseOverListItem = useCallback((lot) => {
    setHighlightedLot(lot);
  }, []);

  // 마우스 아웃 시 처리
  const handleMouseOutListItem = useCallback(() => {
    setHighlightedLot(null);
  }, []);

  // 사용자 위치 가져오기
  useEffect(() => {
    // 사용자의 현재 위치를 가져오는 함수
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setUserLocation({ lat, lng });
            
            // 사용자 위치로 지도 중심 이동
            if (map) {
              const userLatLng = new kakao.maps.LatLng(lat, lng);
              map.setCenter(userLatLng);
            }
          },
          (error) => {
            console.error("사용자 위치를 가져오는데 실패했습니다:", error);
            alert("위치 정보를 가져올 수 없습니다. 기본 위치를 사용합니다.");
          }
        );
      } else {
        alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      }
    };

    getUserLocation();
  }, [map]);

  useEffect(() => {
    if (!map || !parkingLots) return;

    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const clusterer = new kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 5,
      minClusterSize: 2,
    });
    
    // 마커 생성
    const newMarkerMap = {};
    const newMarkers = parkingLots
      .filter(lot => lot.경도 && lot.위도)
      .map(lot => {
        const position = new kakao.maps.LatLng(lot.위도, lot.경도);
        const markerImage = createMarkerImage(lot);

        const marker = new kakao.maps.Marker({ position, image: markerImage, zIndex: 0 });

        kakao.maps.event.addListener(marker, 'click', () => {
          if (activeInfoWindow) {
            activeInfoWindow.close();
          }

          const infowindow = new kakao.maps.InfoWindow({
            content: createInfoWindowContent(lot),
            position: marker.getPosition(),
            zIndex: 9999,
          });

          infowindow.open(map, marker);
          setActiveInfoWindow(infowindow);
        });

        newMarkerMap[lot.id] = marker;
        return marker;
      });

    clusterer.addMarkers(newMarkers);
    setMarkers(newMarkers);
    setMarkerMap(newMarkerMap);

    const updateVisibleParkingLots = () => {
      const center = map.getCenter();
      const circle = new kakao.maps.Circle({ center, radius });
      const bounds = circle.getBounds();

      const visibleLots = parkingLots.filter(lot => {
        const position = new kakao.maps.LatLng(lot.위도, lot.경도);
        return bounds.contain(position);
      });

      setVisibleParkingLots(visibleLots);
    };

    const mapEventListeners = [];

    const addListener = (eventName, handler) => {
      const listener = kakao.maps.event.addListener(map, eventName, handler);
      mapEventListeners.push(listener);
    };

    addListener('center_changed', updateVisibleParkingLots);
    addListener('zoom_changed', updateVisibleParkingLots);
    addListener('click', () => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
        setActiveInfoWindow(null);
      }
    });

    updateVisibleParkingLots();

    return () => {
      mapEventListeners.forEach(listener => {
        if (listener && kakao.maps.event.removeListener) {
          kakao.maps.event.removeListener(listener);
        }
      });
    };
  }, [map, parkingLots, radius, createMarkerImage, createInfoWindowContent, activeInfoWindow]);

  useEffect(() => {
    if (map) {
      const updateMapCenter = () => {
        const center = map.getCenter();
        setMapCenter({ lat: center.getLat(), lng: center.getLng() });
      };
  
      const centerChangedListener = kakao.maps.event.addListener(map, 'center_changed', updateMapCenter);
  
      return () => {
        if (centerChangedListener && kakao.maps.event.removeListener) {
          kakao.maps.event.removeListener(centerChangedListener);
        }
      };
    }
  }, [map]);

  useEffect(() => {
    updateMarkerHighlight(highlightedLot, !!highlightedLot);
  }, [highlightedLot, updateMarkerHighlight]);

  return (
    <ParkingLotList 
      parkingLots={visibleParkingLots} 
      onMouseOverListItem={handleMouseOverListItem} 
      onMouseOutListItem={handleMouseOutListItem} 
      onClickListItem={handleClickListItem}
      highlightedLot={highlightedLot}
      onRadiusIncrease={handleRadiusIncrease}
      mapCenter={mapCenter}
    />
  );
};

export default React.memo(ParkingLotLayer);