import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "../server/router/_app";

export const trpc = createReactQueryHooks<AppRouter>();
