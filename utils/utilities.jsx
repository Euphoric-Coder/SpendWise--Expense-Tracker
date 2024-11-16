
const formatCurrency = (amount) => {
  let formattedAmount;

  if (amount >= 1_000_000_000) {
    // Billion
    formattedAmount = `${(amount / 1_000_000_000).toFixed(2)}B`;
  } else if (amount >= 1_000_000) {
    // Million
    formattedAmount = `${(amount / 1_000_000).toFixed(2)}M`;
  } else if (amount >= 1_000) {
    // Thousand
    formattedAmount = `${(amount / 1_000).toFixed(2)}K`;
  } else {
    // Less than 1,000
    formattedAmount = amount.toFixed(2);
  }

  // Add currency symbol manually
  return `₹${formattedAmount}`;
};

export const formatCurrencyDashboard = (amount) => {
  let formattedAmount;

  if (amount >= 1_00_00_00_000) {
    // Lakh Crore
    formattedAmount = `${(amount / 1_00_00_00_000).toFixed(1)}L Cr`;
  } else if (amount >= 1_00_00_000) {
    // Crore
    formattedAmount = `${(amount / 1_00_00_000).toFixed(1)}Cr`;
  } else if (amount >= 1_00_000) {
    // Lakh
    formattedAmount = `${(amount / 1_00_000).toFixed(1)}L`;
  } else if (amount >= 1_000) {
    // Thousand
    formattedAmount = `${(amount / 1_000).toFixed(1)}K`;
  } else {
    // Less than 1,000
    formattedAmount = amount.toFixed(1);
  }

  return `₹${formattedAmount}`;
};



export { formatCurrency };