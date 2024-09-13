import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const RegisterParkingLot = () => {
  const [name, setName] = useState('');
  const [lon, setLon] = useState('');
  const [lat, setLat] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [fee, setFee] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/parking-lots', {
        주차장명: name,
        위도: lat,
        경도: lon,
        공유시간: time,
        주차장사진: capacity,
      });
      console.log('주차장 등록 성공:', response.data);
    } catch (error) {
      console.error('주차장 등록 실패:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>주차장 등록</Typography>
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
      />
      <TextField
        label="경도"
        variant="outlined"
        value={lon}
        onChange={(e) => setLon(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="공유시간"
        variant="outlined"
        value={time}
        onChange={(e) => setTime(e.target.value)}
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