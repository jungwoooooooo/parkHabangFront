import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assert/잔잔배경.png';
import logoImage from '../assert/배경_없는거.png';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/signup', { email, password, nickname });
      console.log('회원가입 성공:', response.data);
      alert('회원가입 성공');
      navigate('/login'); // 회원가입 성공 후 로그인 페이지로 이동
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 실패. 이메일 또는 닉네임을 확인해 주세요.');
    }
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
          marginBottom: "20px"
        }}
      />
      <Typography variant="h4" gutterBottom>회원가입</Typography>
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
      <TextField
        label="닉네임"
        variant="outlined"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        margin="normal"
        fullWidth
        sx={{ 
          backgroundColor: "rgba(255, 255, 255, 0.8)", 
          maxWidth: "400px" // 최대 넓이 조정
        }} 
      />
      <Button variant="contained" color="primary" onClick={handleSignup} style={{ marginTop: '16px' }}>
        회원가입
      </Button>
    </Box>
  );
};

export default SignupForm;