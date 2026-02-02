import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthActions } from "@convex-dev/auth/react";

import { SignInFlow } from "../types"; // Ensure your types file exports this
import { TriangleAlert } from "lucide-react";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch((err) => {
        setError("Invalid email or password.");
      })
      .finally(() => setPending(false));
  };

  const handleProviderSignIn = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  return (
    <Card className="w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm border border-destructive text-destructive">
          <TriangleAlert className="size-4 flex-shrink-0" />
          <p>{error}</p>
          {/* The text "You, 1 second ago • Uncommitted changes" is likely a placeholder/comment in the image, not part of the actual component code for displaying 'error' */}
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignIn} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />

          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => handleProviderSignIn("google")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="absolute size-5 top-2.5 left-2.5" />
            Continue with Google
          </Button>

          <Button
            disabled={pending}
            onClick={() => handleProviderSignIn("github")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="absolute size-5 top-2.5 left-2.5" />
            Continue with GitHub
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => setState("signUp")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
