import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MyReservations.css'; // 새로운 CSS 파일 추가

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReservation, setEditReservation] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editEndTime, setEditEndTime] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/reservations/user-reservations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          alert('예약 목록을 불러오는 데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate]);

  const handleEdit = (reservation) => {
    setEditReservation(reservation);
    setEditStartDate(new Date(reservation.시작시간).toISOString().slice(0, 10));
    setEditStartTime(new Date(reservation.시작시간).toISOString().slice(11, 16));
    setEditEndDate(new Date(reservation.종료시간).toISOString().slice(0, 10));
    setEditEndTime(new Date(reservation.종료시간).toISOString().slice(11, 16));
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/reservations/${editReservation.id}`, {
        시작시간: new Date(`${editStartDate}T${editStartTime}`).toISOString(),
        종료시간: new Date(`${editEndDate}T${editEndTime}`).toISOString(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservations(reservations.map(reservation => 
        reservation.id === editReservation.id 
          ? { ...reservation, 시작시간: `${editStartDate}T${editStartTime}`, 종료시간: `${editEndDate}T${editEndTime}` } 
          : reservation
      ));
      setEditDialogOpen(false);
      alert('예약이 수정되었습니다.');
    } catch (error) {
      alert('예약 수정에 실패했습니다.');
    }
  };

  const handleCancel = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(reservations.filter(reservation => reservation.id !== id));
      alert('예약이 취소되었습니다.');
    } catch (error) {
      alert('예약 취소에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
      </div>
    );
  }

  const timeOptions = Array.from({ length: 24 * 6 }, (_, i) => {
    const hours = String(Math.floor(i / 6)).padStart(2, '0');
    const minutes = String((i % 6) * 10).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  return (
    <div className="reservations-container">
      <h1>내 예약 관리</h1>
      <ul className="reservations-list">
        {reservations.map((reservation) => (
          <li key={reservation.id} className="reservation-item">
            <div>
              <strong>주차장:</strong> {reservation.parkingLot?.주차장명 || '정보 없음'}
            </div>
            <div>
              <strong>시작 시간:</strong> {new Date(reservation.시작시간).toLocaleString()}
            </div>
            <div>
              <strong>종료 시간:</strong> {new Date(reservation.종료시간).toLocaleString()}
            </div>
            <div className="reservation-actions">
              <button onClick={() => handleEdit(reservation)} className="edit-button">수정</button>
              <button onClick={() => handleCancel(reservation.id)} className="cancel-button">취소</button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/reservation')} className="new-reservation-button">새 예약하기</button>

      {editDialogOpen && (
        <div className="edit-dialog">
          <h2>예약 수정</h2>
          <div>
            <label>시작 날짜</label>
            <input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
          </div>
          <div>
            <label>시작 시간</label>
            <select value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)}>
              {timeOptions.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div>
            <label>종료 날짜</label>
            <input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
          </div>
          <div>
            <label>종료 시간</label>
            <select value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)}>
              {timeOptions.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div className="edit-dialog-actions">
            <button onClick={() => setEditDialogOpen(false)} className="cancel-button">취소</button>
            <button onClick={handleEditSave} className="save-button">저장</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;