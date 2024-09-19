import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
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
  const [reservedTimes, setReservedTimes] = useState([]);

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

  useEffect(() => {
    const fetchReservedTimes = async () => {
      if (parkingLot) {
        try {
          const response = await axios.get(`http://localhost:5000/reservations?parkingLot=${parkingLot.id}`);
          setReservedTimes(response.data);
        } catch (error) {
          console.error('예약된 시간 불러오기 실패:', error);
        }
      }
    };

    fetchReservedTimes();
  }, [parkingLot]);

  const isTimeOverlap = (start, end) => {
    return reservedTimes.some(reservation => {
      const resStart = new Date(reservation.시작시간);
      const resEnd = new Date(reservation.종료시간);
      return (start < resEnd && end > resStart);
    });
  };

  const isTimeDisabled = (time, date) => {
    const dateTime = new Date(`${date}T${time}`);
    return reservedTimes.some(reservation => {
      const resStart = new Date(reservation.시작시간);
      const resEnd = new Date(reservation.종료시간);
      return dateTime >= resStart && dateTime <= resEnd;
    });
  };

  const handleReservation = async () => {
    try {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);

      if (isTimeOverlap(start, end)) {
        setSnackbarMessage('이미 예약된 시간입니다. 다른 시간을 선택해주세요.');
        setOpenSnackbar(true);
        return;
      }

      const token = localStorage.getItem('token'); // JWT 토큰 가져오기
      console.log('불러온 토큰:', token); // 토큰 확인
      const reservationData = {
        parkingLot: parkingLot.id,
        시작시간: new Date(`${startDate}T${startTime}`).toISOString(),
        종료시간: new Date(`${endDate}T${endTime}`).toISOString(),
        사용자이름: name,
        연락처: phoneNumber,
        차량번호: carNumber
      };

      console.log('Reservation Data:', reservationData); // 로그 추가

      await axios.post('http://localhost:5000/reservations', reservationData, {
        headers: {
          Authorization: `Bearer ${token}` // 헤더에 토큰 추가
        }
      });

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

  const timeOptions = Array.from({ length: 24 * 6 }, (_, i) => {
    const hours = String(Math.floor(i / 6)).padStart(2, '0');
    const minutes = String((i % 6) * 10).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>예약</Typography>
      <Typography variant="h6" gutterBottom>{parkingLot.주차장명}</Typography>
      <TextField
        label="예약자 이름"
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
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel shrink>시작 시간</InputLabel>
        <Select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          displayEmpty
        >
          {timeOptions.map((time) => (
            <MenuItem key={time} value={time} disabled={isTimeDisabled(time, startDate)}>
              {time}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel shrink>종료 시간</InputLabel>
        <Select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          displayEmpty
        >
          {timeOptions.map((time) => (
            <MenuItem key={time} value={time} disabled={isTimeDisabled(time, endDate)}>
              {time}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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