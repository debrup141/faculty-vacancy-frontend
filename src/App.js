import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Typography from "@mui/material/Typography";
import "./App.css";
import ToastList from "./components/ToastList";
import TempNavbar from "./components/TempNavbar";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <TempNavbar />
      <ToastList />
      <Outlet />
      <Typography
        variant="body2"
        color="text.secondary"
        style={{ width: "100%", paddingBottom: 12, textAlign: "center" }}
      >
        {"Copyright © | Tech Stark | "} {new Date().getFullYear()}
        {"."}
      </Typography>
    </div>
  );
}

export default App;
