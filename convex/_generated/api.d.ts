/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as channelPreferences from "../channelPreferences.js";
import type * as channels from "../channels.js";
import type * as cleanupDuplicateConversations from "../cleanupDuplicateConversations.js";
import type * as conversations from "../conversations.js";
import type * as dmSearch from "../dmSearch.js";
import type * as http from "../http.js";
import type * as members from "../members.js";
import type * as messageStatus from "../messageStatus.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as presence from "../presence.js";
import type * as reactions from "../reactions.js";
import type * as typingIndicators from "../typingIndicators.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";
import type * as workspaces from "../workspaces.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  channelPreferences: typeof channelPreferences;
  channels: typeof channels;
  cleanupDuplicateConversations: typeof cleanupDuplicateConversations;
  conversations: typeof conversations;
  dmSearch: typeof dmSearch;
  http: typeof http;
  members: typeof members;
  messageStatus: typeof messageStatus;
  messages: typeof messages;
  notifications: typeof notifications;
  presence: typeof presence;
  reactions: typeof reactions;
  typingIndicators: typeof typingIndicators;
  upload: typeof upload;
  users: typeof users;
  workspaces: typeof workspaces;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
