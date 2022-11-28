import { Grid } from "@mui/material";
import CompletedVacancyCard from "../../components/CompletedVacancyCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { BASE_URL, configToken } from "../../utils/api";
import { addToast } from "../../redux/features/toast/toastSlice";

const Completed = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [completedData, setCompletedData] = useState([]);
  const dispatch = useDispatch();
  const { token, isLoggedIn, isAdmin } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      setIsLoading(true);
      axios
        .get(`${BASE_URL}admin/getcompletedvacancies`, configToken(token))
        .then((response) => {
          console.log(response.data);
          setCompletedData(response.data);
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
  }, [isLoggedIn, token, isAdmin]);

  if (isLoading) {
    return (
      <Grid container spacing={1} justifyContent="center" sx={{ marginTop: 5 }}>
        <CircularProgress color="primary" size={40} />
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={1} justifyContent="center" sx={{ marginTop: 5 }}>
        {completedData.map((item, index) => (
          <Grid key={index} item xs={12}>
            <CompletedVacancyCard item={item} />
          </Grid>
        ))}
      </Grid>
    );
  }
};

export default Completed;
