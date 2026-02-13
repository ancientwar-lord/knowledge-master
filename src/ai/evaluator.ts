export function evaluateAnswers(answers: string[]) {
  return answers.map(a => ({
    score: a.length > 20 ? "Good" : "Weak"
  }));
}
