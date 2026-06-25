import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/Wujing" : "";

const nextConfig: NextConfig = {
  // 静态导出仅用于生产构建；开发模式关闭以避免新增 Markdown 后需重启 dev
  ...(process.env.NODE_ENV === "production" ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
