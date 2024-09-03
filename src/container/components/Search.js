import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import Modal from 'react-modal';
import axios from 'axios';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '80px',
    left: '120px',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '5px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    width: '200px',
}));

const AddressList = styled(List)(({ theme }) => ({
    marginTop: '8px',
    maxHeight: '120px',
    overflowY: 'auto',
}));

const AddressListItem = styled(ListItem)(({ theme }) => ({
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const SmallTypography = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
}));

const SmallTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
        fontSize: '0.75rem',
    },
    marginBottom: '5px',
}));

const SearchPlace = ({ onLocationChange }) => {
    const [zipCode, setZipcode] = useState("");
    const [roadAddress, setRoadAddress] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [addressList, setAddressList] = useState([]);

    const completeHandler = (data) => {
        setZipcode(data.zonecode);
        setRoadAddress(data.roadAddress);
        setIsOpen(false);
        searchAddress(data.roadAddress);
    }

    const searchAddress = async (address) => {
        if (address) {
            try {
                const response = await axios.get(
                    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
                    {
                        headers: {
                            Authorization: `KakaoAK cc4618fc55e2dc943ad112bb5cdc43c4`, // Replace with your Kakao API key
                        },
                    }
                );
                const documents = response.data.documents;
                setAddressList(documents);

                if (documents.length > 0) {
                    const { x, y } = documents[0].address;
                    if (onLocationChange) {
                        onLocationChange({ lat: parseFloat(y), lng: parseFloat(x) });
                    }
                }
            } catch (error) {
                console.error("주소 검색 오류:", error);
            }
        }
    }

    const selectAddress = (address) => {
        const { x, y } = address;
        if (onLocationChange) {
            onLocationChange({ lat: parseFloat(y), lng: parseFloat(x) });
        }
    }

    const toggleModal = () => {
        setIsOpen(!isOpen);
    }

    return (
        <Container>
            <SmallTypography variant="h6" gutterBottom>
                주소 검색
            </SmallTypography>
            <SmallTextField
                fullWidth
                value={zipCode}
                readOnly
                label="우편번호"
                margin="normal"
                variant="outlined"
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={toggleModal}
                style={{ fontSize: '0.625rem' }}
            >
                우편번호 검색
            </Button>
            <SmallTextField
                fullWidth
                value={roadAddress}
                onChange={(e) => setRoadAddress(e.target.value)}
                label="도로명 주소"
                margin="normal"
                variant="outlined"
            />
            <AddressList>
                {addressList.map((address, index) => (
                    <AddressListItem key={index} onClick={() => selectAddress(address)}>
                        <ListItemText primary={address.address_name} />
                    </AddressListItem>
                ))}
            </AddressList>
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
