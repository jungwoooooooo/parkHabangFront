import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assert/바람사진.jpeg';
import logoImage from '../assert/배경_없는거.png';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/signin', { email, password });
      const userData = response.data;
      localStorage.setItem('token', userData.accessToken); // 토큰을 로컬 스토리지에 저장
      console.log('로그인 성공:', userData);
      console.log('저장된 토큰:', localStorage.getItem('token')); // 저장된 토큰 확인
      onLogin(userData); // { accessToken: string, isAdmin: boolean } 형태로 반환됨
      if (userData.isAdmin) {
        navigate('/admin-reservations');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해 주세요.');
    }
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <Box 
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <img 
        src={logoImage}
        alt="로고" 
        style={{
          width: "700px", // 크기 조정
          height: "700px", // 크기 조정
          marginBottom: "0px"
        }}
      />
      <Typography variant="h4" gutterBottom>Login</Typography>
      <TextField
        label="이메일"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        fullWidth
        sx={{ 
          backgroundColor: "rgba(255, 255, 255, 0.8)", 
          maxWidth: "400px" // 최대 넓이 조정
        }} 
      />
      <TextField
        label="비밀번호"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        fullWidth
        sx={{ 
          backgroundColor: "rgba(255, 255, 255, 0.8)", 
          maxWidth: "400px" // 최대 넓이 조정
        }} 
      />
      <Button variant="contained" color="primary" onClick={handleLogin} style={{ marginTop: '16px' }}>
        로그인
      </Button>
      <Button variant="outlined" color="secondary" onClick={navigateToSignup} style={{ marginTop: '16px' }}>
        회원가입
      </Button>
    </Box>
  );
};

export default Login;