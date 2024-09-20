import React from 'react';
import '../App.css';

const MileageInfo = () => {
  return (
    <div className="centered-content">
      <br/><br/>
      <h1>안전신문고 마일리지</h1>
      <p>안전신문고 마일리지는 신고건수 등에 따라 적립이 되며, 마일리지 적립금에 따라 여러 가지 혜택을 받을 수 있습니다.</p>
      <br/>
      <h2>마일리지란?</h2>
      <div>
        <p>일종의 포인트 개념으로, 구매나 이용 등을 통해 적립가능합니다.</p>
        <p>안전신문고에서는 신고와 관련된 활동을 통해서 마일리지를 적립할 수 있습니다.</p>
      </div>
      <br/>
      <h2>마일리지 확인</h2>
      <p>마이페이지 - 나의 신고마일리지에서 마일리지 내역을 확인할 수 있습니다.</p>
      <img src={`https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FlgoNG%2Fbtruc5Fyvng%2F0HDGsfoxJ9XrOcHLeEJGgk%2Fimg.jpg`} alt="마일리지 확인" />

      <br/>
      <h2>마일리지 사용방법</h2>
      <p>안전신문고에서 제공하는 상품 교환, 할인 혜택, 이벤트 참여, 기부 등으로 마일리지 사용이 가능합니다.</p>
      <br/>
      <h2>마일리지 유효기간</h2>
      <p>안전신문고 마일리지는 일정 기간 동안 유지되며, 기간 경과 후 자동으로 소멸될 수 있습니다.</p>
    </div>
  );
};

export default MileageInfo;