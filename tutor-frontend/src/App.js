import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import WithNavbar from "./components/WithNavbar";
import { TutorialAppProvider } from "./context/TutorialAppContext";
import Courses from "./pages/Course";
import Levels from "./pages/Levels";
import Login from "./pages/Login";
import Resources from "./pages/Resources";
import SignUp from "./pages/SignUp";
import Space from "./pages/Space";
import Tutors from "./pages/Tutors";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import SingleTutor from "./pages/SingleTutor";
import Profile from "./pages/Profile";
import TutorProtect from "./protectedroutes/TutorProtect";
import StudentProtect from "./protectedroutes/StudentProtect";
import { QueryClient, QueryClientProvider } from "react-query";
const theme = createTheme({
  typography: {
    fontFamily: ["'Poppins', sans-serif"].join(","),
  },
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      cacheTime: 600000,
    },
    mutations: {
      useErrorBoundary: false,
    },
  },
});
const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <TutorialAppProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<SignUp />} />

                <Route element={<TutorProtect />}>
                  <Route exact path="/tutor/profile" element={<Profile />} />
                  <Route element={<WithNavbar />}>
                    <Route path="/tutor/courses" element={<Courses />} />
                    <Route
                      path="/tutor/courses/:course/:courseId/space"
                      element={<Space />}
                    />
                    <Route
                      path="/tutor/courses/:course/:courseId/resources"
                      element={<Resources />}
                    />
                    <Route
                      path="/tutor/courses/:course/:courseId/tutors"
                      element={<Tutors />}
                    />
                    <Route
                      path="/tutor/courses/:course/:courseId/tutors/:tutorId"
                      element={<SingleTutor />}
                    />
                  </Route>
                </Route>

                <Route element={<StudentProtect />}>
                  <Route exact path="/student/profile" element={<Profile />} />
                  <Route element={<WithNavbar />}>
                    <Route path="/student/levels" element={<Levels />} />
                    <Route
                      path="/student/levels/:level/courses"
                      element={<Courses />}
                    />
                    <Route
                      path="/student/levels/:level/courses/:course/:courseId/space"
                      element={<Space />}
                    />
                    <Route
                      path="/student/levels/:level/courses/:course/:courseId/tutors"
                      element={<Tutors />}
                    />
                    <Route
                      path="/student/levels/:level/courses/:course/:courseId/resources"
                      element={<Resources />}
                    />
                    <Route
                      path="/student/levels/:level/courses/:course/:courseId/tutors/:tutorId"
                      element={<SingleTutor />}
                    />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </TutorialAppProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
