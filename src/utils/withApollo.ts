import { withApollo as createWithApollo } from "next-apollo";
import { PaginatedJobs } from "../generated/graphql";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { isServer } from "./isServer";

const createApolloClient = (ctx?: NextPageContext) => {
  console.log(ctx?.req?.headers);
  return new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql` as string,
    credentials: "include",
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
};

export const withApollo = createWithApollo(createApolloClient);
