import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyParkingLots = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParkingLots = async () => {
      const token = localStorage.getItem('token');
      console.log('불러온 토큰:', token); // 토큰 확인
      if (!token) {
        console.log('토큰이 없습니다. 로그인 페이지로 리디렉션합니다.');
        navigate('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션
        setLoading(false); // 로딩 상태 종료
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/parking-lots/user-parking-lots', {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          },
        });
        console.log('주차장 목록 불러오기 성공:', response.data);
        setParkingLots(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('토큰이 만료되었습니다. 로그인 페이지로 리디렉션합니다.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error('주차장 목록 불러오기 실패:', error);
          alert('주차장 목록을 불러오는 데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParkingLots();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('토큰이 없습니다. 로그인 페이지로 리디렉션합니다.');
      navigate('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/parking-lots/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
        },
      });
      console.log('주차장 삭제 성공:', id);
      setParkingLots(parkingLots.filter(lot => lot.id !== id));
      alert('주차장이 삭제되었습니다.');
    } catch (error) {
      console.error('주차장 삭제 실패:', error);
      alert('주차장 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>내 주차장 관리</Typography>
      <List>
        {parkingLots.map((lot) => (
          <ListItem key={lot.id} divider>
            <ListItemText primary={lot.주차장명} secondary={`주소: ${lot.소재지도로명주소}, 요금: ${lot.주차기본요금}, 수용량: ${lot.총주차면}`} />
            <Button variant="contained" color="secondary" onClick={() => handleDelete(lot.id)}>
              삭제
            </Button>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={() => navigate('/register-parking-lot')} style={{ marginTop: '16px' }}>
        주차장 등록
      </Button>
    </Box>
  );
};

export default MyParkingLots;