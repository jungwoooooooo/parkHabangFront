import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Adjust imports as needed
import axios from 'axios'; // Assuming you're using axios for API requests

const ParkingDetailsPage = () => {
  const { id } = useParams(); // Get the parking lot ID from the URL
  const [lotDetails, setLotDetails] = useState(null);
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  useEffect(() => {
    // Fetch parking lot details from the server or API
    const fetchLotDetails = async () => {
      try {
        const response = await axios.get(`/api/parking-lots/${id}`); // Replace with your API endpoint
        setLotDetails(response.data);
      } catch (error) {
        console.error('Error fetching parking lot details:', error);
      }
    };

    fetchLotDetails();
  }, [id]);

  if (!lotDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Parking Lot Details</h1>
      <h2>{lotDetails.주차장명}</h2>
      <p><strong>구분:</strong> {lotDetails.주차장구분}</p>
      <p><strong>유형:</strong> {lotDetails.주차장유형}</p>
      <p><strong>도로명주소:</strong> {lotDetails.소재지도로명주소}</p>
      <p><strong>지번주소:</strong> {lotDetails.소재지지번주소}</p>
      <p><strong>주차구획수:</strong> {lotDetails.주차구획수}</p>
      <p><strong>운영요일:</strong> {lotDetails.운영요일}</p>
      <p><strong>전화번호:</strong> {lotDetails.전화번호}</p>
      <p><strong>기본요금:</strong> {lotDetails.주차기본요금}원</p>
      <p><strong>총 주차면:</strong> {lotDetails.총주차면}</p>
      <p><strong>가능한 주차면:</strong> {lotDetails.가능한주차면}</p>
      <p><strong>요금정보:</strong> {lotDetails.요금정보}</p>
    </div>
  );
};

export default ParkingDetailsPage;
