const EMISSION_FACTORS = {
  transport: {
    car: 0.21,       // kg CO2 per km
    bus: 0.089,      // kg CO2 per km
    flight: 0.255,   // kg CO2 per km
    bike: 0,         // kg CO2 per km
  },
  food: {
    beef: 6.61,       // kg CO2 per kg
    chicken: 1.24,    // kg CO2 per kg
    vegetarian: 0.5,  // kg CO2 per meal
    vegan: 0.3,       // kg CO2 per meal
  },
  energy: {
    electricity: 0.82,  // kg CO2 per kWh
    gas: 2.04,           // kg CO2 per m³
  },
  shopping: {
    clothing: 15,      // kg CO2 per item
    electronics: 50,   // kg CO2 per item
    general: 5,        // kg CO2 per item
  },
};

/**
 * Calculate CO2 emissions for a given activity.
 * @param {string} category - Activity category (transport, food, energy, shopping)
 * @param {string} type - Activity type within the category
 * @param {number} quantity - Amount/quantity of the activity
 * @returns {number} CO2 emissions in kg
 */
const calculateCO2 = (category, type, quantity) => {
  const categoryFactors = EMISSION_FACTORS[category];

  if (!categoryFactors) {
    throw new Error(`Unknown category: ${category}`);
  }

  const factor = categoryFactors[type];

  if (factor === undefined) {
    throw new Error(`Unknown type '${type}' for category '${category}'`);
  }

  return parseFloat((factor * quantity).toFixed(3));
};

module.exports = { EMISSION_FACTORS, calculateCO2 };
