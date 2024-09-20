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
  const [circles, setCircles] = useState([]); // 원 상태 추가
  const [isExpanded, setIsExpanded] = useState(false); // 버튼 확장 상태 추가

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const categoryIcons = {
    fire: 'https://cdn-icons-png.flaticon.com/512/353/353902.png',
    child: 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/3c1ad7636808a88d4b3250d95329dd28-removebg-preview.png?raw=true',
    cctv: 'https://cdn-icons-png.flaticon.com/512/4017/4017956.png'
  };

  useEffect(() => {
    if (!map || !incheonIllegalParkingData.length) return;

    // 현재 표시된 마커 및 원 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
    circles.forEach(circle => circle.setMap(null)); // 원 제거
    setCircles([]);

    const newMarkers = [];
    const newCircles = [];

    incheonIllegalParkingData
      .filter(parking => visibleCategories[parking.category])
      .forEach(parking => {
        if (parking.longitude && parking.latitude) {
          const position = new kakao.maps.LatLng(parking.latitude, parking.longitude);

          const marker = new kakao.maps.Marker({
            position,
            map,
            title: parking.location,
            image: new kakao.maps.MarkerImage(
              categoryIcons[parking.category],
              new kakao.maps.Size(45, 45),
              { offset: new kakao.maps.Point(20, 20) }
            )
          });

          newMarkers.push(marker);

          // 어린이 보호구역일 경우 반경 300m 원 추가
          if (parking.category === 'child') {
            const circle = new kakao.maps.Circle({
              center: position,
              radius: 300,
              strokeWeight: 5,
              strokeColor: '#FF0000',
              strokeOpacity: 0.2,
              strokeStyle: 'solid',
              fillColor: '#FF0000',
              fillOpacity: 0.2,
              map: map
            });
            newCircles.push(circle);
          }

          // CCTV 구역일 경우 반경 100m 원 추가
          if (parking.category === 'cctv') {
            const circle = new kakao.maps.Circle({
              center: position,
              radius: 100,
              strokeWeight: 5,
              strokeColor: '#0000FF',
              strokeOpacity: 0.2,
              strokeStyle: 'solid',
              fillColor: '#0000FF',
              fillOpacity: 0.2,
              map: map
            });
            newCircles.push(circle);
          }

          // 소화전 구역일 경우 반경 5m 원 추가
          if (parking.category === 'fire') {
            const circle = new kakao.maps.Circle({
              center: position,
              radius: 5,
              strokeWeight: 5,
              strokeColor: '#FFA500',
              strokeOpacity: 0.8,
              strokeStyle: 'solid',
              fillColor: '#FFA500',
              fillOpacity: 0.3,
              map: map
            });
            newCircles.push(circle);
          }
        }
      });

    setMarkers(newMarkers);
    setCircles(newCircles);

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

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
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
        flexDirection: 'column', // 세로로 배치
        alignItems: 'center', // 세로 중앙 정렬
        gap: 1
      }}>
        <Button 
          variant="contained"
          onClick={toggleExpand}
          size={isMobile ? "medium" : "large"} // 버튼 크기 조정
          sx={{ 
            backgroundColor: isExpanded ? '#4CAF50' : '#f44336',
            color: 'white',
            '&:hover': {
              backgroundColor: isExpanded ? '#45a049' : '#da190b',
            },
            fontSize: isMobile ? '1rem' : '1.25rem', // 폰트 크기 조정
            padding: isMobile ? '12px 24px' : '10px 24px', // 패딩 조정
            marginTop: '0px', // 버튼을 아래로 내리기
            marginLeft: '20px',
            borderRadius: '20px', // 둥근 모서리
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 그림자 추가
            transition: 'background-color 0.3s ease', // 배경색 전환 효과
            height: '56px', // 높이 조정
            display: 'flex', // 아이콘과 텍스트를 함께 배치
            alignItems: 'center' // 아이콘과 텍스트를 세로 중앙 정렬
          }}
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/4956/4956198.png" 
            alt="icon" 
            style={{ width: '30px', height: '30px', marginRight: '10px' }} // 아이콘 크기 및 간격 조정
          />
          불법주차 구역 {isExpanded ? '접기' : '보기'}
        </Button>
        {isExpanded && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', // 세로로 배치
            alignItems: 'center', // 세로 중앙 정렬
            gap: 1,
            marginTop: '10px' // 버튼을 아래로 내리기
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
                borderRadius: '20px', // 둥근 모서리
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 그림자 추가
                transition: 'background-color 0.3s ease', // 배경색 전환 효과
                height: '56px', // 높이 조정
              }}
            >
              전체 {Object.values(visibleCategories).every(value => value) ? '끄기' : '보기'}
            </Button>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row', // 한 줄로 배치
              alignItems: 'center', // 세로 중앙 정렬
              gap: 1,
              marginTop: '10px' // 버튼을 아래로 내리기
            }}>
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
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default IncheonIllegalParkingLayer;