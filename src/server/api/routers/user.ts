import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { schema } from "@/server/api/schema/schema";
import { THROW_ERROR, THROW_OK } from "@/trpc/shared";
import { hash } from "argon2";

export const userRouter = createTRPCRouter({
  register: publicProcedure.input(schema.user.create).mutation(async ({ ctx, input }) => {
    const { name, email, password } = input;
    const data = await ctx.db.user.findFirst({ where: { email: input.email } });
    if (data) THROW_ERROR("CONFLICT");
    await ctx.db.user.create({ data: { name, email, password: await hash(password) } });
    return THROW_OK("CREATED");
  }),
});
