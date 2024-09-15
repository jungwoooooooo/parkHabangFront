import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('예약 목록 조회 실패:', error);
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/reservations/${id}`);
      fetchReservations();
    } catch (error) {
      console.error('예약 취소 실패:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>주차장</TableCell>
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
              <TableCell>{reservation.parkingLot.주차장명}</TableCell>
              <TableCell>{reservation.사용자이름}</TableCell>
              <TableCell>{new Date(reservation.시작시간).toLocaleString()}</TableCell>
              <TableCell>{new Date(reservation.종료시간).toLocaleString()}</TableCell>
              <TableCell>{reservation.차량번호}</TableCell>
              <TableCell>
                <Button onClick={() => handleCancelReservation(reservation.id)}>취소</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminReservations;