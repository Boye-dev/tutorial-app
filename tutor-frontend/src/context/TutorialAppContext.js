import { createContext, useState } from "react";
import { Snackbar } from "@mui/material";

const TutorialAppContext = createContext();
export const TutorialAppProvider = ({ children }) => {
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackColor, setSnackColor] = useState();
  const handleClose = () => {
    setIsSnackOpen(false);
  };
  return (
    <TutorialAppContext.Provider
      value={{
        setIsSnackOpen,
        setSnackMessage,

        snackColor,
        setSnackColor,
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
