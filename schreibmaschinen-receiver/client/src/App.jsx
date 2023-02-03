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
  Modal,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export default function App() {
  const [textToSend, setTextToSend] = useState("");
  const [formOfCommunication, setFormOfCommunication] = useState("");
  const [colorOfText, setColorOfText] = useState("");
  const [tabSelected, setTabSelected] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [table, setTable] = useState([]);
  const [languageSelected, setLanguageSelected] = useState("GB");
  const { t, i18n } = useTranslation();
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [indexOfTyping, setIndexOfTyping] = useState(0);
  const [progressIndex, setProgressIndex] = useState(6);
  const [typingState, setTypingState] = useState("");
  const [indexToDelete, setIndexToDelete] = useState(0);
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
    /* updateTable(); */
    /* update every second */
    const interval = setInterval(() => {
      updateTable();
    }, 1000);
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
        /* console.log(res.data); */
        setTable(res.data.messages);
        setProgressIndex(res.data.progressIndex);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        /* console.log("done"); */
      });
  }

  /* useEffect(() => {
    console.log(table);
  }, [table]); */

  /* useEffect(() => {
    if (!progressModalOpen) {
      setIndexOfTyping(0);
      setTypingState("");
      setProgressIndex(6);
    }
  }, [progressModalOpen]); */

  useEffect(() => {
    if (!progressModalOpen) {
      sendStopCommand();
    }
  }, [progressModalOpen]);

  async function sendStopCommand() {
    axios
      .post("http://localhost:3002/api", {
        text: "stop",
        action: "stop",
      })
      .then((res) => {
        console.log(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }

  async function handleTyping({ i, action }) {
    axios
      .post("http://localhost:3002/api", {
        text: table[i]?.message,
        action: action,
        index: i,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /* if progress index reached length - 1 of text */
  useEffect(() => {
    /* console.log(progressIndex);
    console.log(table[indexOfTyping]?.message?.length); */
    if (progressIndex > table[indexOfTyping]?.message?.length - 1) {
      setTypingState("done");
      setTimeout(() => {
        /* after finishing, delete task */
        handleTyping({ i: indexOfTyping, action: "delete" });
        /* close modal window of progress */
        setProgressModalOpen(false);
        /* set characters written index to 0 */
        setProgressIndex(0);
      }, 10000);
    }
  }, [progressIndex]);

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
            <PrecisionManufacturingIcon
              sx={{
                width: "100px",
                height: "100px",
              }}
            />
            <Stack spacing={1}>
              <Typography variant="h3">
                {t("Communication of Typewriters")}
              </Typography>
              <Typography variant="h5">
                {t("Start your journey to the past")}
              </Typography>
            </Stack>

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
                  <MenuItem value={language.code} key={language}>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => {
                  setDeleteAllModalOpen(true);
                }}
              >
                {t("Delete all tasks")}
              </Button>
              <Tooltip title={t("Refresh table")}>
                <IconButton
                  onClick={() => {
                    updateTable();
                  }}
                  aria-label="refresh"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 610,
            }}
          >
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
                {table.length > 0 ? (
                  table.map((row, index) => (
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
                            setDeleteModalOpen(true);
                            setIndexToDelete(index);
                          }}
                        >
                          <Tooltip title={t("Delete")}>
                            <DeleteIcon color="error" />
                          </Tooltip>
                        </IconButton>
                        <IconButton
                          aria-label="send"
                          onClick={() => {
                            setTypingState("typing");
                            setProgressModalOpen(true);
                            setIndexOfTyping(index);
                            console.log(index);
                            handleTyping({ i: index, action: "start" });
                          }}
                        >
                          <Tooltip title={t("Start Typing")}>
                            <PlayCircleFilledWhiteIcon color="primary" />
                          </Tooltip>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      colSpan={5}
                      sx={{ p: 5 }}
                    >
                      <TaskAltIcon
                        sx={{
                          width: "100px",
                          height: "100px",
                        }}
                        color="disabled"
                      />
                      <Typography variant="h6">
                        {t("No tasks to show")}
                      </Typography>
                      <Typography variant="body2">
                        {t(
                          "To add a task, go to the other side and start typing on the typewriter"
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
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
      <Modal
        open={progressModalOpen}
        onClose={() => {
          setProgressModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {typingState === "done" ? t("Done") : t("Typing in progress")}
            </Typography>
            <Typography id="modal-modal-description">
              {typingState === "done"
                ? t("Go look at your new artpiece!")
                : t("This may take a while, but it's worth it!")}
            </Typography>

            {typingState === "done" ? (
              <LinearProgress
                color="success"
                variant="determinate"
                value={100}
              />
            ) : (
              <LinearProgress
                color="primary"
                variant="determinate"
                value={
                  (progressIndex / table[indexOfTyping]?.message?.length) * 100
                }
              />
            )}
            <div
              style={{
                display: "inline",
                overflow: "hidden",
                wordWrap: "break-word",
                width: "auto",
              }}
            >
              {/* go through message character by character */}
              {table[indexOfTyping]?.message !== undefined &&
                table[indexOfTyping]?.message
                  .split("")
                  .map((character, index) => {
                    return (
                      <Typography
                        key={index}
                        id="modal-modal-description"
                        variant="h2"
                        sx={{
                          display: "inline",
                          mt: 2,
                          transition: "all 0.2s ease-in-out",
                          color:
                            typingState === "typing"
                              ? progressIndex > index
                                ? "primary.main"
                                : "text.disabled"
                              : typingState === "done" && "success.main",
                        }}
                      >
                        {character === " " ? "_" : character}
                      </Typography>
                    );
                  })}
            </div>
          </Stack>
        </Box>
      </Modal>
      <Dialog
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t("Delete")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("Are you sure you want to delete this task?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteModalOpen(false);
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => {
              handleTyping({ i: indexToDelete, action: "delete" });
              setDeleteModalOpen(false);
            }}
            autoFocus
            variant="contained"
            color="error"
          >
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteAllModalOpen}
        onClose={() => {
          setDeleteAllModalOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("Delete all tasks")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("Are you sure you want to delete all tasks?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteAllModalOpen(false);
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => {
              handleTyping({ action: "clear" });
              setDeleteAllModalOpen(false);
            }}
            autoFocus
            variant="contained"
            color="error"
          >
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
