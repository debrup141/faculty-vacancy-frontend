import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

import { BASE_URL, configToken } from "../../utils/api";
import SubscriptionCard from "./SubscriptionCard";
import { addToast } from "../../redux/features/toast/toastSlice";

const MySubscriptions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [subData, setSubData] = useState([]);
  const dispatch = useDispatch();
  const { token, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true);
      axios
        .get(`${BASE_URL}subscriptions/mysubscriptions`, configToken(token))
        .then((response) => {
          console.log(response.data);
          setSubData(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          dispatch(
            addToast({
              type: "error",
              message: "Could not load your subscriptions!",
            })
          );
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, token]);

  if (isLoading) {
    return (
      <Grid container spacing={1} justifyContent="center" sx={{ marginTop: 5 }}>
        <CircularProgress color="primary" size={40} />
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={1} justifyContent="center" sx={{ marginTop: 5 }}>
        {subData.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} lg={4}>
            <SubscriptionCard item={item} subscribe={false} />
          </Grid>
        ))}
      </Grid>
    );
  }
};

export default MySubscriptions;
