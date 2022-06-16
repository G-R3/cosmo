import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="p-3 px-5">
      <ul className="flex gap-5 justify-end">
        <li>
          <Link href="/submit">
            <a className="p-3">Create Post</a>
          </Link>
        </li>
        <li>
          <Link href="/sign-in">
            <a className="p-3">Sign In</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
