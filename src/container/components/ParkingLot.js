import React, { useEffect, useState } from 'react';
import { useMap } from '../map/MapContext'; // Adjust import path as needed
import generateHtmlContent from '../../utils/HtmlContent'; // Adjust import path as needed

const { kakao } = window;

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
    const parkingLotIconUrl = 'https://cdn-icons-png.flaticon.com/512/3720/3720866.png'; // Replace with your icon URL

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

          const content = generateHtmlContent(lot);

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
