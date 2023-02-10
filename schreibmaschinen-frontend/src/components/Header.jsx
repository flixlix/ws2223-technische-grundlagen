import { Box, Stack, Typography, Select, MenuItem } from "@mui/material";
import PanToolAltIcon from "@mui/icons-material/PanToolAlt";
import FormControl from "@mui/material/FormControl";

export default function Header({
  languages,
  languageSelected,
  setLanguageSelected,
  t,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 2,
        }}
      >
        <PanToolAltIcon
          sx={{
            width: "100px",
            height: "100px",
          }}
        />
        <Stack spacing={2}>
          <Typography
            variant="h3"
            sx={{
              display: "inline",
              width: "fit-content",
            }}
          >
            {t("Communication of Typewriters")}
          </Typography>
          <Typography variant="h5">
            {t("Start your journey to the past")}
          </Typography>
        </Stack>
      </Box>
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
                key={language.code}
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
            <MenuItem value={language.code} key={language.code}>
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
  );
}
