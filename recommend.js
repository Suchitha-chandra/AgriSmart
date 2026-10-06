// Simple, explainable rule-based crop guidance (educational, not agronomic advice).

const LEVEL_VALUE = { low: 1, medium: 2, high: 3 };

export const CROPS = [
  { name: 'Rice', phMin: 5.0, phMax: 6.5, needs: { nitrogen: 'high', phosphorus: 'medium', potassium: 'medium' } },
  { name: 'Wheat', phMin: 6.0, phMax: 7.5, needs: { nitrogen: 'medium', phosphorus: 'medium', potassium: 'medium' } },
  { name: 'Maize', phMin: 5.8, phMax: 7.0, needs: { nitrogen: 'high', phosphorus: 'medium', potassium: 'medium' } },
  { name: 'Cotton', phMin: 6.0, phMax: 8.0, needs: { nitrogen: 'medium', phosphorus: 'low', potassium: 'medium' } },
  { name: 'Groundnut', phMin: 5.5, phMax: 7.0, needs: { nitrogen: 'low', phosphorus: 'medium', potassium: 'medium' } },
  { name: 'Chickpea', phMin: 6.0, phMax: 8.0, needs: { nitrogen: 'low', phosphorus: 'medium', potassium: 'low' } },
  { name: 'Sugarcane', phMin: 6.0, phMax: 7.5, needs: { nitrogen: 'high', phosphorus: 'medium', potassium: 'high' } },
];

// Score 0-100: half from how well pH fits, half from how well nutrients match.
export function scoreCrop(crop, { ph, nitrogen, phosphorus, potassium }) {
  const phDistance = ph < crop.phMin ? crop.phMin - ph : ph > crop.phMax ? ph - crop.phMax : 0;
  const phScore = Math.max(0, 50 - phDistance * 25);

  const soilLevels = { nitrogen, phosphorus, potassium };
  const nutrientNames = Object.keys(crop.needs);
  const nutrientScore = nutrientNames.reduce((total, nutrient) => {
    const gap = Math.abs(LEVEL_VALUE[soilLevels[nutrient]] - LEVEL_VALUE[crop.needs[nutrient]]);
    return total + (50 / nutrientNames.length) * (1 - gap / 2);
  }, 0);

  return Math.round(phScore + nutrientScore);
}

export function recommendCrops(soil, limit = 3) {
  return CROPS.map((crop) => ({ name: crop.name, score: scoreCrop(crop, soil) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function soilAdvice({ ph, nitrogen, phosphorus, potassium }) {
  const advice = [];
  if (ph < 5.5) advice.push('Soil is acidic. Consider adding agricultural lime after a lab test.');
  if (ph > 7.5) advice.push('Soil is alkaline. Organic matter or gypsum can help; confirm with a lab test.');
  if (nitrogen === 'low') advice.push('Nitrogen is low. Compost or a nitrogen fertiliser can help.');
  if (phosphorus === 'low') advice.push('Phosphorus is low. Consider a phosphate source suited to your crop.');
  if (potassium === 'low') advice.push('Potassium is low. A potash fertiliser may improve yield.');
  if (advice.length === 0) advice.push('Your soil readings look balanced. Keep monitoring each season.');
  return advice;
}
