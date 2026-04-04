import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { cache } from "react";

// One QueryClient per request on the server (cache() scopes it to the request)
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: { staleTime: 60 * 1000 },
        dehydrate: {
          // Include pending queries so streaming prefetches are passed to the client
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) ||
            query.state.status === "pending",
          // Next.js handles error redaction — if we do it here, it breaks dynamic page detection
          shouldRedactErrors: () => false,
        },
      },
    }),
);
