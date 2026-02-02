"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignInFlow } from "../types";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {

  const { signIn } = useAuthActions();
  
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");  
      setPending(false);
      return;
    }
    signIn("password", { name, email, password, flow: "signUp" })
      .catch((err) => {
        setError("Failed to sign up. Please try again.");
      })
      .finally(() => setPending(false));
  };


  const handleProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };


  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
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
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            type="text"
            required
          />
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
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
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
            onClick={() => handleProviderSignUp("google")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="absolute size-5 top-2.5 left-2.5" />
            Continue with Google
          </Button>
        </div>
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => handleProviderSignUp("github")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="absolute size-5 top-2.5 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => setState("signIn")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
