import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // If a public API base is configured (e.g. Vercel), do not rewrite.
    if (process.env.NEXT_PUBLIC_API_BASE_URL) return [];
    // In development, proxy Next.js `/api/*` calls to the Express server on 4000.
    // This keeps client code using relative `/api` URLs working locally.
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:4000/api/:path*",
        },
      ];
    }
    // Fallback: no rewrites in production without explicit base URL
    return [];
  },
};

export default nextConfig;
