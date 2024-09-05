import React, { useState, useEffect } from 'react';
import KakaoMap from './map/KakaoMap'; // Adjust the import path as needed
import SearchPlace from './components/Search'; // Adjust the import path as needed
import { MapProvider } from './map/MapContext';
import Header from './components/Header';
import ParkingLotLayer from './components/ParkingLot';
import IllegalParkingLayer from './components/IllegalParking';
import ChildrenAreaLayer from './components/ChildrenAreaLayers';// Import the new component

export default function MapContainer() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [parkingLots, setParkingLots] = useState([]);
  const [illegalParkingData, setIllegalParkingData] = useState([]);
  const [childrenAreaData, setChildrenAreaData] = useState([]); // 어린이 보호구역 데이터 상태 추가

  useEffect(() => {
    // API에서 주차장 데이터 가져오기
    const fetchParkingLots = async () => {
      try {
        const response = await fetch('http://localhost:3000/parking-lots'); // API URL
        const data = await response.json();
        setParkingLots(data);
      } catch (error) {
        console.error('Error fetching parking lots:', error);
      }
    };

    fetchParkingLots();
  }, []);

  useEffect(() => {
    // API에서 불법 주정차 데이터 가져오기
    const fetchIllegalParkingData = async () => {
      try {
        const response = await fetch('http://localhost:3000/illegal-parking'); // API URL
        const data = await response.json();
        if (Array.isArray(data)) {
          setIllegalParkingData(data);
        } else {
          console.error('Invalid data format:', data);
          setIllegalParkingData([]);
        }
      } catch (error) {
        console.error('Error fetching illegal parking data:', error);
        setIllegalParkingData([]);
      }
    };

    fetchIllegalParkingData();
  }, []);

  useEffect(() => {
    // API에서 어린이 보호구역 데이터 가져오기
    const fetchChildrenAreaData = async () => {
      try {
        const response = await fetch('http://localhost:3000/children-area'); // API URL
        const data = await response.json();
        if (Array.isArray(data)) {
          setChildrenAreaData(data);
        } else {
          console.error('Invalid data format:', data);
          setChildrenAreaData([]);
        }
      } catch (error) {
        console.error('Error fetching children area data:', error);
        setChildrenAreaData([]);
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
            console.error('Unable to retrieve your location');
            setCurrentLocation({ lat: 37.5665, lng: 126.978 });
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser');
        setCurrentLocation({ lat: 37.5665, lng: 126.978 });
      }
    };

    getCurrentLocation();
  }, []);

  const markers = [];
  if (currentLocation) {
    markers.push({ title: '현재 위치', position: currentLocation });
  }
  if (searchLocation) {
    markers.push({ title: '검색된 위치', position: searchLocation });
  }

  const center = searchLocation || currentLocation || { lat: 37.5665, lng: 126.978 };

  return (
    <>
      <Header />
      <MapProvider>
        <SearchPlace onLocationChange={setSearchLocation} />
        <KakaoMap
          center={center}
          markers={markers}
          options={{ level: 3 }} // 기본 옵션
        />
        <ParkingLotLayer parkingLots={parkingLots} />
        <IllegalParkingLayer illegalParkingData={illegalParkingData} />
        <ChildrenAreaLayer childrenAreaData={childrenAreaData} /> {/* 어린이 보호구역 레이어 추가 */}
      </MapProvider>
    </>
  );
}
