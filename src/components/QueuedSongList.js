import { makeStyles } from "@mui/styles";
import { Delete } from "@mui/icons-material";
import { Avatar, IconButton, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { useMutation } from "@apollo/client";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

const QueuedSongList = ({ queue }) => {
	console.log({ queue });
	//checking to see if screen size is bigger than "md"(medium).  use greaterThanMd as a boolean to display components
	const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

	// const song = {
	// 	title: "Tattoos Together",
	// 	artist: "Lauv",
	// 	thumbnail:
	// 		"https://i.ytimg.com/an_webp/j9DnUII28fI/mqdefault_6s.webp?du=3000&sqp=CNra044G&rs=AOn4CLBhB_Q2D-UC69iiCRWx08vBbFn28g",
	// };

	return (
		greaterThanMd && (
			<div style={{ margin: "10px 0" }}>
				<Typography color="textSecondary" variant="button">
					QUEUE ({queue.length})
				</Typography>
				{queue.map((song, i) => (
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
	const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
		onCompleted: (data) => {
			//returning data and setting it in local storage from client.js mutation type and resolvers
			localStorage.setItem(
				"queue",
				JSON.stringify(data.addOrRemoveFromQueue)
			);
		},
	});
	const { thumbnail, artist, title } = song;

	function handleAddOrRemoveFromQueue() {
		addOrRemoveFromQueue({
			//__typename is just the name of thing we're working with
			//where data is provided to input in client in order to change
			variables: { input: { ...song, __typename: "Song" } },
		});
	}

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
			<IconButton onClick={handleAddOrRemoveFromQueue}>
				<Delete color="error" />
			</IconButton>
		</div>
	);
}

export default QueuedSongList;
