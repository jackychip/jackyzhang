import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // mandatory: no edge optimizer on GitHub Pages
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true, // emit /page/index.html — friendlier on Pages
};

export default nextConfig;
