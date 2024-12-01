import { format } from "date-fns";

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
  // Handle null or undefined amounts
  if (!amount || isNaN(amount)) {
    return "₹0";
  }

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

export const getISTDate = () => {
  // Create a new Date object
  const now = new Date();

  // Convert to Indian Standard Time (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is 5 hours 30 minutes ahead of UTC
  const istDate = new Date(now.getTime() + istOffset);

  return istDate.toISOString().split("T")[0]; // Return date in YYYY-MM-DD format
};

export const getISTCustomDate = (date) => {
  // Create a new Date object
  const now = new Date(date);

  // Convert to Indian Standard Time (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is 5 hours 30 minutes ahead of UTC
  const istDate = new Date(now.getTime() + istOffset);

  return istDate.toISOString().split("T")[0]; // Return date in YYYY-MM-DD format
};

export function isSameDate(date, today) {
  const parsedDate = new Date(date);
  const parsedToday = new Date(today);

  return parsedDate.getTime() === parsedToday.getTime();
}

export function formatDate(inputDate) {
  // Parse the input to a Date object if it's a string
  const date = new Date(inputDate);

  // Automatically detect timezone offset and adjust the date
  const offsetInMinutes = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offsetInMinutes * 60 * 1000);

  // Format the adjusted date to 'YYYY-MM-DD'
  return format(adjustedDate, "yyyy-MM-dd");
}

export function dateDifference(date) {
  // Get today's date
  const today = new Date(getISTDate());

  // Parse the provided date string into a Date object
  const parsedDate = new Date(date);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = Math.abs(today - parsedDate);

  // Convert milliseconds to days
  const differenceInDays = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  return differenceInDays;
}

export { formatCurrency };