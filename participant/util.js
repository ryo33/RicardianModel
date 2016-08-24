export function calculateGain(proposer, selling, g1proposal, g1rate, g2proposal, g2rate) {
  return (proposer ? 1 : -1) *
    (selling == 1 ? 1 : -1) *
      (g2proposal * g2rate - g1proposal * g1rate)
}
