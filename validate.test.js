import { describe, it, expect } from 'vitest';
import { validateSoilInput, sanitizeCityName } from './validate.js';

describe('validateSoilInput', () => {
  const validSoil = { ph: '6.5', nitrogen: 'medium', phosphorus: 'low', potassium: 'high' };

  it('accepts valid input and converts pH to a number', () => {
    const result = validateSoilInput(validSoil);
    expect(result.valid).toBe(true);
    expect(result.values.ph).toBe(6.5);
  });

  it('rejects pH outside 3 to 10 and empty pH', () => {
    expect(validateSoilInput({ ...validSoil, ph: '11' }).errors.ph).toBeDefined();
    expect(validateSoilInput({ ...validSoil, ph: '' }).errors.ph).toBeDefined();
  });

  it('rejects unknown nutrient levels', () => {
    expect(validateSoilInput({ ...validSoil, nitrogen: 'extreme' }).errors.nitrogen).toBeDefined();
  });
});

describe('sanitizeCityName', () => {
  it('trims and collapses spaces', () => {
    expect(sanitizeCityName('  New   Delhi ')).toBe('New Delhi');
  });

  it('rejects scripts, digits and too-short names', () => {
    expect(sanitizeCityName('<script>alert(1)</script>')).toBeNull();
    expect(sanitizeCityName('A')).toBeNull();
    expect(sanitizeCityName('City123')).toBeNull();
  });
});
