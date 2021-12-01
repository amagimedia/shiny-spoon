import React from "react";
import VideoJS from "./VideoJS";

export default function App() {
  const playerRef = React.useRef(null);
  const videoJsOptions = {
    // lookup the options in the docs for more options
    responsive: true,
    fluid: true,
    poster:
      "https://mango.blender.org/wp-content/uploads/2012/09/tos-poster-540x800.jpg",
    sources: [
      {
        src: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };
  const handlePlayerReady = (player, presentationConnection) => {
    playerRef.current = player;

    // you can handle player events here
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
      if (presentationConnection) {
        console.log("message sent");
        presentationConnection.send(JSON.stringify({ currentTime: `stop` }));
      }
    });
    player.on("play", () => {
      console.log("start playing");
      if (presentationConnection) {
        console.log("message sent");
        presentationConnection.send(
          JSON.stringify({ currentTime: `${Math.floor(player.currentTime())}` })
        );
      }
    });

    player.on("pause", () => {
      if (presentationConnection) {
        console.log("message sent");
        presentationConnection.send(JSON.stringify({ currentTime: `stop` }));
      }
    });

    player.on("ended", () => {
      if (presentationConnection) {
        console.log("message sent");
        presentationConnection.send(JSON.stringify({ currentTime: `ended` }));
      }
    });
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
}
