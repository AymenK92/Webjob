import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";

const InformationCard = ({ title, content }) => {
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ color: "#1976d2" }}>
            {title}
          </Typography>
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InformationCard;
