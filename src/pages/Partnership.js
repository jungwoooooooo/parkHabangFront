import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

const Partnership = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        제휴/협력
      </Typography>
      <Typography variant="h6" gutterBottom>
        주차해방과 함께 할 수 있는 다양한 제안을 기다립니다.
      </Typography>
      <Typography variant="h6" gutterBottom>
        인천광역시 계양구 효성1동, 정우
      </Typography>
      <Typography variant="body1" gutterBottom>
        jungwoo@naver.com
      </Typography>
      <Box mt={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.href = 'mailto:contact@moduparking.com'}
        >
          메일 보내기
        </Button>
      </Box>
    </Container>
  );
};

export default Partnership;