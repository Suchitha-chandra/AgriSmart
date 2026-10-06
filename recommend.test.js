import { describe, it, expect } from 'vitest';
import { recommendCrops, soilAdvice, scoreCrop, CROPS } from './recommend.js';

describe('recommendCrops', () => {
  it('ranks Rice first for acidic, nitrogen-rich soil', () => {
    const top = recommendCrops({ ph: 5.2, nitrogen: 'high', phosphorus: 'medium', potassium: 'medium' });
    expect(top[0].name).toBe('Rice');
  });

  it('returns the requested number of results, sorted by score', () => {
    const results = recommendCrops({ ph: 7, nitrogen: 'medium', phosphorus: 'medium', potassium: 'medium' }, 3);
    expect(results).toHaveLength(3);
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
  });
});

describe('scoreCrop', () => {
  it('gives a perfect score when pH and nutrients match', () => {
    const wheat = CROPS.find((crop) => crop.name === 'Wheat');
    expect(scoreCrop(wheat, { ph: 6.5, nitrogen: 'medium', phosphorus: 'medium', potassium: 'medium' })).toBe(100);
  });
});

describe('soilAdvice', () => {
  it('flags acidic soil and low nitrogen', () => {
    const advice = soilAdvice({ ph: 5, nitrogen: 'low', phosphorus: 'medium', potassium: 'medium' });
    expect(advice.join(' ')).toMatch(/acidic/i);
    expect(advice.join(' ')).toMatch(/nitrogen/i);
  });

  it('returns a balanced message for healthy soil', () => {
    const advice = soilAdvice({ ph: 6.5, nitrogen: 'medium', phosphorus: 'medium', potassium: 'medium' });
    expect(advice[0]).toMatch(/balanced/i);
  });
});
