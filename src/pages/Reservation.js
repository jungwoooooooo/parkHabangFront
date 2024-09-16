import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Reservation = ({ parkingLots }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [parkingLot, setParkingLot] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lotId = params.get('lotId');
    if (lotId) {
      const lot = parkingLots.find(lot => lot.id === parseInt(lotId));
      setParkingLot(lot);
    }
  }, [location.search, parkingLots]);

  const handleReservation = async () => {
    try {
      const reservationData = {
        parkingLot: parkingLot.id,
        시작시간: new Date(`${startDate}T${startTime}`).toISOString(),
        종료시간: new Date(`${endDate}T${endTime}`).toISOString(),
        사용자이름: name,
        연락처: phoneNumber,
        차량번호: carNumber
      };

      await axios.post('http://localhost:3000/reservations', reservationData); // URL 확인

      setSnackbarMessage('예약이 성공적으로 완료되었습니다.');
      setOpenSnackbar(true);

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('예약 실패:', error);
      setSnackbarMessage(error.response?.data?.message || '예약에 실패했습니다. 다시 시도해주세요.');
      setOpenSnackbar(true);
    }
  };

  if (!parkingLot) {
    return <Typography>주차장을 찾을 수 없습니다.</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>예약</Typography>
      <Typography variant="h6" gutterBottom>{parkingLot.주차장명}</Typography>
      <TextField
        label="이름"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        fullWidth
      />
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
      <TextField
        label="시작 시간"
        type="time"
        variant="outlined"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
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
      <TextField
        label="종료 시간"
        type="time"
        variant="outlined"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="전화번호"
        variant="outlined"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="차량번호"
        variant="outlined"
        value={carNumber}
        onChange={(e) => setCarNumber(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleReservation} style={{ marginTop: '16px' }}>
        예약하기
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Reservation;