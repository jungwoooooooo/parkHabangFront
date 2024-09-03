import React, { useEffect, useRef, useState } from 'react';
import { useMap } from '../map/MapContext'; // Adjust import path as needed

const ParkingLotLayer = ({ parkingLots }) => {
  const { map } = useMap(); // Retrieve map instance from context
  const [markers, setMarkers] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null); // State to track the currently open info window

  useEffect(() => {
    if (!map || !parkingLots) return;

    // Remove existing markers
    markers.forEach(marker => marker.setMap(null)); // Remove markers from the map
    setMarkers([]); // Clear the markers array

    // URL to the parking lot icon image
    const parkingLotIconUrl = 'https://www.clipartmax.com/png/middle/220-2201264_euclid-autopark-closure-oct-parking-icon-google-maps.png'; // Replace with your icon URL

    // Create new markers
    const newMarkers = parkingLots.map(lot => {
      if (lot.경도 && lot.위도) {
        const position = new kakao.maps.LatLng(lot.위도, lot.경도);

        const marker = new kakao.maps.Marker({
          position,
          map,
          title: lot.주차장명,
          image: new kakao.maps.MarkerImage(parkingLotIconUrl, new kakao.maps.Size(32, 32)) // Adjust size as needed
        });

        // Add event listener to show popup on marker click
        kakao.maps.event.addListener(marker, 'click', () => {
          // Close the currently active info window if it exists
          if (activeInfoWindow) {
            activeInfoWindow.close();
          }

          const content = `
            <div>
              <h2>상세정보</h2>
              <h3>${lot.주차장명}</h3>
              <p>${lot.주차장구분}</p>
              <p>${lot.주차장유형}</p>
              <p>${lot.소재지도로명주소}</p>
              <p>${lot.소재지지번주소}</p>
              <p>${lot.주차구획수}</p>
              <p>${lot.운영요일}</p>
              <p>${lot.전화번호}</p>
              <p>기본요금: ${lot.주차기본요금}원</p>
              <p>총 주차면 : ${lot.총주차면}</p>
              <p>가능한 주차면 : ${lot.가능한주차면}</p>
              <p>${lot.요금정보}</p>
            </div>
          `;

          const infowindow = new kakao.maps.InfoWindow({
            content,
            position: marker.getPosition(),
          });

          infowindow.open(map, marker);
          setActiveInfoWindow(infowindow); // Set the newly opened info window as the active one

          // Add a listener to close the info window on another click on the marker
          kakao.maps.event.addListener(map, 'click', () => {
            infowindow.close();
            setActiveInfoWindow(null); // Reset the active info window state
          });
        });

        return marker;
      }
      return null;
    }).filter(marker => marker !== null);

    setMarkers(newMarkers); // Update state with new markers

    // Add a listener to the map to close the active info window when clicking elsewhere on the map
    kakao.maps.event.addListener(map, 'click', () => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
        setActiveInfoWindow(null); // Reset the active info window state
      }
    });

  }, [map, parkingLots]);

  return null; // No need to render anything specific here
};

export default ParkingLotLayer;
