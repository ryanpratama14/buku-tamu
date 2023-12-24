import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { THROW_OK, THROW_TRPC_ERROR } from "@/trpc/shared";
import { hash } from "argon2";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.user.findFirst({ where: { username: input.username } });
      if (data) return THROW_TRPC_ERROR("CONFLICT");
      await ctx.db.user.create({ data: { username: input.username, hashedPassword: await hash(input.password) } });
      return THROW_OK("CREATED");
    }),
});
