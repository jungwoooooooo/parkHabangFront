import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/map');
  };

  return (
    <div className="main-content">
      <h1>인천의<br />주차고민 해결<br />주차해방</h1>
      <button className="cta-button" onClick={handleButtonClick}>인천 주차장 지도 보러가기</button>
      
      {/* 소개 섹션 */}
      <section className="intro-section">
        <h2>서비스 소개</h2>
        <p>주차해방은 인천의 주차 문제를 해결하기 위한 서비스입니다. 실시간 주차장 정보를 제공하여 편리한 주차를 도와드립니다.</p>
      </section>
      
      {/* 사용자 리뷰 섹션 */}
      <section className="reviews-section">
        <h2>사용자 리뷰</h2>
        <div className="review">
          <p>"이 서비스 덕분에 주차 스트레스가 줄었어요!" - 사용자 A</p>
        </div>
        <div className="review">
          <p>"정말 편리하고 유용한 정보가 많아요." - 사용자 B</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
