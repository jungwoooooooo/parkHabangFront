import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Box, Tabs, Tab 
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await fetchReservations();
      await fetchUsers();
      await fetchParkingLots();
    };
    fetchData();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${API_URL}/reservations`);
      setReservations(response.data);
    } catch (error) {
      console.error('예약 목록 조회 실패:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}` // 인증 토큰 추가
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('유저 목록 조회 실패:', error);
    }
  };

  const fetchParkingLots = async () => {
    try {
      const response = await axios.get(`${API_URL}/parking-lots`);
      setParkingLots(response.data);
    } catch (error) {
      console.error('주차장 목록 조회 실패:', error);
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      await axios.delete(`${API_URL}/reservations/${id}`);
      fetchReservations();
    } catch (error) {
      console.error('예약 취소 실패:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('유저 삭제 실패:', error);
    }
  };

  const handleDeleteParkingLot = async (id) => {
    try {
      await axios.delete(`${API_URL}/parking-lots/${id}`);
      fetchParkingLots();
    } catch (error) {
      console.error('주차장 삭제 실패:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Tabs value={currentTab} onChange={handleTabChange} centered>
        <Tab label="예약 관리" />
        <Tab label="유저 관리" />
        <Tab label="주차장 관리" />
      </Tabs>

      {currentTab === 0 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>주차장명</TableCell>
                <TableCell>사용자</TableCell>
                <TableCell>시작 시간</TableCell>
                <TableCell>종료 시간</TableCell>
                <TableCell>차량 번호</TableCell>
                <TableCell>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.parkingLot?.주차장명}</TableCell>
                  <TableCell>{reservation.user?.name}</TableCell>
                  <TableCell>{new Date(reservation.startTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(reservation.endTime).toLocaleString()}</TableCell>
                  <TableCell>{reservation.carNumber}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="flex-start">
                      <Button 
                        onClick={() => handleCancelReservation(reservation.id)} 
                        style={{ marginLeft: '-16px' }}
                      >
                        취소
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {currentTab === 1 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>유저 ID</TableCell>
                <TableCell>유저 이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="flex-start">
                      <Button 
                        onClick={() => handleDeleteUser(user.id)} 
                        style={{ marginLeft: '-16px' }}
                      >
                        삭제
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {currentTab === 2 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>주차장 ID</TableCell>
                <TableCell>주차장명</TableCell>
                <TableCell>소재지도로명주소</TableCell>
                <TableCell>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parkingLots.map((lot) => (
                <TableRow key={lot.id}>
                  <TableCell>{lot.id}</TableCell>
                  <TableCell>{lot.주차장명}</TableCell>
                  <TableCell>{lot.소재지도로명주소}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="flex-start">
                      <Button 
                        onClick={() => handleDeleteParkingLot(lot.id)} 
                        style={{ marginLeft: '-16px' }}
                      >
                        삭제
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminReservations;