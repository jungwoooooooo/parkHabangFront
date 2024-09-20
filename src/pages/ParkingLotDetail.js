import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Button, IconButton, Tooltip, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { FileCopy as FileCopyIcon } from '@mui/icons-material';

const { kakao } = window;

const ParkingLotDetail = ({ parkingLots }) => {
  const { id } = useParams();
  const parkingLot = parkingLots.find(lot => lot.id === parseInt(id));
  const [copySuccess, setCopySuccess] = useState('');
  const [randomImage, setRandomImage] = useState('');

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

      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="width: 150px; text-align: center; padding: 6px 0;">${parkingLot.주차장명}</div>`,
        position: markerPosition,
      });

      infowindow.open(map, marker);
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

    // 랜덤 이미지 선택
    const images = [
      'https://image.utoimage.com/preview/cp870322/2019/08/201908004588_500.jpg',
      'https://img5.yna.co.kr/etc/inner/KR/2020/01/07/AKR20200107120600065_02_i_P2.jpg',
      'https://www.insiseol.or.kr/life/parking/img/contents/facility.jpg',
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setRandomImage(randomImage);

  }, [parkingLot, id]);

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
    <Box padding="16px" display="flex" justifyContent="center">
      <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
        <Typography variant="h4">{parkingLot.주차장명}</Typography>
        <br/>
        <div id="map" style={{ width: '100%', height: '300px' }}></div>
        <br/>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>요금</TableCell>
                <TableCell>{parkingLot.요금정보}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>잔여 수</TableCell>
                <TableCell>{parkingLot.가능한주차면}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>주소</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {parkingLot.소재지지번주소}
                    <Tooltip title="주소 복사">
                      <IconButton onClick={() => handleCopy(parkingLot.소재지지번주소)}>
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>운영요일</TableCell>
                <TableCell>{parkingLot.운영요일}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>기본 요금</TableCell>
                <TableCell>{parkingLot.주차기본요금}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>평일 운영 시작 시간</TableCell>
                <TableCell>{parkingLot.평일운영시작시각}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>평일 운영 종료 시간</TableCell>
                <TableCell>{parkingLot.평일운영종료시각}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>토요일 운영 시작 시간</TableCell>
                <TableCell>{parkingLot.토요일운영시작시각}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>토요일 운영 종료 시간</TableCell>
                <TableCell>{parkingLot.토요일운영종료시각}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>공휴일 운영 시작 시간</TableCell>
                <TableCell>{parkingLot.공휴일운영시작시각}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>공휴일 운영 종료 시간</TableCell>
                <TableCell>{parkingLot.공휴일운영종료시각}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {copySuccess && <Typography color="primary">{copySuccess}</Typography>}
        <Box display="flex" justifyContent="center" marginTop="16px">
          <Link to={`/reservation?lotId=${parkingLot.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">예약하기</Button>
          </Link>
        </Box>
        <Box display="flex" justifyContent="center" marginTop="16px">
          <img src={randomImage} alt="주차장 전경" style={{ width: '100%', maxWidth: '500px' }} />
        </Box>
        <Box marginTop="16px">
          <Typography variant="h5">사용자 리뷰</Typography>
          <Typography>주차장이 잘 보이는 곳에 있어 찾기 쉬웠습니다 !</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ParkingLotDetail;