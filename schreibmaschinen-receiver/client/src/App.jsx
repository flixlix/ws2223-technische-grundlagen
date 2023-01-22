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
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  Alert,
  Autocomplete,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./App.css";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";
import axios from "axios";
import translations from "../src/assets/translations.json";
import { useTranslation } from "react-i18next";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

export default function App() {
  const [textToSend, setTextToSend] = useState("");
  const [formOfCommunication, setFormOfCommunication] = useState("");
  const [colorOfText, setColorOfText] = useState("");
  const [tabSelected, setTabSelected] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [table, setTable] = useState([]);
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
      if (colorOfText.length === 0) {
        setAlerts([
          ...alerts,
          {
            id: uuid(),
            severity: "error",
            message: t("Please select a color of text"),
          },
        ]);
        return;
      }
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
            severity: t("success"),
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
    updateTable();
  }, []);

  /* limit alert array to 3 elements */
  useEffect(() => {
    if (alerts.length > 3) {
      setAlerts(alerts.slice(1));
    }
  }, [alerts]);

  async function updateTable() {
    axios
      .get("http://localhost:3002/api")
      .then((res) => {
        console.log(res.data);
        setTable(res.data.messages);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("done");
      });
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Stack spacing={1}>
              <Typography variant="h3">
                {t("Communication of Typewriters")}
              </Typography>
              <Typography variant="h5">
                {t("Start your journey to the past")}
              </Typography>
            </Stack>

            <PrecisionManufacturingIcon
              sx={{
                width: "100px",
                height: "100px",
              }}
            />
            <FormControl>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={languageSelected}
                onChange={(e) => setLanguageSelected(e.target.value)}
                renderValue={(value) => {
                  const language = languages.find(
                    (language) => language.code === value
                  );
                  return (
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${language.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${language.code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                  );
                }}
              >
                {languages.map((language) => (
                  <MenuItem value={language.code}>
                    <Box sx={{ "& > img": { mr: 2, flexShrink: 0 } }}>
                      <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${language.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${language.code.toLowerCase()}.png 2x`}
                        alt=""
                      />
                      {language.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6">{t("Tasks")}</Typography>
            <IconButton
              onClick={() => {
                updateTable();
              }}
              aria-label="refresh"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("Text")}</TableCell>
                  <TableCell align="right">{t("Color")}</TableCell>
                  <TableCell align="right">{t("Form")}</TableCell>
                  <TableCell align="right">{t("Actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {table.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.message}
                    </TableCell>
                    <TableCell align="right">{row.color}</TableCell>
                    <TableCell align="right">{row.form}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          axios
                            .delete(`http://localhost:3002/api/${row.id}`)
                            .then((res) => {
                              console.log(res.data);
                              setTable(
                                table.filter((message) => message.id !== row.id)
                              );
                            })
                            .catch((err) => {
                              console.log(err);
                            })
                            .finally(() => {
                              console.log("done");
                            });
                        }}
                      >
                        <Tooltip title={t("Delete")}>
                          <DeleteIcon color="error" />
                        </Tooltip>
                      </IconButton>
                      <IconButton aria-label="send">
                        <Tooltip title={t("Start Typing")}>
                          <PlayCircleFilledWhiteIcon color="primary" />
                        </Tooltip>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
          ></Box>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}
