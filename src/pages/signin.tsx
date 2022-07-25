import { getProviders, signIn } from "next-auth/react";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { AiFillGithub, AiFillGoogleCircle } from "react-icons/ai";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

interface ProviderProps {
  styles: string;
  icon: JSX.Element;
}

const providerStyles: Record<string, ProviderProps> = {
  github: {
    styles: "bg-zinc-800 text-whiteAlt hover:bg-zinc-700",
    icon: <AiFillGithub size={25} className="mr-2" />,
  },
  google: {
    styles: "bg-blue-700 text-whiteAlt hover:bg-blue-600",
    icon: <AiFillGoogleCircle size={25} className="mr-2" />,
  },
};

const SignIn: NextPage = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const callbackUrl = useRouter().query.callbackUrl as string;

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10">Log in to Cosmo</h1>
      <div className="flex flex-col gap-4">
        {Object.values(providers).map((provider: any) => {
          const { styles, icon } = providerStyles[provider.id] as ProviderProps;
          return (
            <button
              key={provider.id}
              className={`h-12 p-4 rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all w-full ${styles}`}
              onClick={() =>
                signIn(provider.id, { callbackUrl: callbackUrl ?? "/" })
              }
            >
              {icon}
              Sign in with {provider.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};
