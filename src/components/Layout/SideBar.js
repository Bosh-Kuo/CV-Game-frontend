import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../containers/App";
import { useContext } from "react";

const drawerWidth = 240;
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const SideBar = ({ open, setOpen, toggleSideBar }) => {
  const navigate = useNavigate();
  const { UserData } = useContext(UserContext);
  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleSideBar}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />

      {/* 遊戲選單列表 */}
      <List>
        <div>
          {/* GameList */}
          <ListSubheader inset>Game List</ListSubheader>
          <ListItem
            button
            onClick={() => {
              navigate(`/login/${UserData.username}/pose-flappy-bird`);
            }}
          >
            <ListItemIcon>
              <Avatar
                alt="Pose Flappy Bird"
                src={require("../../img/Flappy_Bird_icon.png")}
              />
            </ListItemIcon>
            <ListItemText primary="Pose-Flappy-Bird" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              navigate(`/login/${UserData.username}/rock-paper-scissors`);
            }}
          >
            <ListItemIcon>
              <Avatar
                alt="Remy Sharp"
                src={require("../../img//Rock_Paper_Scissors_icon.png")}
              />
            </ListItemIcon>
            <ListItemText primary="Rock-Paper-Scissors" />
          </ListItem>
          {/* 新遊戲加在這 */}
          <ListItem
            button
            onClick={() => {
              navigate(`/login/${UserData.username}/fingerexercise`);
            }}
          >
            <ListItemIcon>
              <Avatar alt="hands" src={require("../../img/fingerexer.jpg")} />
            </ListItemIcon>
            <ListItemText primary="Finger-Exercise" />
          </ListItem>

          {/* LeaderBoard */}
          <Divider />
          <ListSubheader inset>Statistics</ListSubheader>
          <ListItem
            button
            onClick={() => {
              navigate(`/login/${UserData.username}/leaderboard`);
            }}
          >
            <ListItemIcon sx={{ pl: 1 }}>
              <SportsScoreIcon />
            </ListItemIcon>
            <ListItemText primary="Leader Board" />
          </ListItem>
          <Divider />
        </div>
      </List>
    </Drawer>
  );
};
export default SideBar;
