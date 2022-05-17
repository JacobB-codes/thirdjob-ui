import { withApollo as createWithApollo } from "next-apollo";
import { PaginatedJobs } from "../generated/graphql";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { isServer } from "./isServer";

const createApolloClient = (ctx?: NextPageContext) => {
  return new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql` as string,
    credentials: "include" as const,
    headers: {
      cookie: (isServer() ? ctx?.req?.headers.cookie : undefined) || "",
    },
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
                return {
                  ...incoming, // take 'hasMore' field from the incoming page
                  jobs: [...(existing?.jobs || []), ...incoming.jobs],
                };
              },
            },
          },
        },
      },
    }),
  });
};

export const withApollo = createWithApollo(createApolloClient);
