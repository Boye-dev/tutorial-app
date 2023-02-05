import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  Drawer,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import SingleMessage from "./SingleMessage";
const Messages = ({ openMessages, setOpenMessages }) => {
  const [openSingle, setOpenSingle] = useState(false);
  return (
    <>
      <Drawer
        anchor={"right"}
        open={openMessages}
        onClose={() => setOpenMessages(false)}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: "100%", md: "500px" },
            backgroundColor: "white",
          },
        }}
      >
        <Box sx={{ position: "sticky", top: "0", backgroundColor: "white" }}>
          <Box
            sx={{
              paddingTop: "9%",
              pl: 3,
              pr: 3,
              pb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: "rgb(0,66,130)",
                fontWeight: "700",
                fontSize: "30px",
              }}
            >
              Messages
            </Typography>
            <Close
              onClick={() => setOpenMessages(false)}
              sx={{
                fontSize: "30px",
                color: "rgb(0,66,130)",
                cursor: "pointer",
              }}
            />
          </Box>
          <Divider />
        </Box>
        {[1, 2, 4, 5, 67, 7, 12, 3, 45, 56, 67, 8].map(() => {
          return (
            <Box
              sx={{
                cursor: "pointer",
                ":hover": {
                  backgroundColor: "rgba(128, 128, 128, 0.452)",
                },
              }}
              onClick={() => {
                setOpenMessages(false);
                setOpenSingle(true);
              }}
            >
              <Box sx={{ mt: 2, pl: 3, pr: 3, mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  <Box sx={{ width: "50px" }}>
                    <Box
                      sx={{
                        border: "2px solid black",
                        borderRadius: "100%",
                        width: "50px",
                        height: "50px",
                        color: "black",
                      }}
                    ></Box>
                  </Box>
                  <Box sx={{ pl: 2, width: `calc(100% - (60px + 15%))` }}>
                    <Typography
                      sx={{
                        color: "grey",
                        fontSize: "14px",
                        fontWeight: "700",
                      }}
                    >
                      Oyelola Adeboye
                    </Typography>
                    <Typography sx={{ fontSize: "11px", color: "grey" }}>
                      Lorem ipsubnd uidehjdjsklhgiiuidehjdjsklhgii
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      pl: 2,
                      width: "calc(100% - (60px + (100% - (60px + 15%))))",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "9px", md: "11px" },
                        color: "grey",
                      }}
                    >
                      Just Now
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider />
            </Box>
          );
        })}
      </Drawer>
      <SingleMessage openSingle={openSingle} setOpenSingle={setOpenSingle} />
    </>
  );
};

export default Messages;
