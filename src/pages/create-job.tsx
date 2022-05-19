import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCreateJobMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

const CreateJob: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();

  const [createJob] = useCreateJobMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={async (values) => {
          const { errors } = await createJob({
            variables: { options: values },
            update: (cache) => {
              cache.evict({ fieldName: "jobs" });
            },
          });
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="Title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="description"
                placeholder="description..."
                label="Description"
              />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              _hover={{
                bgGradient: "linear(to-br, red.500, yellow.500)",
              }}
            >
              create job
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreateJob);
