import React from 'react';

const Partnership = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>제휴/협력</h1>
      <p>여기에 제휴/협력 내용을 작성하세요.</p>
      <p>주차해방과 함께 할 수 있는 다양한 제안을 기다립니다.</p>
      <p>인천광역시 계양구 효성1동, 효성동 정우 컴퍼니</p>
      <p>jungwoo@naver.com</p>
      <button onClick={() => window.location.href = 'mailto:contact@moduparking.com'}>
        메일 보내기
      </button>
    </div>
  );
};

export default Partnership;