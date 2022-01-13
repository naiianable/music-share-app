import React, { useContext } from "react";
import { makeStyles } from "@mui/styles";
import {
	Card,
	CardContent,
	CardMedia,
	IconButton,
	Slider,
	Typography,
} from "@mui/material";
import QueuedSongList from "./QueuedSongList";
import { PlayArrow, SkipNext, SkipPrevious, Pause } from "@mui/icons-material";
import { SongContext } from "../App";

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		justifyContent: "space-between",
	},
	details: {
		display: "flex",
		flexDirection: "column",
		padding: "0px 15px",
	},
	content: {
		flex: "1 0 auto",
	},
	thumbnail: {
		width: 150,
	},
	controls: {
		display: "flex",
		alignItems: "center",
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
	},
	playIcon: {
		height: 38,
		width: 38,
	},
}));

const SongPlayer = () => {
	//bringing in hard coded song from app.js. setting data to "state" and using it to update jsx in player
	const { state, dispatch } = useContext(SongContext);
	const classes = useStyles();

	function handleTogglePlay() {
		dispatch(
			//create/dispatch new action types used by reducer
			//action is dispatched(clicking play/pause button), reducer runs, state is updated in SongPlayer, isPlaying is updated in this case
			state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" }
		);
	}

	return (
		<>
			<Card variant="outlined" className={classes.container}>
				<div className={classes.details}>
					<CardContent className={classes.content}>
						<Typography variant="h5" component="h3">
							{state.song.title}
						</Typography>
						<Typography
							variant="subtitle1"
							component="p"
							color="textSecondary"
						>
							{state.song.artist}
						</Typography>
					</CardContent>
					<div className={classes.controls}>
						<IconButton>
							<SkipPrevious />
						</IconButton>
						<IconButton onClick={handleTogglePlay}>
							{state.isPlaying ? (
								<Pause className={classes.playIcon} />
							) : (
								<PlayArrow className={classes.playIcon} />
							)}
						</IconButton>
						<IconButton>
							<SkipNext />
						</IconButton>
						<Typography
							variant="subtitle1"
							component="p"
							color="textSecondary"
						>
							00:01:30
						</Typography>
					</div>
					<Slider type="range" min={0} max={1} step={0.01} />
				</div>
				<CardMedia
					className={classes.thumbnail}
					image={state.song.thumbnail}
				/>
			</Card>
			<QueuedSongList />
		</>
	);
};

export default SongPlayer;
