import React, { useEffect, useState } from 'react';

import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [editReservation, setEditReservation] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');

  const [editStartTime, setEditStartTime] = useState('');

  const [editEndDate, setEditEndDate] = useState('');

  const [editEndTime, setEditEndTime] = useState('');

  useEffect(() => {

    const fetchReservations = async () => {
      const token = localStorage.getItem('token');

      console.log('불러온 토큰:', token); // 토큰 확인

      if (!token) {

        console.log('토큰이 없습니다. 로그인 페이지로 리디렉션합니다.');
        navigate('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션

        setLoading(false); // 로딩 상태 종료
        return;

      }

      try {

        const response = await axios.get('http://localhost:5000/reservations/user-reservations', {

          headers: {

            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          },

        });
        console.log('예약 목록 불러오기 성공:', response.data);

        setReservations(response.data);

      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('토큰이 만료되었습니다. 로그인 페이지로 리디렉션합니다.');

          localStorage.removeItem('token');

          navigate('/login');

        } else {

          console.error('예약 목록 불러오기 실패:', error);

          alert('예약 목록을 불러오는 데 실패했습니다.');

        }
      } finally {

        setLoading(false);
      }

    };

    fetchReservations();

  }, [navigate]);


  const handleEdit = (reservation) => {

    setEditReservation(reservation);

    setEditStartDate(new Date(reservation.시작시간).toISOString().slice(0, 10));
    setEditStartTime(new Date(reservation.시작시간).toISOString().slice(11, 16));
    setEditEndDate(new Date(reservation.종료시간).toISOString().slice(0, 10));
    setEditEndTime(new Date(reservation.종료시간).toISOString().slice(11, 16));

    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('토큰이 없습니다. 로그인 페이지로 리디렉션합니다.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/reservations/${editReservation.id}`, {
        시작시간: new Date(`${editStartDate}T${editStartTime}`).toISOString(),
        종료시간: new Date(`${editEndDate}T${editEndTime}`).toISOString(),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('예약 수정 성공:', response.data);
      setReservations(reservations.map(reservation => 
        reservation.id === editReservation.id 
          ? { ...reservation, 시작시간: `${editStartDate}T${editStartTime}`, 종료시간: `${editEndDate}T${editEndTime}` } 
          : reservation
      ));

      setEditDialogOpen(false);
      alert('예약이 수정되었습니다.');
    } catch (error) {
      console.error('예약 수정 실패:', error);
      alert('예약 수정에 실패했습니다.');
    }
  };


  const handleCancel = async (id) => {

    const token = localStorage.getItem('token');

    if (!token) {

      console.log('토큰이 없습니다. 로그인 페이지로 리디렉션합니다.');

      navigate('/login');

      return;

    }

    try {

      await axios.delete(`http://localhost:5000/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });

      console.log('예약 취소 성공:', id);
      setReservations(reservations.filter(reservation => reservation.id !== id));

      alert('예약이 취소되었습니다.');
    } catch (error) {

      console.error('예약 취소 실패:', error);

      alert('예약 취소에 실패했습니다.');
    }

  };

  if (loading) {

    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />

      </Box>

    );

  }


  const timeOptions = Array.from({ length: 24 * 6 }, (_, i) => {
    const hours = String(Math.floor(i / 6)).padStart(2, '0');
    const minutes = String((i % 6) * 10).padStart(2, '0');

    return `${hours}:${minutes}`;

  });

  return (

    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">

      <Typography variant="h4" gutterBottom>내 예약 관리</Typography>
      <List>
        {reservations.map((reservation) => (

          <ListItem key={reservation.id} divider>

            <ListItemText 
              primary={`주차장: ${reservation.parkingLot?.주차장명 || '정보 없음'}`} // 주차장명 확인

              secondary={`시작 시간: ${new Date(reservation.시작시간).toLocaleString()}, 종료 시간: ${new Date(reservation.종료시간).toLocaleString()}`} 

            />

            <Button variant="contained" color="primary" onClick={() => handleEdit(reservation)} style={{ marginRight: '8px' }}>
              수정
            </Button>

            <Button variant="contained" color="secondary" onClick={() => handleCancel(reservation.id)}>
              취소

            </Button>
          </ListItem>

        ))}

      </List>

      <Button variant="contained" color="primary" onClick={() => navigate('/reservation')} style={{ marginTop: '16px' }}>

        새 예약하기

      </Button>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>

        <DialogTitle>예약 수정</DialogTitle>
        <DialogContent>

          <TextField

            label="시작 날짜"
            type="date"

            value={editStartDate}

            onChange={(e) => setEditStartDate(e.target.value)}
            fullWidth

            margin="normal"
            InputLabelProps={{ shrink: true }}

          />
          <FormControl fullWidth margin="normal" variant="outlined">

            <InputLabel shrink>시작 시간</InputLabel>
            <Select

              value={editStartTime}

              onChange={(e) => setEditStartTime(e.target.value)}

              displayEmpty

            >
              {timeOptions.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="종료 날짜"
            type="date"
            value={editEndDate}
            onChange={(e) => setEditEndDate(e.target.value)}

            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel shrink>종료 시간</InputLabel>
            <Select
              value={editEndTime}
              onChange={(e) => setEditEndTime(e.target.value)}
              displayEmpty

            >
              {timeOptions.map((time) => (
                <MenuItem key={time} value={time}>

                  {time}

                </MenuItem>

              ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>

          <Button onClick={() => setEditDialogOpen(false)} color="primary">

            취소

          </Button>

          <Button onClick={handleEditSave} color="primary">

            저장

          </Button>

        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default MyReservations;