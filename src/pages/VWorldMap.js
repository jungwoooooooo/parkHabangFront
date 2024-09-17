import React, { useEffect } from 'react';

const VWorldMap = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://map.vworld.kr/js/webglMapInit.js.do?version=3.0&apiKey=C885778C-13B9-3F3F-924B-3D6B706A3686&domain=https://localhost:3001/vworld-map";
    script.async = true;
    script.onload = () => {
      console.log("VWorld API 스크립트 로드 성공");
      const checkVWorldLoaded = setInterval(() => {
        console.log("window.vw 상태:", window.vw);
        if (window.vw && window.vw.MapOptions) {
          clearInterval(checkVWorldLoaded);
          console.log("VWorld API 로드 완료");
          initializeMap();
        }
      }, 100);
    };
    script.onerror = () => {
      console.error("VWorld API 스크립트 로드 실패");
    };
    document.body.appendChild(script);

    const initializeMap = () => {
      if (!window.vw || !window.vw.MapOptions) {
        console.error("VWorld API가 로드되지 않았습니다.");
        return;
      }

      console.log("initializeMap 함수 호출");
      const mapOptions = new window.vw.MapOptions(
        window.vw.BasemapType.GRAPHIC, // 베이스맵 타입
        "",                            // 특정 베이스맵을 설정하지 않음
        window.vw.DensityType.BASIC,   // POI 레이어 밀도
        window.vw.DensityType.BASIC,   // 도로 레이어 밀도
        false,                         // 트래픽 레이어 비활성화
        new window.vw.CameraPosition(
          new window.vw.CoordZ(127.425, 38.196, 13487000), // 초기 카메라 위치
          new window.vw.Direction(-90, 0, 0)              // 카메라 방향
        ),
        new window.vw.CameraPosition(
          new window.vw.CoordZ(127.425, 38.196, 1548700),  // 줌된 카메라 위치
          new window.vw.Direction(0, -90, 0)              // 카메라 방향
        )
      );

      new window.vw.Map("vmap", mapOptions);
      console.log("맵 초기화 완료");
    };

    return () => {
      // clean up when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return <div id="vmap" style={{ width: '100%', height: '97vh', position: 'relative', backgroundColor: 'lightgray' }}></div>;
};

export default VWorldMap;