import { Box, Divider, TextField, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import { Star } from "@mui/icons-material";
import SingleMessage from "../components/SingleMessage";
import { useNavigate } from "react-router-dom";
const Tutors = () => {
  const navigate = useNavigate();
  const [openSingle, setOpenSingle] = useState(false);
  const rating = 3;
  const getStars = (rate) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star key={i} sx={{ color: i < rate ? "rgb(185,141,59)" : "grey" }} />
      );
    }
    return stars;
  };

  return (
    <>
      <Box
        sx={{
          mt: { xs: "230px !important", md: "120px !important" },
          margin: { xs: "0 0", md: "0 20%" },
          width: "100%",
        }}
      >
        <TextField
          sx={{
            width: { xs: "100%", md: "70%" },
            mb: 5,
            pl: { xs: 2, md: 0 },
            pr: { xs: 2, md: 0 },
          }}
        />
        <Typography
          sx={{
            color: "rgb(0,66,130)",
            fontSize: "45px",
            pl: 3,
            fontWeight: "400",
          }}
        >
          Tutors
        </Typography>
        <Divider sx={{ backgroundColor: "rgb(185,141,59)", height: "3.5px" }} />
        {[1, 2, 3, 4].map(() => {
          return (
            <Box>
              <Box
                onClick={() => navigate("1")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pt: 2,
                  cursor: "pointer",
                  pb: 2,
                  pl: 1,
                  pr: 1,
                  zIndex: "10",
                  ":hover": {
                    backgroundColor: "rgba(128, 128, 128, 0.452)",
                  },
                }}
              >
                <Box
                  sx={{ width: "50%", display: "flex", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      border: "2px solid black",
                      borderRadius: "100%",
                      width: "50px",
                      height: "50px",
                      color: "black",
                    }}
                  ></Box>
                  <Box>
                    {" "}
                    <Typography
                      sx={{
                        pl: 2,
                        color: "grey",
                        fontSize: "14px",
                        fontWeight: "700",
                      }}
                    >
                      Oyelola Adeboye
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex">
                  <Typography sx={{ pr: 2 }}>{getStars(rating)}</Typography>
                  <Tooltip title="Message">
                    <ChatIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenSingle(true);
                      }}
                      sx={{
                        color: "rgb(0,66,130)",
                        cursor: "pointer",
                        zIndex: "100",
                      }}
                    />
                  </Tooltip>
                </Box>
              </Box>
              <Divider
                sx={{ backgroundColor: "rgb(0,66,130)", height: "1px" }}
              />
            </Box>
          );
        })}
        <SingleMessage openSingle={openSingle} setOpenSingle={setOpenSingle} />
      </Box>
    </>
  );
};

export default Tutors;
