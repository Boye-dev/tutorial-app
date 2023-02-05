import { ArrowBack, ChangeCircle, Edit } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const role = "Tutor";
  return (
    <>
      <Box
        sx={{
          pt: 5,
          pl: { xs: 2, md: 20 },
          pr: { xs: 2, md: 20 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
          <ArrowBack
            onClick={() => {
              if (role === "Tutor") {
                navigate(-1);
              } else {
                navigate(-1);
              }
            }}
            sx={{ fontSize: "50px", color: "rgb(0,66,130)", cursor: "pointer" }}
          />
          <Typography
            sx={{
              fontSize: "30px",
              fontWeight: "700",
              color: "rgb(0,66,130)",
              pl: 2,
            }}
          >
            Edit Profile
          </Typography>
        </Box>
        <Box
          sx={{
            display: { xs: "block", md: "" },

            width: { xs: "100%" },
          }}
        >
          <Box
            sx={{
              width: {
                xs: "100%",
              },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                border: "2px solid black",
                borderRadius: "100%",
                width: "250px",
                height: "250px",
                color: "black",
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 5,
              mt: 3,
            }}
          >
            <Edit sx={{ color: "rgb(0,66,130)" }} />
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "300",
                color: "rgb(0,66,130)",
                textAlign: "center",
              }}
            >
              Change Profile Picture
            </Typography>
          </Box>
          <Box
            sx={{
              width: { xs: "100%" },
              textAlign: { xs: "center", md: "center" },
              mt: 5,
            }}
          >
            <TextField
              defaultValue="Oyelola Adeboye"
              label="First Name"
              sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
            />{" "}
            <TextField
              defaultValue="Oyelola Adeboye"
              label="Last Name"
              sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
            />{" "}
            <TextField
              defaultValue="Oyelola Adeboye"
              label="User Name"
              sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
            />{" "}
            <TextField
              defaultValue="Oyelola Adeboye"
              label="Email"
              sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
            />
            <TextField
              defaultValue="Oyelola Adeboye"
              label="Phone Number"
              sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Button
                sx={{
                  mt: 3,
                  mb: 3,
                  width: { xs: "100%", md: "60%" },
                  height: "50px",
                  backgroundColor: "rgb(185,141,59)",
                  transition: "opacity 0.3s",
                  ":hover": {
                    bgcolor: "rgb(185,141,59)",
                    color: "white",
                    opacity: "0.8",
                  },
                  opacity: "1",
                }}
                type="submit"
                variant="contained"
                // onClick={() => setIsStudent(true)}
              >
                <span>Edit Details</span>
              </Button>
            </Box>
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: "700",
                color: "rgb(0,66,130)",
                pl: 2,
                pb: 2,
              }}
            >
              Change Password
            </Typography>
            <TextField
              defaultValue="Oyelola Adeboye"
              label="Old Password"
              sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
            />
            <TextField
              defaultValue="Oyelola Adeboye"
              label="New Password"
              sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
            />
            <TextField
              defaultValue="Oyelola Adeboye"
              label="Confirm New Password"
              sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Button
                sx={{
                  mt: 3,
                  mb: 3,
                  width: { xs: "100%", md: "60%" },
                  height: "50px",
                  backgroundColor: "rgb(0,66,130)",
                  transition: "opacity 0.3s",
                  ":hover": {
                    bgcolor: "rgb(0,66,130)",
                    color: "white",
                    opacity: "0.8",
                  },
                  opacity: "1",
                }}
                type="submit"
                variant="contained"
                // onClick={() => setIsStudent(true)}
              >
                <span>Change Password</span>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
