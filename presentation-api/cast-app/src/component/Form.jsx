import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Grid, Typography } from "@mui/material";
export default function Form({ playerRef, handleMessage }) {
  const [vSrc, setSrc] = useState("");
  const handleSubmit = () => {
    if (vSrc) {
      if (playerRef.current) {
        const player = playerRef.current;
        player.src(vSrc);
      }
      handleMessage(vSrc);
      setSrc("");
    }
  };
  return (
    <Grid
      container
      alignItems="center"
      sx={{ mt: "2rem" }}
      justifyContent="space-around"
    >
      <Grid item>
        <TextField
          label="Video Source"
          type="text"
          value={vSrc}
          onChange={(e) => setSrc(e.target.value)}
          variant="outlined"
          borderColor="white"
        />
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={handleSubmit} sx={{ ml: "2rem" }}>
          <Typography variant="button">Submit</Typography>
        </Button>
      </Grid>
    </Grid>
  );
}
