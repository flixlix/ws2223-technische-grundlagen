import { useState } from "react";
import { v4 as uuid } from "uuid";
import {
  Button,
  Typography,
  Stack,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./App.css";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";

export function FieldTextToSend({ value, onChange, onCancel }) {
  return (
    <FormControl
      key="text-to-send-input-box"
      sx={{
        m: 1,
        width: "100%",
      }}
      variant="outlined"
    >
      <InputLabel htmlFor="outlined-adornment-text">Enter Text</InputLabel>
      <OutlinedInput
        id="outlined-adornment-weight"
        key="text-to-send-input-field"
        value={value}
        label={"Enter Text"}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        endAdornment={
          value.length > 0 && (
            <InputAdornment position="end">
              <IconButton aria-label="delete text" onClick={() => onCancel()}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          )
        }
        aria-describedby="outlined-weight-helper-text"
      />
    </FormControl>
  );
}
export default function App() {
  const [textToSend, setTextToSend] = useState("");
  const [formOfCommunication, setFormOfCommunication] = useState("");
  const [colorOfText, setColorOfText] = useState("");
  const [tabSelected, setTabSelected] = useState(0);
  const [alerts, setAlerts] = useState([]);

  function handleChange(event, newValue) {
    setTabSelected(newValue);
    console.log(newValue);
  }

  const theme = createTheme({
    typography: {
      /* roboto mono */
      fontFamily: ["Roboto Mono", "monospace"].join(","),
    },
  });

  function handleCancelSend() {
    setFormOfCommunication("");
  }

  function easyModePanel() {
    return <div></div>;
  }

  function advancedModePanel() {
    return (
      <Stack spacing={2}>
        <FormControl
          sx={{
            m: 1,
            width: "100%",
          }}
          variant="standard"
        >
          <FormLabel>Form of Communication</FormLabel>

          <RadioGroup>
            <FormControlLabel
              value="mqtt"
              control={<Radio />}
              label="MQTT (Wireless)"
              checked={formOfCommunication === "mqtt"}
              onChange={(e) => setFormOfCommunication(e.target.value)}
            />
            <FormControlLabel
              value="visible_light"
              control={<Radio />}
              label="RGB Light"
              checked={formOfCommunication === "visible_light"}
              onChange={(e) => setFormOfCommunication(e.target.value)}
            />
            <FormControlLabel
              value="infrared_light"
              control={<Radio />}
              label="Infrared Light"
              checked={formOfCommunication === "infrared_light"}
              onChange={(e) => setFormOfCommunication(e.target.value)}
            />
          </RadioGroup>
        </FormControl>
        <FormControl
          sx={{
            m: 1,
            width: "100%",
          }}
          variant="standard"
        >
          <FormLabel>Color of text</FormLabel>

          <RadioGroup>
            <FormControlLabel
              value="black"
              control={<Radio color="default" />}
              label="Black"
              checked={colorOfText === "black"}
              onChange={(e) => setColorOfText(e.target.value)}
            />
            <FormControlLabel
              value="red"
              control={<Radio color="error" />}
              label="Red"
              checked={colorOfText === "red"}
              onChange={(e) => setColorOfText(e.target.value)}
            />
          </RadioGroup>
        </FormControl>
      </Stack>
    );
  }

  function handleSubmit() {
    setAlerts([]);
    if (textToSend.length === 0 || textToSend === " ") {
      setAlerts([
        ...alerts,
        {
          id: uuid(),
          severity: "error",
          message: "Please enter some text to send",
        },
      ]);
      return;
    }
    if (textToSend.length > 50) {
      setAlerts([
        ...alerts,
        {
          id: uuid(),
          severity: "error",
          message: "Please enter less than 50 characters",
        },
      ]);
      return;
    }

    /* if advanced mode was selected */
    if (tabSelected === 1) {
      if (formOfCommunication.length === 0) {
        setAlerts([
          ...alerts,
          {
            id: uuid(),
            severity: "error",
            message: "Please select a form of communication",
          },
        ]);
        return;
      }
      if (colorOfText.length === 0) {
        setAlerts([
          ...alerts,
          {
            id: uuid(),
            severity: "error",
            message: "Please select a color of text",
          },
        ]);
        return;
      }
      setAlerts([
        ...alerts,
        {
          id: uuid(),
          severity: "success",
          message: `Sending "${textToSend}" via ${formOfCommunication} in ${colorOfText}`,
        },
      ]);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Stack
        padding={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "space-between",
          height: "100vh",
          width: "100vw",
          boxSizing: "border-box",
        }}
      >
        <Stack
          spacing={4}
          className="main"
          sx={{
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h3">Schreibmaschinenkommunikation</Typography>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabSelected}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Easy Mode" />
                <Tab label="Advanced Mode" />
              </Tabs>
            </Box>
          </Box>

          <FieldTextToSend
            key="text-to-send-input"
            value={textToSend}
            onChange={(value) => setTextToSend(value)}
            onCancel={() => setTextToSend("")}
          />

          {tabSelected === 0 ? easyModePanel() : advancedModePanel()}
        </Stack>
        <Box
          sx={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
            gap: 2,
          }}
        >
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

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              width: "100%",
              gap: 2,
            }}
          >
            <Button variant="text" onClick={() => handleCancelSend()}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
            >
              Send Text
            </Button>
          </Box>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}
