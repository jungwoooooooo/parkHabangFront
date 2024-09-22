import React from 'react';

const ServiceIntro = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>서비스 소개</h1>
      <h3>주차해방 예약하는 방법.</h3>
      <iframe
        width="315"
        height="560"
        src="https://www.youtube-nocookie.com/embed/19IyBRmTP-A"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <h3>내 주차장을 공유하고 적립금을 받고싶다면 등록하세요.</h3>
      <h3>주차장 등록하는 방법.</h3>
      <iframe
        width="315"
        height="560"
        src="https://www.youtube-nocookie.com/embed/3EXLSJ96q8M"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default ServiceIntro;