/**
 * JWT Token Utilities
 * Helper functions to decode and extract information from JWT tokens
 */

/**
 * Decode JWT token without verification (client-side only)
 * Note: This does NOT verify the token signature, only decodes the payload
 */
export function decodeJWT(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Get user ID from JWT token
 */
export function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // JWT typically stores user ID in 'sub', 'nameid', or 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
  return (
    decoded.sub ||
    decoded.nameid ||
    decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] ||
    decoded.userId ||
    null
  );
}

