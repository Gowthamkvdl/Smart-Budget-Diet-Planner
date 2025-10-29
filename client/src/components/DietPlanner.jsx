// src/DietPlanner.jsx
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import axios from 'axios';
import MealCard from './MealCard';

const API_URL = 'https://diet-planner-stkt.onrender.com/api/generate-plan';

const DietPlanner = () => {
  // 1) User Inputs
  const [constraints, setConstraints] = useState({
    dietType: 'Non-Vegetarian',
    calorieTarget: 2200,
    allergies: '',
    cuisinePreference: 'South Indian (Tamil Nadu)',
    dailyBudget: 300,
  });

  // 2) Output & UI State
  const [mealPlan, setMealPlan]   = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState(null);

  // 3) Detect touch device (mobile) to avoid disabled attribute
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch);
    if (touch) document.documentElement.classList.add('no-hover'); // used by CSS to disable hover anims
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConstraints((prev) => ({ ...prev, [name]: value }));
  };

  // Simulate progress up to 90% while API runs
  const simulateProgress = () => {
    let current = 0;
    const id = setInterval(() => {
      current += Math.floor(Math.random() * 6) + 1; // +1..+6
      if (current >= 90) {
        current = 90;
        clearInterval(id);
      }
      setProgress(current);
    }, 800);
    return id;
  };

  // Submit -> show loading immediately, then call API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remove sticky :hover/focus on mobile
    if (document.activeElement?.blur) document.activeElement.blur();

    // Flush the "loading" state before async to force an immediate paint
    flushSync(() => {
      setIsLoading(true);
      setError(null);
      setMealPlan(null);
      setProgress(0);
    });
    await new Promise((r) => requestAnimationFrame(r)); // ensures paint now

    // Basic validation
    if (constraints.calorieTarget <= 0 || constraints.dailyBudget <= 0) {
      setError("Please enter valid positive numbers for Calories and Budget.");
      setIsLoading(false);
      return;
    }

    const timer = simulateProgress();

    try {
      const response = await axios.post(API_URL, constraints);
      setMealPlan(response.data);
      setProgress(100);
    } catch (err) {
      const details = err.response?.data?.details || err.message;
      setError(`Plan generation failed: ${details}. Check your console for details.`);
      setProgress(0);
    } finally {
      clearInterval(timer);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // Optional INR formatter passed to MealCard too (if needed)
  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  // Button state handling:
  // Desktop uses "disabled" natively; Mobile uses class + pointer-events
  const loadingClass   = isLoading ? 'is-loading' : '';
  const pointerStyle   = isTouch && isLoading ? { pointerEvents: 'none' } : undefined;
  const ariaDisabled   = isTouch && isLoading ? true : undefined;
  const actuallyDisabled = !isTouch && isLoading; // only disable on desktop

  return (
    <div className="container mt-2 mt-md-5">
      <header className="text-center mb-5">
        <h1 className="display-4 text-success pt-5 font-weight-bold">
          Smart Budget Diet Planner
        </h1>
        <p className="lead text-muted">
          Generate a personalized, budget-friendly meal plan using AI.
        </p>
      </header>

      {/* Form Card */}
      <div className="p-3 p-md-5 mx-3 pt-4 glass-card mb-5 m-0">
        <div className="card-body p-0">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Diet Type */}
              <div className="col-md-6">
                <i className="bi bi-egg-fried field-icon me-1" />
                <label className="form-label">Diet Type</label>
                <div className="form-field">
                  <select
                    name="dietType"
                    value={constraints.dietType}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Strict Vegetarian">Strict Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              {/* Cuisine Preference */}
              <div className="col-md-6">
                <i className="bi bi-geo-alt field-icon me-1" />
                <label className="form-label">Cuisine Preference</label>
                <div className="form-field">
                  <input
                    type="text"
                    name="cuisinePreference"
                    value={constraints.cuisinePreference}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., South Indian, Bengali, Punjabi"
                    required
                  />
                </div>
              </div>

              {/* Daily Calorie Goal */}
              <div className="col-md-6">
                <i className="bi bi-fire field-icon me-1" />
                <label className="form-label">Daily Calorie Goal</label>
                <div className="form-field">
                  <input
                    type="number"
                    name="calorieTarget"
                    value={constraints.calorieTarget}
                    onChange={handleChange}
                    className="form-control"
                    min="1000"
                    required
                  />
                </div>
              </div>

              {/* Max Daily Budget (INR) */}
              <div className="col-md-6">
                <i className="bi bi-currency-rupee field-icon me-1" />
                <label className="form-label">Max Daily Budget (INR)</label>
                <div className="form-field">
                  <input
                    type="number"
                    name="dailyBudget"
                    value={constraints.dailyBudget}
                    onChange={handleChange}
                    className="form-control"
                    min="100"
                    required
                  />
                </div>
              </div>

              {/* Allergies/Avoidances */}
              <div className="col-12">
                <i className="bi bi-exclamation-triangle field-icon me-1" />
                <label className="form-label">Allergies/Avoidances (Comma Separated)</label>
                <div className="form-field">
                  <input
                    type="text"
                    name="allergies"
                    value={constraints.allergies}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., Peanuts, Gluten, Dairy"
                  />
                </div>
              </div>

              {/* Submit Button (mobile vs desktop behavior) */}
              <div className="col-12 pt-3">
                <button
                  type="submit"
                  disabled={actuallyDisabled}               // desktop only
                  aria-disabled={ariaDisabled}              // mobile semantics
                  aria-live="polite"
                  aria-busy={isLoading}
                  className={`btn ui-btn ${isTouch ? 'ui-btn--mobile' : 'ui-btn--desktop'} ${loadingClass} rounded-5 mb-4 btn-lg w-100 text-white`}
                  style={pointerStyle}
                >
                  {/* progress as real child for instant paint */}
                  <div
                    className="btn-progress"
                    style={{ width: `${progress}%` }}
                    aria-hidden="true"
                  />
                  <span className="w-100 text-center position-relative">
                    {isLoading ? `Generating Plan... (${progress}%)` : 'GENERATE SMART MEAL PLAN'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Results */}
      {mealPlan && (
        <MealCard mealPlan={mealPlan} constraints={constraints} formatINR={formatINR} />
      )}
    </div>
  );
};

export default DietPlanner;
