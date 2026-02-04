import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useTheme } from "next-themes";

import { SignInFlow } from "../types";
import { TriangleAlert, Mail, Lock, ArrowRight, Moon, Sun } from "lucide-react";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="flex flex-col gap-y-3 w-full animate-in fade-in zoom-in-95 duration-500 max-w-[400px]">
      {/* Branding Header */}
      <div className="flex flex-col items-center gap-y-1 mb-0.5">
        <div className="relative size-10 mb-0.5 hover:scale-110 transition-transform duration-300 pointer-events-none">
          <Image
            src="/icon.png"
            alt="CollabX Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-inter">
          Collab<span className="text-indigo-600">X</span>
        </h1>
        <p className="text-xs text-muted-foreground font-medium">
          Sign in to your team workspace
        </p>
      </div>

      <Card className="w-full border border-slate-200/60 dark:border-slate-800/60 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_rgba(0,0,0,0.03)] dark:shadow-none bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl overflow-hidden">
        <CardContent className="py-2 px-7 space-y-3.5">
          {!!error && (
            <div className="bg-destructive/10 p-2 rounded-lg flex items-center gap-x-2 text-[10px] border border-destructive/20 text-destructive animate-in fade-in slide-in-from-top-1">
              <TriangleAlert className="size-3.5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={onPasswordSignIn} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-0.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  disabled={pending}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@work.com"
                  type="email"
                  required
                  className="pl-9 h-9.5 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-600 rounded-xl transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between ml-0.5">
                <label className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Button variant="link" size="sm" className="p-0 h-auto text-indigo-600 font-semibold text-[10.5px] hover:text-indigo-700 hover:no-underline" asChild>
                  <a href="#">Forgot?</a>
                </Button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  disabled={pending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                  className="pl-9 h-9.5 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-600 rounded-xl transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-0.5 group cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
              <div className={`size-3.5 rounded border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 dark:border-slate-700'}`}>
                {rememberMe && <div className="size-1 rounded-full bg-white animate-in zoom-in-50" />}
              </div>
              <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 select-none">
                Remember for 30 days
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-9.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200/20 dark:shadow-none text-white font-semibold group transition-all duration-300 active:scale-[0.98] text-sm mb-4 mt-2"
              disabled={pending}
            >
              Sign in to CollabX
              <ArrowRight className="ml-1.5 size-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="relative py-0.5 border-t border-slate-100 dark:border-slate-800 mt-1">
            <div className="absolute inset-x-0 -top-2 flex justify-center">
              <span className="bg-white dark:bg-[#0f172a] px-2 text-[9px] uppercase tracking-widest font-semibold text-slate-400/80">
                Or
              </span>
            </div>
          </div>

          <div className="flex gap-x-2.5 mt-0.5">
            <Button
              disabled={pending}
              onClick={() => handleProviderSignIn("google")}
              variant="outline"
              size="lg"
              className="flex-1 h-9 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-slate-700 dark:text-slate-300 gap-x-2 shadow-sm text-[10.5px]"
            >
              <FcGoogle className="size-4" />
              Google
            </Button>
            <Button
              disabled={pending}
              onClick={() => handleProviderSignIn("github")}
              variant="outline"
              size="lg"
              className="flex-1 h-9 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-slate-700 dark:text-slate-300 gap-x-2 shadow-sm text-[10.5px]"
            >
              <FaGithub className="size-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-x-1.5 mt-0.5 animate-in fade-in zoom-in duration-700">
        <p className="text-xs text-slate-500 font-medium tracking-tight">
          New to CollabX?
        </p>
        <Button
          variant="link"
          className="p-0 h-auto text-indigo-600 font-bold text-xs hover:text-indigo-700 hover:no-underline"
          onClick={() => setState("signUp")}
        >
          Create an account
        </Button>
      </div>

      <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8">
        <Button
          variant="outline"
          size="icon"
          className="rounded-2xl size-9 shadow-xl border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:scale-110 transition-all active:scale-95 duration-300"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {!mounted ? null : theme === "dark" ? (
            <Sun className="size-4 text-amber-500 animate-in zoom-in rotate-90" />
          ) : (
            <Moon className="size-4 text-slate-700 animate-in zoom-in -rotate-12" />
          )}
        </Button>
      </div>
    </div>
  );
};
