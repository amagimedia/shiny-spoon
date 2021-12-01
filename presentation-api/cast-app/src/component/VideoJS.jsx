import React, { useState, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Presentation from "./Presentation";
import { Grid, Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const VideoJS = ({ options, onReady, index, deleteController }) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const presentationRequest = React.useRef(
    new PresentationRequest(["https://hungry-bohr-e8dad0.netlify.app/"])
  );
  const presentationConnection = React.useRef(null);
  const [view, setView] = useState(true);
  const [presentationId, setPresentation] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [status, setStatus] = useState("");

  const handleView = (value) => {
    setView(value);
  };

  const handleConnection = () => {
    presentationRequest.current
      .start()
      .then((connection) => {
        handleView(false);
        console.log(
          "> Connected to " + connection.url + ", id: " + connection.id
        );
      })
      .catch((error) => {
        handleView(true);
        console.log("> " + error.name + ": " + error.message);
      });
  };

  useEffect(
    () =>
      presentationRequest.current
        .getAvailability()
        .then((availability) => {
          console.log("Available presentation displays: " + availability.value);
          availability.addEventListener("change", function () {
            console.log(
              "> Available presentation displays: " + availability.value
            );
          });
        })
        .catch((error) => {
          console.log(
            "Presentation availability not supported, " +
              error.name +
              ": " +
              error.message
          );
        }),
    []
  );
  const handleCurrentTime = () => {
    setCurrentTime((prev) => prev + 1);
  };
  useEffect(() => {
    let id;
    if (status === "start") {
      id = setInterval(() => {
        handleCurrentTime();
      }, 1000);
    }

    return () => clearInterval(id);
  }, [status]);

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
        onReady && onReady(player);
        console.log(player.currentTime());
      }));
    } else {
      const player = playerRef.current;
      player.src(options.sources);
    }
  }, [options, videoRef, onReady]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);
  useEffect(() => {
    presentationRequest.current.addEventListener(
      "connectionavailable",
      function (event) {
        presentationConnection.current = event.connection;
        console.log(presentationConnection);
        setPresentation(presentationConnection.current.id);
        presentationConnection.current.addEventListener("close", function () {
          console.log("> Connection closed.");
          setView(true);
        });
        presentationConnection.current.addEventListener(
          "terminate",
          function () {
            console.log("> Connection terminated.");
            setView(true);
            setPresentation("");
          }
        );
        presentationConnection.current.addEventListener(
          "message",
          function (event) {
            console.log(JSON.parse(event.data).currentTime);
            const value = JSON.parse(event.data).currentTime;
            if (value === "ended") {
              setStatus("ended");
            } else if (value === "stop") {
              setStatus("ended");
            } else {
              setCurrentTime(Number(value));
              setStatus("start");
            }
          }
        );
      }
    );
  }, []);

  const handleDelete = () => {
    if (presentationConnection.current) {
      presentationConnection.current.terminate();
    }

    deleteController(index - 1);
  };

  return (
    <Grid item lg={6}>
      <Grid container sx={{ mb: "2rem" }}>
        <Grid
          item
          container
          sx={{
            display: view ? "inherit" : "none",
            backgroundColor: "rgb(3 ,30, 60)",
            borderRadius: 5,
            p: "1rem",
            border: "1px solid rgb(30, 73, 118)",
          }}
        >
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
          >
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
          <Grid
            item
            container
            columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
            spacing={2}
            sx={{ p: "5px" }}
          >
            <Grid item lg={10} xs={3} sm={7} md={10}>
              <div data-vjs-player>
                <video
                  ref={videoRef}
                  className="video-js vjs-big-play-centered"
                />
              </div>
            </Grid>
            <Grid item lg={1} xs={1} sm={1} md={1}>
              <Button
                variant="contained"
                onClick={handleConnection}
                disabled={!view}
              >
                <Typography variant="button">Start</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container>
          <Presentation
            playerRef={playerRef}
            handleView={handleView}
            view={view}
            presentationRequest={presentationRequest.current}
            presentationConnection={presentationConnection.current}
            presentationId={presentationId}
            currentTime={currentTime}
            index={index}
            handleDelete={handleDelete}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VideoJS;
