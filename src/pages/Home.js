import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import backgroundImage from '../assert/지도화면.png';
import '../container/css/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [showImage, setShowImage] = React.useState(false);
  const [showText, setShowText] = React.useState(false);

  const handleButtonClick = () => {
    navigate('/map');
  };

  const imageAnimation = useSpring({
    opacity: showImage ? 1 : 0,
    transform: showImage ? 'translateY(0)' : 'translateY(-50px)',
    config: { duration: 2000 }, // 애니메이션 속도를 2초로 설정
  });

  const textAnimation = useSpring({
    opacity: showText ? 1 : 0,
    transform: showText ? 'translateY(0)' : 'translateY(-20px)',
    config: { duration: 2000 }, // 애니메이션 속도를 2초로 설정
  });

  React.useEffect(() => {
    setShowImage(true);
    setShowText(true);
  }, []);

  const { ref: introRef, inView: introInView } = useInView({ triggerOnce: true });
  const { ref: reviewsRef, inView: reviewsInView } = useInView({ triggerOnce: true });

  const introAnimation = useSpring({
    opacity: introInView ? 1 : 0,
    transform: introInView ? 'translateY(0)' : 'translateY(20px)',
    config: { duration: 1000 },
  });

  const reviewsAnimation = useSpring({
    opacity: reviewsInView ? 1 : 0,
    transform: reviewsInView ? 'translateY(0)' : 'translateY(20px)',
    config: { duration: 1000 },
  });

  return (
    <div className="main-content">
      <animated.h1 style={textAnimation}>인천의<br />주차고민 해결<br /><br />주차해방</animated.h1>
      
      <div className="image-container">
        <animated.img
          src={backgroundImage}
          alt="인천 주차장 지도"
          style={imageAnimation}
        />
      </div>
      
      <button className="cta-button" onClick={handleButtonClick}>인천 주차장 지도 보러가기</button>
      <br/><br/><br/><br/>
      {/* 소개 섹션 */}
      <animated.section className="intro-section" style={introAnimation} ref={introRef}>
        <h2>서비스 소개</h2>
        <p>'주차해방'은 인천의 주차 문제를 해결하기 위한 서비스입니다. <p/>주차장 정보를 제공하고 미리 예약할 수 있고, 사람들끼리 주차장을 공유하여 주차 문제를 해결합니다.</p>
        <p>또한 불법주차에 관한 정보를 제공하여 전국의 불법주차를 줄이고 교통 혼잡과 사건 사고를 줄이는 것이 저희의 목표입니다.</p>
      </animated.section>
      
      {/* 사용자 리뷰 섹션 */}
      <animated.section className="reviews-section" style={reviewsAnimation} ref={reviewsRef}>
        <h2>사용자 리뷰</h2>
        <div className="review">
          <p>"이 서비스 덕분에 주차 스트레스가 줄었어요!" - 사용자 A</p>
        </div>
        <div className="review">
          <p>"정말 편리하고 유용한 정보가 많아요." - 사용자 B</p>
        </div>
      </animated.section>
    </div>
  );
};

export default Home;