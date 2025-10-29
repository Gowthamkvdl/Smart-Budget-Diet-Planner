import React, { useEffect, useRef } from "react";

/** Map meal types to Bootstrap Icons */
const typeIcon = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("break")) return "bi-sunrise";
  if (t.includes("lunch")) return "bi-umbrella";
  if (t.includes("snack")) return "bi-cup-straw";
  if (t.includes("dinner")) return "bi-moon-stars";
  return "bi-egg-fried";
};

/** INR formatter */
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/** Compute a color tier for cost vs target */
const budgetTier = (cost, target) => {
  const ratio = cost / Math.max(target, 1);
  if (ratio <= 0.95) return "ok";        // under target → green
  if (ratio <= 1.1) return "warn";       // near target → amber
  return "over";                         // above target → red
};

const MealCard = ({ mealPlan, constraints }) => {

  const cardRef = useRef(null);

  useEffect(() => {
    if (mealPlan && mealPlan.length && cardRef.current) {
      // ensure DOM is painted first
      requestAnimationFrame(() => {
        cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [mealPlan]); // <-- trigger when mealPlan updates

  return (
    <section ref={cardRef} className="mt-5 mb-5">
      <h2 className="fw-bold mb-4 pt-3 text-dark-emphasis text-center display-6">
        Your 7-Day Personalized Plan
      </h2>

      <div className="row g-4">
        {mealPlan.map((dayPlan) => {
          const dayCost = dayPlan.daily_total_cost_approx ?? 0;
          const target = constraints?.dailyBudget ?? 0;
          const tier = budgetTier(dayCost, target);
          const pct = Math.max(0, Math.min(120, Math.round((dayCost / Math.max(target, 1)) * 100)));

          // daily calories (optional but nice)
          const totalKcal = (dayPlan.meals || []).reduce(
            (sum, m) => sum + (Number(m.calories_approx) || 0),
            0
          );

          return (
            <div key={dayPlan.day} className="col-lg-6 px-3">
              <article className="plan-card glass-card h-100 rounded-5">
                {/* Header */}
                <header className="plan-header rounded-top-5">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge plan-day-badge rounded-pill px-3 py-2">
                        Day {dayPlan.day}
                      </span>
                      <span className="fw-semibold text-white-90">
                        {formatINR(dayCost)}
                      </span>
                      <span className="text-white-50 small">
                        (Target: {formatINR(target)})
                      </span>
                    </div>

                    <span
                      className={`badge rounded-pill plan-tier plan-tier-${tier}`}
                    >
                      {tier === "ok" ? "Under Budget" : tier === "warn" ? "On Track" : "Over Budget"}
                    </span>
                  </div>

                  {/* Slim cost progress */}
                  <div className="plan-budget mt-3">
                    <div className="plan-budget-track">
                      <div
                        className={`plan-budget-fill plan-budget-${tier}`}
                        style={{ width: `${pct}%` }}
                        aria-label="Budget usage"
                      />
                    </div>
                    <div className="d-flex justify-content-between small mt-1 text-white-75">
                      <span>₹ Spent</span>
                      <span>{pct}% of target</span>
                    </div>
                  </div>
                </header>

                {/* Body */}
                <div className="card-body p-0">
                  <ul className="list-unstyled m-0">
                    {(dayPlan.meals || []).map((meal, idx) => (
                      <li
                        key={idx}
                        className={`meal-item ${idx < dayPlan.meals.length - 1 ? "meal-divider" : ""}`}
                      >
                        <div className="d-flex align-items-start gap-3">
                          <div className="meal-icon-wrap">
                            <i className={`bi ${typeIcon(meal.meal_type)}`} />
                          </div>

                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start gap-2">
                              <p className="fw-semibold mb-1">
                                {meal.meal_type}:{" "}
                                <span className="link-primary text-decoration-none">
                                  {meal.dish_name}
                                </span>
                              </p>

                              <span className="meta-chip">
                                {formatINR(meal.budget_cost_approx)}
                              </span>
                            </div>

                            <p className="small text-muted fst-italic mb-2">
                              {meal.recipe_summary}
                            </p>

                            <div className="d-flex gap-2 flex-wrap small text-secondary">
                              <span className="meta">
                                <i className="bi bi-fire me-1" />
                                {meal.calories_approx} kcal
                              </span>
                              {/* You can add protein/carbs here later */}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Footer meta */}
                  <div className="plan-footer d-flex justify-content-between align-items-center">
                    <span className="small text-secondary">
                      Total calories ~ <strong>{totalKcal}</strong> kcal
                    </span>
                    <span className="small text-secondary">
                      Items: <strong>{dayPlan.meals?.length || 0}</strong>
                    </span>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MealCard;
