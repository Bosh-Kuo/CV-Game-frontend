import { UserContext } from "./App";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_MUTATION } from "../graphql/index";
import { useMutation } from "@apollo/react-hooks";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Link from "@mui/material/Link";
import AlertMessage from "../components/AlertMessage";

const Login = () => {
  const navigate = useNavigate();
  const [LoginMutation] = useMutation(LOGIN_MUTATION);
  const { UserData, setUserData } = useContext(UserContext);
  const [visibility, setVisibility] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    username: false,
    password: false,
    username_helperText: "",
    password_helperText: "",
  });
  const errorRef = useRef({
    username: false,
    password: false,
    username_helperText: "",
    password_helperText: "",
  });

  // 已登入者進到Login Page會自動被導向Lobby Page
  useEffect(() => {
    if (UserData.signed) {
      navigate(`/login/${UserData.username}/lobby`);
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault(); //避免刷新頁面
    if (username && password) {
      const signInPayLoad = await LoginMutation({
        variables: {
          data: {
            name: username,
            password: password,
          },
        },
      });
      if (signInPayLoad.data.loginUser.ok) {
        let scores = {};
        if (signInPayLoad.data.loginUser.user.scores !== null) {
          signInPayLoad.data.loginUser.user.scores.map((score) => {
            scores[score.game] = score.score;
          });
          setUserData({
            username: username,
            password: password,
            scores: { ...scores },
            signed: true,
          });
        } else {
          setUserData({
            username: username,
            password: password,
            scores: {},
            signed: true,
          });
        }
        navigate(`/login/${username}/lobby`);
      } else {
        setAlert({
          open: true,
          message: signInPayLoad.data.loginUser.error,
          severity: "error",
        });
        setUsername("");
        setPassword("");
      }
    } else {
      if (!username) {
        errorRef.current = {
          ...errorRef.current,
          username: true,
          username_helperText: "Required",
        };
      } else {
        errorRef.current.username = false;
      }
      if (!password) {
        errorRef.current = {
          ...errorRef.current,
          password: true,
          password_helperText: "Required",
        };
      } else {
        errorRef.current.password = false;
      }
      setError(errorRef.current);
    }
  };
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={8} // md控制寬度
        sx={{
          backgroundImage:
            "url(https://i.pinimg.com/originals/6c/bb/c0/6cbbc09cfa522d37cc209a2e354d023f.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.grey[50]
              : theme.palette.grey[900], // 如果圖片蓋滿的會就沒作用
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LoginRoundedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            SIGN IN
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 5 }}
            onSubmit={handleSubmit}
          >
            <TextField
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              required
              fullWidth
              label="User Name"
              autoFocus
              autoComplete="off"
              error={error.username}
              helperText={error.username_helperText}
              value={username}
            />
            <TextField
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setVisibility(!visibility)}
                    >
                      {visibility ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              required
              fullWidth
              label="Password"
              type={visibility ? "text" : "password"}
              autoComplete="off"
              error={error.password}
              helperText={error.password_helperText}
              value={password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Grid item>
              <Link
                component="button"
                variant="body2"
                underline="hover"
                onClick={() => navigate(`/register`)}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
            <AlertMessage alert={alert} setAlert={setAlert} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
