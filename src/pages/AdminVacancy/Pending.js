import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { BASE_URL, configToken } from "../../utils/api";
import { addToast } from "../../redux/features/toast/toastSlice";
import PendingVacancyCard from "../../components/PendingVacancyCard";
import { Box, Typography, TextField } from "@mui/material";

const Pending = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingData, setPendingData] = useState([]);
  const [dateLimit, setDateLimit] = useState(30);
  const dispatch = useDispatch();
  const { token, isLoggedIn, isAdmin } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn && isAdmin && dateLimit !== "") {
      setIsLoading(true);
      axios
        .get(
          `${BASE_URL}admin/getvacancyfordays/${dateLimit}`,
          configToken(token)
        )
        .then((response) => {
          console.log(response.data);
          setPendingData(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          dispatch(
            addToast({
              type: "error",
              message: "Could not load vacancies!",
            })
          );
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, token, isAdmin, dateLimit]);

  if (isLoading) {
    return (
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Enter date limit:"
          variant="outlined"
          type="number"
          min={1}
          value={dateLimit}
          onChange={(e) => setDateLimit(e.target.value)}
          sx={{ mb: 4 }}
        />

        <Grid
          container
          spacing={1}
          justifyContent="center"
          sx={{ marginTop: 5 }}
        >
          <CircularProgress color="primary" size={40} />
        </Grid>
      </Box>
    );
  } else {
    if (pendingData.length === 0) {
      return (
        <Box
          sx={{
            marginTop: 4,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Enter date limit:"
            variant="outlined"
            type="number"
            value={dateLimit}
            onChange={(e) => setDateLimit(e.target.value)}
            sx={{ mb: 4 }}
          />
          <Typography variant="h4" gutterBottom>
            No upcoming vacancies!
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            marginTop: 4,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Enter date limit:"
            variant="outlined"
            type="number"
            min={1}
            value={dateLimit}
            onChange={(e) => setDateLimit(e.target.value)}
            sx={{ mb: 4 }}
          />
          <Grid
            container
            spacing={1}
            justifyContent="center"
            sx={{ marginTop: 5 }}
          >
            {pendingData.map((item, index) => (
              <Grid key={index} item xs={12}>
                <PendingVacancyCard item={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }
  }
};

export default Pending;
