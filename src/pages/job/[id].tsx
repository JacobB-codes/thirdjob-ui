import { Heading, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useJobQuery } from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";

const Job: NextPage = () => {
  const router = useRouter();
  const { data, loading } = useJobQuery({
    variables: {
      id: typeof router.query.id === "string" ? +router.query.id : -1,
    },
  });

  if (!loading && !data) {
    return <div>Something went wrong with the query</div>;
  }

  return (
    <Layout>
      {data?.job && !loading ? (
        <Stack>
          <Heading>{data?.job?.title}</Heading>
          <Text>
            posted by <b>{data.job?.creator.username}</b> at{" "}
            <b>{data.job?.createdAt}</b>
          </Text>
          <Text>{data?.job?.description}</Text>
        </Stack>
      ) : (
        <div>didnt work</div>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Job);
