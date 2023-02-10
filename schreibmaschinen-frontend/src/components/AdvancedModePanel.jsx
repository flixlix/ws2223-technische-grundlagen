import React from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

export default function AdvancedModePanel({
  formOfCommunication,
  setFormOfCommunication,
  colorOfText,
  setColorOfText,
  t,
}) {
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
          />
          {/* <FormControlLabel
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
