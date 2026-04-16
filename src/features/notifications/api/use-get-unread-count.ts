import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetUnreadCount = () => {
  const [status, setStatus] = useState<
    "pending" | "success" | null
  >(null);

  const query = useQuery(api.notifications.getUnreadCount);

  const count = useMemo(() => {
    if (query === undefined) {
      setStatus("pending");
      return 0;
    }

    setStatus("success");
    return query;
  }, [query]);

  const isPending = status === "pending";
  const isSuccess = status === "success";

  return {
    count,
    isPending,
    isSuccess,
  };
};
