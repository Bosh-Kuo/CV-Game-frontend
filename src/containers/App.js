// import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import LeaderBoard from "./LeaderBoard";
import { Routes, Route, Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useUser from "../hooks/useUser";
import { createContext } from "react";
import Lobby from "./Lobby";
import Login from "./Login";
import Register from "./Register";
import About from "./About";
import FlappyBirdGamePage from "./flappybird/GamePage";
import RockPaperScissors from "./rock-paper-scissors/GamePage";
import Fingerexer from "./fingerexercise/GamePage";
import { useQuery } from "@apollo/client";
import { USER_QUERY, USER_SUBSCRIPTION } from "../graphql";
import { FINGER_MORA } from "../constants";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8893ef",
    },
    secondary: {
      main: "#7f3b56",
    },
    background: {
      paper: "#303030",
      default: "#303030",
    },
  },
});

const UserContext = createContext();

function App() {
  const {
    UserData,
    game,
    time,
    timerOn,
    setUserData,
    setGame,
    setTime,
    setTimerOn,
    handleChangeUserData,
    handleCreate,
    handleLogin,
    handleUpdate,
    handleLogout,
    handleSignUp,
  } = useUser();
  const { loading, error, data, subscribeToMore } = useQuery(USER_QUERY, {
    variables: {
      game: FINGER_MORA,
    },
  });
  // if (data) console.log(data);
  useEffect(() => {
    subscribeToMore({
      document: USER_SUBSCRIPTION,
      variables: { game: FINGER_MORA },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return { users: subscriptionData.data.userUpdated.data };
      },
    });
  }, [subscribeToMore]);
  return (
    <UserContext.Provider
      value={{
        UserData,
        game,
        time,
        timerOn,
        setUserData,
        setGame,
        setTime,
        setTimerOn,
        handleChangeUserData,
        handleCreate,
        handleLogin,
        handleUpdate,
        handleLogout,
        handleSignUp,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/login/:username/leaderboard"
            element={
              <LeaderBoard
                loading={loading}
                error={error}
                data={data}
                subscribeToMore={subscribeToMore}
              />
            }
          />
          <Route path="/login/:username/lobby" element={<Lobby />} />
          <Route path="/login/:username/about" element={<About />} />
          <Route
            path="/login/:username/pose-flappy-bird"
            element={<FlappyBirdGamePage />}
          />
          <Route
            path="/login/:username/rock-paper-scissors"
            element={<RockPaperScissors />}
          />
          <Route
            path="/login/:username/fingerexercise"
            element={<Fingerexer />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export { App, UserContext };
