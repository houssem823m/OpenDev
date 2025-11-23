
// Security headers middleware
export function securityHeaders() {
  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
}

// File upload validation
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 10MB limit" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "File type not allowed" };
  }

  return { valid: true };
}

