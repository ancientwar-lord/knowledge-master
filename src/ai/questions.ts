export async function generateQuestions(concepts: string[]) {
  return concepts.map(c => `Explain ${c} in simple terms.`);
}
