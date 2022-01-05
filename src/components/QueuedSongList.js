import { makeStyles } from "@mui/styles";
import { Delete } from "@mui/icons-material";
import { Avatar, IconButton, Typography, useMediaQuery } from "@mui/material";
import React from "react";

const QueuedSongList = () => {
	//checking to see if screen size is bigger than "md"(medium).  use greaterThanMd as a boolean to display components
	const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

	const song = {
		title: "Tattoos Together",
		artist: "Lauv",
		thumbnail:
			"https://i.ytimg.com/an_webp/j9DnUII28fI/mqdefault_6s.webp?du=3000&sqp=CNra044G&rs=AOn4CLBhB_Q2D-UC69iiCRWx08vBbFn28g",
	};

	return (
		greaterThanMd && (
			<div style={{ margin: "10px 0" }}>
				<Typography color="textSecondary" variant="button">
					QUEUE (5)
				</Typography>
				{Array.from({ length: 5 }, () => song).map((song, i) => (
					<QueuedSong key={i} song={song} />
				))}
			</div>
		)
	);
};

const useStyles = makeStyles({
	avatar: {
		width: 44,
		height: 44,
	},
	text: {
		textOverflow: "ellipsis",
		overflow: "hidden",
	},
	container: {
		display: "grid",
		girdAutoFlow: "column",
		gridTemplateColumns: "50px auto 50px",
		gridGap: 12,
		lineItems: "center",
		marginTop: 10,
	},
	songInfoContainer: {
		overflow: "hidden",
		whiteSpace: "nowrap",
	},
});

function QueuedSong({ song }) {
	const classes = useStyles();
	const { thumbnail, artist, title } = song;

	return (
		<div className={classes.container}>
			<Avatar
				src={thumbnail}
				alt="Song thumbnail"
				className={classes.avatar}
			/>
			<div className={classes.songInfoContainer}>
				<Typography variant="subtitle2" className={classes.text}>
					{title}
				</Typography>
				<Typography
					color="textSecondary"
					variant="body2"
					className={classes.text}
				>
					{artist}
				</Typography>
			</div>
			<IconButton>
				<Delete color="error" />
			</IconButton>
		</div>
	);
}

export default QueuedSongList;
