import { QueryClient } from "@tanstack/react-query";

// A module-level singleton (rather than one created inside a component) so that
// non-component code — like auth.service.ts's login()/logout() — can invalidate
// cached queries (e.g. "profile") directly when the authenticated user changes.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
