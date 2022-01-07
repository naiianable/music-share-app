import React, { useState, useEffect } from "react";
import {
	TextField,
	InputAdornment,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AddBoxOutlined, Link } from "@mui/icons-material";
// import SoundCloudPlayer from "react-player/soundcloud";
// import YouTubePlayer from "react-player/youtube";
import ReactPlayer from "react-player/lazy";
import { useMutation } from "@apollo/client";
import { ADD_SONG } from "../graphql/mutations";

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		alignItems: "center",
	},
	urlInput: {
		margin: theme.spacing(1),
	},
	addSongButton: {
		margin: theme.spacing(1),
	},
	dialog: {
		textAlign: "center",
	},
	thumbnail: {
		width: "90%",
	},
}));

const DEFAULT_SONG = {
	duration: 0,
	title: "",
	artist: "",
	thumbnail: "",
};

const AddSong = () => {
	const classes = useStyles();
	const [addSong, { error }] = useMutation(ADD_SONG);
	const [url, setUrl] = useState("");
	// console.log("THIS IS URL", url);
	const [playable, setPlayable] = useState(false);
	const [dialog, setDialog] = useState(false);
	const [song, setSong] = useState(DEFAULT_SONG);

	//setting if the reactplayer can play a url to a boolean to toggle if button is disabled or not
	//if url CAN be played, button will be set to true.  in jsx, it will be set to the opposite boolean. if boolean is true(playable song), we DO NOT want the button to be disabled, therefore we need it to be false.
	useEffect(() => {
		const isPlayable = ReactPlayer.canPlay(url);
		setPlayable(isPlayable);
	}, [url]);

	//ALLOWING US TO EDIT SONGS BY CHANGING STATE OF SETSONG. NEW 'NAME' IS SET TO THE UPDATED VALUE
	//SPREAD OPERATOR (...) SPREADS IN ALL OTHER VALUES INTO THE STATE WITHOUT CHANGING IT, ONLY UPDATING NAME
	function handleChangeSong(e) {
		const { name, value } = e.target;
		setSong((prevSong) => ({
			...prevSong,
			//computed property syntax
			[name]: value,
		}));
	}

	// console.log("THIS IS ADDSONG CLASSES", classes);
	function handleCloseDialog() {
		setDialog(false);
	}

	//NEXT 3 CODE BLOCKS ARE RECEIVING DATA FROM MUSIC PROVIDER AND USING THAT TO DISPLAY ON PAGE
	//REVIEW THIS!!!!!!!!!!!!!!!!!!!!!!!
	async function handleEditSong({ player }) {
		const nestedPlayer = player.player.player;
		let songData;
		if (nestedPlayer.getVideoData) {
			songData = getYoutubeInfo(nestedPlayer);
		} else if (nestedPlayer.getCurrentSound) {
			songData = await getSoundCloudInfo(nestedPlayer);
		}
		setSong({ ...songData, url });
		// console.log("THIS IS PLAYER", songData);
	}

	async function handleAddSong() {
		try {
			const { url, thumbnail, duration, title, artist } = song;
			await addSong({
				variables: {
					url: url.length > 0 ? url : null,
					thumbnail: thumbnail.length > 0 ? thumbnail : null,
					duration: duration > 0 ? duration : null,
					title: title.length > 0 ? title : null,
					artist: artist.length > 0 ? artist : null,
				},
			});
			//clearing all input fields after adding song successfully
			handleCloseDialog();
			setSong(DEFAULT_SONG);
			setUrl("");
		} catch (error) {
			console.error("Error adding song", error);
		}
	}

	//REVIEW THIS!!!!!!!!!!!!!!!!!!!!!!!
	function getYoutubeInfo(player) {
		const duration = player.getDuration();
		const { title, video_id, author } = player.getVideoData();
		const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
		return {
			duration,
			title,
			artist: author,
			thumbnail,
		};
	}

	//REVIEW THIS!!!!!!!!!!!!!!!!!!!!!!!
	function getSoundCloudInfo(player) {
		return new Promise((resolve) => {
			player.getCurrentSound((songData) => {
				if (songData) {
					resolve({
						duration: Number(songData.duration / 1000),
						title: songData.title,
						artist: songData.user.username,
						thumbnail: songData.artwork_url.replace(
							"-large",
							"-t500x500"
						),
					});
				}
			});
		});
	}

	//custom error handler
	function handleError(field) {
		//optional chaining operator
		return error?.graphQLErrors[0]?.extensions?.path?.includes(field);
		//return error && error.graphQLErrors[0].extensions.path.includes(field);
	}

	//destructure song state to use in jsx
	const { thumbnail, title, artist } = song;
	// console.log("THIS IS SONG DECONSTRUCTED", thumbnail, title, artist);
	// console.dir(error); <----- shows object with error data returned from useMutation

	return (
		<div className={classes.container}>
			<Dialog
				className={classes.dialog}
				open={dialog}
				onClose={handleCloseDialog}
			>
				<DialogTitle>Edit Song</DialogTitle>
				<DialogContent>
					<img
						src={thumbnail}
						alt="Song Thumbnail"
						className={classes.thumbnail}
					/>
					<TextField
						value={title}
						onChange={handleChangeSong}
						margin="dense"
						name="title"
						label="Title"
						fullWidth
						error={handleError("title")}
						helperText={handleError("title") && "Fill out field"}
					/>
					<TextField
						value={artist}
						onChange={handleChangeSong}
						margin="dense"
						name="artist"
						label="Artist"
						fullWidth
						error={handleError("artist")}
						helperText={handleError("artist") && "Fill out field"}
					/>
					<TextField
						value={thumbnail}
						onChange={handleChangeSong}
						margin="dense"
						name="thumbnail"
						label="Thumbnail"
						fullWidth
						error={handleError("thumbnail")}
						helperText={
							handleError("thumbnail") && "Fill out field"
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="secondary">
						Cancel
					</Button>
					<Button
						onClick={handleAddSong}
						variant="outlined"
						color="primary"
					>
						Add Song
					</Button>
				</DialogActions>
			</Dialog>
			<TextField
				className={classes.urlInput}
				onChange={(e) => setUrl(e.target.value)}
				value={url}
				placeholder="Add Youtube or Soundcloud Url"
				fullWidth
				margin="normal"
				type="url"
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Link />
						</InputAdornment>
					),
				}}
			/>
			<Button
				// if song is not playable, button will be disabled
				disabled={!playable}
				className={classes.addSongButton}
				onClick={() => setDialog(true)}
				variant="contained"
				color="primary"
				endIcon={<AddBoxOutlined />}
			>
				Add
			</Button>
			<ReactPlayer url={url} hidden onReady={handleEditSong} />
		</div>
	);
};

export default AddSong;
