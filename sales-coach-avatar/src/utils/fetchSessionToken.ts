export const fetchSessionToken = async () => {
  const response = await fetch("/api/session-token", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch session token");
  }

  const data = await response.json();
  return data.sessionToken;
};
