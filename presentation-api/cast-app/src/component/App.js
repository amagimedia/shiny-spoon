import React from "react";
import Container from "@mui/material/Container";
import VideoJS from "./VideoJS"; // point to where the functional component is stored
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import { ThemeProvider } from "@mui/system";

export default function App() {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    // lookup the options in the docs for more options
    autoplay: false,
    controls: true,
    responsive: true,
    height: "525px",
    width: "900px",
    poster:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
    sources: [
      {
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ pt: "1rem", pb: "1rem" }}>
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </Container>
    </ThemeProvider>
  );
}
