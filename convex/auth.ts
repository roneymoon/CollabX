import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: String(params.email ?? ""),
      name: String(params.name ?? ""),
    };
  }
});

const GoogleProvider = Google({
  profile(profile) {
    return {
      email: profile.email,
      name: profile.name,
      image: profile.picture,  // <-- IMPORTANT
    };
  }
});


export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [CustomPassword, Google, GitHub],
});
