import type { NextPage } from "next";
import Image from "next/image";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <>
      <Navbar />
      <section className="flex flex-col items-center gap-10">
        <div className="w-full max-w-3xl bg-white rounded-md p-5">
          <h2 className="text-xl font-semibold">This is My Post</h2>
          <span className="flex gap-2 mb-3">
            <small>Posted by</small>
            <small>Tuxedoed</small>
            <small>10 hrs ago</small>
          </span>
          {/* <Image width={256} height={256} /> */}
          {/* <div className="h-96 w-full bg-gray-300 rounded-md"></div> */}
          <div className="truncate">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
            excepturi, quibusdam laborum assumenda veritatis odit unde voluptas
            necessitatibus dolorem expedita deserunt? A et repellat autem!
            Voluptate soluta earum pariatur ea officia in, sed quidem veritatis
            quo suscipit ipsum ipsam ullam doloremque eum quisquam tempore
            officiis iure dolorem. Corporis, illo ipsa quidem eveniet temporibus
            tenetur delectus maxime sapiente assumenda harum pariatur eaque
            perspiciatis architecto adipisci, omnis officia, accusantium amet
            nobis necessitatibus! Ratione incidunt nisi officiis numquam.
            Adipisci aspernatur sequi maxime molestiae eligendi atque fugit eius
            est nulla cum exercitationem qui doloremque commodi, non assumenda
            necessitatibus mollitia nemo reiciendis explicabo quisquam
            molestias!
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex justify-center items-center gap-2">
              <button>Upvote</button>
              <span>123</span>
              <button>Downvote</button>
            </div>
            <div className="flex gap-5">
              <button>Share</button>
              <button>Save</button>
              <button>100 Comment</button>
            </div>
          </div>
        </div>
        <div className="w-full max-w-3xl bg-white rounded-md p-5">
          <h2 className="text-xl font-semibold">This is My Post</h2>
          <span className="flex gap-2 mb-3">
            <small>Posted by</small>
            <small>Tuxedoed</small>
            <small>10 hrs ago</small>
          </span>
          {/* <Image width={256} height={256} /> */}
          <div className="h-96 w-full bg-gray-300 rounded-md"></div>

          <div className="flex justify-between mt-3">
            <div className="flex justify-center items-center gap-2">
              <button>Upvote</button>
              <span>123</span>
              <button>Downvote</button>
            </div>
            <div className="flex gap-5">
              <button>Share</button>
              <button>Save</button>
              <button>Comment</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
