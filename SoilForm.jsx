import { useState } from 'react';
import { LEVELS, validateSoilInput } from '../utils/validate.js';

const INITIAL_VALUES = { ph: '', nitrogen: '', phosphorus: '', potassium: '' };
const NUTRIENT_FIELDS = [
  { name: 'nitrogen', label: 'Nitrogen level' },
  { name: 'phosphorus', label: 'Phosphorus level' },
  { name: 'potassium', label: 'Potassium level' },
];

export default function SoilForm({ onSubmit }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = validateSoilInput(values);
    setErrors(result.errors);
    if (result.valid) onSubmit(result.values);
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate aria-labelledby="soil-title">
      <h2 id="soil-title">Soil test</h2>

      <div className="field">
        <label htmlFor="ph">Soil pH (3 to 10)</label>
        <input
          id="ph" name="ph" type="number" step="0.1" inputMode="decimal"
          value={values.ph} onChange={handleChange}
          aria-invalid={Boolean(errors.ph)} aria-describedby={errors.ph ? 'ph-error' : undefined}
        />
        {errors.ph && <p id="ph-error" className="error" role="alert">{errors.ph}</p>}
      </div>

      {NUTRIENT_FIELDS.map(({ name, label }) => (
        <div className="field" key={name}>
          <label htmlFor={name}>{label}</label>
          <select
            id={name} name={name} value={values[name]} onChange={handleChange}
            aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined}
          >
            <option value="">Select level</option>
            {LEVELS.map((level) => (
              <option key={level} value={level}>{level[0].toUpperCase() + level.slice(1)}</option>
            ))}
          </select>
          {errors[name] && <p id={`${name}-error`} className="error" role="alert">{errors[name]}</p>}
        </div>
      ))}

      <button type="submit" className="button">Get crop suggestions</button>
    </form>
  );
}
