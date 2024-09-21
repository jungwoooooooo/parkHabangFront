import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SearchPlace from '../container/components/Search'; // SearchPlace 컴포넌트 임포트

const EditParkingLot = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchParkingLot = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        console.log(`Fetching parking lot with ID: ${id}`); // 디버깅용 로그 추가
        const response = await axios.get(`http://localhost:5000/parking-lots/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setName(data.주차장명);
        setLat(data.위도);
        setLon(data.경도);
        setStartDate(data.시작날짜);
        setStartTime(data.시작시간);
        setEndDate(data.종료날짜);
        setEndTime(data.종료시간);
        setAddress(data.주소);
        setJibunAddress(data.소재지지번주소);
        setFee(data.주차기본요금);
        setCapacity(data.총주차면);
        setContact(data.연락처);
        setDescription(data.설명);
      } catch (error) {
        console.error('주차장 정보 불러오기 실패:', error);
        alert('주차장 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchParkingLot();
  }, [id, navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('토큰이 없습니다. 로그인 페이지로 리디렉션합니다.');
      navigate('/login');
      return;
    }

    const data = {
      주차장명: name,
      위도: lat,
      경도: lon,
      시작날짜: startDate,
      시작시간: startTime,
      종료날짜: endDate,
      종료시간: endTime,
      소재지도로명주소: address,
      소재지지번주소: jibunAddress,
      주차기본요금: fee,
      총주차면: capacity,
      가능한주차면: capacity, // 가능한주차면 필드 추가
      주차장구분: '대여',
      전화번호: contact,
      특기사항: description,
      주차장사진: image ? URL.createObjectURL(image) : null, // 이미지 URL로 변환
      userId: 1, // 예시로 사용자 ID를 1로 설정
      장애인전용주차구역보유여부: 'N', // 예시로 설정
    };

    try {
      console.log(`Updating parking lot with ID: ${id}`); // 디버깅용 로그 추가
      const response = await axios.put(`http://localhost:5000/parking-lots/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('주차장 수정 성공:', response.data);
      alert('주차장 수정이 완료되었습니다!');
      navigate('/my-parking-lots', { state: { refresh: true } }); // 수정 후 내 주차장 관리 페이지로 이동
    } catch (error) {
      if (error.response) {
        console.error('주차장 수정 실패:', error.response.data);
      } else if (error.request) {
        console.error('주차장 수정 실패: 응답 없음', error.request);
      } else {
        console.error('주차장 수정 실패:', error.message);
      }
    }

    // 토큰 상태 확인
    console.log('토큰 상태:', localStorage.getItem('token'));
  };

  const handleLocationChange = ({ lat, lng, roadAddress, jibunAddress }) => {
    setLat(lat);
    setLon(lng);
    setAddress(roadAddress);
    setJibunAddress(jibunAddress);
  };

  const timeOptions = Array.from({ length: 24 * 6 }, (_, i) => {
    const hours = String(Math.floor(i / 6)).padStart(2, '0');
    const minutes = String((i % 6) * 10).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f5f5f5">
      <Typography variant="h4" gutterBottom>주차장 수정</Typography>
      <Paper elevation={3} style={{ padding: '32px', maxWidth: '600px', width: '100%', position: 'relative' }}>
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
          <Grid item xs={12} style={{ textAlign: 'left', marginBottom: '19px' }}>
            <SearchPlace onLocationChange={handleLocationChange} top="115px" left="50%" />
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
            <Button variant="contained" color="primary" onClick={handleUpdate} fullWidth>
              수정하기
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EditParkingLot;