import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

// imageURL: 遊戲圖片
// title: 遊戲標題, ex: Pose Flappy Bird
// desciption: 遊戲描述
// onClick: navigate到該遊戲url的callback function 
export default function GameCard({imageURL, title, description, onClick}) {
  return (
    <Card sx={{ maxWidth: 345, height:350 }} onClick={onClick}>
      <CardActionArea >
        <CardMedia
          component="img"
          height="200"
          image= {imageURL}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" align="center">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}