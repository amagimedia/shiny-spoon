import React, { useState } from "react";
import { Button, CssBaseline } from "@mui/material";
import theme from "./theme";
import { ThemeProvider } from "@mui/system";
import VideojsController from "./VideojsController";
import { Grid, Box } from "@mui/material";
import { nanoid } from "nanoid";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Receiver from "./Receiver";

export default function App() {
  const [controller, setController] = useState([{ id: `${nanoid()}` }]);

  const handleContoller = () => {
    setController((prev) => [...prev, { id: `${nanoid()}` }]);
  };

  const deleteController = (value) => {
    setController((prev) => prev.filter((e, index) => index !== value));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Box sx={{ padding: "1rem" }}>
                  <Button
                    variant="contained"
                    onClick={handleContoller}
                    sx={{ mb: "1rem" }}
                  >
                    Create an Controller
                  </Button>
                  <Grid container spacing={2} justifyContent="center">
                    {controller.map((e, index) => (
                      <VideojsController
                        index={index + 1}
                        deleteController={deleteController}
                        key={e.id}
                      />
                    ))}
                  </Grid>
                </Box>
              </>
            }
          />
          <Route path="/receiver" element={<Receiver />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
