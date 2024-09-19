import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        const response = await axios.get('http://localhost:3000/reservations/user-reservations', {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

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
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={() => navigate('/reservation')} style={{ marginTop: '16px' }}>
        새 예약하기
      </Button>
    </Box>
  );
};

export default MyReservations;