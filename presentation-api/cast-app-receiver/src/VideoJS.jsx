import React, { useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady, handleData } = props;
  const [seekData, setSeekData] = useState(0);
  const [volume, setVolume] = useState(30);

  useEffect(() => {
    let connectionIdx = 0;

    function addConnection(connection) {
      connection.connectionId = ++connectionIdx;
      console.log(connectionIdx);
      connection.addEventListener("message", function (event) {
        const response = JSON.parse(event.data);
        if (response.message) {
          handleData(response);
        } else if (response.seekData) {
          setSeekData(response.seekData);
        } else if (response.volumeData) {
          setVolume(response.volumeData);
        } else {
          const player = playerRef.current ? playerRef.current : null;
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
  }, [handleData]);

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
        onReady && onReady(player);
      }));
      console.log(player);
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
    const player = playerRef.current;
    if (player) {
      player.currentTime(seekData);
    }
  }, [seekData]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.volume(volume);
    }
  }, [volume]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoJS;
