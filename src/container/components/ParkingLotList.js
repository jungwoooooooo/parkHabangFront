import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Button, Paper, Box, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme(); // 기본 테마 생성

const StyledListItem = styled(ListItem)(({ theme, highlighted }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: highlighted ? theme.palette.action.selected : 'inherit',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ParkingLotList = ({ parkingLots, onMouseOverListItem, onMouseOutListItem, onClickListItem, highlightedLot, onRadiusIncrease }) => {
  const [showRadiusPrompt, setShowRadiusPrompt] = useState(false);

  useEffect(() => {
    if (parkingLots.length <= 2) {
      setShowRadiusPrompt(true);
    } else {
      setShowRadiusPrompt(false);
    }
  }, [parkingLots]);

  const handleRadiusIncrease = () => {
    onRadiusIncrease();
    setShowRadiusPrompt(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={{ width: '320px', height: 'calc(93vh - 200px)', overflowY: 'auto', position: 'absolute', left: 0, top: '280px', zIndex: 10 }}>
        <Box p={2}>
          <Typography variant="h5" gutterBottom>주차장 리스트</Typography>
          <Dialog open={showRadiusPrompt} onClose={() => setShowRadiusPrompt(false)}>
            <DialogTitle>반경 확장</DialogTitle>
            <DialogContent>
              <Typography>반경 내에 주차장이 적습니다. 반경을 넓히시겠습니까?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleRadiusIncrease}>네</Button>
              <Button onClick={() => setShowRadiusPrompt(false)}>아니오</Button>
            </DialogActions>
          </Dialog>
          <List>
            {parkingLots.map((lot, index) => (
              <React.Fragment key={index}>
                <StyledListItem
                  highlighted={highlightedLot && highlightedLot.id === lot.id}
                  onMouseOver={() => onMouseOverListItem && onMouseOverListItem(lot)}
                  onMouseOut={() => onMouseOutListItem && onMouseOutListItem(lot)}
                  onClick={() => onClickListItem && onClickListItem(lot)}
                >
                  <ListItemText
                    primary={<Typography variant="subtitle1">{lot.주차장명}</Typography>}
                    secondary={
                      <>
                        <Typography variant="body2">요금: {lot.요금정보}</Typography>
                        <Typography variant="body2">잔여 수: {lot.가능한주차면}</Typography>
                        <Box mt={1}>
                          <Button component={Link} to={`/parking-lot/${lot.id}`} variant="outlined" size="small" sx={{ mr: 1 }}>
                            상세 정보
                          </Button>
                          <Button component={Link} to={`/reservation?lotId=${lot.id}`} variant="contained" size="small">
                            예약하기
                          </Button>
                        </Box>
                      </>
                    }
                  />
                </StyledListItem>
                {index < parkingLots.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ParkingLotList;