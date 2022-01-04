import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { HeadsetTwoTone } from "@mui/icons-material";

//root css overriding margin
const useStyles = makeStyles((theme) => ({
	title: {
		paddingLeft: "8px",
	},
}));

const Header = () => {
	const classes = useStyles();
	// console.log("this is classes", classes);

	return (
		<AppBar color="primary" position="fixed">
			<Toolbar>
				<HeadsetTwoTone />
				<Typography
					className={classes.title}
					variant="h6"
					component="h1"
				>
					Music Share
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
