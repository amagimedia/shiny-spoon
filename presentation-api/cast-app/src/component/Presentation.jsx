import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Slider,
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Form from "./Form";

export default function Presentation({
  playerRef,
  handleView,
  view,
  presentationConnection,
  presentationRequest,
  presentationId,
}) {
  const [slide, setSlide] = useState(0);
  const [play, setPlay] = useState(true);
  const [duration, setDuration] = useState(0);
  const [toggleMessage, setToggleMessage] = useState(true);
  const [volume, setVolume] = useState(40);
  const [mute, setMute] = useState(true);

  useEffect(() => {
    if (playerRef.current) {
      const value = Math.floor(playerRef.current.duration());
      setDuration(Number.isNaN(value) ? 0 : value);
    }
  }, [view, playerRef, toggleMessage]);

  const handleDisConnection = () => {
    presentationConnection.terminate();
  };

  const handleMessage = (sourceMessage) => {
    console.log(presentationConnection);
    if (
      presentationConnection &&
      presentationConnection.state === "connected"
    ) {
      presentationConnection.send(
        JSON.stringify({ message: `${sourceMessage}` })
      );
    }
  };

  const handleClick = (value) => {
    switch (value) {
      case "play":
        presentationConnection.send(JSON.stringify({ controlMessage: "play" }));
        break;
      case "pause":
        presentationConnection.send(
          JSON.stringify({ controlMessage: "pause" })
        );
        break;
      case "mute":
        presentationConnection.send(JSON.stringify({ controlMessage: "mute" }));
        break;
      case "unmute":
        presentationConnection.send(
          JSON.stringify({ controlMessage: "unmute" })
        );
        break;
      default:
        break;
    }
  };

  const handleChange = (event, newValue) => {
    setSlide(newValue);
    const player = playerRef.current;
    if (player && presentationConnection) {
      const value = slide * (player.duration() * 0.01);
      if (presentationConnection) {
        presentationConnection.send(JSON.stringify({ seekData: value }));
      }
    }
  };

  const handlePlay = () => {
    if (play) {
      setPlay(false);
      return;
    }
    setPlay(true);
  };

  const handleMute = () => {
    setMute(!mute);
  };

  const handleReconnect = () => {
    presentationRequest
      .reconnect(presentationId)
      .then((connection) => {
        console.log("Reconnected to " + connection.id);
        handleView(false);
      })
      .catch((error) => {
        console.log(
          "Presentation.reconnect() error, " + error.name + ": " + error.message
        );
      });
  };

  const handleClose = () => {
    presentationConnection.close();
  };

  const handleDuration = (value) => {
    setDuration(value);
  };

  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  }

  function handletoggleMessage() {
    setToggleMessage(!toggleMessage);

    // experiment
    setTimeout(() => {
      const value = Math.floor(playerRef.current.duration());
      setDuration(Number.isNaN(value) ? 0 : value);
    }, 400);
  }
  const handleVolume = (event, newValue) => {
    setVolume(newValue);
    const value = volume / 100;
    if (presentationConnection) {
      presentationConnection.send(JSON.stringify({ volumeData: value }));
    }
  };

  return (
    <>
      <Grid
        item
        container
        sx={{
          display: !view ? "inherit" : "none",
          backgroundColor: "rgb(3 ,30, 60)",
          borderRadius: 5,
          p: "1rem",
          border: "1px solid rgb(30, 73, 118)",
        }}
      >
        <Grid item container>
          <Typography variant="h2">Controls</Typography>
        </Grid>
        <Grid item container sx={{ mt: "2em" }} justifyContent="space-between">
          <Grid item>
            <IconButton
              onClick={() => {
                handleClick(play ? "play" : "pause");
                handlePlay();
              }}
              sx={{
                border: "1px solid rgb(30, 73, 118)",
                borderRadius: "50%",
              }}
            >
              {play ? <PlayArrowIcon /> : <PauseIcon />}
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => {
                handleClick(mute ? "mute" : "unmute");
                handleMute();
              }}
              sx={{
                border: "1px solid rgb(30, 73, 118)",
                borderRadius: "50%",
              }}
            >
              {mute ? <VolumeMuteIcon /> : <VolumeOffIcon />}
            </IconButton>
          </Grid>
          <Grid item>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <VolumeDown />
              <Slider
                aria-label="Volume"
                value={volume}
                onChange={handleVolume}
                sx={{ width: 100 }}
              />
              <VolumeUp />
            </Stack>
          </Grid>
          <Grid item>
            <Slider
              aria-label="Volume"
              value={slide}
              onChange={handleChange}
              sx={{
                width: ["20rem", "25rem", "35rem"],
                ml: ["3rem", "5rem", 0],
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: -2,
              }}
            >
              <Typography variant="time" sx={{ ml: ["3rem", "5rem", 0] }}>
                {formatDuration(Math.floor(slide * duration * 0.01))}
              </Typography>
              <Typography variant="time">
                -
                {formatDuration(Math.floor(duration - slide * duration * 0.01))}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid
          item
          container
          sx={{
            mt: "2rem",
            backgroundColor: "rgb(3 ,30, 60)",
            borderRadius: 5,
            p: "1rem",
            border: "1px solid rgb(30, 73, 118)",
          }}
        >
          <Grid item container sx={{ mb: "2rem" }}>
            <Typography variant="h2"> Presentation Controls</Typography>
          </Grid>
          <Grid item container justifyContent="space-between">
            <Grid item>
              <Button
                variant="contained"
                onClick={handleReconnect}
                disabled={presentationId.length === 0}
              >
                <Typography variant="button">Reconnect</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleClose} disabled={view}>
                <Typography>Close</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleDisConnection}
                disabled={view}
              >
                <Typography variant="button">Terminate</Typography>
              </Button>
            </Grid>
          </Grid>
          <Grid item container>
            <Form
              handleMessage={handleMessage}
              playerRef={playerRef}
              handleDuration={handleDuration}
              handletoggleMessage={handletoggleMessage}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
