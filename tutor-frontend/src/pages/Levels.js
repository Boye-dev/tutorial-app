import { Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";
import svg from "../assets/images/randomSvg.png";
const Levels = () => {
  const navigate = useNavigate();
  const levels = [
    { level: "100", color: "yellow" },
    { level: "200", color: "green" },
    { level: "300", color: "blue" },
    { level: "400", color: "orange" },
  ];
  return (
    <>
      <Box sx={{ mt: "100px", ml: 5, mr: 5, width: "100%" }}>
        <TextField sx={{ width: { xs: "100%", md: "50%" }, mb: 5 }} />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-evenly",
          }}
          //   spacing={{ xs: 0, md: 2 }}
        >
          {levels.map((item) => {
            return (
              <Box
                onClick={() => navigate(`${item.level}/courses`)}
                sx={{
                  width: { xs: "100%", md: "300px" },
                  boxShadow: "none",
                  transition: "box-shadow 0.2s",
                  height: "250px",
                  borderRadius: "8px",
                  backgroundColor: item.color,
                  mb: 5,
                  ":hover": {
                    cursor: "pointer",
                    boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
                  },
                }}
              >
                <Box sx={{ padding: "15%" }}>
                  <Typography
                    sx={{ color: "white", fontSize: "40px", fontWeight: "700" }}
                  >
                    {item.level}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <img src={svg} alt="" style={{ width: "70%" }} />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default Levels;
