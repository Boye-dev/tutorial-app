import React, { useState } from "react";
import { Box, Typography, Divider, Drawer } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import AddTutorial from "./AddTutorial";
import AuthService from "../auth_service";
const UpcomingTutorials = ({
  setOpenUpcoming,
  openUpcoming,
  data,
  refetchTutorial,
}) => {
  const [openAddTutorial, setAddTutorial] = useState(false);

  const { getCurrentUser } = AuthService;

  return (
    <>
      <Drawer
        anchor={"left"}
        open={openUpcoming}
        onClose={() => setOpenUpcoming(false)}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: "100%", md: "400px" },
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
        {data?.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography>No Upcoming Tutorials</Typography>
          </Box>
        ) : (
          data?.map((item) => {
            const date = new Date(item.date);
            return (
              <Box sx={{}}>
                <Box sx={{ p: 3 }}>
                  <Typography
                    sx={{ fontSize: "13px", fontWeight: "600", color: "black" }}
                  >
                    Title- {item.title}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "13px", fontWeight: "600", color: "black" }}
                  >
                    Description- {item.description}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "13px", fontWeight: "600", color: "black" }}
                  >
                    Date- {date.getDate()}/{date.getMonth()}/
                    {date.getFullYear()} {item.startTime} - {item.endTime}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "13px", fontWeight: "600", color: "black" }}
                  >
                    Type - {item.type}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "13px", fontWeight: "600", color: "black" }}
                  >
                    Venue - {item.venue}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "13px", fontWeight: "600", color: "black" }}
                  >
                    Tutor - {item.tutorId.lastname} {item.tutorId.firstname}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1, mt: 1 }} />
              </Box>
            );
          })
        )}
        <AddTutorial
          refetchTutorial={refetchTutorial}
          openAddTutorial={openAddTutorial}
          setAddTutorial={setAddTutorial}
        />
        {getCurrentUser()?.role === "Tutor" && (
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
