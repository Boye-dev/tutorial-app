import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import classes from "../styles/space.module.css";
import SendIcon from "@mui/icons-material/Send";
import UpcomingTutorials from "../components/UpcomingTutorials";
import { Add, CalendarToday } from "@mui/icons-material";
import AddTutorial from "../components/AddTutorial";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AuthService from "../auth_service";
import api from "../api/api";
import TutorialAppContext from "../context/TutorialAppContext";

const Space = () => {
  const { course, courseId } = useParams();
  const [openUpcoming, setOpenUpcoming] = useState(false);
  const [openAddTutorial, setAddTutorial] = useState(false);
  const [something, setSomething] = useState("");
  const [openReplies, setOpenReplies] = useState({});
  const [textfieldValues, setTextfieldValues] = useState(null);
  const [showSomething, setShowSomething] = useState(false);
  const queryClient = useQueryClient();

  const { setIsSnackOpen, setSnackMessage, setSnackColor } =
    useContext(TutorialAppContext);
  const handleChange = (event, id) => {
    setTextfieldValues({
      ...textfieldValues,
      [id]: event.target.value,
    });
  };

  const handleSomethingChange = (event) => {
    setSomething(event.target.value);
  };
  const { getCurrentUser } = AuthService;
  const handleOpenReplies = (spaceId) => {
    setOpenReplies({
      ...openReplies,
      [spaceId]: !openReplies[spaceId],
    });
  };
  function isNotWhitespace(value) {
    return /\S/.test(value);
  }
  const replySpace = async ({ id, data }) => {
    return api.post(`/api/reply/${id}`, data).then((res) => res.data);
  };
  const { mutate, isLoading: isReplying } = useMutation(replySpace, {
    onError: (error) => {
      setSnackColor("red");
      setIsSnackOpen(true);
      setSnackMessage(error.response.data.error);
    },
    onSuccess: (data) => {
      setSnackColor("green");
      setIsSnackOpen(true);
      setSnackMessage("Replied Successfully");
      queryClient.refetchQueries(`get-space`);
    },
  });
  const onReply = (id, comment) => {
    if (comment !== "" && isNotWhitespace(comment)) {
      setTextfieldValues({
        ...textfieldValues,
        [id]: "",
      });
      const data = {
        userId: getCurrentUser()?._id,
        comment: comment,
      };

      mutate({ id, data });
    }
  };
  const postSpace = async ({ id, data }) => {
    return api.post(`/api/addSpace`, data).then((res) => res.data);
  };
  const { mutate: spaceMutate, isLoading: isPosting } = useMutation(postSpace, {
    onError: (error) => {
      setSnackColor("red");
      setIsSnackOpen(true);
      setSnackMessage(error.response.data.error);
    },
    onSuccess: (data) => {
      setSnackColor("green");
      setIsSnackOpen(true);
      setSnackMessage("Posted Successfully");
      queryClient.refetchQueries(`get-space`);
    },
  });
  const onPost = () => {
    if (something !== "" && isNotWhitespace(something)) {
      setSomething("");
      const data = {
        userId: getCurrentUser()?._id,
        comment: something,
        courseId: courseId,
      };

      spaceMutate({ data });
    }
  };

  const [data, setData] = useState(null);
  const [mainCourse, setCourse] = useState(null);
  const [tutorials, setTutorials] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingCourse, setLoadingCourse] = useState(true);
  const [isLoadingTutorial, setLoadingTutorial] = useState(true);
  const { status } = useQuery("get-space", () => {
    return api.get(`/api/spaces/${courseId}`).then((data) => {
      setData(data.data);

      setLoading(false);
      return data;
    });
  });

  const { status: courseStatus } = useQuery("get-course-by-id", () => {
    return api.get(`/api/course/${courseId}`).then((data) => {
      setCourse(data.data);
      setLoadingCourse(false);
      return data;
    });
  });
  const { refetch: refetchTutorial } = useQuery("get-tutorials-by-id", () => {
    return api.get(`/api/tutorials/${courseId}`).then((data) => {
      setTutorials(data.data);
      setLoadingTutorial(false);
      return data;
    });
  });

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
            display: isLoadingCourse ? "none" : "flex",
            alignItems: "flex-end",
            pl: 5,
            pb: 5,
            pt: 5,
            mb: 5,
            justifyContent: "space-between",
            height: { xs: "250px", md: "300px" },
            borderRadius: "8px",
            backgroundColor: mainCourse?.color || "whitesmoke",
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
              {mainCourse?.level} Level
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
            {isLoadingTutorial ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : tutorials?.length === 0 ? (
              <Typography>No Upcoming Tutorials</Typography>
            ) : (
              tutorials?.slice(0, 3).map((item) => {
                const date = new Date(item.date);
                return (
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Title- {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Description- {item.description.substring(0, 40) + "..."}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Date- {date.getDate()}/{date.getMonth()}/
                      {date.getFullYear()} {item.startTime} - {item.endTime}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Type - {item.type}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Venue - {item.venue}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Tutor - {item.tutorId.lastname} {item.tutorId.firstname}
                    </Typography>
                    <Divider sx={{ mb: 1, mt: 1 }} />
                  </Box>
                );
              })
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  getCurrentUser()?.role === "Tutor"
                    ? "space-between"
                    : "flex-end",
                mt: 1,
                alignItems: "center",
              }}
            >
              {isLoadingTutorial ||
                (getCurrentUser()?.role === "Tutor" && (
                  <Tooltip title="Add Tutorial">
                    <Box
                      onClick={() => setAddTutorial(true)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "100%",
                        p: 1,
                        boxShadow:
                          "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
                        cursor: "pointer",
                      }}
                    >
                      <Add />
                    </Box>
                  </Tooltip>
                ))}

              {isLoadingTutorial || (
                <Button
                  onClick={() => setOpenUpcoming(true)}
                  variant="text"
                  color="primary"
                >
                  <Typography>Show More</Typography>
                </Button>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "70%" },

              pl: { xs: 0, md: 3 },
              pr: { xs: 0, md: 3 },
            }}
          >
            {showSomething ? (
              <Box
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  mb: 3,
                  cursor: "pointer",
                  boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
                  display: "flex",
                  alignItems: "flex-end",
                  flexDirection: "column",
                  backgroundColor: "rgba(184, 182, 182, 0.452)",
                  p: 5,
                }}
              >
                <TextField
                  placeholder="Say Something"
                  fullWidth
                  multiline
                  value={something}
                  onChange={(event) => handleSomethingChange(event)}
                  InputProps={{
                    endAdornment: isPosting ? (
                      <CircularProgress />
                    ) : (
                      <IconButton onClick={() => onPost()}>
                        <SendIcon sx={{ color: "rgb(0,66,130)" }} />
                      </IconButton>
                    ),
                  }}
                />
                <Box>
                  <Button
                    onClick={() => setShowSomething(false)}
                    variant="contained"
                    color="error"
                    sx={{ mt: 2 }}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                onClick={() => setShowSomething(true)}
                sx={{
                  width: "100%",
                  height: "80px",
                  borderRadius: "8px",
                  mb: 3,
                  cursor: "pointer",
                  boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(184, 182, 182, 0.452)",
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    borderRadius: "100%",
                    width: "50px",
                    height: "50px",
                    color: "black",
                  }}
                >
                  {" "}
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
                <Typography sx={{ pl: 3, color: "grey" }}>
                  Say something to the class
                </Typography>
              </Box>
            )}
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : data?.spaces?.length === 0 ? (
              <Typography
                sx={{
                  color: "blue",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                No space be the first to add
              </Typography>
            ) : (
              data?.spaces?.map((item) => {
                const spaceCreatedAt = new Date(item.createdAt);
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
                            borderRadius: "100%",
                            width: "50px",
                            height: "50px",
                            color: "black",
                          }}
                        >
                          {" "}
                          <img
                            style={{
                              borderRadius: "100%",
                              width: "50px",
                              height: "50px",
                            }}
                            src={
                              item?.tutor?.profilePhoto ||
                              item?.student?.profilePhoto
                            }
                            alt="profile"
                          />
                        </Box>
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
                            {item?.tutor?.lastname || item?.student?.lastname}{" "}
                            {item?.tutor?.firstname || item?.student?.firstname}{" "}
                            •
                            <span style={{ color: "rgb(0,66,130)" }}>
                              {item?.tutor?.role || item?.student?.role}
                            </span>
                          </Typography>{" "}
                          <Typography
                            sx={{
                              pl: 2,
                              color: "grey",
                              fontSize: "11px",
                            }}
                          >
                            {spaceCreatedAt.toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ pl: 1 }}>
                        <Typography>{item?.comment}</Typography>
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
                      <Button>
                        <Box
                          onClick={() => handleOpenReplies(item?._id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <ChatIcon
                            sx={{ fontSize: "25px", color: "rgb(0,66,130)" }}
                          />
                          <Typography
                            sx={{ pl: 2, fontWeight: "500", fontSize: "18px" }}
                          >
                            {item?.replies.length} class comment
                          </Typography>
                        </Box>
                      </Button>
                      {openReplies[item?._id] &&
                        item?.replies.map((v) => {
                          const replyCreatedAt = new Date(v.createdAt);
                          return (
                            <Box key={v._id} sx={{ display: "flex", mt: 3 }}>
                              <Box
                                sx={{
                                  borderRadius: "100%",
                                  width: "50px",
                                  height: "50px",
                                  color: "black",
                                }}
                              >
                                <img
                                  style={{
                                    borderRadius: "100%",
                                    width: "50px",
                                    height: "50px",
                                  }}
                                  src={
                                    v?.tutor?.profilePhoto ||
                                    v?.student?.profilePhoto
                                  }
                                  alt="profile"
                                />
                              </Box>
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
                                    {v?.tutor?.lastname || v?.student?.lastname}{" "}
                                    {v?.tutor?.firstname ||
                                      v?.student?.firstname}{" "}
                                    •
                                    <span style={{ color: "rgb(0,66,130)" }}>
                                      {v?.tutor?.role || v?.student?.role}
                                    </span>
                                  </Typography>{" "}
                                  <Typography
                                    sx={{
                                      pl: 2,
                                      color: "grey",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {replyCreatedAt.toLocaleDateString()}
                                  </Typography>
                                </Box>
                                <Typography
                                  sx={{
                                    pl: 2,
                                    color: "grey",
                                    fontSize: "14px",
                                  }}
                                >
                                  {v?.comment}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
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
                            borderRadius: "100%",
                            width: "50px",
                            height: "50px",
                            color: "black",
                          }}
                        >
                          {" "}
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
                        <Box sx={{ width: "95%", pl: "5%" }}>
                          <TextField
                            placeholder="Add Comment"
                            fullWidth
                            multiline
                            value={
                              textfieldValues ? textfieldValues[item._id] : ""
                            }
                            onChange={(event) => handleChange(event, item._id)}
                            InputProps={{
                              endAdornment: isReplying ? (
                                <CircularProgress />
                              ) : (
                                <IconButton
                                  onClick={() => {
                                    if (textfieldValues) {
                                      onReply(
                                        item._id,
                                        textfieldValues[item._id]
                                      );
                                    }
                                  }}
                                >
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
              })
            )}
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
          data={tutorials}
          refetchTutorial={refetchTutorial}
          openUpcoming={openUpcoming}
          setOpenUpcoming={setOpenUpcoming}
        />
        <AddTutorial
          refetchTutorial={refetchTutorial}
          openAddTutorial={openAddTutorial}
          setAddTutorial={setAddTutorial}
        />
      </Box>
    </>
  );
};

export default Space;
