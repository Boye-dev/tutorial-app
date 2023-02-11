import { Person } from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import api from "../api/api";
import AuthService from "../auth_service";
import TutorialAppContext from "../context/TutorialAppContext";

const Conversation = ({
  conversation,
  setOpenMessages,
  setOpenSingle,
  setReceiverId,
  setConversationId,
  convo,
  setConfo,
  receiverId,
}) => {
  const { convoData, setConvoData, socketRef } = useContext(TutorialAppContext);
  const { getCurrentUser } = AuthService;

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser?._id);

    const getUser = async () => {
      if (conversation) {
        try {
          const res = await api.get(`/api/get-user/${friendId}`);
          setUser(res.data);
          setConfo(true);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getUser();
  }, [conversation]);

  useEffect(() => {
    const getMessages = async () => {
      if (conversation) {
        try {
          const res = await api.get(`/api/get-messages/${conversation._id}`);
          setMessage(res.data);
          socketRef.current.emit("sendMessage", {
            message,
          });
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getMessages();
  }, [conversation, convoData, message, socketRef]);

  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          ":hover": {
            backgroundColor: "rgba(128, 128, 128, 0.452)",
          },
        }}
        onClick={() => {
          if (convo) {
            setConversationId(conversation._id);
            setReceiverId(
              conversation.members.find((m) => m !== currentUser?._id)
            );
            setOpenMessages(false);
            setOpenSingle(true);
          }
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
                  border: user ? "none" : "1px solid grey",
                  borderRadius: "100%",
                  width: "50px",
                  height: "50px",
                  color: "black",
                }}
              >
                {user ? (
                  <img
                    style={{
                      borderRadius: "100%",
                      width: "60px",
                      height: "60px",
                    }}
                    src={user.profilePhoto}
                    alt="profile"
                  />
                ) : (
                  <Person
                    sx={{ width: "100%", height: "100%", color: "grey" }}
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ pl: 2, width: `calc(100% - (60px + 15%))` }}>
              <Typography
                sx={{
                  color: "grey",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                {user?.lastname} {user?.firstname}
              </Typography>
              <Typography sx={{ fontSize: "11px", color: "grey" }}>
                {message
                  ? message[message?.length - 1]?.text.substring(0, 30)
                  : "--"}
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
    </>
  );
};

export default Conversation;
