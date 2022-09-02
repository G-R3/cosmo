import { trpc, UserCommunities } from "@/utils/trpc";
import Link from "next/link";
import { FC, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "../common/Button";

interface PanelProps {
  title: string;
  data: UserCommunities;
}

const minItems = 5;

const CommunitiesPanel: FC<PanelProps> = ({ title, data }) => {
  const { data: session } = useSession();
  const [expanded, setExpanded] = useState(false);

  const itemsToShow = expanded ? data.communities.length : minItems;

  return (
    <div className="bg-whiteAlt dark:bg-darkOne p-5 rounded-md">
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="space-y-4">
        {data.communities.slice(0, itemsToShow).map((community) => (
          <PanelItem
            key={community.id}
            id={community.id}
            name={community.name}
            members={community._count.members}
            isMember={community.members.some(
              (member) => member.userId === session?.user.id,
            )}
          />
        ))}
        {data.communities.length > minItems && (
          <Button
            onClick={() => setExpanded((expanded) => !expanded)}
            size="sm"
            fullWidth
            className="hover:bg-secondaryHover active:bg-secondaryActive focus:bg-secondaryHover"
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        )}
      </div>
    </div>
  );
};

const PanelItem: FC<{
  id: string;
  name: string;
  members: number;
  isMember: boolean;
}> = ({ id, name, members, isMember }) => {
  const utils = trpc.useContext();

  const joinMutation = trpc.useMutation(["community.join"], {
    onSuccess(data, variables, context) {
      utils.invalidateQueries(["user.get-communities"]);
    },
  });
  const leaveMutation = trpc.useMutation(["community.leave"], {
    onSuccess(data, variables, context) {
      utils.invalidateQueries(["user.get-communities"]);
    },
  });

  return (
    <>
      <div className="flex justify-between">
        <div className="max-w-[97%] overflow-hidden text-ellipsis text-grayAlt">
          <Link href={`/community/${name}`}>
            <a className="text-sm font-semibold">{name}</a>
          </Link>
          <div className="text-xs">
            {members === 1 ? `${members} member` : `${members} members`}
          </div>
        </div>
        {isMember ? (
          <Button
            variant="secondary"
            size="sm"
            loading={leaveMutation.isLoading}
            onClick={() => leaveMutation.mutate({ communityId: id })}
          >
            Leave
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            loading={joinMutation.isLoading}
            onClick={() => joinMutation.mutate({ communityId: id })}
          >
            Join
          </Button>
        )}
      </div>
    </>
  );
};

export default CommunitiesPanel;
