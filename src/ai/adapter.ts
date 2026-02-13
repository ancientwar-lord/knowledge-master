export async function analyzeCommit(diff: string): Promise<string> {
  // TEMP MOCK
  return JSON.stringify({
    "technologies": ["Express", "JWT"],
    "concepts": ["Middleware", "Authentication"]
  });
}
