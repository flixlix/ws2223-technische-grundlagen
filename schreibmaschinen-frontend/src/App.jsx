import { useEffect, useState } from "react";
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
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  Alert,
  Autocomplete,
  Select,
  MenuItem,
  Icon,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./App.css";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";
import axios from "axios";
import translations from "../src/assets/translations.json";
import { useTranslation } from "react-i18next";
import PanToolAltIcon from "@mui/icons-material/PanToolAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import Header from "./components/Header";
import TabComponent from "./components/TabComponent";
import AdvancedModePanel from "./components/AdvancedModePanel";
import AlertsStackComponent from "./components/AlertsStackComponent";

export function FieldTextToSend({ value, onChange, onCancel, t }) {
  return (
    <FormControl
      key="text-to-send-input-box"
      sx={{
        width: "100%",
      }}
      variant="outlined"
      required
    >
      <InputLabel htmlFor="outlined-adornment-text" required>
        {t("Enter text")}
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-weight"
        key="text-to-send-input-field"
        value={value}
        label={t("Enter text")}
        required
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
  const [data, setData] = useState(null);
  const [languageSelected, setLanguageSelected] = useState("GB");
  const { t, i18n } = useTranslation();
  const languages = [
    { code: "GB", label: t("English") },
    { code: "DE", label: t("German") },
    { code: "PT", label: t("Portuguese") },
    { code: "FR", label: t("French") },
    { code: "ES", label: t("Spanish") },
    { code: "RU", label: t("Russian") },
    { code: "IT", label: t("Italian") },
    { code: "NL", label: t("Dutch") },
    { code: "TR", label: t("Turkish") },
    { code: "ID", label: t("Indonesian") },
    { code: "UA", label: t("Ukranian") },
  ];

  function handleChange(event, newValue) {
    setTabSelected(newValue);
    console.log(newValue);
  }

  useEffect(() => {
    console.log(languageSelected);
    i18n.changeLanguage(languageSelected.toLowerCase());
  }, [languageSelected]);

  const theme = createTheme({
    typography: {
      /* roboto mono */
      fontFamily: ["Roboto Mono", "monospace"].join(","),
    },
  });

  function handleCancelSend() {
    setFormOfCommunication("");
    setColorOfText("");
    setTextToSend("");
    axios.post("http://localhost:3001/post", {
      text: "cancel4321",
    });
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
          required
        >
          <FormLabel>{t("Form of Communication")}</FormLabel>

          <RadioGroup>
            <FormControlLabel
              value="mqtt"
              control={<Radio />}
              label={t("MQTT (Wireless)")}
              checked={formOfCommunication === "mqtt"}
              onChange={(e) => setFormOfCommunication(e.target.value)}
            />{/* 
            <FormControlLabel
              value="visible_light"
              control={<Radio />}
              label={t("RGB Light")}
              checked={formOfCommunication === "visible_light"}
              onChange={(e) => setFormOfCommunication(e.target.value)}
            /> */}
            <FormControlLabel
              value="infrared_light"
              control={<Radio />}
              label={t("Infrared Light")}
              checked={formOfCommunication === "infrared_light"}
              onChange={(e) => setFormOfCommunication(e.target.value)}
            />
          </RadioGroup>
        </FormControl>
        {/* <FormControl
          sx={{
            m: 1,
            width: "100%",
          }}
          variant="standard"
          required
        >
          <FormLabel>{t("Color of text")}</FormLabel>

          <RadioGroup>
            <FormControlLabel
              value="black"
              control={<Radio color="default" />}
              label={t("Black")}
              checked={colorOfText === "black"}
              onChange={(e) => setColorOfText(e.target.value)}
            />
            <FormControlLabel
              value="red"
              control={<Radio color="error" />}
              label={t("Red")}
              checked={colorOfText === "red"}
              onChange={(e) => setColorOfText(e.target.value)}
            />
          </RadioGroup>
        </FormControl> */}
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
          message: t("Please enter some text to send"),
        },
      ]);

      return;
    }
    /* return if error if only contains numbers */
    if (/^\d+$/.test(textToSend)) {
      setAlerts([
        ...alerts,
        {
          id: uuid(),
          severity: "error",
          message: t("Please enter some text to send"),
        },
      ]);
      return;
    }
    /* return error if contains "€" */
    if (textToSend.includes("€")) {
      setAlerts([
        ...alerts,
        {
          id: uuid(),
          severity: "error",
          message: t("Please do not use the euro symbol"),
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
          message: t("Please enter less than 50 characters"),
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
            message: t("Please select a form of communication"),
          },
        ]);
        return;
      }
      /* if (colorOfText.length === 0) {
        setAlerts([
          ...alerts,
          {
            id: uuid(),
            severity: "error",
            message: t("Please select a color of text"),
          },
        ]);
        return;
      } */
    }

    axios
      .post("http://localhost:3001/post", {
        text: textToSend,
        form: tabSelected === 1 ? formOfCommunication : "mqtt",
        color: tabSelected === 1 ? colorOfText : "black",
      })
      .then((res) => {
        setAlerts([
          ...alerts,
          {
            id: uuid(),
            severity: "success",
            message: t("alert_message_success", {
              textToSend,
              colorOfText: tabSelected === 1 ? colorOfText : "black",
              formOfCommunication:
                tabSelected === 1 ? formOfCommunication : "mqtt",
            }),
          },
        ]);
      })
      .catch((err) => {
        setAlerts([
          ...alerts,
          {
            id: uuid(),
            severity: "error",
            message: "Error sending message",
          },
        ]);
        console.log(err);
      })
      .finally(() => {
        console.log("done");
      });
  }
  useEffect(() => {
    setInterval(() => {
        updateMessage();
    }, 1000);
  }, [textToSend]);
  async function updateMessage() {
    axios
      .get("http://localhost:3001/api")
      .then((res) => {
        /* console.log(res.data); */
        setTextToSend(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        /* console.log("done"); */
      });
  }
  /* limit alert array to 3 elements */
  useEffect(() => {
    if (alerts.length > 3) {
      setAlerts(alerts.slice(1));
    }
  }, [alerts]);

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
          <Header
            languages={languages}
            languageSelected={languageSelected}
            setLanguageSelected={setLanguageSelected}
            t={t}
          />
          <TabComponent
            tabSelected={tabSelected}
            setTabSelected={setTabSelected}
            t={t}
            onRefresh={() => updateMessage()}
          />
          <FieldTextToSend
            key="text-to-send-input"
            value={textToSend}
            onChange={(value) => setTextToSend(value)}
            onCancel={() => setTextToSend("")}
            t={t}
          />
          {tabSelected === 1 && (
            <AdvancedModePanel
              key="advancedModePanelKey"
              formOfCommunication={formOfCommunication}
              setFormOfCommunication={setFormOfCommunication}
              colorOfText={colorOfText}
              setColorOfText={setColorOfText}
              t={t}
            />
          )}
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
          <AlertsStackComponent alerts={alerts} setAlerts={setAlerts} t={t} />

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
              {t("Cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              type="submit"
            >
              {t("Send")}
            </Button>
          </Box>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}
