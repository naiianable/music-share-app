import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { ApolloProvider } from "@apollo/client";
import theme from "./theme";
import client from "./graphql/client";

ReactDOM.render(
	<ApolloProvider client={client}>
		<ThemeProvider theme={theme}>
			{/* Need StyledEngineProvider in order to overwrite any css using makeStyles.  Wrap component tree with this!! */}
			<StyledEngineProvider injectFirst>
				<CssBaseline />
				<App />
			</StyledEngineProvider>
		</ThemeProvider>
	</ApolloProvider>,
	document.getElementById("root")
);
