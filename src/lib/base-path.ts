// Prepend basePath to public/ assets — plain <a>/<img> are NOT auto-prefixed
// (only next/link, next/image, next/font, next/script are basePath-aware).
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBasePath = (p: string) => `${basePath}${p}`;
// usage: <a href={withBasePath("/resume.pdf")} download>Download Resume</a>
