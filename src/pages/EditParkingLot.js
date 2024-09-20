import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, CircularProgress, Grid, Paper } from '@mui/material';
import SearchPlace from '../container/components/Search'; // SearchPlace 컴포넌트 임포트

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

  const handleLocationChange = ({ lat, lng, roadAddress, jibunAddress }) => {
    setParkingLot({
      ...parkingLot,
      위도: lat,
      경도: lng,
      주소: roadAddress,
      소재지지번주소: jibunAddress,
    });
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
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5" p={2}>
      <Typography variant="h4" gutterBottom>주차장 정보 수정</Typography>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={() => navigate('/my-parking-lots')}>
          내 주차장 관리
        </Button>
      </Box>
      <Paper elevation={3} style={{ padding: '32px', maxWidth: '800px', width: '100%', marginTop: '16px' }}>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SearchPlace onLocationChange={handleLocationChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="주차장명"
                label="주차장명"
                value={parkingLot.주차장명 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="위도"
                label="위도"
                value={parkingLot.위도 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="경도"
                label="경도"
                value={parkingLot.경도 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="공유시간"
                label="공유시간"
                value={parkingLot.공유시간 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="주소"
                label="주소"
                value={parkingLot.주소 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="소재지지번주소"
                label="소재지지번주소"
                value={parkingLot.소재지지번주소 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="주차기본요금"
                label="기본 요금"
                type="number"
                value={parkingLot.주차기본요금 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="총주차면"
                label="총 주차면"
                type="number"
                value={parkingLot.총주차면 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="연락처"
                label="연락처"
                value={parkingLot.연락처 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="설명"
                label="설명"
                value={parkingLot.설명 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Box mt={2} display="flex" justifyContent="space-between">
                <Button type="submit" variant="contained" color="primary">
                  수정 완료
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate('/my-parking-lots')}>
                  취소
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditParkingLot;