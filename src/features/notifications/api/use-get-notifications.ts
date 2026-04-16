import { useCallback, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type ResponseType = typeof api.notifications.get._returnType;

export const useGetNotifications = () => {
  const [status, setStatus] = useState<
    "pending" | "error" | "success" | "settled" | null
  >(null);

  const query = useQuery(api.notifications.get);

  const data = useMemo(() => {
    if (query === undefined) {
      setStatus("pending");
      return undefined;
    }

    setStatus("success");
    return query;
  }, [query]);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  return {
    data,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
