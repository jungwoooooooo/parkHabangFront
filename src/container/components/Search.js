import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import Modal from 'react-modal';
import axios from 'axios';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../css/Search.css'; // CSS 파일 경로 수정

// 주소 검색 컨테이너
const Container = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '80px', // 기존 '10px'에서 '50px'으로 변경
    left: '55%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '5px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    width: '300px',
    [theme.breakpoints.down('sm')]: {
        width: 'auto',
        left: '50%',
        transform: 'translateX(-50%)',
        top: '10px',
        padding: '3px',
        backgroundColor: 'transparent',
        boxShadow: 'none',
    },
}));

// 주소 목록 스타일
const AddressList = styled(List)(({ theme }) => ({
    marginTop: '8px',
    maxHeight: '120px',
    overflowY: 'auto',
}));

// 주소 목록 항목 스타일
const AddressListItem = styled(ListItem)(({ theme }) => ({
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

// 작은 텍스트 스타일
const SmallTypography = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
}));

// 작은 텍스트 필드 스타일
const SmallTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
        fontSize: '0.75rem',
    },
    marginBottom: '5px',
}));

// 주소 검색 컴포넌트
const SearchPlace = ({ onLocationChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [addressList, setAddressList] = useState([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // 우편번호 완료 핸들러
    const completeHandler = (data) => {
        console.log('Complete handler data:', data);
        setIsOpen(false);
        searchAddress(data.roadAddress, data.jibunAddress); // 지번 주소 추가
    }

    // 주소 검색 함수
    const searchAddress = async (roadAddress, jibunAddress) => {
        if (roadAddress) {
            try {
                const response = await axios.get(
                    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(roadAddress)}`,
                    {
                        headers: {
                            Authorization: `KakaoAK cc4618fc55e2dc943ad112bb5cdc43c4`, // Replace with your Kakao API key
                        },
                    }
                );
                const documents = response.data.documents;
                console.log('Search address response:', documents);
                setAddressList(documents);

                if (documents.length > 0) {
                    const { x, y } = documents[0].address;
                    if (onLocationChange) {
                        console.log('Updating location:', { lat: parseFloat(y), lng: parseFloat(x), roadAddress, jibunAddress });
                        onLocationChange({ lat: parseFloat(y), lng: parseFloat(x), roadAddress, jibunAddress });
                    }
                }
            } catch (error) {
                console.error("주소 검색 오류:", error);
            }
        }
    }

    // 주소 선택 핸들러
    const selectAddress = (address) => {
        const { x, y } = address;
        console.log('Selected address:', address);
        if (onLocationChange) {
            console.log('Updating location:', { lat: parseFloat(y), lng: parseFloat(x) });
            onLocationChange({ lat: parseFloat(y), lng: parseFloat(x) });
        }
    }

    // 모달 토글 함수
    const toggleModal = () => {
        setIsOpen(!isOpen);
    }

    // 렌더링
    return (
        <Container>
            <Button
                variant="contained"
                color="primary"
                onClick={toggleModal}
                style={{ fontSize: '0.75rem' }}
            >
                우편번호 검색
            </Button>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1500,
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '350px',
                        height: '400px',
                        padding: '0',
                        overflow: 'hidden',
                        border: 'none',
                        zIndex: 1600,
                        position: 'absolute'
                    },
                }}
            >
                <DaumPostcode onComplete={completeHandler} style={{ width: '100%', height: '100%' }} />
            </Modal>
        </Container>
    );
}

export default SearchPlace;