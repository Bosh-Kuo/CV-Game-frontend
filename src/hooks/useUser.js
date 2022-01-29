import { useState, useRef, useEffect } from "react";
import {
  SIGNUP_MUTATION,
  LOGIN_MUTATION,
  UPDATE_MUTATION,
} from "../graphql/index";
import { useMutation } from "@apollo/react-hooks";
import { useLocation, useNavigate } from "react-router-dom";

const LOCALSTORAGE_KEY = "save-me";

const useUser = () => {
  const [SignupMutation] = useMutation(SIGNUP_MUTATION);
  const [LoginMutation] = useMutation(LOGIN_MUTATION);
  const [UpdateMutation] = useMutation(UPDATE_MUTATION);

  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
  const initUser = {
    username: savedMe || "fei",
    password: "fei",
    scores: {},
    signed: false,
  };
  // User data
  const [displayError, setDisplayError] = useState(false);
  const [UserData, setUserData] = useState(initUser);
  // game model
  const [game, setGame] = useState("");
  // game time score
  const [time, setTime] = useState(0);
  // game time start
  const [timerOn, setTimerOn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  // time count : you can direct set variable like this:
  // setTimerOn(true)  => Start
  // setTimerOn(false) => Stop
  // setTime(0)        => Reset
  // setTimerOn(true)  => Resume
  useEffect(() => {
    let interval = null;
    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!timerOn) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  // 重整頁面就會回到login Page
  useEffect(() => {
    console.log(location.pathname);
    if (!UserData.signed && location.pathname !== "/register") {
      navigate(`/`);
    }
  }, []);

  // handle user data change:
  // input : Object key, Object value
  const handleChangeUserData = (key, value) => {
    // setDisplayError(false);
    if (key === "username" || key === "password") {
      setUserData({
        ...UserData,
        [key]: value,
      });
    } else {
      setUserData({
        ...UserData,
        scores: { ...UserData.scores, [key]: value },
      });
    }
  };

  // after click sign up button
  const handleCreate = () => {
    if (Object.values(UserData).some((v) => !v)) {
      setDisplayError(true);
      return;
    }
    SignupMutation({
      variables: {
        name: UserData.username,
        password: UserData.password,
      },
      onCompleted: () => {
        setUserData(initUser);
        navigate("/login");
        // handleClose();
      },
    });
  };

  // after click login button
  const handleLogin = () => {
    if (!UserData.username || !UserData.password) {
      setDisplayError(true);
      return;
    }
    LoginMutation({
      variables: {
        name: UserData.username,
        password: UserData.password,
      },
      onCompleted: (data) => {
        if (data.ok) {
          Object.entries(data.user.scores).map((key, value) =>
            handleChangeUserData(key, value)
          );
          navigate(`/login/${data.user.name}`);
        } else {
          setDisplayError(data.error);
          return;
        }
      },
    });
  };

  // after finish the game
  const handleUpdate = () => {
    UpdateMutation({
      variables: {
        data: {
          name: UserData.username,
          game: game,
          score: time,
        },
      },
    });
  };

  const handleLogout = async () => {
    await localStorage.clear();
    await setUserData(initUser);
    navigate("/login");
  };

  const handleSignUp = async () => {
    await localStorage.clear();
    await setUserData(initUser);
    navigate("/register");
  };

  return {
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
  };
};

export default useUser;
