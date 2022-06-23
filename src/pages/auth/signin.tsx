import { getProviders, signIn } from "next-auth/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const callbackUrl = useRouter().query.callbackUrl as string;

  return (
    <>
      {Object.values(providers).map((provider: any) => (
        <div key={provider.name}>
          <button
            className="btn"
            onClick={() =>
              signIn(provider.id, { callbackUrl: callbackUrl ?? "/" })
            }
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};
