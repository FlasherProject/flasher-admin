export const generateNextImageURL = (url: string, quality = 75, width = 828): string => {
  const base = process.env.remote
  return `${base}/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
}
