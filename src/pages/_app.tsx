import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedJobs } from "../generated/graphql";

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql` as string,
  credentials: "include",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          jobs: {
            keyArgs: [],
            merge(
              existing: PaginatedJobs | undefined,
              incoming: PaginatedJobs
            ): PaginatedJobs {
              console.log(existing, incoming);
              return {
                ...incoming,
                jobs: [...(existing?.jobs || []), ...incoming.jobs],
              };
            },
          },
        },
      },
    },
  }),
});

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
