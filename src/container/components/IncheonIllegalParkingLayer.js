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
  const [circles, setCircles] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const categoryIcons = {
    fire: 'https://cdn-icons-png.flaticon.com/512/353/353902.png',
    child: 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/3c1ad7636808a88d4b3250d95329dd28-removebg-preview.png?raw=true',
    cctv: 'https://cdn-icons-png.flaticon.com/512/4017/4017956.png'
  };

  useEffect(() => {
    if (!map || !incheonIllegalParkingData.length) return;

    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
    circles.forEach(circle => circle.setMap(null));
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
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}>
        <Button 
          variant="contained"
          onClick={toggleExpand}
          size={isMobile ? "medium" : "large"}
          sx={{ 
            backgroundColor: isExpanded ? '#4CAF50' : '#f44336',
            color: 'white',
            '&:hover': {
              backgroundColor: isExpanded ? '#45a049' : '#da190b',
            },
            fontSize: isMobile ? '1rem' : '1.25rem',
            padding: isMobile ? '12px 24px' : '10px 24px',
            marginTop: '0px',
            marginLeft: '20px',
            borderRadius: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',
            height: '56px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/4956/4956198.png" 
            alt="icon" 
            style={{ width: '30px', height: '30px', marginRight: '10px' }}
          />
          불법주차 구역 {isExpanded ? '접기' : '보기'}
        </Button>
        {isExpanded && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            marginTop: '10px'
          }}>
            <Button 
              variant="contained"
              onClick={toggleAllCategories}
              size={isMobile ? "medium" : "large"}
              sx={{ 
                backgroundColor: Object.values(visibleCategories).every(value => value) ? '#4CAF50' : '#f44336',
                color: 'white',
                '&:hover': {
                  backgroundColor: Object.values(visibleCategories).every(value => value) ? '#45a049' : '#da190b',
                },
                fontSize: isMobile ? '1rem' : '1.25rem',
                padding: isMobile ? '12px 24px' : '10px 24px',
                borderRadius: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease',
                height: '56px',
              }}
            >
              전체 {Object.values(visibleCategories).every(value => value) ? '끄기' : '보기'}
            </Button>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1,
              marginTop: '10px'
            }}>
              {Object.keys(visibleCategories).map(category => (
                <Button 
                  key={category} 
                  variant="contained"
                  onClick={() => toggleCategory(category)}
                  size={isMobile ? "medium" : "large"}
                  sx={{ 
                    backgroundColor: visibleCategories[category] ? '#4CAF50' : '#f44336',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: visibleCategories[category] ? '#45a049' : '#da190b',
                    },
                    fontSize: isMobile ? '1rem' : '1.25rem',
                    padding: isMobile ? '12px 24px' : '10px 24px',
                    borderRadius: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease',
                    marginLeft: '10px',
                    height: '56px',
                  }}
                >
                  <img 
                    src={categoryIcons[category]} 
                    alt={category} 
                    style={{ width: isMobile ? '30px' : '30px', height: isMobile ? '30px' : '30px', verticalAlign: 'middle' }}
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