import { format } from "date-fns";

// Function to format the number in Indian currency format
export const formatToIndianCurrency = (value) => {
  if (!value) return "";
  return new Intl.NumberFormat("en-IN").format(value.replace(/,/g, ""));
};

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

export function UTCtoIST(utcTimestamp) {
  const utcDate = new Date(utcTimestamp + "Z"); // Adding "Z" ensures UTC interpretation
  const istDateString = utcDate.toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
  });
  return istDateString;
}

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

export const getISTDateTime = () => {
  // Create a new Date object
  const now = new Date();

  // Use Intl.DateTimeFormat to format the date and time in IST
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  };

  // Format the date and time in IST
  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const parts = formatter.formatToParts(now);

  // Extract individual parts
  const date = `${parts.find((p) => p.type === "year").value}-${
    parts.find((p) => p.type === "month").value
  }-${parts.find((p) => p.type === "day").value}`;
  const time = `${parts.find((p) => p.type === "hour").value}:${
    parts.find((p) => p.type === "minute").value
  }:${parts.find((p) => p.type === "second").value}`;

  return `${date} ${time}`; // Return date and time in "YYYY-MM-DD HH:mm:ss" format
};

export const getISTCustomDate = (date) => {
  // Create a new Date object
  const now = new Date(date);

  // Convert to Indian Standard Time (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is 5 hours 30 minutes ahead of UTC
  const istDate = new Date(now.getTime() + istOffset);

  return istDate.toISOString().split("T")[0]; // Return date in YYYY-MM-DD format
};

export function addOneMonth(dateString) {
  // Parse the input date string into a Date object
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Month is 0-based in JavaScript

  // Add one month
  date.setMonth(date.getMonth() + 1);

  // Handle cases where adding a month changes the day (e.g., Feb 28 -> Mar 28)
  if (date.getDate() !== day) {
    // Set to the last day of the previous month
    date.setDate(0);
  }

  // Format the result back to YYYY-MM-DD
  const resultYear = date.getFullYear();
  const resultMonth = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  const resultDay = String(date.getDate()).padStart(2, "0");

  return `${resultYear}-${resultMonth}-${resultDay}`;
}

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

export function expenseDateFormat(dateStr) {
  const dateObj = new Date(dateStr);
  const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}/${String(
    dateObj.getMonth() + 1
  ).padStart(2, "0")}/${dateObj.getFullYear()}`;
  return formattedDate;
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

export function calculateNonRecurringProgress(startDate, endDate) {
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  const today = new Date();

  // Ensure the dates are valid
  if (parsedEndDate < parsedStartDate) {
    return 100; // Fully expired
  }

  // Calculate total days between start and end dates
  const totalDays = Math.ceil(
    (parsedEndDate - parsedStartDate) / (1000 * 60 * 60 * 24)
  );

  // Calculate remaining days from today to end date
  const remainingDays = Math.ceil(
    (parsedEndDate - today) / (1000 * 60 * 60 * 24)
  );

  // Ensure remaining days are within bounds
  if (remainingDays <= 0) {
    return 100; // Fully expired
  } else if (today < parsedStartDate) {
    return 0; // Not started yet
  }

  // Calculate the nonrecurringProgress percentage
  const progressPercentage = ((totalDays - remainingDays) / totalDays) * 100;

  return progressPercentage.toFixed(2); // Return percentage with 2 decimal places
}

export function nextRecurringDate(date, frequency) {
  console.log(date, frequency);
  if (date !== null && frequency !== null) {
    const next = new Date(date);

    switch (frequency?.toLowerCase()) {
      case "daily":
        next.setDate(next.getDate() + 1);
        break;

      case "weekly":
        next.setDate(next.getDate() + 7);
        break;

      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;

      case "yearly":
        next.setFullYear(next.getFullYear() + 1);
        break;

      default:
        console.log("error");
    }

    // Convert to IST (GMT +5:30) and format the date
    const istFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const [day, month, year] = istFormatter.format(next).split("/");

    return `${year}-${month}-${day}`;
  }
}

export function calculateRecurringProgress(startDate, frequency) {
  const today = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  // const parsedStartDate = new Date(new Date(startDate).getTime() + istOffset);
  const parsedStartDate = new Date(startDate);

  // Convert today's date to IST
  const todayInIST = new Date(today.getTime() + istOffset);

  // Ensure the start date is valid
  if (todayInIST < parsedStartDate) {
    return {
      progress: 0,
      nextRecurringDate: parsedStartDate.toISOString().split("T")[0],
      daysUntilNext: Math.ceil(
        (parsedStartDate - todayInIST) / (1000 * 60 * 60 * 24)
      ),
    };
  }

  let nextRecurringDate = new Date(parsedStartDate);

  // Calculate the next recurring date based on the frequency
  switch (frequency?.toLowerCase()) {
    case "daily":
      while (nextRecurringDate <= todayInIST) {
        nextRecurringDate.setDate(nextRecurringDate.getDate() + 1);
      }
      break;
    case "weekly":
      while (nextRecurringDate <= todayInIST) {
        nextRecurringDate.setDate(nextRecurringDate.getDate() + 7);
      }
      break;
    case "monthly":
      while (nextRecurringDate <= todayInIST) {
        nextRecurringDate.setMonth(nextRecurringDate.getMonth() + 1);
      }
      break;
    case "yearly":
      while (nextRecurringDate <= todayInIST) {
        nextRecurringDate.setFullYear(nextRecurringDate.getFullYear() + 1);
      }
      break;
    default:
      console.log("Invalid frequency. Use daily, weekly, monthly, or yearly.");
  }

  // Calculate days remaining until the next recurring date
  const daysUntilNext = Math.ceil(
    (nextRecurringDate - todayInIST) / (1000 * 60 * 60 * 24)
  );

  // Determine the duration of the current period in milliseconds
  let periodDuration;
  switch (frequency?.toLowerCase()) {
    case "daily":
      periodDuration = 24 * 60 * 60 * 1000; // 1 day
      break;
    case "weekly":
      periodDuration = 7 * 24 * 60 * 60 * 1000; // 1 week
      break;
    case "monthly":
      const currentMonth = todayInIST.getMonth();
      const nextMonth = currentMonth + 1;
      const startOfNextMonth = new Date(todayInIST.getFullYear(), nextMonth, 1);
      periodDuration =
        startOfNextMonth - new Date(todayInIST.getFullYear(), currentMonth, 1);
      break;
    case "yearly":
      periodDuration = 365 * 24 * 60 * 60 * 1000; // Approximate 1 year
      break;
  }

  // Calculate elapsed time since the start of the current recurring period
  const elapsedTime = todayInIST - parsedStartDate;
  const currentPeriodIndex = Math.floor(elapsedTime / periodDuration);
  const periodStartDate = new Date(
    parsedStartDate.getTime() + currentPeriodIndex * periodDuration
  );
  const timeSincePeriodStart = todayInIST - periodStartDate;

  // Calculate progress within the current period
  const progress = (timeSincePeriodStart / periodDuration) * 100;

  return {
    progress: progress.toFixed(2), // Progress percentage
    nextRecurringDate: nextRecurringDate.toISOString().split("T")[0], // Date of next recurring
    daysUntilNext, // Days remaining until next recurring
  };
}

export { formatCurrency };
