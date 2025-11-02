// src/DietPlanner.jsx
import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import axios from 'axios';
import MealCard from './MealCard';

const API_URL = 'http://localhost:3000/api/generate-plan';

const DietPlanner = () => {
	// Inputs
	const [constraints, setConstraints] = useState({
		dietType: 'Non-Vegetarian',
		calorieTarget: 2200,
		allergies: '',
		cuisinePreference: 'South Indian (Tamil Nadu)',
		dailyBudget: 300,
	});

	// UI/State
	const [mealPlan, setMealPlan] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);

	// Detect touch (mobile) to avoid native disabled bug
	const [isTouch, setIsTouch] = useState(false);
	useEffect(() => {
		const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		setIsTouch(touch);
		if (touch) document.documentElement.classList.add('no-hover');
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setConstraints(prev => ({ ...prev, [name]: value }));
	};

	// Simulated progress up to 90% while API runs
	const simulateProgress = () => {
		let current = 0;
		const id = setInterval(() => {
			current += Math.floor(Math.random() * 6) + 1; // +1..+6
			if (current >= 90) { current = 90; clearInterval(id); }
			setProgress(current);
		}, 800);
		return id;
	};
	// NEW state
	const [showProgress, setShowProgress] = useState(false);
	const mobBtn = useRef(null)

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (document.activeElement?.blur) document.activeElement.blur();

		// 1) Flush loading state
		flushSync(() => {
			setIsLoading(true);
			setError(null);
			setMealPlan(null);
			setProgress(0);
			setShowProgress(false);
		});

		// ✅ Force button re-render (repaint)
		if (mobBtn.current) {
			mobBtn.current.style.transform = 'scale(0.97)';
			mobBtn.current.style.opacity = '0.85';
			setTimeout(() => {
				if (mobBtn.current) {
					mobBtn.current.style.transform = 'scale(1)';
					mobBtn.current.style.opacity = '1';
				}
			}, 150); // slight animation bump
		}

		// 2) Ensure the button renders in "loading" state first
		await new Promise(r => requestAnimationFrame(r));

		// 3) Turn on the progress layer and give it a tiny kick (1%)
		flushSync(() => {
			setShowProgress(true);
			setProgress(1);
		});

		// 4) One more frame so width:1% actually paints before we animate further
		await new Promise(r => requestAnimationFrame(r));

		// Validate
		if (constraints.calorieTarget <= 0 || constraints.dailyBudget <= 0) {
			setError("Please enter valid positive numbers for Calories and Budget.");
			setIsLoading(false);
			setShowProgress(false);
			return;
		}

		// Start simulated progress
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
			setTimeout(() => {
				setIsLoading(false);
				setShowProgress(false);
			}, 500);
		}
	};


	const formatINR = (amount) =>
		new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			maximumFractionDigits: 0
		}).format(amount);

	// Desktop uses disabled; Mobile uses class + pointer-events:none
	const actuallyDisabled = !isTouch && isLoading;     // real disabled on desktop
	const ariaDisabled = isTouch && isLoading ? true : undefined;
	const pointerStyle = isTouch && isLoading ? { pointerEvents: 'none' } : undefined;
	const loadingClass = isLoading ? 'is-loading' : '';

	return (
		<div className="container mt-2 mt-md-5">
			<header className="text-center mb-md-5">
				<h1 className="display-4 text-success pt-5 font-weight-bold">
					Smart Budget Diet Planner
				</h1>
				<p className="lead text-muted">
					Generate a personalized, budget-friendly meal plan using AI.
				</p>
			</header>

			<div className="p-3 p-md-5 mx-1 pt-4 glass-card mb-5 m-0">
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

							{/* Max Daily Budget */}
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

							{/* Allergies */}
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

							{/* Submit Button (Desktop = disabled+internal progress; Mobile = visual disabled + internal progress) */}
							<div className="col-12">
								{/* Desktop button */}
								{/* DESKTOP */}
								<button disabled={isLoading} className={`btn fw-semibold ui-btn ui-btn--desktop d-none d-md-block w-100 rounded-5 fs-4 ${isLoading ? 'is-loading' : ''} `}>
									{(isLoading || showProgress) && (
										<div className="btn-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
									)}
									<span className="w-100 text-center position-relative">
										{isLoading ? `Generating Plan... (${progress}%)` : 'GENERATE SMART MEAL PLAN'}
									</span>
								</button>

								{/* Mobile button — NOT actually disabled to avoid paint bug, but same look with progress */}
								<div
									ref={mobBtn}
									disabled={isLoading}
									className={`btn mb-4 ui-btn--mobile fw-semibold d-md-none d-block w-100 rounded-5 fs-4 ${isLoading ? 'is-loading' : ''} `}
									onClick={!isLoading ? handleSubmit : undefined}
									style={isLoading ? { pointerEvents: 'none' } : undefined}
								>
									{(isLoading || showProgress) && (
										<div className="btn-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
									)}
									<span className="w-100 text-center position-relative">
										{isLoading ? `Generating Plan... (${progress}%)` : 'GENERATE SMART MEAL PLAN'}
									</span>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>

			{error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
			{mealPlan && <MealCard mealPlan={mealPlan} constraints={constraints} formatINR={formatINR} />}
		</div>
	);
};

export default DietPlanner;

