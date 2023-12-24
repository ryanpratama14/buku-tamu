import { createTRPCRouter } from "@/server/api/trpc";
import { visitRouter } from "./routers/visit";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  visit: visitRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
