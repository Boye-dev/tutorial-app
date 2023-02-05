import React, { useState } from "react";
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
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import AddTutorial from "./AddTutorial";
const UpcomingTutorials = ({ setOpenUpcoming, openUpcoming }) => {
  const [openAddTutorial, setAddTutorial] = useState(false);

  const role = "Tutor";
  return (
    <>
      <Drawer
        anchor={"left"}
        open={openUpcoming}
        onClose={() => setOpenUpcoming(false)}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: "100%", md: "530px" },
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
                color: "rgb(185,141,59)",
                fontWeight: "700",
                fontSize: "30px",
              }}
            >
              Upcoming Tutorials
            </Typography>
            <Close
              onClick={() => setOpenUpcoming(false)}
              sx={{
                fontSize: "30px",
                color: "rgb(185,141,59)",
                cursor: "pointer",
              }}
            />
          </Box>
          <Divider />
        </Box>
        {[1, 2, 4, 5, 67, 7, 12, 3, 45, 56, 67, 8].map(() => {
          return (
            <Box sx={{}}>
              <Box sx={{ p: 3 }}>
                <Typography sx={{ fontSize: "13px", color: "grey" }}>
                  Introduction To Math
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "grey" }}>
                  In this Tutorial we will be taking a brief description on math
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "grey" }}>
                  7pm - 9pm
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "grey" }}>
                  Virtual
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "grey" }}>
                  https://chat.openai.com/chat
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "grey" }}>
                  Tutor - Oyelola Adeboye
                </Typography>
              </Box>
              <Divider sx={{ mb: 1, mt: 1 }} />
            </Box>
          );
        })}
        <AddTutorial
          openAddTutorial={openAddTutorial}
          setAddTutorial={setAddTutorial}
        />
        {role === "Tutor" && (
          <Box
            onClick={() => {
              setAddTutorial(true);
            }}
            sx={{
              position: "fixed",
              bottom: "20px",
              left: "10px",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              borderRadius: "100%",
              width: "40px",
              height: "40px",
              p: 1,
              boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
              cursor: "pointer",
            }}
          >
            <Add />
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default UpcomingTutorials;
