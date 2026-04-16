import { useCallback, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  workspaceId?: Id<"workspaces">;
};

type ResponseType = boolean;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useMarkAllRead = () => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "pending" | "error" | "success" | "settled" | null
  >(null);

  const mutation = useMutation(api.notifications.markAllRead);

  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutate = useCallback(
    async (values: RequestType = {}, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);

        setData(response);
        setStatus("success");
        options?.onSuccess?.(response);

        return response;
      } catch (err) {
        const e = err as Error;
        setError(e);
        setStatus("error");
        options?.onError?.(e);

        if (options?.throwError) {
          throw e;
        }

        return false;
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    mutate,
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isSettled,
  };
};
