export function generateInsights(round) {
  const insights = [];

  if (round.penalties > 1)
    insights.push("Penalties cost you shots — tee strategy needs tightening.");

  if (round.doubles > 2)
    insights.push("Too many doubles. Prioritise bogey avoidance.");

  if (round.putts > 32)
    insights.push("Putting lost strokes. Focus on lag speed.");

  if (round.gir < 7)
    insights.push("Approach play costing strokes. Middle of green bias.");

  if (round.upDowns / (18 - round.gir) < 0.3)
    insights.push("Short game underperformed. More bump-and-run.");

  if (!insights.length)
    insights.push("Solid round. Keep playing this strategy.");

  return insights;
}
