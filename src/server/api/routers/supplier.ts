import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const supplierRouter = createTRPCRouter({
  // Get all suppliers with valid data
  getAllValidSuppliers: publicProcedure.query(({ ctx }) => {
    const suppliers = ctx.prisma.supplier.findMany({
      where: {
        ebitMargin: { not: null },
        shareOfWallet: { not: null },
        spend: { not: null },
      },
    });
    return suppliers;
  }),

  // Create many suppliers
  createManySuppliers: publicProcedure
    .input(
      z.array(
        z.object({
          name: z.string(),
          ebitMargin: z.number().optional(),
          shareOfWallet: z.number().optional(),
          spend: z.number().optional(),
        })
      )
    )
    .mutation(({ ctx, input }) => {
      const suppliers = ctx.prisma.supplier.createMany({
        data: input,
      });
      return suppliers;
    }),

  // Delete all suppliers
  deleteAllSuppliers: publicProcedure.mutation(({ ctx }) => {
    const suppliers = ctx.prisma.supplier.deleteMany();
    return suppliers;
  }),
});
