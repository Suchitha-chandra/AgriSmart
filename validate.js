// Input validation: never trust user input before using it in logic or in a URL.

export const LEVELS = ['low', 'medium', 'high'];
const NUTRIENTS = ['nitrogen', 'phosphorus', 'potassium'];

export function validateSoilInput({ ph, nitrogen, phosphorus, potassium }) {
  const errors = {};
  const phNumber = Number(ph);

  if (ph === '' || ph == null || Number.isNaN(phNumber) || phNumber < 3 || phNumber > 10) {
    errors.ph = 'Enter a soil pH between 3 and 10.';
  }

  const levels = { nitrogen, phosphorus, potassium };
  NUTRIENTS.forEach((nutrient) => {
    if (!LEVELS.includes(levels[nutrient])) {
      errors[nutrient] = 'Choose low, medium or high.';
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: { ph: phNumber, nitrogen, phosphorus, potassium },
  };
}

// Allows letters (any language), spaces, dots, apostrophes and hyphens only.
export function sanitizeCityName(rawCity) {
  const cleanedCity = String(rawCity ?? '').trim().replace(/\s+/g, ' ');
  if (cleanedCity.length < 2 || cleanedCity.length > 60) return null;
  if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(cleanedCity)) return null;
  return cleanedCity;
}
