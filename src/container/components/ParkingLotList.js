import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, Typography, Button, Paper, Box, Divider, Alert, AlertTitle } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { debounce } from 'lodash'; // Import debounce from lodash

const theme = createTheme(); // 기본 테마 생성

//주차장 리스트 스타일 컴포넌트
const StyledListItem = styled(ListItem)(({ theme, highlighted }) => ({
  marginBottom: theme.spacing(2),//마진 추가
  backgroundColor: highlighted ? theme.palette.action.selected : 'inherit',//배경 색 설정
  border: '2px solid #000', // 테두리 추가
  '&:hover': {
    backgroundColor: theme.palette.action.hover,//마우스 오버 시 배경 색 변경
  },
}));

//주차장 리스트 컴포넌트
const ParkingLotList = ({ parkingLots, onMouseOverListItem, onMouseOutListItem, onClickListItem, highlightedLot, onRadiusIncrease, mapCenter, currentRadius, userLocation }) => {
  const [showRadiusAlert, setShowRadiusAlert] = useState(false);//반경 알림 상태 초기화
  const [sortBy, setSortBy] = useState('distance');//정렬 기준 상태 초기화
  const [sortedParkingLots, setSortedParkingLots] = useState([]);//정렬된 주차장 상태 초기화

  //주차장 리스트 상태 업데이트
  useEffect(() => {
    if (parkingLots.length <= 2) {//주차장 리스트가 2개 이하일 경우
      setShowRadiusAlert(true);//반경 알림 상태 업데이트
    } else {//주차장 리스트가 2개 이상일 경우
      setShowRadiusAlert(false);//반경 알림 상태 업데이트
    }

    // 주차장 정렬
    const sortLots = () => {
      const referenceLocation = userLocation || mapCenter;

      if (!referenceLocation || typeof referenceLocation.lat !== 'number' || typeof referenceLocation.lng !== 'number') {
        console.warn('위치 정보가 올바르게 정의되지 않았습니다:', referenceLocation);
        setSortedParkingLots(parkingLots);
        return;
      }

      const sorted = [...parkingLots].map(lot => {
        const distance = calculateDistance(
          parseFloat(lot.위도), 
          parseFloat(lot.경도), 
          referenceLocation.lat, 
          referenceLocation.lng
        );
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
  }, [parkingLots, sortBy, userLocation, mapCenter]);

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

  // 디바운스 시간을 더 늘립니다
  const debouncedMouseOver = React.useMemo(
    () => debounce((lot) => {
      onMouseOverListItem && onMouseOverListItem(lot);
    }, 300), // 200ms에서 300ms로 증가
    [onMouseOverListItem]
  );

  const debouncedMouseOut = React.useMemo(
    () => debounce((lot) => {
      onMouseOutListItem && onMouseOutListItem(lot);
    }, 300), // 200ms에서 300ms로 증가
    [onMouseOutListItem]
  );

  // 메모이제이션된 리스트 아이템 컴포넌트를 최적화합니다
  const MemoizedListItem = React.memo(({ lot, index }) => {
    const isHighlighted = highlightedLot && highlightedLot.id === lot.id;

    const handleMouseEnter = React.useCallback(() => {
      debouncedMouseOver(lot);
    }, [lot]);

    const handleMouseLeave = React.useCallback(() => {
      debouncedMouseOut(lot);
    }, [lot]);

    const handleClick = React.useCallback(() => {
      onClickListItem && onClickListItem(lot);
    }, [lot]);

    return (
      <React.Fragment>
        <StyledListItem
          highlighted={isHighlighted}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <Box>
            <Typography variant="subtitle1">{lot.주차장명}</Typography>
            <Typography variant="body2">요금: {lot.요금정보}</Typography>
            <Typography variant="body2">잔여 수: {lot.가능한주차면}</Typography>
            <Typography variant="body2">거리: {lot.distance}m</Typography>
            <Box mt={1}>
              <Button component={Link} to={`/parking-lot/${lot.id}`} variant="outlined" size="small" sx={{ mr: 1 }}>
                상세 정보
              </Button>
              <Button component={Link} to={`/reservation?lotId=${lot.id}`} variant="contained" size="small" sx={{ mr: 1 }}>
                예약하기
              </Button>
              <Button variant="contained" size="small" color="secondary" onClick={(e) => {
                e.stopPropagation();
                onClickListItem(lot);
              }}>
                길찾기
              </Button>
            </Box>
          </Box>
        </StyledListItem>
        {index < sortedParkingLots.length - 1 && <Divider />}
      </React.Fragment>
    );
  }, (prevProps, nextProps) => {
    return prevProps.lot.id === nextProps.lot.id &&
           prevProps.index === nextProps.index &&
           (prevProps.highlightedLot && prevProps.highlightedLot.id) === (nextProps.highlightedLot && nextProps.highlightedLot.id);
  });

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={{ width: '320px', height: 'calc(93vh - 200px)', overflowY: 'auto', position: 'absolute', left: 0, top: '280px', zIndex: 10 }}>
        <Box p={2}>
          <Typography variant="h5" gutterBottom>주차장 리스트</Typography>
          <Typography variant="body2" gutterBottom>현재 검색 반경: {currentRadius}m</Typography>
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
              현재 반경 {currentRadius}m를 확장하여 다시 검색하시겠습니까?
            </Alert>
          )}
          <List>
            {sortedParkingLots.map((lot, index) => (
              <MemoizedListItem 
                key={lot.id} 
                lot={lot} 
                index={index} 
                highlightedLot={highlightedLot}
              />
            ))}
          </List>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default React.memo(ParkingLotList);