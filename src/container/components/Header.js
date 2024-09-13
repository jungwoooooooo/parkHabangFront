import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

// 색상과 스타일을 사용자 정의합니다.
const customAppBarStyle = {
  backgroundColor: '#E0F2F7', // 헤더 배경 색상
  height: '30px', // 헤더 높이
};

const customToolbarStyle = {
  height: '100%', // 툴바의 높이를 헤더에 맞추기
  display: 'flex',
  justifyContent: 'space-between', // 제목과 버튼을 양쪽 끝으로 배치
  alignItems: 'center', // 세로 중앙 정렬
  padding: '0 16px', // 툴바의 패딩
};

const customTypographyStyle = {
  color: '#333', // 글씨 색상
  flexGrow: 1, // 제목을 가능한 넓게 확장
  textAlign: 'center', // 제목 중앙 정렬
};

const customButtonStyle = {
  color: '#00796B', // 버튼 글씨 색상
};

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Link to="/register-parking-lot" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            내 주차장 등록하기
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
