import React from "react";
import { useState } from "react";
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
import {
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Chat, Logout, Person, Settings } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import classes from "../styles/navbar.module.css";
import Messages from "./Messages";
import AuthService from "../auth_service";

const Navbar = ({ setMobileOpen, mobileOpen }) => {
  const { getCurrentUser, logout } = AuthService;

  const location = useLocation();
  const navigate = useNavigate();

  const { level, course, courseId } = useParams();

  const [openMessages, setOpenMessages] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box>
        <AppBar
          position="fixed"
          sx={{
            width: "100%",
            height: {
              xs:
                location.pathname !== "/student/levels" &&
                location.pathname !== "/student/levels/" &&
                location.pathname !== `/student/levels/${level}/courses` &&
                location.pathname !== `/student/levels/${level}/courses/` &&
                location.pathname !== `/tutor/courses` &&
                location.pathname !== `/tutor/courses/`
                  ? "180px"
                  : "70px",
              md: "70px",
            },
            p: 0,
            m: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "rgb(0,66,130)",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon sx={{ fontSize: "30px" }} />
            </IconButton>
            {location.pathname !== "/student/levels" &&
              location.pathname !== "/student/levels/" &&
              location.pathname !== `/student/levels/${level}/courses` &&
              location.pathname !== `/student/levels/${level}/courses/` &&
              location.pathname !== `/tutor/courses` &&
              location.pathname !== `/tutor/courses/` && (
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    width: "30%",
                    alignItems: "center",
                    height: "70px",
                    justifyContent: "space-around",
                  }}
                >
                  <Box
                    onClick={() => {
                      if (getCurrentUser()?.role === "Tutor") {
                        navigate(`/tutor/courses`);
                      } else {
                        navigate(`/student/levels/`);
                      }
                    }}
                    sx={{
                      height: "100%",

                      transition: "border-bottom 0.01s",
                      borderBottomRightRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      cursor: "pointer",
                      p: 2,
                      ":hover": {
                        borderBottom: "5px solid rgb(185,141,59)",
                        // backgroundColor: "rgba(128, 128, 128, 0.452)",
                        color: "rgb(185,141,59)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Typography sx={{ fontSize: "15px", fontWeight: "700" }}>
                        Home
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    onClick={() => {
                      if (getCurrentUser()?.role === "Tutor") {
                        navigate(`/tutor/courses/${course}/${courseId}/space`);
                      } else {
                        navigate(
                          `/student/levels/${level}/courses/${course}/${courseId}/space`
                        );
                      }
                    }}
                    className={
                      location.pathname ===
                      `/student/levels/${level}/courses/${course}/${courseId}/space`
                        ? classes.activeBars
                        : location.pathname ===
                            `/tutor/courses/${course}/${courseId}/space` &&
                          classes.activeBars
                    }
                    sx={{
                      height: "100%",

                      transition: "border-bottom 0.01s",
                      borderBottomRightRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      cursor: "pointer",
                      p: 2,
                      ":hover": {
                        borderBottom: "5px solid rgb(185,141,59)",
                        backgroundColor: "rgba(128, 128, 128, 0.452)",
                        color: "rgb(185,141,59)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Typography sx={{ fontSize: "15px", fontWeight: "700" }}>
                        Space
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    onClick={() => {
                      if (getCurrentUser()?.role === "Tutor") {
                        navigate(`/tutor/courses/${course}/${courseId}/tutors`);
                      } else {
                        navigate(
                          `/student/levels/${level}/courses/${course}/${courseId}/tutors`
                        );
                      }
                    }}
                    className={
                      location.pathname ===
                      `/student/levels/${level}/courses/${course}/${courseId}/tutors`
                        ? classes.activeBars
                        : location.pathname ===
                            `/tutor/courses/${course}/${courseId}/tutors` &&
                          classes.activeBars
                    }
                    sx={{
                      height: "100%",

                      transition: "border-bottom 0.01s",
                      borderBottomRightRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      cursor: "pointer",
                      p: 2,
                      ":hover": {
                        borderBottom: "5px solid rgb(185,141,59)",
                        backgroundColor: "rgba(128, 128, 128, 0.452)",
                        color: "rgb(185,141,59)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Typography sx={{ fontSize: "15px", fontWeight: "700" }}>
                        Tutors
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    onClick={() => {
                      if (getCurrentUser()?.role === "Tutor") {
                        navigate(
                          `/tutor/courses/${course}/${courseId}/resources`
                        );
                      } else {
                        navigate(
                          `/student/levels/${level}/courses/${course}/${courseId}/resources`
                        );
                      }
                    }}
                    className={
                      location.pathname ===
                      `/student/levels/${level}/courses/${course}/${courseId}/resources`
                        ? classes.activeBars
                        : location.pathname ===
                            `/tutor/courses/${course}/${courseId}/resources` &&
                          classes.activeBars
                    }
                    sx={{
                      height: "100%",

                      transition: "border-bottom 0.01s",
                      borderBottomRightRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      cursor: "pointer",
                      p: 2,
                      ":hover": {
                        borderBottom: "5px solid rgb(185,141,59)",
                        backgroundColor: "rgba(128, 128, 128, 0.452)",
                        color: "rgb(185,141,59)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Typography sx={{ fontSize: "15px", fontWeight: "700" }}>
                        Resources
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            <Box pt={1}>
              <Tooltip title="Profile">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (getCurrentUser()?.role === "Tutor") {
                      navigate(`/tutor/profile`);
                    } else {
                      navigate(`/student/profile`);
                    }
                  }}
                >
                  <Box
                    sx={
                      {
                        // border: "2px solid black",
                        // borderRadius: "100%",
                        // width: "50px",
                        // height: "50px",
                        // color: "black",
                      }
                    }
                  >
                    <img
                      style={{
                        borderRadius: "100%",
                        width: "50px",
                        height: "50px",
                      }}
                      src={getCurrentUser()?.profilePhoto}
                      alt="profile"
                    />
                  </Box>
                  <Typography
                    sx={{
                      pl: 2,
                      color: "white",
                    }}
                  >
                    Hello {getCurrentUser()?.firstname}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          </Toolbar>
          {location.pathname !== "/student/levels" &&
            location.pathname !== "/student/levels/" &&
            location.pathname !== `/student/levels/${level}/courses` &&
            location.pathname !== `/student/levels/${level}/courses/` &&
            location.pathname !== `/tutor/courses` &&
            location.pathname !== `/tutor/courses/` && (
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  width: "100%",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "space-around",
                }}
              >
                <Box
                  onClick={() => {
                    if (getCurrentUser()?.role === "Tutor") {
                      navigate(`/tutor/courses`);
                    } else {
                      navigate(`/student/levels/`);
                    }
                  }}
                  sx={{
                    height: "100%",

                    transition: "border-bottom 0.01s",
                    borderBottomRightRadius: "4px",
                    borderBottomLeftRadius: "4px",
                    cursor: "pointer",
                    p: 2,
                    ":hover": {
                      borderBottom: "5px solid rgb(185,141,59)",
                      // backgroundColor: "rgba(128, 128, 128, 0.452)",
                      color: "rgb(185,141,59)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography sx={{ fontSize: "15px" }}>Home</Typography>
                  </Box>
                </Box>

                <Box
                  onClick={() => {
                    if (getCurrentUser()?.role === "Tutor") {
                      navigate(`/tutor/courses/${course}/${courseId}/space`);
                    } else {
                      navigate(
                        `/student/levels/${level}/courses/${course}/${courseId}/space`
                      );
                    }
                  }}
                  className={
                    location.pathname ===
                    `/student/levels/${level}/courses/${course}/${courseId}/space`
                      ? classes.activeBarsSmall
                      : location.pathname ===
                          `/tutor/courses/${course}/${courseId}/space` &&
                        classes.activeBarsSmall
                  }
                  sx={{
                    height: "100%",

                    transition: "border-bottom 0.01s",
                    borderBottomRightRadius: "4px",
                    borderBottomLeftRadius: "4px",
                    cursor: "pointer",
                    p: 2,
                    ":hover": {
                      borderBottom: "5px solid rgb(185,141,59)",
                      // backgroundColor: "rgba(128, 128, 128, 0.452)",
                      color: "rgb(185,141,59)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography sx={{ fontSize: "15px" }}>Space</Typography>
                  </Box>
                </Box>

                <Box
                  onClick={() => {
                    if (getCurrentUser()?.role === "Tutor") {
                      navigate(`/tutor/courses/${course}/${courseId}/tutors`);
                    } else {
                      navigate(
                        `/student/levels/${level}/courses/${course}/${courseId}/tutors`
                      );
                    }
                  }}
                  className={
                    location.pathname ===
                    `/student/levels/${level}/courses/${course}/${courseId}/tutors`
                      ? classes.activeBarsSmall
                      : location.pathname ===
                          `/tutor/courses/${course}/${courseId}/tutors` &&
                        classes.activeBarsSmall
                  }
                  sx={{
                    height: "100%",

                    transition: "border-bottom 0.01s",
                    borderBottomRightRadius: "4px",
                    borderBottomLeftRadius: "4px",
                    cursor: "pointer",
                    p: 2,
                    ":hover": {
                      borderBottom: "5px solid rgb(185,141,59)",
                      //   backgroundColor: "rgba(128, 128, 128, 0.452)",
                      color: "rgb(185,141,59)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography sx={{ fontSize: "15px" }}>Tutors</Typography>
                  </Box>
                </Box>

                <Box
                  onClick={() => {
                    if (getCurrentUser()?.role === "Tutor") {
                      navigate(
                        `/tutor/courses/${course}/${courseId}/resources`
                      );
                    } else {
                      navigate(
                        `/student/levels/${level}/courses/${course}/${courseId}/resources`
                      );
                    }
                  }}
                  className={
                    location.pathname ===
                    `/student/levels/${level}/courses/${course}/${courseId}/resources`
                      ? classes.activeBarsSmall
                      : location.pathname ===
                          `/tutor/courses/${course}/${courseId}/resources` &&
                        classes.activeBarsSmall
                  }
                  sx={{
                    height: "100%",

                    transition: "border-bottom 0.01s",
                    borderBottomRightRadius: "4px",
                    borderBottomLeftRadius: "4px",
                    cursor: "pointer",
                    p: 2,
                    ":hover": {
                      borderBottom: "5px solid rgb(185,141,59)",
                      //   backgroundColor: "rgba(128, 128, 128, 0.452)",
                      color: "rgb(185,141,59)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography sx={{ fontSize: "15px" }}>Resources</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          <Drawer
            anchor={"left"}
            open={open}
            onClose={() => setOpen(false)}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: "300px",
                backgroundColor: "white",
              },
            }}
          >
            <Box sx={{ paddingTop: "9%" }}>
              <Box
                onClick={() => {
                  if (getCurrentUser()?.role === "Tutor") {
                    navigate(`/tutor/profile`);
                  } else {
                    navigate(`/student/profile`);
                  }
                }}
                sx={{
                  p: "2%",
                  mb: 2,
                  cursor: "pointer",
                  backgroundColor: "none",
                  borderTopRightRadius: "40px",
                  borderBottomRightRadius: "40px",
                  transition: "background-color 0.1s ",
                  ":hover": {
                    backgroundColor: "rgba(128, 128, 128, 0.452)",
                    borderTopRightRadius: "40px",
                    borderBottomRightRadius: "40px",
                  },
                }}
              >
                <Tooltip title="Profile">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <img
                        style={{ borderRadius: "100%" }}
                        width="50px"
                        height="50px"
                        src={getCurrentUser()?.profilePhoto}
                        alt="profile"
                      />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          pl: 2,
                          color: "black",
                        }}
                      >
                        {getCurrentUser()?.firstname}{" "}
                        {getCurrentUser()?.lastname}
                      </Typography>{" "}
                      <Typography
                        sx={{
                          pl: 2,
                          color: "grey",
                          fontSize: "10px",
                        }}
                      >
                        {getCurrentUser()?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ paddingTop: "9%", pl: "5%", mb: 1, pr: 2 }}>
              <Box
                onClick={() => {
                  if (getCurrentUser()?.role === "Tutor") {
                    navigate(`/tutor/profile`);
                  } else {
                    navigate(`/student/profile`);
                  }
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  mb: 3,
                  cursor: "pointer",
                  backgroundColor: "none",
                  borderTopRightRadius: "40px",
                  borderBottomRightRadius: "40px",
                  transition: "background-color 0.1s ",
                }}
              >
                <Box sx={{}}>
                  <Person sx={{ fontSize: "35px" }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      pl: 1,
                      color: "black",
                    }}
                  >
                    Profile
                  </Typography>{" "}
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ paddingTop: "9%", pl: "5%", mb: 1, pr: 2 }}>
              <Box
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  mb: 3,
                  cursor: "pointer",
                  backgroundColor: "none",
                  borderTopRightRadius: "40px",
                  borderBottomRightRadius: "40px",
                  transition: "background-color 0.1s ",
                }}
              >
                <Box sx={{}}>
                  <Logout sx={{ fontSize: "35px" }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      pl: 1,
                      color: "black",
                    }}
                  >
                    Logout
                  </Typography>{" "}
                </Box>
              </Box>
            </Box>
          </Drawer>
          {/* <Divider sx={{ backgroundColor: "rgb(185,141,59)", height: "4px" }} /> */}
        </AppBar>
        <Box
          onClick={() => setOpenMessages(true)}
          sx={{
            position: "fixed",
            cursor: "pointer",
            right: "0",
            top: "50%",
            width: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "50px",
            boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
            backgroundColor: "rgb(185,141,59)",
            zIndex: "200",
            borderTopLeftRadius: "30%",
            borderBottomLeftRadius: "30%",
          }}
        >
          <Chat sx={{ fontSize: "25px", color: "rgb(0,66,130)" }} />
        </Box>
        <Messages
          openMessages={openMessages}
          setOpenMessages={setOpenMessages}
        />
      </Box>
    </>
  );
};

export default Navbar;
