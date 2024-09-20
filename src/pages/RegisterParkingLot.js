import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper } from '@mui/material';
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
  const [contact, setContact] = useState(''); // 연락처 상태 추가
  const [description, setDescription] = useState(''); // 설명 상태 추가
  const navigate = useNavigate();

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('토큰이 없습니다. 로그인 페이지로 리디렉션합니다.');
      navigate('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/parking-lots', {
        주차장명: name,
        위도: lat,
        경도: lon,
        공유시간: time,
        주소: address,
        소재지지번주소: jibunAddress, // 지번 주소 추가
        주차기본요금: fee,
        총주차면: capacity,
        가능한주차면: capacity, // 가능한주차면을 총주차면과 동일하게 설정
        주차장구분: '대여', // 주차장구분을 대여로 설정
        연락처: contact, // 연락처 추가
        설명: description, // 설명 추가
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
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f5f5f5">
      <Typography variant="h4" gutterBottom>주차장 등록</Typography>
      <Paper elevation={3} style={{ padding: '32px', maxWidth: '600px', width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ textAlign: 'left' }}> {/* 왼쪽 정렬 추가 */}
            <SearchPlace onLocationChange={handleLocationChange} /> {/* SearchPlace 컴포넌트 추가 */}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="주차장 이름"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="위도"
              variant="outlined"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              margin="normal"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="경도"
              variant="outlined"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              margin="normal"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="공유시간"
              variant="outlined"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="주소"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              margin="normal"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="소재지지번주소"
              variant="outlined"
              value={jibunAddress}
              onChange={(e) => setJibunAddress(e.target.value)}
              margin="normal"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="요금"
              variant="outlined"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="수용량"
              variant="outlined"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="연락처"
              variant="outlined"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="설명"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleRegister} fullWidth>
              등록하기
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RegisterParkingLot;