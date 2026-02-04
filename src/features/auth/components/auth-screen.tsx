"use client";

import { useState } from "react";

import { SignInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export const AuthScreen = () => {

  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden px-4">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.12)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.12)_0%,transparent_50%)] pointer-events-none" />

      <div className="md:h-auto md:w-[400px] w-full max-w-sm flex flex-col items-center gap-y-2 z-10 py-2">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}

        <div className="flex flex-col items-center mt-0.5">
          <p className="text-[9px] text-muted-foreground/30 uppercase tracking-[0.2em] font-bold font-inter">
            © 2024 COLLABX TECHNOLOGY INC.
          </p>
        </div>
      </div>
    </div>
  );
};
