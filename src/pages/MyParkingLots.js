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
      if (!token) {
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/parking-lots/user-parking-lots', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParkingLots(response.data);
      } catch (error) {
        if (error.response) {
          console.error('서버 응답 오류:', error.response.data);
          console.error('상태 코드:', error.response.status);
          console.error('헤더:', error.response.headers);
        } else if (error.request) {
          console.error('응답 없음:', error.request);
        } else {
          console.error('오류 메시지:', error.message);
        }
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
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
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/parking-lots/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParkingLots(parkingLots.filter(lot => lot.id !== id));
      alert('주차장이 삭제되었습니다.');
    } catch (error) {
      console.error('주차장 삭제 실패:', error);
      alert('주차장 삭제에 실패했습니다.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-parking-lot/${id}`);
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
            <Button variant="contained" color="primary" onClick={() => handleEdit(lot.id)} style={{ marginRight: '8px' }}>
              수정
            </Button>
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