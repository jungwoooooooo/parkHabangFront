import React, { useState, useEffect } from 'react';
import KakaoMap from './map/KakaoMap';
import SearchPlace from './components/Search';
import { MapProvider } from './map/MapContext';
import ParkingLotLayer from './components/ParkingLotLayer';
import './css/MapContainer.css'
import IncheonIllegalParkingLayer from './components/IncheonIllegalParkingLayer';
import axios from 'axios';

export default function MapContainer({ setParkingLots }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [parkingLots, setLocalParkingLots] = useState([]);
  const [incheonIllegalParkingData, setIncheonIllegalParkingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parkingResponse, incheonIllegalParkingResponse] = await Promise.all([
          axios.get('http://localhost:5000/parking-lots'),
          axios.get('http://localhost:5000/incheon-illegal-parking')
        ]);

        setLocalParkingLots(parkingResponse.data);
        setParkingLots(parkingResponse.data);
        setIncheonIllegalParkingData(Array.isArray(incheonIllegalParkingResponse.data) ? incheonIllegalParkingResponse.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setParkingLots]);

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
          },
          () => {
            setCurrentLocation({ lat: 37.5665, lng: 126.978 });
          }
        );
      } else {
        setCurrentLocation({ lat: 37.5665, lng: 126.978 });
      }
    };

    getCurrentLocation();
  }, []);

  const center = searchLocation || currentLocation || { lat: 37.5665, lng: 126.978 };

  useEffect(() => {
    console.log('Search location updated:', searchLocation);
  }, [searchLocation]);

  return (
    <div className="map-container">
      <MapProvider>
        <SearchPlace onLocationChange={setSearchLocation} top="50px" left="1100px" />
        <KakaoMap
          center={center}
          markers={[{ title: '현재 위치', position: center }]}
          options={{ level: 3 }}
        />
        <ParkingLotLayer parkingLots={parkingLots} />
        <IncheonIllegalParkingLayer incheonIllegalParkingData={incheonIllegalParkingData} />
      </MapProvider>
    </div>
  );
}