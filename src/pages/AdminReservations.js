import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Box, Tabs, Tab 
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedParkingLot, setSelectedParkingLot] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrentUser();
    };
    fetchData();
  }, []); // 컴포넌트가 마운트될 때 한 번만 호출

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        await fetchUsers();
        await fetchParkingLots();
        await fetchReservations(); // currentUser가 설정된 후에 호출
      }
    };
    fetchData();
  }, [currentUser]); // currentUser가 변경될 때마다 fetchData 호출

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }
  
      const response = await axios.get(`${API_URL}/user/current`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('현재 사용자 데이터:', response.data); // currentUser 확인용 로그
      setCurrentUser(response.data);
    } catch (error) {
      console.error('현재 사용자 정보 조회 실패:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${API_URL}/reservations`);
      console.log('예약 데이터:', response.data); // 데이터 확인용 로그
      console.log('현재 사용자:', currentUser); // currentUser 확인용 로그
      const filteredReservations = response.data.filter(reservation => 
        reservation.parkingLot?.id === currentUser?.parkingLotId
      );
      console.log('필터링된 예약 데이터:', filteredReservations); // 필터링된 데이터 확인용 로그
      setReservations(filteredReservations);
    } catch (error) {
      console.error('예약 목록 조회 실패:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const usersData = Array.isArray(response.data) ? response.data : [];
      setUsers(usersData);
    } catch (error) {
      console.error('유저 목록 조회 실패:', error);
      setUsers([]);
    }
  };

  const fetchParkingLots = async () => {
    try {
      const response = await axios.get(`${API_URL}/parking-lots`);
      setParkingLots(response.data);
    } catch (error) {
      console.error('주차장 목록 조회 실패:', error);
    }
  };

  const fetchReservationsByParkingLot = async (parkingLotId) => {
    try {
      const response = await axios.get(`${API_URL}/reservations/parking-lot/${parkingLotId}`);
      setReservations(response.data);
    } catch (error) {
      console.error('주차장 예약 목록 조회 실패:', error);
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      const token = localStorage.getItem('token'); // 토큰 가져오기
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      await axios.delete(`${API_URL}/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // 인증 헤더 추가
        }
      });
      fetchReservations();
    } catch (error) {
      console.error('예약 취소 실패:', error);
    }
  };

  const handleDeleteParkingLot = async (id) => {
    try {
      await axios.delete(`${API_URL}/parking-lots/${id}`);
      fetchParkingLots();
    } catch (error) {
      console.error('주차장 삭제 실패:', error);
    }
  };

  const handleEditParkingLot = (id) => {
    // 수정 로직을 여기에 추가하세요
    console.log(`주차장 ${id} 수정`);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleParkingLotClick = (parkingLotId) => {
    setSelectedParkingLot(parkingLotId);
    fetchReservationsByParkingLot(parkingLotId);
  };

  const handleCheckIn = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }
  
      await axios.post(`${API_URL}/reservations/${reservationId}/check-in`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setReservations(prevReservations => {
        const updatedReservations = prevReservations.map(reservation => {
          if (reservation.id === reservationId) {
            return { 
              ...reservation, 
              checkedIn: true, 
              checkedOut: false,
              parkingLot: {
                ...reservation.parkingLot,
                가능한주차면: reservation.parkingLot.가능한주차면 - 1 // 잔여석 업데이트
              }
            };
          }
          return reservation;
        });
  
        // 모든 예약의 주차장 잔여석 업데이트
        const parkingLotId = prevReservations.find(res => res.id === reservationId)?.parkingLot?.id;
        return updatedReservations.map(reservation => {
          if (reservation.parkingLot?.id === parkingLotId) {
            return {
              ...reservation,
              parkingLot: {
                ...reservation.parkingLot,
                가능한주차면: updatedReservations.find(res => res.id === reservationId)?.parkingLot?.가능한주차면
              }
            };
          }
          return reservation;
        });
      });
    } catch (error) {
      console.error('입차 실패:', error);
    }
  };
  
  const handleCheckOut = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }
  
      const response = await axios.post(`${API_URL}/reservations/${reservationId}/check-out`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200 || response.status === 201) { // 201 상태 코드도 처리
        setReservations(prevReservations => {
          const updatedReservations = prevReservations.map(reservation => {
            if (reservation.id === reservationId) {
              return { 
                ...reservation, 
                checkedOut: true,
                parkingLot: {
                  ...reservation.parkingLot,
                  가능한주차면: reservation.parkingLot.가능한주차면 + 1 // 잔여석 업데이트
                }
              };
            }
            return reservation;
          });
  
          // 모든 예약의 주차장 잔여석 업데이트
          const parkingLotId = prevReservations.find(res => res.id === reservationId)?.parkingLot?.id;
          return updatedReservations.map(reservation => {
            if (reservation.parkingLot?.id === parkingLotId) {
              return {
                ...reservation,
                parkingLot: {
                  ...reservation.parkingLot,
                  가능한주차면: updatedReservations.find(res => res.id === reservationId)?.parkingLot?.가능한주차면
                }
              };
            }
            return reservation;
          });
        });
        alert('출차완료');
      } else {
        console.error('출차 실패:', response.statusText);
      }
    } catch (error) {
      console.error('출차 실패:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Tabs value={currentTab} onChange={handleTabChange} centered>
        <Tab label="예약 관리" />
        <Tab label="주차장 관리" />
      </Tabs>

      {currentTab === 0 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>주차장 ID</TableCell> {/* 주차장 ID 열 추가 */}
                <TableCell>주차장명</TableCell>
                <TableCell>사용자</TableCell>
                <TableCell>시작 시간</TableCell>
                <TableCell>종료 시간</TableCell>
                <TableCell>차량 번호</TableCell>
                <TableCell>잔여석</TableCell>
                <TableCell>주소</TableCell> {/* 주소 열 추가 */}
                <TableCell>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">예약이 없습니다.</TableCell> {/* colSpan 수정 */}
                </TableRow>
              ) : (
                reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.parkingLot?.id}</TableCell> {/* 주차장 ID 데이터 추가 */}
                    <TableCell>{reservation.parkingLot?.주차장명}</TableCell>
                    <TableCell>{reservation.사용자이름 || 'N/A'}</TableCell> {/* 사용자 데이터가 없을 때 'N/A' 표시 */}
                    <TableCell>{new Date(reservation.시작시간).toLocaleString()}</TableCell>
                    <TableCell>{new Date(reservation.종료시간).toLocaleString()}</TableCell>
                    <TableCell>{reservation.차량번호 || 'N/A'}</TableCell> {/* 차량 번호 데이터가 없을 때 'N/A' 표시 */}
                    <TableCell>{reservation.parkingLot?.가능한주차면}</TableCell> {/* 가능한주차면 데이터 추가 */}
                    <TableCell>{reservation.parkingLot?.소재지지번주소}</TableCell> {/* 주소 데이터 추가 */}
                    <TableCell>
                      <Box display="flex" justifyContent="flex-start">
                        <Button 
                          onClick={() => handleCancelReservation(reservation.id)} 
                          style={{ marginLeft: '-16px' }}
                        >
                          취소
                        </Button>
                        {!reservation.checkedIn && (
                          <Button 
                            onClick={() => handleCheckIn(reservation.id)} 
                            style={{ marginLeft: '8px' }}
                          >
                            입차
                          </Button>
                        )}
                        {reservation.checkedIn && !reservation.checkedOut && (
                          <Button 
                            onClick={() => handleCheckOut(reservation.id)} 
                            style={{ marginLeft: '8px' }}
                          >
                            출차
                          </Button>
                        )}
                        {reservation.checkedOut && (
                          <span>출차 완료된 차량</span>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {currentTab === 1 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>주차장 ID</TableCell>
                <TableCell>주차장명</TableCell>
                <TableCell>소재지지번주소</TableCell>
                <TableCell>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parkingLots
                .filter(lot => lot.id === currentUser?.parkingLotId)
                .map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell>{lot.id}</TableCell>
                    <TableCell>{lot.주차장명}</TableCell>
                    <TableCell>{lot.소재지지번주소}</TableCell>
                    <TableCell>
                      <Box display="flex" justifyContent="flex-start">
                        <Button 
                          onClick={() => handleEditParkingLot(lot.id)} 
                          style={{ marginLeft: '-16px' }}
                        >
                          수정
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedParkingLot && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>주차장명</TableCell>
                <TableCell>사용자</TableCell>
                <TableCell>시작 시간</TableCell>
                <TableCell>종료 시간</TableCell>
                <TableCell>차량 번호</TableCell>
                <TableCell>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.parkingLot?.주차장명}</TableCell>
                  <TableCell>{reservation.user?.name}</TableCell>
                  <TableCell>{new Date(reservation.startTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(reservation.endTime).toLocaleString()}</TableCell>
                  <TableCell>{reservation.carNumber}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="flex-start">
                      <Button 
                        onClick={() => handleCancelReservation(reservation.id)} 
                        style={{ marginLeft: '-16px' }}
                      >
                        취소
                      </Button>
                      <Button 
                        onClick={() => handleCheckIn(reservation.parkingLot.id)} 
                        style={{ marginLeft: '8px' }}
                      >
                        입차
                      </Button>
                      <Button 
                        onClick={() => handleCheckOut(reservation.parkingLot.id)} 
                        style={{ marginLeft: '8px' }}
                      >
                        출차
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminReservations;