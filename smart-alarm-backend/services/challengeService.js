function generateMathChallenge() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;

  return {
    type: "math",
    question: `What is ${a} + ${b}?`,
    answer: String(a + b)
  };
}

module.exports = {
  generateMathChallenge
};