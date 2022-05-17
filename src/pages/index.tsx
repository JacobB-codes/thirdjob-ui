import { useJobsQuery } from "../generated/graphql";
import Layout from "../components/Layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = useJobsQuery({
    variables: {
      limit: 15,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <div>
        <div>your query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>Thirdjob</Heading>
        <NextLink href="/create-job">
          <Link ml="auto">create job</Link>
        </NextLink>
      </Flex>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.jobs.jobs.map((j) => (
            <Box key={j.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{j.title}</Heading>
              <Text fontSize="sm">
                posted by {j.creator.username} at {j.createdAt}
              </Text>
              <Text mt={4}>{j.descriptionSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && data.jobs.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor: data.jobs.jobs[data.jobs.jobs.length - 1].createdAt,
                },
              });
            }}
            isLoading={loading}
            colorScheme="teal"
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
