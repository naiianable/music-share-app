import { Pause, PlayArrow, Save } from "@mui/icons-material";
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
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useSubscription } from "@apollo/client";
import { GET_SONGS } from "../graphql/subscriptions";
import { SongContext } from "../App";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

const SongList = () => {
	//useSubscription is to update page instantly without sending additional request.  different from useQuery
	//*** see client.js for setup
	const { data, loading, error } = useSubscription(GET_SONGS);

	// console.log("THIS IS DATA", data);
	// console.log("THIS IS LOADING", loading);
	// console.log("THIS IS ERROR", error);

	// const song = {
	// 	title: "Tattoos Together",
	// 	artist: "Lauv",
	// 	thumbnail:
	// 		"https://i.ytimg.com/an_webp/j9DnUII28fI/mqdefault_6s.webp?du=3000&sqp=CNra044G&rs=AOn4CLBhB_Q2D-UC69iiCRWx08vBbFn28g",
	// };

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

	if (error) return <div>Error Fetching Songs</div>;

	return (
		<div>
			{/* Array.from: first arg is the length of array returned, sec arg is a .map that maps through object */}
			{/* Second .map get each song and its index and returning a new component from that */}
			{data.songs.map((song) => (
				// Passing song from func below as Component, able to destructure song in function to access title, artist, thumbnail
				<Song key={song.id} song={song} />
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
	const { id } = song;
	const { state, dispatch } = useContext(SongContext);
	const [currentSongPlaying, setCurrentSongPlaying] = useState(false);
	const { artist, thumbnail, title } = song;
	const classes = useStyles();
	//usemutation second parameter onCompleted callback. returns data from executed mutation
	const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
		onCompleted: (data) => {
			//returning data and setting it in local storage from client.js mutation type and resolvers
			localStorage.setItem(
				"queue",
				JSON.stringify(data.addOrRemoveFromQueue)
			);
		},
	});

	useEffect(() => {
		const isSongPlaying = state.isPlaying && id === state.song.id;
		setCurrentSongPlaying(isSongPlaying);
	}, [id, state.song.id, state.isPlaying]);

	function handleTogglePlay() {
		//payload is used in reducer, assigning the song as action.payload.song
		dispatch({ type: "SET_SONG", payload: { song } });
		dispatch(
			state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" }
		);
	}

	function handleAddOrRemoveFromQueue() {
		addOrRemoveFromQueue({
			//__typename is just the name of thing we're working with
			//where data is provided to input in client in order to change
			variables: { input: { ...song, __typename: "Song" } },
		});
	}

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
						<IconButton
							onClick={handleTogglePlay}
							size="small"
							color="primary"
						>
							{currentSongPlaying ? <Pause /> : <PlayArrow />}
						</IconButton>
						<IconButton
							onClick={handleAddOrRemoveFromQueue}
							size="small"
							color="secondary"
						>
							<Save />
						</IconButton>
					</CardActions>
				</div>
			</div>
		</Card>
	);
}

export default SongList;
