import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import { Box, CssBaseline, Container } from "@mui/material";

const WithNavbar = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />

      <Outlet />
    </Box>
  );
};

export default WithNavbar;
