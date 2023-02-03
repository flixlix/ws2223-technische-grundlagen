import React from "react";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

export default function AlertsStackComponent({ alerts, setAlerts }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 2,
      }}
    >
      <Stack spacing={2} sx={{ width: "100%" }}>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            severity={alert.severity}
            onClose={() => {
              setAlerts(alerts.filter((a) => a.id !== alert.id));
            }}
          >
            {alert.message}
          </Alert>
        ))}
      </Stack>
    </Box>
  );
}
