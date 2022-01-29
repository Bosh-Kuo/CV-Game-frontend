import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SIGNUP_MUTATION } from "../graphql/index";
import { useMutation } from "@apollo/react-hooks";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Link from "@mui/material/Link";
import AlertMessage from "../components/AlertMessage";

const Register = () => {
  const navigate = useNavigate();
  const [SignupMutation] = useMutation(SIGNUP_MUTATION);
  const [visibility, setVisibility] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [error, setError] = useState({
    username: false,
    password: false,
    confirmPassword: false,
    username_helperText: "",
    password_helperText: "",
    confirmPassword_helperText: "",
  });
  const errorRef = useRef({
    username: false,
    password: false,
    confirmPassword: false,
    username_helperText: "",
    password_helperText: "",
    confirmPassword_helperText: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault(); //避免刷新頁面
    if (username && password && confirmPassword) {
      if (password !== confirmPassword) {
        setAlert({
          open: true,
          message: "Please confirm your password again",
          severity: "error",
        });
        return;
      } else {
        const signUpPayLoad = await SignupMutation({
          variables: {
            data: {
              name: username,
              password: password,
            },
          },
        });
        if (signUpPayLoad.data.createUser.ok) {
          navigate(`/login`);
        } else {
          setAlert({
            open: true,
            message: signUpPayLoad.data.createUser.error,
            severity: "error",
          });
          setUsername("");
          setPassword("");
          setConfirmPassword("");
        }
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
      if (!confirmPassword) {
        errorRef.current = {
          ...errorRef.current,
          confirmPassword: true,
          confirmPassword_helperText: "Required",
        };
      } else {
        errorRef.current.confirmPassword = false;
      }
      setError(errorRef.current);
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
          SIGN UP
        </Typography>
        <Box component="form" noValidate sx={{ mt: 5 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                autoComplete="off"
                autoFocus
                error={error.username}
                helperText={error.username_helperText}
                value={username}
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
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
                  setConfirmPassword(event.target.value);
                }}
                required
                fullWidth
                label="Confirm Password"
                type={visibility ? "text" : "password"}
                autoComplete="off"
                error={error.confirmPassword}
                helperText={error.confirmPassword_helperText}
                value={confirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                component="button"
                variant="body2"
                underline="hover"
                onClick={() => navigate(`/login`)}
              >
                {"Already have an account? Sign in"}
              </Link>
            </Grid>
          </Grid>
          <AlertMessage alert={alert} setAlert={setAlert} />
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
