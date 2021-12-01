import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Slider,
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
import DeleteIcon from "@mui/icons-material/Delete";
import Form from "./Form";

export default function Presentation({
  playerRef,
  handleView,
  view,
  presentationConnection,
  presentationRequest,
  presentationId,
  currentTime,
  index,
  handleDelete,
}) {
  const [play, setPlay] = useState(true);
  const [volume, setVolume] = useState(40);
  const [mute, setMute] = useState(true);

  useEffect(() => {
    const value = volume / 100;
    if (
      presentationConnection &&
      presentationConnection.state &&
      presentationConnection.state === "connected"
    ) {
      if (value === 0) {
        presentationConnection.send(JSON.stringify({ controlMessage: "mute" }));
        setMute(false);
      } else {
        presentationConnection.send(JSON.stringify({ volumeData: value }));
      }
    }
  }, [volume, presentationConnection]);

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
    console.log(presentationId);
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

  const handleVolume = (event, newValue) => {
    setVolume(newValue);
  };

  const timeFormater = (time) => {
    return new Date(time * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
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
        <Grid item container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3">{`Controls ${index}`}</Typography>
          </Grid>
          <Grid item>
            <IconButton
              variant="contained"
              onClick={handleDelete}
              sx={{ backgroundColor: "red" }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item container sx={{ mt: "2em" }} justifyContent="space-around">
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
                sx={{ width: 200 }}
              />
              <VolumeUp />
            </Stack>
          </Grid>
          <Grid item>
            <Typography variant="h5">{timeFormater(currentTime)}</Typography>
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
            <Typography variant="h3">
              {`Presentation Controls ${index}`}
            </Typography>
          </Grid>
          <Grid item container justifyContent="space-around">
            <Grid item>
              <Button
                variant="contained"
                onClick={handleReconnect}
                disabled={
                  (presentationConnection &&
                    presentationConnection.state &&
                    presentationConnection.state === "connected") ||
                  presentationId.length === 0
                }
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
            <Form handleMessage={handleMessage} playerRef={playerRef} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
