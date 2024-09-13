import React, { useEffect, useState } from 'react';
import { useMap } from '../map/MapContext';
import { useMediaQuery, Button, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const { kakao } = window;

const theme = createTheme();

const IncheonIllegalParkingLayer = ({ incheonIllegalParkingData }) => {
  const { map } = useMap();
  const [markers, setMarkers] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [visibleCategories, setVisibleCategories] = useState({
    fire: false,
    child: false,
    cctv: false
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const categoryIcons = {
    fire: 'https://cdn-icons-png.flaticon.com/512/353/353902.png',
    child: 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/3c1ad7636808a88d4b3250d95329dd28-removebg-preview.png?raw=true',
    cctv: 'https://cdn-icons-png.flaticon.com/512/4017/4017956.png'
  };

  useEffect(() => {
    if (!map || !incheonIllegalParkingData.length) return;

    // 현재 표시된 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers = incheonIllegalParkingData
      .filter(parking => visibleCategories[parking.category])
      .map(parking => {
        if (parking.longitude && parking.latitude) {
          const position = new kakao.maps.LatLng(parking.latitude, parking.longitude);

          const marker = new kakao.maps.Marker({
            position,
            map,
            title: parking.location,
            image: new kakao.maps.MarkerImage(
              categoryIcons[parking.category],
              new kakao.maps.Size(45, 45),  // 여기서 아이콘 크기를 조절합니다 (예: 40x40 픽셀)
              { offset: new kakao.maps.Point(20, 20) }  // 앵커 포인트 설정 (선택사항)
            )
          });

          return marker;
        }
        return null;
      }).filter(marker => marker !== null);

    setMarkers(newMarkers);

    kakao.maps.event.addListener(map, 'click', () => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
        setActiveInfoWindow(null);
      }
    });

  }, [map, incheonIllegalParkingData, visibleCategories]);

  const toggleCategory = (category) => {
    setVisibleCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleAllCategories = () => {
    const allCategoriesActive = Object.values(visibleCategories).every(value => value);
    const newState = Object.keys(visibleCategories).reduce((acc, category) => {
      acc[category] = !allCategoriesActive;
      return acc;
    }, {});
    setVisibleCategories(newState);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        position: 'absolute', 
        bottom: isMobile ? 70 : 'auto', 
        top: isMobile ? 'auto' : 50, 
        left: isMobile ? 10 : 320, 
        right: isMobile ? 10 : 'auto',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'row', // 한 줄로 배치
        alignItems: 'center', // 세로 중앙 정렬
        gap: 1
      }}>
        <Button 
          variant="contained"
          onClick={toggleAllCategories}
          size={isMobile ? "medium" : "large"} // 버튼 크기 조정
          sx={{ 
            backgroundColor: Object.values(visibleCategories).every(value => value) ? '#4CAF50' : '#f44336',
            color: 'white',
            '&:hover': {
              backgroundColor: Object.values(visibleCategories).every(value => value) ? '#45a049' : '#da190b',
            },
            fontSize: isMobile ? '1rem' : '1.25rem', // 폰트 크기 조정
            padding: isMobile ? '12px 24px' : '10px 24px', // 패딩 조정
            marginTop: '10px', // 버튼을 아래로 내리기
            borderRadius: '20px', // 둥근 모서리
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 그림자 추가
            transition: 'background-color 0.3s ease', // 배경색 전환 효과
            height: '56px', // 높이 조정
          }}
        >
          불법주차 구역 {Object.values(visibleCategories).every(value => value) ? '끄기' : '보기'}
        </Button>
        {Object.keys(visibleCategories).map(category => (
          <Button 
            key={category} 
            variant="contained"
            onClick={() => toggleCategory(category)}
            size={isMobile ? "medium" : "large"} // 버튼 크기 조정
            sx={{ 
              backgroundColor: visibleCategories[category] ? '#4CAF50' : '#f44336',
              color: 'white',
              '&:hover': {
                backgroundColor: visibleCategories[category] ? '#45a049' : '#da190b',
              },
              fontSize: isMobile ? '1rem' : '1.25rem', // 폰트 크기 조정
              padding: isMobile ? '12px 24px' : '10px 24px', // 패딩 조정
              borderRadius: '20px', // 둥근 모서리
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 그림자 추가
              transition: 'background-color 0.3s ease', // 배경색 전환 효과
              marginLeft: '10px', // 버튼 간격 조정
              height: '56px', // 높이 조정
            }}
          >
            <img 
              src={categoryIcons[category]} 
              alt={category} 
              style={{ width: isMobile ? '30px' : '30px', height: isMobile ? '30px' : '30px', verticalAlign: 'middle' }} // 아이콘 크기 조정
            />
          </Button>
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default IncheonIllegalParkingLayer;