/**
 * Navigation utility for axios interceptors
 * Allows navigation from outside React components
 */

type NavigateFunction = (to: string, options?: { replace?: boolean }) => void;

let navigateFunction: NavigateFunction | null = null;

/**
 * Set the navigate function from React Router
 * Should be called once when the router is initialized
 */
export const setNavigate = (navigate: NavigateFunction) => {
  navigateFunction = navigate;
};

/**
 * Navigate to a route
 * Falls back to window.location.href if navigate function is not set
 */
export const navigateTo = (path: string, options?: { replace?: boolean }) => {
  if (navigateFunction) {
    navigateFunction(path, options);
  } else {
    // Fallback to window.location if navigate is not set yet
    if (options?.replace) {
      window.location.replace(path);
    } else {
      window.location.href = path;
    }
  }
};

