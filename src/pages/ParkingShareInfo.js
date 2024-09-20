import React from 'react';
import '../styles/ParkingShareInfo.css';

const ParkingShareInfo = () => {
  return (
    <div className="parking-share-info">
      <br/><br/><br/>
      <h1>주차 공유 안내</h1><br/><br/>
      <p>거주자우선(주거지)주차공간이나, 사유지 주차공간을 공유하시고 포인트 쌓으세요!</p>
      <div className="image-container">
        <img src="https://cdn.emetro.co.kr/data2/content/image/2021/05/02/.cache/512/20210502500175.jpg" alt="주차 공유 이미지" />
        <img src="https://cdn.ulsanpress.net/news/photo/202212/410164_190182_4459.jpg" alt="새로운 주차 공유 이미지" />
      </div>
      <p>자신이 주차장을 쓰지 않는 시간에 다른 사람에게 그 자리를 대여하면 포인트가 쌓입니다.</p>
      <p>비어있는 자신의 자리를 효율있게 공유하세요!</p>
      <br/>
      <h2>주차장 등록하는 법</h2>
      <p>주차장을 등록하려면 아래의 단계를 따르세요:</p>
      <ul>
        <li>주차장 사진을 찍습니다.</li>
        <li><img src="https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/%EC%B4%AC%EC%98%81%EC%95%84%EC%9D%B4%EC%BD%98.png?raw=true" alt="주차장 사진" /></li>
        <li>사진과 함께 주차장 정보를 입력합니다.</li>
        <br/>
        <li><img src="https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/%EB%93%B1%EB%A1%9D%EC%82%AC%EC%A7%84_2.png?raw=true" alt="주차장 사진" /></li>
        <br/><br/><br/><br/>
        <li>등록 버튼을 눌러 완료합니다.</li>
      </ul>
      <p>
        <button 
          className="register-button"
          onClick={() => window.location.href='/register-parking-lot'}
        >
          등록하러 가기
        </button>
      </p>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
  );
};

export default ParkingShareInfo;