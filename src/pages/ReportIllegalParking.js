import React from 'react';

const ReportIllegalParking = () => {
  return (
    <div>
      <h1>불법주차 신고</h1>
      <form>
        <div>
          <label>차량 번호:</label>
          <input type="text" name="carNumber" />
        </div>
        <div>
          <label>위치:</label>
          <input type="text" name="location" />
        </div>
        <div>
          <label>사진 업로드:</label>
          <input type="file" name="photo" />
        </div>
        <button type="submit">신고하기</button>
      </form>
    </div>
  );
};

export default ReportIllegalParking;