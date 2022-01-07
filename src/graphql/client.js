import { ApolloClient, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

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
});

export default client;
