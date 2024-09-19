import React from 'react';

const ParkingShareInfo = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>주차 공유 안내</h1>
      <p>거주자우선(주거지)주차공간이나, 사유지 주차공간을 공유하시고 포인트 쌓으세요!</p>
      <p>자신이 주차장을 쓰지 않는 시간에 다른 사람에게 그 자리를 대여하면 포인트가 쌓입니다.</p>
      <p>비어있는 자신의 자리를 효율있게 공유하세요!</p>
      
      <h2>주차장 등록하는 법</h2>
      <p>주차장을 등록하려면 아래의 단계를 따르세요:</p>
      <ol>
        <li>주차장 사진을 찍습니다.</li>
        <li>사진과 함께 주차장 정보를 입력합니다.</li>
        <li>등록 버튼을 눌러 완료합니다.</li>
      </ol>
      <p>사진과 글을 추가하여 주차장을 등록하세요!</p>
    </div>
  );
};

export default ParkingShareInfo;