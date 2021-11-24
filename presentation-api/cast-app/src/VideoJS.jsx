import React, { useState, useEffect, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Presentation from "./Presentation";
import { Grid, Typography, Button } from "@mui/material";

const presentationRequest = new PresentationRequest([
  "https://hungry-bohr-e8dad0.netlify.app/",
]);
// Make this presentation the default one when using the "Cast" browser menu.
navigator.presentation.defaultRequest = presentationRequest;
let presentationConnection;

const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const [view, setView] = useState(true);

  const { options, onReady } = props;
  const [presentationId, setPresentation] = useState("");

  const handleView = useCallback(
    (value) => {
      if (value) {
        setView(value);
      } else {
        setView(!view);
      }
    },
    [view]
  );

  const handleConnection = () => {
    presentationRequest
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
      presentationRequest
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

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
        onReady && onReady(player);
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
    presentationRequest.addEventListener(
      "connectionavailable",
      function (event) {
        presentationConnection = event.connection;

        setPresentation(presentationConnection.id);
        presentationConnection.addEventListener("close", function () {
          console.log("> Connection closed.");
          handleView();
        });
        presentationConnection.addEventListener("terminate", function () {
          console.log("> Connection terminated.");
          handleView();
          setPresentation("");
        });
        presentationConnection.addEventListener("message", function (event) {
          console.log("> " + event.data);
        });
      }
    );
  }, [handleView]);

  return (
    <Grid container>
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
        <Grid item container>
          <Typography variant="h2">Controls</Typography>
        </Grid>
        <Grid item container direction="column">
          <Grid item lg={8}>
            <div data-vjs-player>
              <video
                ref={videoRef}
                className="video-js vjs-big-play-centered"
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              onClick={handleConnection}
              disabled={!view}
              sx={{ height: "2rem" }}
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
          presentationRequest={presentationRequest}
          presentationConnection={presentationConnection}
          presentationId={presentationId}
        />
      </Grid>
    </Grid>
  );
};

export default VideoJS;
