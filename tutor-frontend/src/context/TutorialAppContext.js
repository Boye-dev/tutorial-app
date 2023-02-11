import { createContext, useEffect, useRef, useState } from "react";
import { Snackbar } from "@mui/material";
import { io } from "socket.io-client";
import AuthService from "../auth_service";

const TutorialAppContext = createContext();
export const TutorialAppProvider = ({ children }) => {
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackColor, setSnackColor] = useState();
  const [convoData, setConvoData] = useState(true);
  const handleClose = () => {
    setIsSnackOpen(false);
  };
  const { getCurrentUser } = AuthService;

  const currenUser = getCurrentUser();

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("ws://tutorial-app-production.up.railway.app");
  }, []);
  useEffect(() => {
    socketRef.current.emit("addUser", currenUser?._id);
    socketRef.current.on("getUsers", (users) => {});
  }, [currenUser]);
  return (
    <TutorialAppContext.Provider
      value={{
        setIsSnackOpen,
        setSnackMessage,
        socketRef,
        snackColor,
        setSnackColor,
        convoData,
        setConvoData,
      }}
    >
      {isSnackOpen && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={isSnackOpen}
          onClose={handleClose}
          autoHideDuration={3000}
          message={`${snackMessage}`}
          key="topcenter"
          sx={{
            color: "black !important",
            "& .MuiSnackbarContent-root": {
              backgroundColor: `${snackColor ? `${snackColor}` : "darkred"}`,
            },
          }}
        />
      )}
      {children}
    </TutorialAppContext.Provider>
  );
};

export default TutorialAppContext;
