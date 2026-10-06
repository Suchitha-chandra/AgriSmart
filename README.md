# AgriSmart (React)

A responsive farming dashboard built with React. It shows live weather for a city and suggests suitable crops from a simple soil test. This is a React rebuild of my earlier HTML/CSS/JavaScript AgriSmart project.

**Live demo:** _add your deployed link here_  |  **Figma design:** _add your Figma link here_

## Features
- Live weather (temperature, humidity, wind, rainfall) using the Open-Meteo API (no API key needed)
- Soil form (pH + nitrogen, phosphorus, potassium levels) with a ranked crop list and soil advice
- Mobile-first responsive layout with light and dark themes
- Accessible forms: labels, keyboard focus styles, `aria-invalid`, error alerts and live regions

## Tech
React 18, Vite, Vitest, React Testing Library, plain CSS (custom properties + CSS Grid)

## Run it
```bash
npm install
npm run dev      # start the app
npm test         # run unit and component tests
npm run build    # production build
```

## Project structure
```
src/
  components/   SoilForm, WeatherCard (+ SoilForm test)
  services/     weather.js (API calls, error handling, request cancellation)
  utils/        validate.js, recommend.js (+ unit tests)
  App.jsx       page layout and state
```

## How it follows good engineering practice
- **Secure coding:** all inputs are validated before use (`validate.js`); city names are sanitized and URL-encoded; no API keys or secrets in the client; React escapes rendered text.
- **Testing:** 12 automated tests cover validation, the recommendation logic and the form's behaviour.
- **Debugging and reliability:** failed network calls show clear error messages; older requests are cancelled with `AbortController` to avoid stale results.
- **UX and simplicity:** one clear action per card, plain-language labels and immediate feedback on mistakes.

## Development process (SDLC)
1. **Requirements:** a farmer needs quick weather and a simple crop suggestion on a phone.
2. **Design:** low-fidelity screens in Figma, then a mobile-first layout built to match them.
3. **Build:** small components with a single responsibility; logic kept separate from UI.
4. **Test:** unit tests for logic, component tests for user flows.
5. **Review and iterate:** refactor for readability, then deploy.

## Limitations
Crop suggestions use simple rules for learning purposes. They are not professional agronomic advice.
