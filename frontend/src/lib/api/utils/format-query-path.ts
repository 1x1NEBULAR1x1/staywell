// Function for formatting URL with query parameters
export const formatQueryPath = (basePath: string, param: unknown): string => {
  if (!param) return basePath;

  // If parameter is object, convert it to query string
  if (typeof param === "object") {
    const queryParams = Object.entries(param)
      .filter(([key, value]) => {
        // For skip and take always include in query if they are numbers (including 0)
        if (key === "skip" || key === "take") {
          return typeof value === "number";
        }
        // For other parameters filter empty values
        return value !== undefined && value !== "";
      })
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join("&");

    return queryParams ? `${basePath}?${queryParams}` : basePath;
  }

  // If parameter is string or number, add as id
  return `${basePath}/${encodeURIComponent(String(param))}`;
};
