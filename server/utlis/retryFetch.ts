import { error } from "console";

// Status codes that usually indicate temporary server problems.
const RETRY_STATUS_CODES = [500, 502, 503, 504];

//Sleep function to delay the time between retries
function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// retry Fetch - Wraps around native fetch
export async function retryFetch(
  url: string,
  options: RequestInit = {},
  retries: number = 3,
  delay: number = 500
): Promise<Response> {
  try {
    console.log("API Retry Wrapper invoked");
    const response = await fetch(url, options);

    // If request succeeded (HTTP 2xx), return the response immediately
    if (response.ok) {
      return response;
    }

    //lets check status codes for network issue or temp server problem
    const isValidRetryCode = RETRY_STATUS_CODES.includes(response.status);
    if (isValidRetryCode && retries > 0) {
      console.log(`Retrying request... attempts left: ${retries}`);
      // Wait before retrying
      await sleep(delay);
      // Retry request with one less attempt and increased delay
      return retryFetch(url, options, retries - 1, delay * 2);
    }

    //not a valid retry status code
    return response;
  } catch {
    //just try again if there are retries left
    if (retries > 0) {
      console.log(`Network error, retrying... attempts left: ${retries}`);

      await sleep(delay);

      return retryFetch(url, options, retries - 1, delay * 2);
    }
  }

  //maxed out the retries - just throw the error
  throw error;
}
