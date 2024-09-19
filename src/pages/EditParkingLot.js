import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';

const EditParkingLot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parkingLot, setParkingLot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkingLot = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/parking-lots/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParkingLot(response.data);
      } catch (error) {
        console.error('주차장 정보 불러오기 실패:', error);
        alert('주차장 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchParkingLot();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/parking-lots/${id}`, parkingLot, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('주차장 정보가 수정되었습니다.');
      navigate('/my-parking-lots');
    } catch (error) {
      console.error('주차장 수정 실패:', error);
      alert('주차장 수정에 실패했습니다.');
    }
  };

  const handleChange = (event) => {
    setParkingLot({ ...parkingLot, [event.target.name]: event.target.value });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!parkingLot) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>주차장 정보를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" padding={3}>
      <Typography variant="h4" gutterBottom>주차장 정보 수정</Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
        <TextField
          name="주차장명"
          label="주차장명"
          value={parkingLot.주차장명 || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="소재지도로명주소"
          label="주소"
          value={parkingLot.소재지도로명주소 || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="주차기본요금"
          label="기본 요금"
          type="number"
          value={parkingLot.주차기본요금 || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="총주차면"
          label="총 주차면"
          type="number"
          value={parkingLot.총주차면 || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            수정 완료
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditParkingLot;