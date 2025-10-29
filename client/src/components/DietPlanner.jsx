import React, { useState } from 'react';
import axios from 'axios';
import MealCard from './MealCard';

const API_URL = 'https://diet-planner-stkt.onrender.com/api/generate-plan';

const DietPlanner = () => {
    // State for User Inputs
    const [constraints, setConstraints] = useState({
        dietType: 'Non-Vegetarian',
        calorieTarget: 2200,
        allergies: '',
        cuisinePreference: 'South Indian (Tamil Nadu)',
        dailyBudget: 300,
    });

    // State for API Output & Loading
    const [mealPlan, setMealPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    // Handles changes in the form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setConstraints(prev => ({ ...prev, [name]: value }));
    };

    // Simulates real-time loading progress up to 90%
    const simulateProgress = () => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            // Increments progress randomly but stops before 100%
            currentProgress += Math.floor(Math.random() * (7 - 1) + 1);
            if (currentProgress >= 90) {
                clearInterval(interval);
                currentProgress = 90;
            }
            setProgress(currentProgress);
        }, 800); // Update every 800ms

        return interval;
    };

    // Handles the form submission and API call
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMealPlan(null);
        setProgress(0);

        // 👇 Fix mobile disappearing hover / focus glitch
        if (document.activeElement && typeof document.activeElement.blur === "function") {
            document.activeElement.blur();
        }

        if (constraints.calorieTarget <= 0 || constraints.dailyBudget <= 0) {
            setError("Please enter valid positive numbers for Calories and Budget.");
            setIsLoading(false);
            return;
        }

        const progressInterval = simulateProgress(); // Start simulation

        try {
            // Sends constraints to the secure Express proxy
            const response = await axios.post(API_URL, constraints);
            setMealPlan(response.data);

            setProgress(100); // Finalize progress bar on success

        } catch (err) {
            console.error("API Call Error:", err);
            const details = err.response?.data?.details || err.message;
            setError(`Plan generation failed: ${details}. Check your console for details.`);
            setProgress(0);
            setTimeout(() => setIsLoading(false), 500); // Hide loading quickly on error

        } finally {
            clearInterval(progressInterval); // Stop simulation
            if (!error) {
                // Wait briefly to show 100% before transitioning to results
                setTimeout(() => setIsLoading(false), 500);
            }
        }
    };

    // --- Helper function for currency formatting (Indian locale for INR) ---
    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // --- RENDER LOGIC ---
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

            {/* Input Form Card - Uses custom glass-card style */}
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

                            {/* Submit Button */}
                            <div className="col-12 pt-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`btn ui-btn rounded-5 mb-4 btn-lg w-100 text-white`}
                                    style={{
                                        "--progress": `${progress}%` // dynamic progress fill
                                    }}
                                >
                                    <span className="w-100 text-center">
                                        {isLoading ? `Generating Plan... (${progress}%)` : 'GENERATE SMART MEAL PLAN'}
                                    </span>
                                </button>

                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Error and Loading Feedback */}
            {error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            )}

            {/* 3. Rendered Meal Plan */}
            {mealPlan && (
                <MealCard mealPlan={mealPlan} constraints={constraints} formatINR={formatINR} />
            )}
        </div>
    );
};

export default DietPlanner;
