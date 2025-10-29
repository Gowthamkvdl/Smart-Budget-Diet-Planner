import React, { useEffect, useState } from 'react';
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
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // 3) Detect touch device to switch button variant (mobile vs desktop)
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch);
    if (touch) document.documentElement.classList.add('no-hover'); // used by CSS to disable hover anim
  }, []);

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConstraints(prev => ({ ...prev, [name]: value }));
  };

  // Simulate progress up to 90% while API runs
  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * (7 - 1) + 1); // +1..+6
      if (currentProgress >= 90) {
        clearInterval(interval);
        currentProgress = 90;
      }
      setProgress(currentProgress);
    }, 800);
    return interval;
  };

  // Submit -> show loading immediately on mobile, then call API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent sticky :hover/focus on mobile
    if (document.activeElement?.blur) document.activeElement.blur();

    setIsLoading(true);
    setError(null);
    setMealPlan(null);
    setProgress(0);

    // Force a paint before starting async work (mobile browsers)
    await new Promise((r) => requestAnimationFrame(r));

    if (constraints.calorieTarget <= 0 || constraints.dailyBudget <= 0) {
      setError("Please enter valid positive numbers for Calories and Budget.");
      setIsLoading(false);
      return;
    }

    const progressInterval = simulateProgress();

    try {
      const response = await axios.post(API_URL, constraints);
      setMealPlan(response.data);
      setProgress(100);
    } catch (err) {
      const details = err.response?.data?.details || err.message;
      console.error("API Call Error:", err);
      setError(`Plan generation failed: ${details}. Check your console for details.`);
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // (Optional helper) INR formatting if needed elsewhere
  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);

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

      {/* Input Form Card */}
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

              {/* Submit Button — mobile vs desktop */}
              <div className="col-12 pt-3">
                {isTouch ? (
                  // MOBILE: same style, no hover/chitchat, internal progress bar
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn ui-btn ui-btn--mobile rounded-5 mb-4 btn-lg w-100 text-white"
                    aria-live="polite"
                    aria-busy={isLoading}
                  >
                    <div
                      className="btn-progress"
                      style={{ width: `${progress}%` }}
                      aria-hidden="true"
                    />
                    <span className="w-100 text-center position-relative">
                      {isLoading ? `Generating Plan... (${progress}%)` : 'GENERATE SMART MEAL PLAN'}
                    </span>
                  </button>
                ) : (
                  // DESKTOP: keeps hover shimmer + chitchat, progress inside too
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn ui-btn ui-btn--desktop rounded-5 mb-4 btn-lg w-100 text-white"
                    aria-live="polite"
                    aria-busy={isLoading}
                  >
                    <div
                      className="btn-progress"
                      style={{ width: `${progress}%` }}
                      aria-hidden="true"
                    />
                    <span className="w-100 text-center position-relative">
                      {isLoading ? `Generating Plan... (${progress}%)` : 'GENERATE SMART MEAL PLAN'}
                    </span>
                  </button>
                )}
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
