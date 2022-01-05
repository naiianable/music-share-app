import React, { useState } from "react";
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

const AddSong = () => {
	const classes = useStyles();
	const [dialog, setDialog] = useState(false);

	console.log("THIS IS ADDSONG CLASSES", classes);
	function handleCloseDialog() {
		setDialog(false);
	}

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
						src="https://randomwordgenerator.com/img/picture-generator/51e0d3464d52b10ff3d8992cc12c30771037dbf85254794e70267cd39644_640.jpg"
						alt="Song Thumbnail"
						className={classes.thumbnail}
					/>
					<TextField
						margin="dense"
						name="title"
						label="Title"
						fullWidth
					/>
					<TextField
						margin="dense"
						name="artist"
						label="Artist"
						fullWidth
					/>
					<TextField
						margin="dense"
						name="thumbnail"
						label="Thumbnail"
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="secondary">
						Cancel
					</Button>
					<Button variant="outlined" color="primary">
						Add Song
					</Button>
				</DialogActions>
			</Dialog>
			<TextField
				className={classes.urlInput}
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
				className={classes.addSongButton}
				onClick={() => setDialog(true)}
				variant="contained"
				color="primary"
				endIcon={<AddBoxOutlined />}
			>
				Add
			</Button>
		</div>
	);
};

export default AddSong;
