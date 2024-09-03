import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useMap } from '../map/MapContext';

function KakaoMap({ center, markers = [], options = {} }) {
  const mapRef = useRef(null);
  const roadviewRef = useRef(null);
  const [roadview, setRoadview] = useState(null);
  const [isTrafficVisible, setIsTrafficVisible] = useState(options.traffic || false);

  const { map, setMap } = useMap();

  const memoizedMarkers = useMemo(() => markers, [markers]);
  const memoizedOptions = useMemo(() => options, [options]);

  // 지도 초기화
  useEffect(() => {
    if (!map && mapRef.current) {
      const { kakao } = window;

      try {
        const newMap = new kakao.maps.Map(mapRef.current, {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: memoizedOptions.level || 3,
          ...memoizedOptions,
        });

        setMap(newMap);

        // 컨트롤 추가
        const mapTypeControl = new kakao.maps.MapTypeControl();
        newMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        const zoomControl = new kakao.maps.ZoomControl();
        newMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        if (isTrafficVisible) {
          newMap.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
        }
      } catch (error) {
        console.error("지도 생성 중 오류가 발생했습니다: ", error);
      }
    }
  }, [mapRef, setMap, memoizedOptions, isTrafficVisible]);

  // 마커 업데이트
  useEffect(() => {
    if (map) {
      const { kakao } = window;

      // 기존 마커 제거
      if (map && memoizedMarkers.length) {
        memoizedMarkers.forEach((marker) => {
          const mapMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(marker.position.lat, marker.position.lng),
            map: map,
            title: marker.title,
          });

          // 마커 클릭 시 로드뷰 표시
          kakao.maps.event.addListener(mapMarker, 'click', () => {
            if (roadview) {
              const roadviewClient = new kakao.maps.RoadviewClient();
              const position = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);

              roadviewClient.getNearestPanoId(position, 50, (panoId) => {
                if (panoId) {
                  roadview.setPanoId(panoId, position);
                } else {
                  console.warn("로드뷰의 panoId를 찾을 수 없습니다.");
                }
              });
            }
          });
        });
      }

      // 지도 중심 설정
      map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }
  }, [map, memoizedMarkers, roadview, center]);

  // 교통 정보 토글 핸들러
  const toggleTraffic = useCallback(() => {
    setIsTrafficVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    if (map) {
      try {
        if (isTrafficVisible) {
          map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
        } else {
          map.removeOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
        }
      } catch (error) {
        console.error("교통 정보 업데이트 중 오류가 발생했습니다: ", error);
      }
    }
  }, [isTrafficVisible, map]);

  // 로드뷰 초기화
  useEffect(() => {
    if (roadviewRef.current) {
      const { kakao } = window;
      try {
        const newRoadview = new kakao.maps.Roadview(roadviewRef.current);
        setRoadview(newRoadview);
      } catch (error) {
        console.error("로드뷰 생성 중 오류가 발생했습니다: ", error);
      }
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {/* <div ref={roadviewRef} style={{ width: '100%', height: '50%' }} /> */}
      <button 
        onClick={toggleTraffic} 
        style={{ 
          position: 'absolute', 
          top: '250px', 
          right: '10px', 
          padding: '10px 20px', 
          backgroundColor: '#fff', 
          border: '1px solid #ccc', 
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000, 
        }}
      >
        {isTrafficVisible ? '교통 정보 끄기' : '교통 정보 켜기'}
      </button>
    </div>
  );
}

export default KakaoMap;
