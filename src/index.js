import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import theme from "./theme";

ReactDOM.render(
	<ThemeProvider theme={theme}>
		{/* Need StyledEngineProvider in order to overwrite any css using makeStyles.  Wrap component tree with this!! */}
		<StyledEngineProvider injectFirst>
			<CssBaseline />
			<App />
		</StyledEngineProvider>
	</ThemeProvider>,
	document.getElementById("root")
);
