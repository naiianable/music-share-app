import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { GET_QUEUED_SONGS } from "./queries";

const client = new ApolloClient({
	//setting up subscription using websocketlink
	//wss connection instead of http
	link: new WebSocketLink({
		uri: "wss://music-share-project.herokuapp.com/v1/graphql",
		options: {
			reconnect: true,
		},
	}),
	cache: new InMemoryCache(),
	//writing query to made to local storage
	// object types being defined, Song using same parameters as listed in Hasura
	//input allows us to collect all of the arguments we would normally be passing in a mutation or any graphql operation. used in addOrRemoveFromQueue
	//Query is naming what kind of query we want to perform. named queue returning an array of songs (required)
	//Mutation will allow to add or remove items from queue
	typeDefs: gql`
		type Song {
			id: uuid!
			title: String!
			artist: String!
			thumbnail: String!
			duration: Float!
			url: String!
		}

		input SongInput {
			id: uuid!
			title: String!
			artist: String!
			thumbnail: String!
			duration: Float!
			url: String!
		}

		type Query {
			queue: [Song]!
		}

		type Mutation {
			addOrRemoveFromQueue(input: SongInput!): [Song]!
		}
	`,
	//how queries and mutations are resolved, how that data is used
	resolvers: {
		Mutation: {
			//how data recieved on input will be turned into song array
			//takes 3 inputs, able to work directly with cache
			addOrRemoveFromQueue: (_, { input }, { cache }) => {
				const queryResult = cache.readQuery({
					query: GET_QUEUED_SONGS,
				});
				if (queryResult) {
					const { queue } = queryResult;
					const isInQueue = queue.some(
						(song) => song.id === input.id
					);
					const newQueue = isInQueue
						? queue.filter((song) => song.id !== input.id)
						: [...queue, input];
					cache.writeQuery({
						query: GET_QUEUED_SONGS,
						data: { queue: newQueue },
					});
					return newQueue;
				}
				//returning empty array in case nothing is read for whatever reason
				return [];
			},
		},
	},
});

//checking if local storage has anything and setting it as a boolean
const hasQueue = Boolean(localStorage.getItem("queue"));

const data = {
	//if there is stuff in localstorage then getting everything with key 'queue' and parsing to JSON
	queue: hasQueue ? JSON.parse(localStorage.getItem("queue")) : [],
};

//initializing empty array made above for queue to start off with
client.writeQuery({
	query: GET_QUEUED_SONGS,
	data: data,
});

export default client;
