import { Box, Typography } from "@mui/material";
import React from "react";

const Message = ({ own, message }) => {
  return (
    <>
      <Box
        sx={{
          p: 2,

          display: "flex",
          alignItems: own ? "flex-end" : "flex-start",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "80%",

            backgroundColor: own ? "rgb(185,141,59)" : "rgb(0,66,130)",
            borderRadius: "10px",
            p: 2,
          }}
        >
          <Typography sx={{ color: "white" }}>{message?.text} </Typography>
          <Typography sx={{ textAlign: "right", color: "white" }}>
            12:30
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Message;
