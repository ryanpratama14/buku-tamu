import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { schema } from "@/schema";
import {
  type RouterOutputs,
  type RouterInputs,
  THROW_OK,
  THROW_TRPC_ERROR,
  insensitiveMode,
  getPagination,
  getPaginationData,
} from "@/trpc/shared";
import { formatName, getDateFromObject, getNewDate } from "@/lib/utils";
import { z } from "zod";

export const visitRouter = createTRPCRouter({
  create: publicProcedure.input(schema.visit.create).mutation(async ({ ctx, input }) => {
    const { startDate, startTime } = input;
    const generatedStartTime = startDate && startTime ? getDateFromObject({ startDate, startTime }) : getNewDate();
    const data = await ctx.db.visit.create({
      data: {
        visitorName: formatName(input.visitorName),
        visitorCompany: input.visitorCompany,
        description: input.description,
        phoneNumber: input.phoneNumber,
        startTime: generatedStartTime,
        endTime: null,
        status: startDate ? "VISITING" : "DRAFT",
      },
    });
    return data;
  }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.visit.findFirst({ where: { id: input.id } });
    if (!data) return THROW_TRPC_ERROR("NOT_FOUND");
    await ctx.db.visit.delete({ where: { id: input.id } });
    return THROW_OK("OK");
  }),

  list: protectedProcedure.input(schema.visit.list).query(async ({ ctx, input }) => {
    const { pagination, params } = input;

    const whereQuery = {
      where: {
        status: params.status,
      },
    };

    const [data, totalData] = await ctx.db.$transaction([
      ctx.db.visit.findMany({
        ...getPagination(pagination),
        ...whereQuery,
      }),
      ctx.db.visit.count(whereQuery),
    ]);

    return { data, ...getPaginationData({ page: pagination.page, limit: pagination.limit, totalData }) };
  }),
});

// output
export type Visit = RouterOutputs["visit"]["create"];

// inputs
export type VisitCreateInput = RouterInputs["visit"]["create"];
export type VisitListInput = RouterInputs["visit"]["list"];
