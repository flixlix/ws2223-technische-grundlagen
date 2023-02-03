import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function TabComponent({
  tabs,
  tabSelected,
  setTabSelected,
  t,
  onRefresh,
}) {
  const handleChange = (event, newValue) => {
    setTabSelected(newValue);
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Tabs
        value={tabSelected}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label={t("Easy Mode")} />
        <Tab label={t("Advanced Mode")} />
      </Tabs>
      <IconButton onClick={onRefresh}>
        <RefreshIcon />
      </IconButton>
    </Box>
  );
}
