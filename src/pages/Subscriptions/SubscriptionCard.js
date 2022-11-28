import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { BASE_URL, configToken } from "../../utils/api";
import { addToast } from "../../redux/features/toast/toastSlice";

export default function SubscriptionCard({ item, subscribe }) {
  const [showStatus, setShowStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector((state) => state.auth);

  const handleClick = () => {
    if (isLoggedIn) {
      setIsLoading(true);
      if (!subscribe) {
        console.log(`${BASE_URL}subscriptions/delete/${item.subscriptionId}`);
        axios
          .get(
            `${BASE_URL}subscriptions/delete/${item.subscriptionId}`,
            configToken(token)
          )
          .then((response) => {
            console.log(response);
            if (response.data === "success") {
              setShowStatus("unsubscribed");
              setIsLoading(false);
            } else {
              console.log(response);
              dispatch(
                addToast({
                  type: "error",
                  message: "Could not unsubscribe. Please try again!",
                })
              );
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
            dispatch(
              addToast({
                type: "error",
                message: "Could not unsubscribe. Please try again!",
              })
            );
            setIsLoading(false);
          });
      } else {
        const data = {
          department: item.department,
          colleges: item.colleges,
        };
        axios
          .post(
            `${BASE_URL}subscriptions/mysubscriptions`,
            data,
            configToken(token)
          )
          .then((response) => {
            if (response.data !== []) {
              setShowStatus("subscribed");
              setIsLoading(false);
            } else {
              dispatch(
                addToast({
                  type: "error",
                  message: "Could not subscribe. Please try again!",
                })
              );
              setIsLoading(false);
            }
          })
          .catch((error) => {
            dispatch(
              addToast({
                type: "error",
                message: "Could not subscribe. Please try again!",
              })
            );
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {item.department}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Colleges :
          </Typography>
          <div>
            <ul>
              {item.colleges.map((item, index) => (
                <li key={index}>
                  <Typography variant="body2" gutterBottom>{item}</Typography>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardActions>
          {showStatus === "subscribed" ? (
            <Typography sx={{ fontSize: 14, mx: "auto", color: "green" }} gutterBottom>
              <CheckCircleIcon fontSize="small" />{" "} Subscribed!
            </Typography>
          ) : showStatus === "unsubscribed" ? (
            <Typography sx={{ fontSize: 14, mx: "auto" }} color="primary" gutterBottom>
              <CheckCircleIcon fontSize="small" />{" "} Unsubscribed!
            </Typography>
          ) : (
            <Button
              sx={{ width: "60%", mx: "auto" }}
              variant="outlined"
              color={subscribe ? "primary" : "error"}
              size="small"
              disabled={isLoading}
              onClick={handleClick}
            >
              {isLoading ? (
                <CircularProgress color="secondary" size={20} />
              ) : subscribe ? (
                "Subscribe"
              ) : (
                "UnSubscribe"
              )}
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
