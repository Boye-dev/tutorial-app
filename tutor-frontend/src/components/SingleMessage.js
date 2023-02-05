import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Tooltip,
  MenuItem,
  Divider,
  Drawer,
  TextField,
} from "@mui/material";
import { Close, Send } from "@mui/icons-material";
const SingleMessage = ({ openSingle, setOpenSingle }) => {
  return (
    <>
      <Drawer
        anchor={"right"}
        open={openSingle}
        onClose={() => setOpenSingle(false)}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: "100%", md: "450px" },
            backgroundColor: "white",
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: "0",
            backgroundColor: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                border: "2px solid black",
                borderRadius: "100%",
                width: "60px",
                height: "60px",
                color: "black",
              }}
            ></Box>
            <Typography
              sx={{
                color: "grey",
                fontSize: "14px",
                fontWeight: "700",
                pl: 2,
              }}
            >
              Oyelola Adeboye
            </Typography>
          </Box>
          <Close
            onClick={() => setOpenSingle(false)}
            sx={{ fontSize: "30px", color: "rgb(0,66,130)", cursor: "pointer" }}
          />
        </Box>
        <Divider />
        <Box>
          {[1, 2, 4].map(() => {
            return (
              <Box>
                {" "}
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "flex-end",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: "80%",

                      backgroundColor: "rgb(0,66,130)",
                      borderRadius: "10px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "white" }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam lacinia, mi euismod feugiat tincidunt, nibh velit
                      efficitur
                    </Typography>
                    <Typography sx={{ textAlign: "right", color: "white" }}>
                      12:30
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: "80%",

                      backgroundColor: "rgb(185,141,59)",
                      borderRadius: "10px",
                      p: 2,
                    }}
                  >
                    <Typography sx={{ color: "white" }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam lacinia, mi euismod feugiat tincidunt, nibh velit
                      efficitur
                    </Typography>
                    <Typography sx={{ textAlign: "right", color: "white" }}>
                      12:30
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
          <Box
            sx={{
              position: "sticky",
              bottom: "0",
              backgroundColor: "white",
              p: 2,
            }}
          >
            <TextField
              placeholder="Send Message"
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <Send sx={{ color: "rgb(0,66,130)" }} />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SingleMessage;
