import React from 'react';
import { Container, Typography, List, ListItem, Link, Box, Card, CardMedia } from '@mui/material';
import '../styles/ReportIllegalParking.css';

const ReportIllegalParking = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        불법주차, 간단하게 신고하는 방법 !!
      </Typography>
      <Typography variant="body1" paragraph>
        불법 주정차의 신고는 2가지 방법이 있습니다 !:
        <br/>
        <br/>
      </Typography>
      <Typography variant="h5" gutterBottom>
        1. 첫 번째는 안전신문고 앱을 통해서 쉽게 신고하는 방법.
      </Typography>
      <List>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          1. 안전신문고 앱을 다운로드하고 설치합니다.
          <Box sx={{ mt: 1 }}>
            <Link href="https://play.google.com/store/apps/details?id=kr.go.safepeople&hl=ko&gl=US&pli=1" target="_blank">
              안드로이드 설치하기
            </Link>
            <br />
            <Link href="https://apps.apple.com/kr/app/%EC%95%88%EC%A0%84%EC%8B%A0%EB%AC%B8%EA%B3%A0-%EA%B5%AC-%EC%8A%A4%EB%A7%88%ED%8A%B8%EA%B5%AD%EB%AF%BC%EC%A0%9C%EB%B3%B4-%EC%83%9D%ED%99%9C%EB%B6%88%ED%8E%B8%EC%8B%A0%EA%B3%A0/id963555704" target="_blank">
              아이폰 설치하기
            </Link>
          </Box>
        </ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          <Card sx={{ maxWidth: 345, mx: 'auto', my: 2 }}>
            <CardMedia
              component="img"
              image="https://www.gc.go.kr/design/main/img/sub03/parking_app1.jpg"
              alt="앱 설치"
            />
          </Card>
        </ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>2. 안전신문고 앱 검색 후 설치</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          <Card sx={{ maxWidth: 345, mx: 'auto', my: 2 }}>
            <CardMedia
              component="img"
              image="https://www.gc.go.kr/design/main/img/sub03/parking_app2.jpg"
              alt="앱 검색"
            />
          </Card>
        </ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>3. 신고화면 상단 '불법주정차 신고' 선택</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          <Card sx={{ maxWidth: 345, mx: 'auto', my: 2 }}>
            <CardMedia
              component="img"
              image="https://www.gc.go.kr/design/main/img/sub03/parking_app3.jpg"
              alt="신고 화면"
            />
          </Card>
        </ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>4. 유형 선택</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          <Card sx={{ maxWidth: 345, mx: 'auto', my: 2 }}>
            <CardMedia
              component="img"
              image="https://www.gc.go.kr/design/main/img/sub03/parking_app4.jpg"
              alt="유형 선택"
            />
          </Card>
        </ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>5. 유형 선택(예시:횡단보도)</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          <Card sx={{ maxWidth: 345, mx: 'auto', my: 2 }}>
            <CardMedia
              component="img"
              image="https://www.gc.go.kr/design/main/img/sub03/parking_app5.jpg"
              alt="유형 선택 예시"
            />
          </Card>
        </ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>6. 신고 요건 확인</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          <Card sx={{ maxWidth: 345, mx: 'auto', my: 2 }}>
            <CardMedia
              component="img"
              image="https://www.gc.go.kr/design/main/img/sub03/parking_app6.jpg"
              alt="신고 요건"
            />
          </Card>
        </ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>7. 사진촬영(1분간격 2장)</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          <Card sx={{ maxWidth: 345, mx: 'auto', my: 2 }}>
            <CardMedia
              component="img"
              image="https://www.gc.go.kr/design/main/img/sub03/parking_app7-1.jpg"
              alt="사진 촬영"
            />
          </Card>
        </ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>8. 위치 지정 및 내용입력</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          <Card sx={{ maxWidth: 345, mx: 'auto', my: 2 }}>
            <CardMedia
              component="img"
              image="https://www.gc.go.kr/design/main/img/sub03/parking_app7-2.jpg"
              alt="위치 지정"
            />
          </Card>
        </ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>9. 위치 지정</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          <Card sx={{ maxWidth: 345, mx: 'auto', my: 2 }}>
            <CardMedia
              component="img"
              image="https://www.gc.go.kr/design/main/img/sub03/parking_app8.jpg"
              alt="위치 지정"
            />
          </Card>
        </ListItem>
      </List>
      <Typography variant="h5" gutterBottom>
        2. 두 번째는 지역별 120 다산콜센터로 신고하기입니다 !
      </Typography>
      <List>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>1. 각 지역번호 + 120 다산콜센터로 전화를 걸어서 불법주정차 단속 요청할 수 있으며</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>문자로 신고도 가능합니다. 단, 안전신문고는 직접적인 신고라면 다산콜센터를 통해서는 단속요청을 하는 것입니다.</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>불법주정차 현장 사진과 주소, 간단한 내용으로 단속요청을 하면 1~2시간 이내에 단속반이 직접 나와서 결과까지 사진을 찍어서 진행사항을 답변해 줍니다.</ListItem>
        <ListItem sx={{ textAlign: 'center', display: 'block' }}>
          <Card sx={{ maxWidth: 345, mx: 'auto', my: 2 }}>
            <CardMedia
              component="img"
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrnIDcb1QfhcF6YpFw7dUx1nBAo7VY5VegLQ&s"
              alt="다산콜센터"
            />
          </Card>
        </ListItem>
      </List>
    </Container>
  );
};

export default ReportIllegalParking;