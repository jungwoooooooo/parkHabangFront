import React, { useState, useEffect } from 'react';
import { useMap } from '../map/MapContext'; // Adjust the import path as needed

const ChildrenAreaLayer = ({ childrenAreaData }) => {
  const { map } = useMap();
  const [markers, setMarkers] = useState([]);
  const [circles, setCircles] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [isLayerVisible, setIsLayerVisible] = useState(false); // 레이어 표시 여부 상태

  useEffect(() => {
    if (!map || !childrenAreaData) return;

    // 현재 표시된 마커와 원 제거
    markers.forEach(marker => marker.setMap(null));
    circles.forEach(circle => circle.setMap(null));
    setMarkers([]);
    setCircles([]);

    if (!isLayerVisible) return; // 레이어가 비활성화된 경우 아무 것도 하지 않음

    const childrenAreaIconUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Korean_Traffic_sign_%28Watch_out_for_children_-_In_the_School_zone%29.svg/2053px-Korean_Traffic_sign_%28Watch_out_for_children_-_In_the_School_zone%29.svg.png'; // 예시 아이콘 URL
    const circleRadius = 300; // 300m 반경

    const newMarkers = [];
    const newCircles = [];

    childrenAreaData.forEach(area => {
      if (area.경도 && area.위도) {
        const position = new kakao.maps.LatLng(area.위도, area.경도);

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position,
          map,
          title: area.대상시설명,
          image: new kakao.maps.MarkerImage(childrenAreaIconUrl, new kakao.maps.Size(32, 32))
        });

        // 원 생성
        const circle = new kakao.maps.Circle({
          center: position,
          radius: circleRadius,
          strokeWeight: 2,
          strokeColor: '#ff0000',
          strokeOpacity: 0.8,
          fillColor: '#ff0000',
          fillOpacity: 0.2
        });
        circle.setMap(map);

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, 'click', () => {
          if (activeInfoWindow) {
            activeInfoWindow.close();
          }

          const content = `
            <div>
              <h2>어린이 보호구역</h2>
              <h3>${area.대상시설명}</h3>
              <p>시설종류: ${area.시설종류}</p>
              <p>위치: ${area.위도}, ${area.경도}</p>
              <p>주소: ${area.소재지도로명주소}</p>
              <p>어린이 보호구역으로 인한 주차금지 구역입니다.</p>
            </div>
          `;

          const infowindow = new kakao.maps.InfoWindow({
            content,
            position: marker.getPosition(),
          });

          infowindow.open(map, marker);
          setActiveInfoWindow(infowindow);
        });

        // 원의 반경 내 클릭 이벤트
        kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
          const clickedPosition = mouseEvent.latLng;
          const distance = kakao.maps.Util.computeDistanceBetween(position, clickedPosition);

          if (distance <= circleRadius) {
            if (activeInfoWindow) {
              activeInfoWindow.close();
            }

            const content = `
              <div>
                <h2>알림</h2>
                <p>어린이 보호구역으로 인한 주차금지 구역입니다.</p>
              </div>
            `;

            const infowindow = new kakao.maps.InfoWindow({
              content,
              position: clickedPosition,
            });

            infowindow.open(map);
            setActiveInfoWindow(infowindow);
          }
        });

        newMarkers.push(marker);
        newCircles.push(circle);
      }
    });

    setMarkers(newMarkers);
    setCircles(newCircles);

    kakao.maps.event.addListener(map, 'click', () => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
        setActiveInfoWindow(null);
      }
    });

  }, [map, childrenAreaData, isLayerVisible]);

  const toggleLayerVisibility = () => {
    setIsLayerVisible(prev => !prev);
  };

  return (
    <>
      <button onClick={toggleLayerVisibility} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        {isLayerVisible ? '숨기기' : '보기'}
      </button>
    </>
  );
};

export default ChildrenAreaLayer;
