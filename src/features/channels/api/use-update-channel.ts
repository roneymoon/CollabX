import { useCallback, useMemo, useState } from "react";
import { useMutation } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

type RequestType = {
  id: Id<"channels">;
  name: string;
};

type ResponseType = Id<"channels"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useUpdateChannel = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "pending" | "error" | "success" | "settled" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.channels.update);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setStatus("pending");
        setData(null);
        setError(null);

        const response = await mutation(values);

        setData(response);
        setStatus("success");

        options?.onSuccess?.(response);
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        setStatus("error");

        options?.onError?.(error);
        if (options?.throwError) {
          throw error;
        }
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
