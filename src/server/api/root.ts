import { createTRPCRouter } from "./trpc";
import { supplierRouter } from "./routers/supplier";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  supplier: supplierRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
