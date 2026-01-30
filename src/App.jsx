import { useState } from 'react';
import { bases, options, condiments } from './data/menuData';
import './App.css';

const STEPS = [
  { key: 'base', title: 'Choose Your Base', subtitle: 'Start with a vegetable mix or wholegrain' },
  { key: 'option', title: 'Add Your Protein', subtitle: 'Pick a fish, meat, or vegetarian option' },
  { key: 'condiment', title: 'Top It Off', subtitle: 'Finish with a sauce or crunch' },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    base: null,
    option: null,
    condiment: null,
  });

  const getItemsForStep = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return bases;
      case 1:
        // If base has compatibleOptions defined, filter; otherwise show all
        if (selections.base?.compatibleOptions) {
          return options.filter((o) => selections.base.compatibleOptions.includes(o.id));
        }
        return options;
      case 2:
        // If option has compatibleCondiments defined, filter; otherwise show all
        if (selections.option?.compatibleCondiments) {
          return condiments.filter((c) => selections.option.compatibleCondiments.includes(c.id));
        }
        return condiments;
      default:
        return [];
    }
  };

  const handleSelect = (item) => {
    const stepKey = STEPS[currentStep].key;
    setSelections((prev) => ({ ...prev, [stepKey]: item }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelections({ base: null, option: null, condiment: null });
  };

  const calculateTotal = () => {
    let total = 0;
    if (selections.base) total += selections.base.price;
    if (selections.option) total += selections.option.price;
    if (selections.condiment) total += selections.condiment.price;
    return total.toFixed(2);
  };

  const calculateNutrition = () => {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    [selections.base, selections.option, selections.condiment].forEach((item) => {
      if (item?.nutrition) {
        totals.calories += item.nutrition.calories;
        totals.protein += item.nutrition.protein;
        totals.carbs += item.nutrition.carbs;
        totals.fat += item.nutrition.fat;
      }
    });
    return totals;
  };

  const currentSelection = selections[STEPS[currentStep].key];
  const items = getItemsForStep(currentStep);
  const isComplete = selections.base && selections.option && selections.condiment;

  return (
    <div className="app">
      <header className="header">
        <img src="/logo.png" alt="joice - sous vide cuisine" className="logo" />
      </header>

      <div className="progress-bar">
        {STEPS.map((step, index) => (
          <div
            key={step.key}
            className={`progress-step ${index === currentStep ? 'active' : ''} ${
              index < currentStep ? 'completed' : ''
            }`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step.title}</div>
          </div>
        ))}
      </div>

      {!isComplete ? (
        <main className="main">
          <div className="step-header">
            <h2>{STEPS[currentStep].title}</h2>
            <p>{STEPS[currentStep].subtitle}</p>
          </div>

          <div className="items-grid">
            {items.map((item) => (
              <div
                key={item.id}
                className={`item-card ${currentSelection?.id === item.id ? 'selected' : ''}`}
                onClick={() => handleSelect(item)}
              >
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder-image" />
                  )}
                </div>
                <div className="item-content">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price">+{item.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="navigation">
            <button className="btn btn-secondary" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </button>
            <div className="running-total">
              Total: <strong>{calculateTotal()}</strong>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!currentSelection}
            >
              {currentStep === STEPS.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </main>
      ) : (
        <main className="main summary">
          <h2>Your Meal</h2>

          <div className="summary-items">
            <div className="summary-item">
              <span className="summary-label">Base</span>
              <span className="summary-name">{selections.base.name}</span>
              <span className="summary-price">{selections.base.price.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Protein</span>
              <span className="summary-name">{selections.option.name}</span>
              <span className="summary-price">{selections.option.price.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Topping</span>
              <span className="summary-name">{selections.condiment.name}</span>
              <span className="summary-price">{selections.condiment.price.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{calculateTotal()}</span>
            </div>
          </div>

          <div className="nutrition-info">
            <h3>Nutrition Facts</h3>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="nutrition-value">{calculateNutrition().calories}</span>
                <span className="nutrition-label">kcal</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-value">{calculateNutrition().protein}g</span>
                <span className="nutrition-label">Protein</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-value">{calculateNutrition().carbs}g</span>
                <span className="nutrition-label">Carbs</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-value">{calculateNutrition().fat}g</span>
                <span className="nutrition-label">Fat</span>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleReset}>
            Create Another Meal
          </button>
        </main>
      )}
    </div>
  );
}

export default App;
