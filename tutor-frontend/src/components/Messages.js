import React, { useContext, useEffect, useRef, useState } from "react";
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
import AuthService from "../auth_service";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import api from "../api/api";
import axios from "axios";
import Conversation from "./Conversation";
import { io } from "socket.io-client";
import TutorialAppContext from "../context/TutorialAppContext";
const Messages = ({ openMessages, setOpenMessages }) => {
  const [openSingle, setOpenSingle] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [loadingConversationns, setLoadingConversations] = useState(true);
  const { getCurrentUser } = AuthService;
  const currenUser = getCurrentUser();
  const [receiverId, setReceiverId] = useState(null);
  const { convoData, setConvoData } = useContext(TutorialAppContext);
  const [convo, setConfo] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get(`api/get-conversation/${currenUser?._id}`);
        setConversations(res.data);
        setConfo(true);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [convoData]);
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
        {conversations.length === 0 ? (
          <Typography sx={{ pl: 5 }}>No conversations</Typography>
        ) : (
          conversations?.map((item) => {
            return (
              <Conversation
                convo={convo}
                setConfo={setConfo}
                conversation={item}
                conversationId={conversationId}
                setConversationId={setConversationId}
                receiverId={receiverId}
                setReceiverId={setReceiverId}
                setOpenMessages={setOpenMessages}
                setOpenSingle={setOpenSingle}
              />
            );
          })
        )}
      </Drawer>
      <SingleMessage
        openSingle={openSingle}
        setOpenSingle={setOpenSingle}
        conversationId={conversationId}
        receiverId={receiverId}
        setConversationId={setConversationId}
      />
    </>
  );
};

export default Messages;
