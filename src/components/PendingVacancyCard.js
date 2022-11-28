import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useFormik } from "formik";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, configToken } from "../utils/api";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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

export default function PendingVacancyCard({ item }) {
  const { token, isAdmin, isLoggedIn } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const handleSubmit = (values, item) => {
    const postObj = {
      position: item.position,
      department: item.department,
      college: item.collegeName,
      collegeId: item.collegeId,
      email: item.email,
      location: item.location,
      ...values,
    };
    console.log(postObj);
    if (isLoggedIn && isAdmin) {
      setIsLoading(true);
      axios
        .post(`${BASE_URL}admin/createvacancy`, postObj, configToken(token))
        .then((res) => {
          console.log(res);
          setCompleted(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false);
        });
    }
  };
  const [expanded, setExpanded] = React.useState(false);
  const formik = useFormik({
    initialValues: {
      minimumQualification: "",
      minimumExperience: "",
      compensation: "",
      applyLink: "",
    },
    onSubmit: (values) => {
      handleSubmit(values, item);
    },
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader title={item.position} subheader={item.department} />
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            College : {item.collegeName}
          </Typography>
          <Typography variant="subtitle1" color="maroon">
            Days to Retire : {item.daysToRetire}
          </Typography>
        </div>
        <Typography variant="body2" color="text.secondary">
          Location : {item.location}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              size="small"
              id="minimumQualification"
              label="Minimum Qualification"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
              onChange={formik.handleChange}
              value={formik.values.minimumQualification}
            />

            <TextField
              size="small"
              id="minimumExperience"
              label="Minimum Experience"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
              onChange={formik.handleChange}
              value={formik.values.minimumExperience}
            />

            <TextField
              size="small"
              id="compensation"
              label="Compensation"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
              onChange={formik.handleChange}
              value={formik.values.compensation}
            />
            <TextField
              size="small"
              id="applyLink"
              label="Apply Link"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
              onChange={formik.handleChange}
              value={formik.values.applyLink}
            />

            {completed ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <CheckCircleOutlineIcon sx={{ color: "green" }} />
                <Typography variant="subtitle2" sx={{ color: "green" }}>
                  Vacancy Created
                </Typography>
              </div>
            ) : (
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={isLoading ? true : false}
              >
                {isLoading ? (
                  <CircularProgress color="primary" size={25} />
                ) : (
                  "Create Vacancy"
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Collapse>
    </Card>
  );
}
