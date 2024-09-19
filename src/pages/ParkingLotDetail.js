import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Button, IconButton, Tooltip } from '@mui/material';
import { FileCopy as FileCopyIcon } from '@mui/icons-material';

const { kakao } = window;

const ParkingLotDetail = ({ parkingLots }) => {
  const { id } = useParams();
  const parkingLot = parkingLots.find(lot => lot.id === parseInt(id));
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (!parkingLot) return; // parkingLot이 undefined일 경우 useEffect 훅이 실행되지 않도록 함

    const loadKakaoMap = () => {
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(parkingLot.latitude, parkingLot.longitude),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);

      const markerPosition = new kakao.maps.LatLng(parkingLot.latitude, parkingLot.longitude);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map);
    };

    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=cc4618fc55e2dc943ad112bb5cdc43c4&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(loadKakaoMap);
      };
      document.head.appendChild(script);
    }
  }, [parkingLot]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('주소가 복사되었습니다!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  if (!parkingLot) {
    return <Typography>주차장을 찾을 수 없습니다.</Typography>;
  }

  return (
    <Box padding="16px">
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Typography variant="h4">{parkingLot.주차장명}</Typography>
        <br/>
        <div id="map" style={{ width: '100%', height: '300px' }}></div>
        <br/>
        <Typography variant="body1">요금: {parkingLot.요금정보}</Typography>
        <Typography variant="body1">잔여 수: {parkingLot.가능한주차면}</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1">주소: {parkingLot.소재지지번주소}</Typography>
          <Tooltip title="주소 복사">
            <IconButton onClick={() => handleCopy(parkingLot.소재지지번주소)}>
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {copySuccess && <Typography color="primary">{copySuccess}</Typography>}
        <Typography variant="body1">운영요일: {parkingLot.운영요일}</Typography>
        <Typography variant="body1">기본 요금: {parkingLot.주차기본요금}</Typography>
        <Typography variant="body1">평일운영시작시간: {parkingLot.평일운영시작시각}</Typography>
        <Typography variant="body1">평일운영종료시간: {parkingLot.평일운영종료시각}</Typography>
        <Typography variant="body1">토요일운영시작시간: {parkingLot.토요일운영시작시각}</Typography>
        <Typography variant="body1">토요일운영종료시간: {parkingLot.토요일운영종료시각}</Typography>
        <Typography variant="body1">공휴일운영시작시각: {parkingLot.공휴일운영시작시각}</Typography>
        <Typography variant="body1">공휴일운영종료시간: {parkingLot.공휴일운영종료시각}</Typography>
        
        <Box display="flex" justifyContent="center" marginTop="16px">
          <Link to={`/reservation?lotId=${parkingLot.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">예약하기</Button>
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default ParkingLotDetail;