import React, { useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
let presentationConnection;
const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    let connectionIdx = 0;
    function addConnection(connection) {
      connection.connectionId = ++connectionIdx;
      console.log(connectionIdx);
      presentationConnection = connection;
      const player = playerRef.current ? playerRef.current : null;
      connection.addEventListener("message", function (event) {
        const response = JSON.parse(event.data);
        if (response.message) {
          player.src(response.message);
        } else if (response.seekData) {
          player.currentTime(response.seekData);
        } else if (response.volumeData) {
          if (player.muted()) {
            player.muted(false);
          }
          player.volume(response.volumeData);
        } else {
          switch (response.controlMessage) {
            case "play":
              player.play();
              break;
            case "pause":
              player.pause();
              break;
            case "mute":
              player.muted(true);
              break;
            case "unmute":
              player.muted(false);
              break;
            default:
              break;
          }
        }
        console.log(response);
      });
    }

    if (navigator.presentation.receiver) {
      navigator.presentation.receiver.connectionList.then((list) => {
        list.connections.map((connection) => addConnection(connection));
        list.addEventListener("connectionavailable", function (event) {
          addConnection(event.connection);
        });
      });
    }
  }, []);

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
        onReady && onReady(player, presentationConnection);
      }));
      player.fill(true);
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

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoJS;
