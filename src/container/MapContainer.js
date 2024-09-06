import React, { useState, useEffect } from 'react';
import KakaoMap from './map/KakaoMap';
import SearchPlace from './components/Search';
import { MapProvider } from './map/MapContext';
import Header from './components/Header';
import ParkingLotLayer from './components/ParkingLot';
import IllegalParkingLayer from './components/IllegalParking';
import ChildrenAreaLayer from './components/ChildrenAreaLayers';

export default function MapContainer() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [parkingLots, setParkingLots] = useState([]);
  const [illegalParkingData, setIllegalParkingData] = useState([]);
  const [childrenAreaData, setChildrenAreaData] = useState([]);

  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        const response = await fetch('http://localhost:3000/parking-lots');
        const data = await response.json();
        setParkingLots(data);
      } catch (error) {
        console.error('Error fetching parking lots:', error);
      }
    };

    fetchParkingLots();
  }, []);

  useEffect(() => {
    const fetchIllegalParkingData = async () => {
      try {
        const response = await fetch('http://localhost:3000/illegal-parking');
        const data = await response.json();
        setIllegalParkingData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching illegal parking data:', error);
      }
    };

    fetchIllegalParkingData();
  }, []);

  useEffect(() => {
    const fetchChildrenAreaData = async () => {
      try {
        const response = await fetch('http://localhost:3000/children-area');
        const data = await response.json();
        setChildrenAreaData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching children area data:', error);
      }
    };

    fetchChildrenAreaData();
  }, []);

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

  return (
    <>
      <Header />
      <MapProvider>
        <SearchPlace onLocationChange={setSearchLocation} />
        <KakaoMap
          center={center}
          markers={[{ title: '현재 위치', position: center }]}
          options={{ level: 3 }}
        />
        <ParkingLotLayer parkingLots={parkingLots} />
        <IllegalParkingLayer illegalParkingData={illegalParkingData} />
        <ChildrenAreaLayer childrenAreaData={childrenAreaData} />
      </MapProvider>
    </>
  );
}
