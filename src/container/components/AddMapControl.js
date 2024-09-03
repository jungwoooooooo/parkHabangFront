import React from "react";
import { Map, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import useKakaoLoader from "../../hooks/useKakaoLoader";

export default function AddMapControl() {
  useKakaoLoader(); // 커스텀 훅을 사용하여 카카오 지도 API 로드

  return (
    <Map
      id="map"
      center={{
        lat: 33.450701, // 지도의 중심 좌표
        lng: 126.570667,
      }}
      style={{
        width: "100%",
        height: "350px",
      }}
      level={3} // 지도의 확대 레벨
    >
      <MapTypeControl position={"TOPRIGHT"} />
      <ZoomControl position={"RIGHT"} />
    </Map>
  );
}
