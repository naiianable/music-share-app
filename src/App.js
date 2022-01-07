import React, { createContext, useContext, useReducer } from "react";
import Header from "./components/Header";
import AddSong from "./components/AddSong";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import { Grid, useMediaQuery, Hidden } from "@mui/material";

export const SongContext = createContext({
	song: {
		id: "94ca81ac-9f3a-42d6-8d55-941d5d5825f9",
		title: "I Like Me Better [Official Video]",
		artist: "Lauv",
		thumbnail: "http://img.youtube.com/vi/BcqxLCWn-CE/0.jpg",
		url: "https://www.youtube.com/watch?v=BcqxLCWn-CE",
		duration: 206,
	},
	isPlaying: false,
});

function App() {
	const initialSongState = useContext(SongContext);
	const [state, dispatch] = useReducer(() => {}, initialSongState);
	//see queuedsonglist for ex
	const greaterThanSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));
	const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

	return (
		<SongContext.Provider value={{ state, dispatch }}>
			<Hidden only="xs">
				<Header />
			</Hidden>

			<Grid container spacing={3}>
				<Grid
					style={{ marginTop: greaterThanSm ? "80px" : 10 }}
					item
					xs={12}
					md={7}
				>
					<AddSong />
					<SongList />
				</Grid>
				<Grid
					style={
						greaterThanMd
							? {
									top: 70,
									position: "fixed",
									width: "100%",
									right: 8,
							  }
							: {
									position: "fixed",
									width: "100%",
									left: 0,
									bottom: 0,
							  }
					}
					item
					xs={12}
					md={5}
				>
					<SongPlayer />
				</Grid>
			</Grid>
		</SongContext.Provider>
	);
}

export default App;
