import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Button, CircularProgress, TextField } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useFormik } from "formik";

import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL, configToken } from "../utils/api";
import { useSelector } from "react-redux";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function OngoingVacancyCard({ item }) {
  const [expanded, setExpanded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRemoved, setIsRemoved] = React.useState(false);
  const [rehired, setRehired] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const { isLoggedIn, token, isAdmin } = useSelector((state) => state.auth);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleRehire = (values, item) => {
    if (isLoggedIn && isAdmin) {
      setIsLoading(true);
      axios
        .post(
          `${BASE_URL}admin/rehire/${item.vacancyId}`,
          values,
          configToken(token)
        )
        .then((res) => {
          console.log(res.data);
          setRehired(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false);
        });
    }
  };

  const handleRemove = () => {
    if (isLoggedIn && isAdmin) {
      setIsLoading(true);
      axios
        .get(
          `${BASE_URL}admin/deletevacancy/${item.vacancyId}`,
          configToken(token)
        )
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          setIsRemoved(true);
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false);
        });
    }
  };

  const handleCompleted = () => {
    if (isLoggedIn && isAdmin) {
      setIsLoading(true);
      axios
        .post(
          `${BASE_URL}admin/markcompleted/${item.vacancyId}`,
          {},
          configToken(token)
        )
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          setIsCompleted(true);
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false);
        });
    }
  };

  const formik = useFormik({
    initialValues: {
      contractLength: "",
    },
    onSubmit: (values) => {
      handleRehire(values, item);
    },
  });

  return (
    <Card>
      <CardHeader title={item.position} subheader={item.department} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          College : {item.college}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Location : {item.location}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              size="small"
              id="contractLength"
              label="Contract Length"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
              onChange={formik.handleChange}
              value={formik.values.contractLength}
            />
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={isLoading || rehired || isCompleted || isRemoved}
            >
              Rehire Faculty
            </Button>
          </form>
        </div>
      </CardContent>

      {isLoading ? (
        <CircularProgress color="primary" size={25} />
      ) : (
        <CardActions disableSpacing>
          <Button
            onClick={handleRemove}
            disabled={isCompleted || isRemoved || rehired}
            color="error"
            variant="contained"
            sx={{ ml: 1, mr: 1 }}
          >
            Remove
          </Button>
          <Button
            disabled={isCompleted || isRemoved || rehired}
            onClick={handleCompleted}
            color="success"
            variant="contained"
            sx={{ ml: 1, mr: 1 }}
          >
            Completed
          </Button>
          <Link
            to={`/admin/sendmail/${item.vacancyId}`}
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="outlined"
              color="primary"
              disabled={isCompleted || isRemoved || rehired}
              sx={{ ml: 1, mr: 1 }}
            >
              Send Invite
            </Button>
          </Link>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      )}

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>
            Minimum Qualification: {item.minimumQualification}
          </Typography>
          <Typography>Minimum Experience: {item.minimumExperience}</Typography>
          <Typography>Compensation: {item.compensation}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
