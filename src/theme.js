import { createTheme } from "@mui/material/styles";
import { teal, purple } from "@mui/material/colors";

const theme = createTheme({
	palette: {
		primary: teal,
		secondary: purple,
		background: {
			default: "#212121",
		},
	},
});

console.log(theme);

export default theme;
