import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchPlace from '../container/components/Search'; // SearchPlace 컴포넌트 임포트

const RegisterParkingLot = () => {
  const [name, setName] = useState('');
  const [lon, setLon] = useState('');
  const [lat, setLat] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [jibunAddress, setJibunAddress] = useState(''); // 지번 주소 상태 추가
  const [fee, setFee] = useState('');
  const [capacity, setCapacity] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('토큰이 없습니다. 로그인 페이지로 리디렉션합니다.');
      navigate('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/parking-lots', {
        주차장명: name,
        위도: lat,
        경도: lon,
        공유시간: time,
        주소: address,
        소재지지번주소: jibunAddress, // 지번 주소 추가
        주차기본요금: fee,
        수용량: capacity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
        },
      });
      console.log('주차장 등록 성공:', response.data);
      alert('주차장 등록이 완료되었습니다!'); // 완료 알림
      navigate('/'); // 메인 화면으로 이동
    } catch (error) {
      if (error.response) {
        console.error('주차장 등록 실패:', error.response.data);
      } else if (error.request) {
        console.error('주차장 등록 실패: 응답 없음', error.request);
      } else {
        console.error('주차장 등록 실패:', error.message);
      }
    }
  };

  const handleLocationChange = ({ lat, lng, roadAddress, jibunAddress }) => {
    setLat(lat);
    setLon(lng);
    setAddress(roadAddress);
    setJibunAddress(jibunAddress); // 지번 주소 설정
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>주차장 등록</Typography>
      <SearchPlace onLocationChange={handleLocationChange} /> {/* SearchPlace 컴포넌트 추가 */}
      <TextField
        label="주차장 이름"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="위도"
        variant="outlined"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        margin="normal"
        fullWidth
        disabled
      />
      <TextField
        label="경도"
        variant="outlined"
        value={lon}
        onChange={(e) => setLon(e.target.value)}
        margin="normal"
        fullWidth
        disabled
      />
      <TextField
        label="공유시간"
        variant="outlined"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="주소"
        variant="outlined"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        margin="normal"
        fullWidth
        disabled
      />
      <TextField
        label="소재지지번주소"
        variant="outlined"
        value={jibunAddress}
        onChange={(e) => setJibunAddress(e.target.value)}
        margin="normal"
        fullWidth
        disabled
      />
      <TextField
        label="요금"
        variant="outlined"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="수용량"
        variant="outlined"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleRegister} style={{ marginTop: '16px' }}>
        등록하기
      </Button>
    </Box>
  );
};

export default RegisterParkingLot;