import React, { useEffect, useState, useContext, useRef } from "react";
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
import { useQuery } from "@apollo/client";
import { GET_QUEUED_SONGS } from "../graphql/queries";
import ReactPlayer from "react-player";

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
	const reactPlayerRef = useRef();
	//setting state for slider in player
	const [played, setPlayed] = useState(0);
	const [seeking, setSeeking] = useState(false);
	const [playedSeconds, setPlayedSeconds] = useState(0);
	const [positionInQueue, setPositionInQueue] = useState(0);
	const { data } = useQuery(GET_QUEUED_SONGS);
	//bringing in hard coded song from app.js. setting data to "state" and using it to update jsx in player
	const { state, dispatch } = useContext(SongContext);
	const classes = useStyles();

	useEffect(() => {
		const songIndex = data.queue.findIndex(
			(song) => song.id === state.song.id
		);
		setPositionInQueue(songIndex);
	}, [data.queue, state.song.id]);

	useEffect(() => {
		const nextSong = data.queue[positionInQueue + 1];
		if (played >= 0.99 && nextSong) {
			setPlayed(0);
			dispatch({ type: "SET_SONG", payload: { song: nextSong } });
		}
	}, [data.queue, played, dispatch, positionInQueue]);

	function handleTogglePlay() {
		dispatch(
			//create/dispatch new action types used by reducer
			//action is dispatched(clicking play/pause button), reducer runs, state is updated in SongPlayer, isPlaying is updated in this case
			state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" }
		);
	}

	function handleProgressChange(e, newValue) {
		//adjusting position of slider when moved manually by updating state
		setPlayed(newValue);
	}

	//allows user to move slider
	function handleSeekMouseDown() {
		setSeeking(true);
	}

	//sets slider after moving
	function handleSeekMouseUp() {
		setSeeking(false);
		//reactPlayerRef.current accesses current value
		//seekTo built in method
		reactPlayerRef.current.seekTo(played);
	}

	//formatting playedSeconds
	function formatDuration(seconds) {
		return new Date(seconds * 1000).toISOString().substr(11, 8);
	}

	function handlePlayNextSong() {
		const nextSong = data.queue[positionInQueue + 1];
		if (nextSong) {
			dispatch({ type: "SET_SONG", payload: { song: nextSong } });
		}
	}

	function handlePlayPrevSong() {
		const prevSong = data.queue[positionInQueue - 1];
		if (prevSong) {
			dispatch({ type: "SET_SONG", payload: { song: prevSong } });
		}
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
							<SkipPrevious onClick={handlePlayPrevSong} />
						</IconButton>
						<IconButton onClick={handleTogglePlay}>
							{state.isPlaying ? (
								<Pause className={classes.playIcon} />
							) : (
								<PlayArrow className={classes.playIcon} />
							)}
						</IconButton>
						<IconButton>
							<SkipNext onClick={handlePlayNextSong} />
						</IconButton>
						<Typography
							variant="subtitle1"
							component="p"
							color="textSecondary"
						>
							{formatDuration(playedSeconds)}
						</Typography>
					</div>
					<Slider
						// updating played using state and setting to value so slider updates as well
						value={played}
						onChange={handleProgressChange}
						onMouseDown={handleSeekMouseDown}
						onMouseUp={handleSeekMouseUp}
						type="range"
						min={0}
						max={1}
						step={0.01}
					/>
				</div>
				{/* component to make song play */}
				<ReactPlayer
					ref={reactPlayerRef}
					onProgress={({ played, playedSeconds }) => {
						if (!seeking) {
							setPlayed(played);
							setPlayedSeconds(playedSeconds);
						}
					}}
					url={state.song.url}
					playing={state.isPlaying}
					hidden
				/>
				<CardMedia
					className={classes.thumbnail}
					image={state.song.thumbnail}
				/>
			</Card>
			<QueuedSongList queue={data.queue} />
		</>
	);
};

export default SongPlayer;
