import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 로그인 로직 추가
    console.log('로그인 시도:', { email, password });
    onLogin(); // 로그인 성공 시 호출
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>로그인</Typography>
      <TextField
        label="이메일"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="비밀번호"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleLogin} style={{ marginTop: '16px' }}>
        로그인
      </Button>
    </Box>
  );
};

export default Login;