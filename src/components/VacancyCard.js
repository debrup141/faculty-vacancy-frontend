import * as React from "react";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

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

export default function VacancyCard({
  college,
  department,
  position,
  location,
  minimumQualification,
  compensation,
  numVacancies,
  applyLink,
}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader title={position} subheader={department} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          College : {college}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location : {location}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          component={Link}
          href={applyLink}
          target="_blank"
          variant="contained"
          sx={{ backgroundColor: "#263354", color: "white" }}
        >
          Apply
        </Button>
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
          <Typography>
            Minimum Qualification : {minimumQualification}
          </Typography>
          <Typography>Minimum Experience : 0 years</Typography>
          <Typography>Compensation : {compensation}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
