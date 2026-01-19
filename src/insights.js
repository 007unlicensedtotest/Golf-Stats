// Compute category-level insights using your past rounds
export function generateInsights(round, pastRounds = []) {
  const insights = [];

  // If no past rounds, fallback to simple messages
  if (pastRounds.length === 0) {
    if (round.penalties > 1)
      insights.push("Penalties cost you shots — tee strategy needs tightening.");
    if (round.doubles > 2)
      insights.push("Too many doubles. Prioritise bogey avoidance.");
    if (round.putts > 32)
      insights.push("Putting lost strokes. Focus on lag speed.");
    if (round.gir < 7)
      insights.push("Approach play costing strokes. Middle of green bias.");
    return insights;
  }

  // Calculate personal averages
  const avg = (key) =>
    pastRounds.reduce((sum, r) => sum + r[key], 0) / pastRounds.length;

  const avgGIR = avg("gir");
  const avgPutts = avg("putts");
  const avgUpDowns = avg("upDowns");
  const avgDriving = avg("penalties"); // simplified proxy for driving accuracy

  // Driving
  const drivingDiff = avgDriving - round.penalties;
  insights.push(
    `Driving ${drivingDiff >= 0 ? "gained" : "lost"} ${Math.abs(
      drivingDiff
    ).toFixed(1)} strokes this round.`
  );

  // Approach
  const approachDiff = round.gir - avgGIR;
  insights.push(
    `Approach ${approachDiff >= 0 ? "gained" : "lost"} ${Math.abs(
      approachDiff
    ).toFixed(1)} strokes this round.`
  );

  // Short Game
  const shortDiff = round.upDowns - avgUpDowns;
  insights.push(
    `Short game ${shortDiff >= 0 ? "gained" : "lost"} ${Math.abs(
      shortDiff
    ).toFixed(1)} strokes this round.`
  );

  // Putting
  const puttingDiff = avgPutts - round.putts;
  insights.push(
    `Putting ${puttingDiff >= 0 ? "gained" : "lost"} ${Math.abs(
      puttingDiff
    ).toFixed(1)} strokes this round.`
  );

  return insights;
}
