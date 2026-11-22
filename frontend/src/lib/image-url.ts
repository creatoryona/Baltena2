const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export function getFullImageUrl(imagePath?: string | null): string {
  if (!imagePath) return ""
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    // If it was previously saved with port 3000 mistakenly, fix it to use API_URL
    if (imagePath.includes("localhost:3000/uploads/")) {
      return imagePath.replace("http://localhost:3000", API_URL)
    }
    return imagePath
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`
  return `${API_URL}${cleanPath}`
}

