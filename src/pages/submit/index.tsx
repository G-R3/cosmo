import { NextPageWithAuth } from "@/components/auth/Auth";
import { CreatePost } from "@/components/Submit/CreatePost";

const Submit: NextPageWithAuth = () => {
  return <CreatePost />;
};

Submit.auth = true;

export default Submit;
