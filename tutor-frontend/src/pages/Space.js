import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import svg from "../assets/images/randomSvg.png";
import ChatIcon from "@mui/icons-material/Chat";
import classes from "../styles/space.module.css";
import SendIcon from "@mui/icons-material/Send";
import UpcomingTutorials from "../components/UpcomingTutorials";
import { Add, CalendarToday } from "@mui/icons-material";
import AddTutorial from "../components/AddTutorial";

const Space = () => {
  const { level, course, courseId } = useParams();
  const [openUpcoming, setOpenUpcoming] = useState(false);
  const [openAddTutorial, setAddTutorial] = useState(false);
  const role = "Tutor";

  return (
    <>
      <Box
        sx={{
          width: "100%",
          mt: { xs: "250px !important", md: "110px !important" },
          margin: { xs: "0 5%", md: "0 10%" },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%" },
            display: "flex",
            alignItems: "flex-end",
            pl: 5,
            pb: 5,
            pt: 5,
            mb: 5,
            justifyContent: "space-between",
            height: { xs: "250px", md: "300px" },
            borderRadius: "8px",
            backgroundColor: "green",
            boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "white",
                fontSize: {
                  lg: 50,
                  md: 50,
                  sm: 30,
                  xs: 30,
                },
                fontWeight: "700",
              }}
            >
              {course.replace("-", " ").toLocaleUpperCase()}
            </Typography>
            <Typography
              sx={{ color: "white", fontSize: "15px", fontWeight: "400" }}
            >
              {level} Level
            </Typography>
          </Box>
          <Box className={classes.topBody}></Box>
        </Box>

        <Box sx={{ display: "flex", mb: 5 }}>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: "30%",
              border: "1px solid grey",
              borderRadius: "8px",
              position: "sticky",
              top: "80px",
              height: "100%",
              p: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "700",
                color: "black",
                pb: 2,
              }}
            >
              Upcoming Tutorials
            </Typography>
            {[1, 2, 3].map(() => {
              return (
                <Box>
                  <Typography sx={{ fontSize: "13px", color: "grey" }}>
                    Introduction To Math
                  </Typography>
                  <Typography sx={{ fontSize: "13px", color: "grey" }}>
                    In this Tutorial we will be taking a brief description on
                    math
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
                  <Divider sx={{ mb: 1, mt: 1 }} />
                </Box>
              );
            })}
            <Box
              sx={{
                display: "flex",
                justifyContent: role === "Tutor" ? "space-between" : "flex-end",
                mt: 1,
                alignItems: "center",
              }}
            >
              {role === "Tutor" && (
                <Tooltip title="Add Tutorial">
                  <Box
                    onClick={() => setAddTutorial(true)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "100%",
                      p: 1,
                      boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
                      cursor: "pointer",
                    }}
                  >
                    <Add />
                  </Box>
                </Tooltip>
              )}

              <Button
                onClick={() => setOpenUpcoming(true)}
                variant="text"
                color="primary"
              >
                <Typography>Show More</Typography>
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "70%" },
              cursor: "pointer",
              pl: { xs: 0, md: 3 },
              pr: { xs: 0, md: 3 },
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "80px",
                borderRadius: "8px",
                mb: 3,
                boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(184, 182, 182, 0.452)",
                p: 3,
              }}
            >
              <AccountCircleIcon
                sx={{ fontSize: "50px", color: "rgb(0,66,130)" }}
              />
              <Typography sx={{ pl: 3, color: "grey" }}>
                Say something to the class
              </Typography>
            </Box>
            {[1, 2, 3].map(() => {
              return (
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                      border: "1px solid grey",
                      width: "100%",
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
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
                            color: "black",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          Oyelola Adeboye •{" "}
                          <span style={{ color: "rgb(0,66,130)" }}>Tutor</span>
                        </Typography>{" "}
                        <Typography
                          sx={{
                            pl: 2,
                            color: "grey",
                            fontSize: "11px",
                          }}
                        >
                          Jan 21 2022
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ pl: 1 }}>
                      <Typography>Helo</Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      borderBottom: "1px solid grey",
                      borderRight: "1px solid grey",
                      borderLeft: "1px solid grey",
                      width: "100%",
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ChatIcon
                        sx={{ fontSize: "25px", color: "rgb(0,66,130)" }}
                      />
                      <Typography
                        sx={{ pl: 2, fontWeight: "500", fontSize: "18px" }}
                      >
                        1 class comment
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mt: 3 }}>
                      <Box
                        sx={{
                          border: "2px solid black",
                          borderRadius: "100%",
                          width: "50px",
                          height: "50px",
                          color: "black",
                        }}
                      ></Box>
                      <Box sx={{ width: "90%" }}>
                        <Box sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              pl: 2,
                              color: "black",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            Oyelola Adeboye •{" "}
                            <span style={{ color: "rgb(0,66,130)" }}>
                              Tutor
                            </span>
                          </Typography>{" "}
                          <Typography
                            sx={{
                              pl: 2,
                              color: "grey",
                              fontSize: "13px",
                            }}
                          >
                            Jan 21 2022
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            pl: 2,
                            color: "grey",
                            fontSize: "14px",
                          }}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Nullam lacinia, mi euismod feugiat tincidunt,
                          nibh velit efficitur velit, vel gravida velit metus eu
                          nunc. Proin ut semper sapien. Sed condimentum, libero
                          a ullamcorper malesuada, libero dolor porttitor
                          ligula, sit amet faucibus nisl lectus eu sapien.
                          Suspendisse eget libero id dui feugiat accumsan.
                          Aliquam erat volutpat. Nunc euismod mauris id nulla
                          commodo, ut aliquet purus commodo. Integer bibendum
                          varius sem, at placerat turpis facilisis eget.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      borderBottom: "1px solid grey",
                      borderRight: "1px solid grey",
                      borderLeft: "1px solid grey",
                      borderBottomLeftRadius: "8px",
                      borderBottomRightRadius: "8px",
                      width: "100%",
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", mt: 3 }}>
                      <Box
                        sx={{
                          border: "2px solid black",
                          borderRadius: "100%",
                          width: "50px",
                          height: "50px",
                          color: "black",
                        }}
                      ></Box>
                      <Box sx={{ width: "95%", pl: "5%" }}>
                        <TextField
                          placeholder="Add Comment"
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <IconButton>
                                <SendIcon sx={{ color: "rgb(0,66,130)" }} />
                              </IconButton>
                            ),
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box
          onClick={() => setOpenUpcoming(true)}
          sx={{
            position: "fixed",
            cursor: "pointer",
            left: "0",
            top: "70%",
            width: "40px",
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "center",
            height: "50px",
            boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
            backgroundColor: "rgb(0,66,130)",
            zIndex: "200",
            borderTopRightRadius: "30%",
            borderBottomRightRadius: "30%",
          }}
        >
          <CalendarToday sx={{ fontSize: "25px", color: "rgb(185,141,59)" }} />
        </Box>
        <UpcomingTutorials
          openUpcoming={openUpcoming}
          setOpenUpcoming={setOpenUpcoming}
        />
        <AddTutorial
          openAddTutorial={openAddTutorial}
          setAddTutorial={setAddTutorial}
        />
      </Box>
    </>
  );
};

export default Space;
