import React, { useContext, useEffect, useRef, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Close, Send } from "@mui/icons-material";
import Message from "./Message";
import { useMutation, useQuery } from "react-query";
import api from "../api/api";
import AuthService from "../auth_service";
import TutorialAppContext from "../context/TutorialAppContext";
const SingleMessage = ({
  openSingle,
  setOpenSingle,
  conversationId,

  receiverId,
}) => {
  const { getCurrentUser } = AuthService;
  const {
    setIsSnackOpen,
    setSnackMessage,
    setSnackColor,
    socketRef,
    setConvoData,
    convoData,
  } = useContext(TutorialAppContext);

  const [messages, setMessages] = useState([]);
  const [tutor, setTutor] = useState(null);
  const [tutorLoading, setTutorLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatLoading, setCurrentChatLoading] = useState(true);
  useEffect(() => {
    const getConversation = async () => {
      if (conversationId) {
        try {
          const res = await api.get(`/api/conversation/${conversationId}`);
          setCurrentChat(res.data);
          setCurrentChatLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getConversation();
  }, [conversationId]);
  useEffect(() => {
    socketRef?.current?.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socketRef]);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  const postReview = async ({ data }) => {
    return api.post(`/api/post-message`, data).then((res) => res.data);
  };
  const { mutate, isLoading } = useMutation(postReview, {
    onError: (error) => {
      setSnackColor("red");
      setIsSnackOpen(true);
      setSnackMessage(error.response.data.actualError);
    },
    onSuccess: (data) => {
      socketRef.current.emit("sendMessage", {
        senderId: getCurrentUser()?._id,
        receiverId,
        text: newMessage,
      });
      setNewMessage("");
      setMessages([...messages, data]);
      setConvoData(!convoData);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    function isNotWhitespace(value) {
      return /\S/.test(value);
    }
    if (newMessage !== "" && isNotWhitespace(newMessage)) {
      const data = {
        senderId: getCurrentUser()?._id,
        text: newMessage,
        conversationId,
      };

      mutate({ data });
    }
  };
  useEffect(() => {
    const getUser = async () => {
      if (receiverId) {
        try {
          const res = await api.get(`/api/get-user/${receiverId}`);
          setTutor(res.data);
          setTutorLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getUser();
  }, [receiverId]);
  useEffect(() => {
    const getMessages = async () => {
      if (conversationId) {
        setLoading(true);
        try {
          const res = await api.get(`/api/get-messages/${conversationId}`);
          setMessages(res.data);
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getMessages();
  }, [conversationId]);
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, openSingle]);

  return (
    <>
      <Drawer
        anchor={"right"}
        open={openSingle}
        onClose={() => {
          setMessages([]);

          setOpenSingle(false);
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: "100%", md: "450px" },
            backgroundColor: "white",
          },
        }}
      >
        <Box sx={{ position: "sticky", top: "0" }}>
          <Box
            sx={{
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
                  border: tutorLoading && "1px solid grey",
                  borderRadius: "100%",
                  width: "60px",
                  height: "60px",
                  color: "black",
                }}
              >
                {tutorLoading || (
                  <img
                    style={{
                      borderRadius: "100%",
                      width: "60px",
                      height: "60px",
                    }}
                    src={tutor.profilePhoto}
                    alt="profile"
                  />
                )}
              </Box>
              <Typography
                sx={{
                  color: "grey",
                  fontSize: "14px",
                  fontWeight: "700",
                  pl: 2,
                }}
              >
                {tutor?.lastname} {tutor?.firstname}
              </Typography>
            </Box>
            <Close
              onClick={() => {
                setMessages([]);
                setOpenSingle(false);
              }}
              sx={{
                fontSize: "30px",
                color: "rgb(0,66,130)",
                cursor: "pointer",
              }}
            />
          </Box>
          <Divider />
        </Box>

        <Box sx={{ height: "80%", overflowY: "scroll" }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <CircularProgress />
            </Box>
          ) : (
            messages.map((item) => {
              return (
                <Box ref={scrollRef}>
                  <Message
                    own={item?.senderId === getCurrentUser()?._id}
                    message={item}
                  />
                </Box>
              );
            })
          )}
        </Box>
        <Box
          sx={{
            position: "sticky",
            bottom: "0",
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <Divider />
          <Box sx={{ p: 2 }}>
            <TextField
              placeholder="Send Message"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={(e) => handleSubmit(e)}>
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
