import { useState, useEffect, useRef, useContext } from "react";
import { One, Two, Three, Four, Five, Zero } from "../../img/fingerexer";
import Webcam from "react-webcam";
import { Prediction } from "../../components/fingerexercise/Prediction";
import { Box, Button } from "@mui/material";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { UserContext } from "../App";
import { FINGER_EXERCISE } from "../../constants/index";
import { UPDATE_MUTATION } from "../../graphql/index";
import { useMutation } from "@apollo/react-hooks";

class Timer {
  constructor() {
    this.isRunning = false;
    this.startTime = 0;
    this.overallTime = 0;
  }

  _getTimeElapsedSinceLastStart() {
    if (!this.startTime) {
      return 0;
    }

    return Date.now() - this.startTime;
  }

  start() {
    if (this.isRunning) {
      return console.error("Timer is already running");
    }

    this.isRunning = true;

    this.startTime = Date.now();
  }

  stop() {
    if (!this.isRunning) {
      return console.error("Timer is already stopped");
    }

    this.isRunning = false;

    this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
  }

  reset() {
    this.overallTime = 0;

    if (this.isRunning) {
      this.startTime = Date.now();
      return;
    }

    this.startTime = 0;
  }

  getTime() {
    if (!this.startTime) {
      return 0;
    }

    if (this.isRunning) {
      return this.overallTime + this._getTimeElapsedSinceLastStart();
    }

    return this.overallTime;
  }
}

