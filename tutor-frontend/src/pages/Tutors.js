import {
  Box,
  CircularProgress,
  Divider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import { Star } from "@mui/icons-material";
import SingleMessage from "../components/SingleMessage";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import api from "../api/api";
import AuthService from "../auth_service";
import TutorialAppContext from "../context/TutorialAppContext";
const Tutors = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [openSingle, setOpenSingle] = useState(false);
  const [isLoadingTutors, setLoadingTutors] = useState(true);
  const [data, setData] = useState(null);
  const { getCurrentUser } = AuthService;
  const [conversations, setConversations] = useState([]);
  const [loadingConversationns, setLoadingConversations] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [creatingConvo, setCreatingConvo] = useState(false);
  const [receiverId, setReceiverId] = useState(null);
  const [name, setName] = useState("");
  const {
    setIsSnackOpen,
    setSnackMessage,
    setSnackColor,
    setConvoData,
    convoData,
  } = useContext(TutorialAppContext);

  const { status } = useQuery("get-tutors", () => {
    return api.get(`/api/course-tutors/${courseId}`).then((data) => {
      setData(data.data);
      setLoadingTutors(false);
      return data;
    });
  });
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get(
          `api/get-conversation/${getCurrentUser()?._id}`
        );
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [convoData]);

  const getStars = (rate) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star key={i} sx={{ color: i < rate ? "rgb(185,141,59)" : "grey" }} />
      );
    }
    return stars;
  };

  const postReview = async ({ data }) => {
    return api.post(`/api/create-conversation`, data).then((res) => res.data);
  };
  const { mutate, isLoading } = useMutation(postReview, {
    onError: (error) => {
      setSnackColor("red");
      setIsSnackOpen(true);
      setSnackMessage(error.response.data.actualError);
      setCreatingConvo(false);
    },
    onSuccess: (data) => {
      setConvoData(!convoData);
      setConversationId(data._id);
      setReceiverId(data.members.find((m) => m !== getCurrentUser()?._id));
      setCreatingConvo(false);
      setOpenSingle(true);
    },
  });
  const handleOpenConversation = (tutorId) => {
    const data = { senderId: getCurrentUser()?._id, receiverId: tutorId };
    // console.log(JSON.stringify([data.senderId, data.receiverId]));
    const hasMessaged = conversations.some(
      (item) =>
        JSON.stringify(item.members) ===
        JSON.stringify([data.senderId, data.receiverId])
    );
    console.log(
      hasMessaged,
      conversations.some(
        (item) =>
          JSON.stringify(item.members) ===
          JSON.stringify([data.senderId, data.receiverId])
      )
    );
    if (hasMessaged) {
      const convoId = conversations.filter(
        (item) =>
          JSON.stringify(item.members) ===
          JSON.stringify([data.senderId, data.receiverId])
      );
      setConversationId(convoId[0]._id);
      setReceiverId(
        convoId[0].members.find((m) => m !== getCurrentUser()?._id)
      );

      setOpenSingle(true);
    } else {
      setCreatingConvo(true);
      mutate({ data });
    }
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
          placeholder="Search For Tutor"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        {isLoadingTutors ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          data
            .filter((item) => {
              const fullname = item.firstname + item.lastname;
              return fullname
                .toLowerCase()
                .includes(name.replace(/ /g, "").toLowerCase());
            })
            .map((item) => {
              return (
                <Box>
                  <Box
                    onClick={() => navigate(item._id)}
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
                      sx={{
                        width: "50%",
                        display: "flex",
                        alignItems: "center",
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
                        <img
                          style={{
                            borderRadius: "100%",
                            width: "50px",
                            height: "50px",
                          }}
                          src={item.profilePhoto}
                          alt="profile"
                        />
                      </Box>
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
                          {item.lastname} {item.firstname}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Typography sx={{ pr: 2 }}>
                        {getStars(Math.floor(item.avgRating))}
                      </Typography>
                      {(loadingConversationns &&
                        item._id === getCurrentUser()?._id) ||
                        (creatingConvo ? (
                          <CircularProgress size={25} />
                        ) : (
                          <Tooltip title="Message">
                            <ChatIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenConversation(item?._id);
                              }}
                              sx={{
                                color: "rgb(0,66,130)",
                                cursor: "pointer",
                                zIndex: "100",
                              }}
                            />
                          </Tooltip>
                        ))}
                      {item._id === getCurrentUser()?._id && (
                        <Typography
                          sx={{
                            color: "grey",
                            fontSize: "17px",
                            fontWeight: "300",
                          }}
                        >
                          Me
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Divider
                    sx={{ backgroundColor: "rgb(0,66,130)", height: "1px" }}
                  />
                </Box>
              );
            })
        )}
        <SingleMessage
          openSingle={openSingle}
          setOpenSingle={setOpenSingle}
          conversationId={conversationId}
          receiverId={receiverId}
          setConversationId={setConversationId}
          convoData={convoData}
          setConvoData={setConvoData}
        />
      </Box>
    </>
  );
};

export default Tutors;
