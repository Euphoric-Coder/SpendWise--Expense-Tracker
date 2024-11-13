
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


export { formatCurrency };