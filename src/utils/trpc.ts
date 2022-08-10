import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "../backend/router/_app";

export const trpc = createReactQueryHooks<AppRouter>();
