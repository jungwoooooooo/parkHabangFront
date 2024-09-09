import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, Typography, Button, Paper, Box, Divider, Alert, AlertTitle } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const theme = createTheme(); // 기본 테마 생성

const StyledListItem = styled(ListItem)(({ theme, highlighted }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: highlighted ? theme.palette.action.selected : 'inherit',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ParkingLotList = ({ parkingLots, onMouseOverListItem, onMouseOutListItem, onClickListItem, highlightedLot, onRadiusIncrease, mapCenter }) => {
  const [showRadiusAlert, setShowRadiusAlert] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [sortedParkingLots, setSortedParkingLots] = useState([]);

  useEffect(() => {
    if (parkingLots.length <= 2) {
      setShowRadiusAlert(true);
    } else {
      setShowRadiusAlert(false);
    }

    // 주차장 정렬
    const sortLots = () => {
      if (!mapCenter || !mapCenter.lat || !mapCenter.lng) {
        console.warn('mapCenter is not properly defined');
        setSortedParkingLots(parkingLots);
        return;
      }

      const sorted = [...parkingLots].map(lot => {
        const distance = calculateDistance(
          parseFloat(lot.위도), 
          parseFloat(lot.경도), 
          mapCenter.lat, 
          mapCenter.lng
        );
        console.log(`주차장: ${lot.주차장명}, 거리: ${distance} km`); // 거리 값 콘솔 출력
        return {
          ...lot,
          distance: Math.round(distance * 1000) // km를 m로 변환하고 반올림
        };
      }).sort((a, b) => {
        if (sortBy === 'distance') {
          return a.distance - b.distance;
        } else if (sortBy === 'price') {
          const priceA = parseFloat(a.요금정보.replace(/[^0-9.-]+/g,"")) || 0;
          const priceB = parseFloat(b.요금정보.replace(/[^0-9.-]+/g,"")) || 0;
          return priceA - priceB;
        }
        return 0;
      });

      setSortedParkingLots(sorted);
    };

    sortLots();
  }, [parkingLots, sortBy, mapCenter]);

  const handleRadiusIncrease = () => {
    onRadiusIncrease();
    setShowRadiusAlert(false);
  };

  // 두 지점 간의 거리를 계산하는 함수
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구의 반경 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // 거리 (km)
    return d;
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI/180)
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={{ width: '320px', height: 'calc(93vh - 200px)', overflowY: 'auto', position: 'absolute', left: 0, top: '280px', zIndex: 10 }}>
        <Box p={2}>
          <Typography variant="h5" gutterBottom>주차장 리스트</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>정렬 기준</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="distance">거리순</MenuItem>
              <MenuItem value="price">요금순</MenuItem>
            </Select>
          </FormControl>
          {showRadiusAlert && (
            <Alert 
              severity="info" 
              action={
                <Button color="inherit" size="small" onClick={handleRadiusIncrease}>
                  네
                </Button>
              }
              onClose={() => setShowRadiusAlert(false)}
            >
              <AlertTitle>반경 확장</AlertTitle>
              반경을 넓혀서 다시 검색하시겠습니까?
            </Alert>
          )}
          <List>
            {sortedParkingLots.map((lot, index) => (
              <React.Fragment key={index}>
                <StyledListItem
                  highlighted={highlightedLot && highlightedLot.id === lot.id ? true : undefined}
                  onMouseOver={() => onMouseOverListItem && onMouseOverListItem(lot)}
                  onMouseOut={() => onMouseOutListItem && onMouseOutListItem(lot)}
                  onClick={() => onClickListItem && onClickListItem(lot)}
                >
                  <Box>
                    <Typography variant="subtitle1">{lot.주차장명}</Typography>
                    <Typography variant="body2">요금: {lot.요금정보}</Typography>
                    <Typography variant="body2">잔여 수: {lot.가능한주차면}</Typography>
                    <Typography variant="body2">거리: {lot.distance}m</Typography> {/* 거리 표시 추가 */}
                    <Box mt={1}>
                      <Button component={Link} to={`/parking-lot/${lot.id}`} variant="outlined" size="small" sx={{ mr: 1 }}>
                        상세 정보
                      </Button>
                      <Button component={Link} to={`/reservation?lotId=${lot.id}`} variant="contained" size="small">
                        예약하기
                      </Button>
                    </Box>
                  </Box>
                </StyledListItem>
                {index < sortedParkingLots.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ParkingLotList;