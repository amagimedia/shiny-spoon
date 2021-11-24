import React from "react";
import VideoJS from "./VideoJS";
import { useState } from "react";

export default function App() {
  const [data, setData] = useState({
    message:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  });

  const playerRef = React.useRef(null);

  const videoJsOptions = {
    // lookup the options in the docs for more options
    autoplay: false,
    controls: false,
    responsive: true,
    fluid: true,
    poster:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",

    sources: [
      {
        src: `${data.message}`,
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // you can handle player events here
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
  };

  const handleData = (response) => {
    setData(response);
  };

  return (
    <div>
      <VideoJS
        options={videoJsOptions}
        onReady={handlePlayerReady}
        handleData={handleData}
      />
    </div>
  );
}
