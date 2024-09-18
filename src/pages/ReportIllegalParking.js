import React from 'react';
import '../styles/ReportIllegalParking.css';

const ReportIllegalParking = () => {
  return (
    <div className="center-content">
      <br/>
      <h1>불법주차, 간단하게 신고하는 방법 !!</h1>
      <p>불법 주정차의 신고는 2가지 방법이 있습니다 !:</p>
      <br />
      <h3>1. 첫 번째는 안전신문고 앱을 통해서 쉽게 신고하는 방법.</h3>
      <br />
      <ul className="no-bullets">
        <li>1. 안전신문고 앱을 다운로드하고 설치합니다.</li>
        <a href="https://play.google.com/store/apps/details?id=kr.go.safepeople&hl=ko&gl=US&pli=1" target="_blank">안드로이드 설치하기</a><br/>
        <a href="https://apps.apple.com/kr/app/%EC%95%88%EC%A0%84%EC%8B%A0%EB%AC%B8%EA%B3%A0-%EA%B5%AC-%EC%8A%A4%EB%A7%88%ED%8A%B8%EA%B5%AD%EB%AF%BC%EC%A0%9C%EB%B3%B4-%EC%83%9D%ED%99%9C%EB%B6%88%ED%8E%B8%EC%8B%A0%EA%B3%A0/id963555704" target="_blank">아이폰 설치하기</a><br/>
        <img src="https://www.gc.go.kr/design/main/img/sub03/parking_app1.jpg" className="center-image" style={{ width: '20%' }} />
        <br />
        <li>2. 안전신문고 앱 검색 후 설치</li>
        <img src="https://www.gc.go.kr/design/main/img/sub03/parking_app2.jpg" className="center-image" style={{ width: '20%' }} />
        <br />
        <li>3. 신고화면 상단 '불법주정차 신고' 선택</li>
        <img src="https://www.gc.go.kr/design/main/img/sub03/parking_app3.jpg" className="center-image" style={{ width: '20%' }} />
        <br />
        <li>4. 유형 선택</li>
        <img src="https://www.gc.go.kr/design/main/img/sub03/parking_app4.jpg" className="center-image" style={{ width: '20%' }} />
        <br />
        <li>5. 유형 선택(예시:횡단보도)</li>
        <img src="https://www.gc.go.kr/design/main/img/sub03/parking_app5.jpg" className="center-image" style={{ width: '20%' }} />
        <br />
        <li>6. 신고 요건 확인</li>
        <img src="https://www.gc.go.kr/design/main/img/sub03/parking_app6.jpg" className="center-image" style={{ width: '20%' }} />
        <br />
        <li>7. 사진촬영(1분간격 2장)</li>
        <img src="https://www.gc.go.kr/design/main/img/sub03/parking_app7-1.jpg" className="center-image" style={{ width: '20%' }} />
        <br />
        <li>8. 위치 지정 및 내용입력</li>
        <img src="https://www.gc.go.kr/design/main/img/sub03/parking_app7-2.jpg" className="center-image" style={{ width: '20%' }} />
        <br />
        <li>9. 위치 지정</li>
        <img src="https://www.gc.go.kr/design/main/img/sub03/parking_app8.jpg" className="center-image" style={{ width: '20%' }} />
      </ul>
      <br />
      <h3>2. 두 번째는 지역별 120 다산콜센터로 신고하기입니다 !</h3>
      <br />
      <ul className="no-bullets">
        <li>1. 각 지역번호 + 120 다산콜센터로 전화를 걸어서 불법주정차 단속 요철할 수 있으며</li>
        <li>문자로 신고도 가능합니다. 단, 안전신문고는 직접적인 신고라면 다산콜센터를 통해서는 단속요청을 하는 것입니다.</li><br/>
        <li>불법주정차 현장 사진과 주소, 간단한 내용으로 단속요청을 하면 1~2시간 이내에 단속반이 직접 나와서 결과까지 사진을 찍어서 진행사항을 답변해 줍니다. </li>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrnIDcb1QfhcF6YpFw7dUx1nBAo7VY5VegLQ&s" className="center-image" style={{ width: '20%' }} />
        <br />
        
      </ul>
      <br />
    </div>
  );
};

export default ReportIllegalParking;