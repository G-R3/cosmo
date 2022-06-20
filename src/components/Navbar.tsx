import Link from "next/link";
import { useSession, signIn, signOut, getProviders } from "next-auth/react";

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav className="p-3 px-5">
      <ul className="flex gap-5 justify-end">
        <li>
          <Link href="/submit">
            <a className="p-3">Create Post</a>
          </Link>
        </li>
        <li>
          {session ? (
            <button onClick={() => signOut()}>Sign out</button>
          ) : (
            <button onClick={() => signIn()}>Sign in</button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
