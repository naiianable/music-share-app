import { PlayArrow, Save } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import {
	CircularProgress,
	Card,
	CardActions,
	CardMedia,
	CardContent,
	Typography,
	IconButton,
} from "@mui/material";
import React, { Component } from "react";

const SongList = () => {
	let loading = false;

	const song = {
		title: "Tattoos Together",
		artist: "Lauv",
		thumbnail:
			"https://i.ytimg.com/an_webp/j9DnUII28fI/mqdefault_6s.webp?du=3000&sqp=CNra044G&rs=AOn4CLBhB_Q2D-UC69iiCRWx08vBbFn28g",
	};

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					marginTop: 50,
				}}
			>
				<CircularProgress />
			</div>
		);
	}
	return (
		<div>
			{/* Array.from: first arg is the length of array returned, sec arg is a .map that maps through object */}
			{/* Second .map get each song and its index and returning a new component from that */}
			{Array.from({ length: 10 }, () => song).map((song, i) => (
				// Passing song from func below as Component, able to destructure song in function to access title, artist, thumbnail
				<Song key={i} song={song} />
			))}
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		margin: theme.spacing(3),
	},
	songInfoContainer: {
		display: "flex",
		alignItems: "center",
	},
	songInfo: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
	},
	thumbnail: {
		objectFit: "cover",
		width: 140,
		height: 140,
	},
}));

function Song({ song }) {
	const { artist, thumbnail, title } = song;
	const classes = useStyles();

	return (
		<Card className={classes.container}>
			<div className={classes.songInfoContainer}>
				<CardMedia image={thumbnail} className={classes.thumbnail} />
				<div className={classes.songInfo}>
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							{title}
						</Typography>
						<Typography
							variant="body1"
							component="p"
							color="textSecondary"
						>
							{artist}
						</Typography>
					</CardContent>
					<CardActions>
						<IconButton size="small" color="primary">
							<PlayArrow />
						</IconButton>
						<IconButton size="small" color="secondary">
							<Save />
						</IconButton>
					</CardActions>
				</div>
			</div>
		</Card>
	);
}

export default SongList;
