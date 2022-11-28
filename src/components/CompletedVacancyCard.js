import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function CompletedVacancyCard({ item }) {
  return (
    <Card>
      <CardHeader title={item.position} subheader={item.department} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          College : {item.college}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location : {item.location}
        </Typography>
      </CardContent>
    </Card>
  );
}
