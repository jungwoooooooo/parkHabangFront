import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchPlace from '../container/components/Search'; // SearchPlace 컴포넌트 임포트

const RegisterParkingLot = () => {
  const [name, setName] = useState('');
  const [lon, setLon] = useState('');
  const [lat, setLat] = useState('');
  const [startDate, setStartDate] = useState(''); // 시작 날짜 상태 추가
  const [startTime, setStartTime] = useState(''); // 시작 시간 상태 추가
  const [endDate, setEndDate] = useState(''); // 종료 날짜 상태 추가
  const [endTime, setEndTime] = useState(''); // 종료 시간 상태 추가
  const [address, setAddress] = useState('');
  const [jibunAddress, setJibunAddress] = useState(''); // 지번 주소 상태 추가
  const [fee, setFee] = useState('');
  const [capacity, setCapacity] = useState('');
  const [contact, setContact] = useState(''); // 연락처 상태 추가
  const [description, setDescription] = useState(''); // 설명 상태 추가
  const [image, setImage] = useState(null); // 이미지 상태 추가
  const navigate = useNavigate();

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('토큰이 없습니다. 로그인 페이지로 리디렉션합니다.');
      navigate('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션
      return;
    }

    const formData = new FormData();
    formData.append('주차장명', name);
    formData.append('위도', lat);
    formData.append('경도', lon);
    formData.append('시작날짜', startDate); // 시작 날짜 추가
    formData.append('시작시간', startTime); // 시작 시간 추가
    formData.append('종료날짜', endDate); // 종료 날짜 추가
    formData.append('종료시간', endTime); // 종료 시간 추가
    formData.append('주소', address);
    formData.append('소재지지번주소', jibunAddress); // 지번 주소 추가
    formData.append('주차기본요금', fee);
    formData.append('총주차면', capacity);
    formData.append('가능한주차면', capacity); // 가능한주차면을 총주차면과 동일하게 설정
    formData.append('주차장구분', '대여'); // 주차장구분을 대여로 설정
    formData.append('연락처', contact); // 연락처 추가
    formData.append('설명', description); // 설명 추가
    if (image) {
      formData.append('image', image); // 이미지 추가
    }

    try {
      const response = await axios.post('http://localhost:5000/parking-lots', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          'Content-Type': 'multipart/form-data', // 멀티파트 폼 데이터 설정
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

  const timeOptions = Array.from({ length: 24 * 6 }, (_, i) => {
    const hours = String(Math.floor(i / 6)).padStart(2, '0');
    const minutes = String((i % 6) * 10).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f5f5f5">
      <Typography variant="h4" gutterBottom>주차장 등록</Typography>
      <Paper elevation={3} style={{ padding: '32px', maxWidth: '600px', width: '100%', position: 'relative' }}> {/* position: relative 추가 */}
        <Grid container spacing={2}>
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
          <Grid item xs={12} style={{ textAlign: 'left', marginBottom: '19px' }}> {/* 왼쪽 정렬 및 마진 추가 */}
            <SearchPlace onLocationChange={handleLocationChange} top="115px" left="50%" /> {/* top과 left props 추가 */}
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
          <Grid item xs={6}>
            <TextField
              label="시작 날짜"
              type="date"
              variant="outlined"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel shrink>시작 시간</InputLabel>
              <Select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                displayEmpty
              >
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="종료 날짜"
              type="date"
              variant="outlined"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel shrink>종료 시간</InputLabel>
              <Select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                displayEmpty
              >
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ margin: '16px 0' }}
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