import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMemberProps {
  id: Id<"members"> | undefined;
}

export const useGetMember = ({ id }: UseGetMemberProps) => {
  const data = useQuery(api.members.getById, id ? { id } : "skip");
  const isLoading = data === undefined;

  return { data, isLoading };
};