function Game({ setPrePare }) {
  const webcamRef = useRef(null);
  const predictPromise = useRef(null);
  const idxRef = useRef(0);
  const timeRef = useRef(null);

  const { UserData, setUserData } = useContext(UserContext);

  const handimage = [Zero, One, Two, Three, Four, Five];
  const handlist = ["zero", "one", "two", "three", "four", "five"];
  // const canvasRef = useRef(null);
  const [playerhand, setPlayerhand] = useState("");
  const [Gesarray, setGesarray] = useState(Prediction.getrandomarr(30));
  const [Gesarraybool, setGesarraybool] = useState(Array(30).fill(false));
  const [start, setStart] = useState(false);
  const [UpdateMutation] = useMutation(UPDATE_MUTATION);
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  const handleStart = () => {
    idxRef.current = 0;
    timeRef.current = new Timer();
    timeRef.current.start();
    setTime(0);
    setStart(true);
  };

  const handleBack = () => {
    idxRef.current = 0;
    setStart(false);
    setPrePare(false);
  };

  const handlegesture = (gesture) => {
    switch (gesture) {
      case "zero":
        setPlayerhand(Zero);
        break;
      case "five":
        setPlayerhand(Five);
        break;
      case "two":
        setPlayerhand(Two);
        break;
      case "three":
        setPlayerhand(Three);
        break;
      case "four":
        setPlayerhand(Four);
        break;
      case "one":
        setPlayerhand(One);
        break;
      default:
        setPlayerhand("");
        break;
    }
  };

  function playOneRound(detector, requiredDuration) {
    const allfinish = Gesarraybool.filter((e) => !e).length === 0;
    if (!allfinish) {
      detect(detector, requiredDuration);
    } else {
      console.log("finish");
      setStart(false);
    }
  }

  function detect(detector, requiredDuration) {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      let lastGesture = "";
      let gestureDuration = 0;
      const predictNonblocking = () => {
        setTimeout(() => {
          const predictionStartTS = Date.now();
          detector.predictGesture(video, 9).then((playerGesture) => {
            if (playerGesture !== "") {
              if (playerGesture === lastGesture) {
                const deltaTime = Date.now() - predictionStartTS;
                gestureDuration += deltaTime;
              } else {
                handlegesture(playerGesture);
                lastGesture = playerGesture;
                gestureDuration = 0;
              }
            } else {
              handlegesture(false);
              lastGesture = "";
              gestureDuration = 0;
            }

            if (gestureDuration < requiredDuration) {
              predictNonblocking();
            } else {
              if (!Gesarraybool[idxRef.current]) {
                if (handlist[Gesarray[idxRef.current]] === playerGesture) {
                  const newarr = Array(30)
                    .fill(false)
                    .fill(true, 0, idxRef.current);
                  newarr[idxRef.current] = true;
                  idxRef.current++;
                  setGesarraybool(newarr);
                } else {
                  predictNonblocking();
                }
              }
            }
          });
        }, 0);
      };

      predictNonblocking();
    }
  }

  const gettime = (time) => {
    const minute = ("0" + Math.floor((time / 60000) % 60)).slice(-2);
    const second = ("0" + Math.floor((time / 1000) % 60)).slice(-2);
    const milsec = ("0" + (Math.floor(time / 10) % 100)).slice(-2);
    return `${minute}:${second}:${milsec}`;
  };

  useEffect(() => {
    let inter = null;
    if (timerOn) {
      inter = setInterval(() => {
        setTime(Math.round(timeRef.current.getTime()));
      }, 25);
    } else if (!timerOn) {
      clearInterval(inter);
    }
    return () => clearInterval(inter);
  }, [timerOn]);

  // setyp & initialization
  // -----------------------------------------------------------------------------
  useEffect(() => {
    predictPromise.current = Prediction.init();
    Promise.all([predictPromise.current]).then(() => {
      console.log("Play One Round");
      playOneRound(Prediction, 120);
    });
  }, []);

  //-----
  useEffect(() => {
    if (start) {
      setTimeout(() => playOneRound(Prediction, 120), 250);
    }
  }, [Gesarraybool, start]);

  useEffect(() => {
    if (start) {
      setTimerOn(true);
    } else {
      setGesarray(Prediction.getrandomarr(30));
      setGesarraybool(Array(30).fill(false));
      setTimerOn(false);
      if (time !== 0) {
        if (UserData.scores.hasOwnProperty(FINGER_EXERCISE)) {
          if (time < UserData.scores[FINGER_EXERCISE]) {
            setUserData({
              ...UserData,
              scores: { ...UserData.scores, [FINGER_EXERCISE]: time },
            });
            UpdateMutation({
              variables: {
                data: {
                  name: UserData.username,
                  game: FINGER_EXERCISE,
                  score: time,
                },
              },
            });
          }
        } else {
          setUserData({
            ...UserData,
            scores: { ...UserData.scores, [FINGER_EXERCISE]: time },
          });
          UpdateMutation({
            variables: {
              data: {
                name: UserData.username,
                game: FINGER_EXERCISE,
                score: time,
              },
            },
          });
        }
      }
    }
  }, [start]);

  return (
    <Box
      sx={{
        width: "100%",
        margin: "0 auto",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        top: "30px",
      }}
    >
      <Box
        sx={{
          position: "relative",
          border: "7px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "8px",
          width: "40%",
          height: "100%",
          margin: "30px",
          display: "flex",
          flexFlow: "column wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            width: "100%",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexFlow: "column wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {start && Gesarray.length > 0 ? (
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={{ xs: 2, md: 2 }}
                columns={{ xs: 12 }}
              >
                {Gesarray.map((e, index) => (
                  <Grid item xs={2} alignItems="center" key={index}>
                    <Box
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={handimage[e]}
                        alt={handimage[e]}
                        width="40"
                        height="50"
                        style={{
                          borderRadius: "4px",
                          overflow: "hidden",
                          opacity: Gesarraybool[index] ? 0.3 : null,
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Button
                variant="contained"
                sx={{
                  mx: 3,
                  px: 3,
                  backgroundColor: (theme) => theme.palette.secondary,
                }}
                onClick={() => handleStart()}
              >
                Start
              </Button>
            )}
          </CardContent>
        </Card>
        <Box
          sx={{
            textAlign: "center",
            top: 10,
            fontSize: "42px",
            lineHeight: "50px",
          }}
        >
          {gettime(time)}
        </Box>
        <Button
          variant="contained"
          sx={{
            mx: 3,
            px: 3,
            backgroundColor: (theme) => theme.palette.secondary,
          }}
          onClick={() => handleBack()}
        >
          Back
        </Button>
      </Box>
      <Box
        sx={{
          // display: "inline-box",
          position: "relative",
          border: "7px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "8px",
          width: "640px",
          height: "480px",
          margin: "30px",
          overflow: "hidden",
        }}
      >
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            textAlign: "center",
            zIndex: 9,
            width: "640px",
            height: "480px",
            transform: "rotateY(180deg)",
          }}
        ></Webcam>
        <Typography
          sx={{
            position: "absolute",
            textAlign: "start",
            width: "640px",
            height: "480px",
            zIndex: 11,
          }}
        >
          {playerhand ? (
            <img src={playerhand} alt={playerhand} width="60" height="75" />
          ) : null}
        </Typography>
      </Box>
    </Box>
  );
}

export default Game;
