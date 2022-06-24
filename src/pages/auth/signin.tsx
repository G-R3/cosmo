import { getProviders, signIn } from "next-auth/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { AiFillGithub } from "react-icons/ai";

const providerButtonStyles: Record<string, string> = {
  github: "bg-zinc-800 text-secondary hover:bg-zinc-700",
  google: "bg-blue-700 text-white hover:bg-blue-600",
};

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const callbackUrl = useRouter().query.callbackUrl as string;

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10">Log in to Cosmo</h1>
      <div className="max-w-xs">
        {Object.values(providers).map((provider: any) => (
          <button
            key={provider.id}
            className={`btn w-full mt-3 focus:outline-accent ${
              providerButtonStyles[provider.id]
            }`}
            onClick={() =>
              signIn(provider.id, { callbackUrl: callbackUrl ?? "/" })
            }
          >
            <AiFillGithub size={25} className="mr-2" />
            Sign in with {provider.name}
          </button>
        ))}
      </div>
    </div>
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
