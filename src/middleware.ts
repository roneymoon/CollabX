import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware(async (request) => {
  const authenticated = await isAuthenticatedNextjs();

  // Not logged in → block private pages
  if (!isPublicPage(request) && !authenticated) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }

  // Logged in → block public pages
  if (isPublicPage(request) && authenticated) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  // Otherwise allow
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
