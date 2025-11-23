// ----------------------
// requestHandler
// ----------------------
// A reusable wrapper function to handle API calls with loading, success, and error handling.
// Parameters:
// - api: A function that returns a Promise (usually an API call).
// - setLoading: Optional function to toggle a loading state before and after the API call.
// - onSuccess: Optional callback function invoked with the response data if the call succeeds.
// - onError: Optional callback function invoked with an error message if the call fails.
export const requestHandler = async (
  api: () => Promise<any>, 
  setLoading?: (value: boolean) => void, 
  onSuccess?: (data: any) => void, 
  onError?: (message: string) => void
) => {
  setLoading && setLoading(true); // Set loading to true if setLoading is provided
  try {
    const response = await api(); // Execute the API call
    const { data } = response; // Extract the data from the response

    if (data && onSuccess) {
      onSuccess(data); // Call the success callback if data exists
    }
  } catch (error: any) {
    // Extract and pass error message to onError callback, or default message
    onError && onError(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading && setLoading(false); // Always set loading to false at the end
  }
};

// ----------------------
// handleGoogleSignIn
// ----------------------
// Redirects the user to the Google OAuth login page.
// Uses the server URI from environment variables.
export const handleGoogleSignIn = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URI}/auth/google`;
};

// ----------------------
// handleGoogleCallback
// ----------------------
// Handles the Google OAuth callback after login.
// Parameters:
// - queryParams: The URL query parameters returned by Google.
// - onSuccess: Optional callback function invoked with the API response data on success.
// - onError: Optional callback function invoked with an error message on failure.
// Returns the response data if successful.
export const handleGoogleCallback = async (
  queryParams: string,
  onSuccess?: (data: any) => void,
  onError?: (msg: string) => void
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/auth/google/callback?${queryParams}`
    );

    if (!response.ok) throw new Error("Google login failed"); // Throw error if response not OK

    const data = await response.json(); // Parse the JSON response
    onSuccess && onSuccess(data); // Call success callback if provided
    return data; // Return data for further processing if needed
  } catch (error: any) {
    onError && onError(error.message); // Call error callback if provided
  }
};

// ----------------------
// formatDate
// ----------------------
// Converts an ISO date string to a human-readable "DD-MM-YYYY" format.
// Returns an empty string if the input is falsy.
export const formatDate = (isoDateString: string) => {
  if (!isoDateString) return "";
  const date = new Date(isoDateString); // Parse ISO date string
  const year = date.getFullYear(); // Extract year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Extract month (1-based) and pad with 0
  const day = String(date.getDate()).padStart(2, "0"); // Extract day and pad with 0
  return `${day}-${month}-${year}`; // Return formatted string
};
