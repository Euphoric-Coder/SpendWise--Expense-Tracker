import { text } from "drizzle-orm/mysql-core";
import {
  Laptop,
  TrendingUp,
  Wallet,
  Building,
  Home,
  Plus,
  ShoppingBasket,
  Zap,
  UtensilsCrossed,
  Plane,
} from "lucide-react";

export const incomeCategories = [
  {
    id: "salary",
    name: "Salary",
    color: "#34d399", // Emerald-400, light and professional green
    textColor: "#ffffff", // White text for contrast
    icon: Wallet,
  },
  {
    id: "freelance",
    name: "Freelance",
    color: "#38bdf8", // Sky-400, fresh and modern blue
    textColor: "#ffffff", // White text for contrast
    icon: Laptop,
  },
  {
    id: "investments",
    name: "Investments",
    color: "#818cf8", // Indigo-400, elegant purple-blue
    textColor: "#ffffff", // White text for contrast
    icon: TrendingUp,
  },
  {
    id: "business",
    name: "Business",
    color: "#f472b6", // Pink-400, vibrant and creative pink
    textColor: "#ffffff", // White text for contrast
    icon: Building,
  },
  {
    id: "rental",
    name: "Rental",
    color: "#facc15", // Yellow-400, bright and attention-grabbing yellow
    textColor: "#000000", // Black text for contrast
    icon: Home,
  },
  {
    id: "other-income",
    name: "Other Income",
    color: "#94a3b8", // Slate-400, neutral and professional gray-blue
    textColor: "#ffffff", // White text for contrast
    icon: Plus,
  },
];

export const expenseCategoriesList = [
  "Housing",
  "Transportation",
  "Groceries",
  "Utilities",
  "Entertainment",
  "Food",
  "Shopping",
  "Healthcare",
  "Education",
  "Personal Care",
  "Travel",
  "Insurance",
  "Gifts/Donations",
  "Bills/Fees",
  "Other Expenses",
];

export const expenseSubcategories = {
  housing: [
    "Rent",
    "Mortgage",
    "Property Tax",
    "Maintenance",
    "Home Insurance",
  ],
  transportation: [
    "Fuel",
    "Public Transport",
    "Maintenance",
    "Parking",
    "Ride-sharing",
  ],
  groceries: ["Fruits", "Vegetables", "Meat", "Dairy", "Bakery", "Beverages"],
  utilities: [
    "Electricity",
    "Water",
    "Gas",
    "Internet",
    "Phone",
    "Garbage Collection",
  ],
  entertainment: [
    "Movies",
    "Games",
    "Streaming Services",
    "Concerts",
    "Events",
  ],
  food: ["Restaurants", "Cafes", "Fast Food", "Takeout", "Beverages"],
  shopping: ["Clothing", "Electronics", "Home Goods", "Accessories", "Gadgets"],
  healthcare: ["Medical", "Dental", "Pharmacy", "Insurance", "Vision Care"],
  education: ["Tuition", "Books", "Courses", "Workshops", "School Supplies"],
  personal: ["Haircut", "Gym", "Beauty", "Wellness", "Spa"],
  travel: ["Flights", "Hotels", "Car Rentals", "Tours", "Public Transport"],
  insurance: ["Life", "Home", "Vehicle", "Health", "Travel"],
  gifts: [
    "Birthday Gifts",
    "Charity",
    "Holiday Gifts",
    "Donations",
    "Weddings",
  ],
  bills: [
    "Bank Fees",
    "Late Fees",
    "Service Charges",
    "Subscription Fees",
    "Loan Payments",
  ],
  other_expense: ["Miscellaneous", "Unexpected Costs", "One-time Purchases"],
};

export const expenseCategories = [
  {
    id: "housing",
    name: "Housing",
    color: "#ef4444", // red-500
    icon: "Home",
    subcategories: expenseSubcategories.housing,
  },
  {
    id: "transportation",
    name: "Transportation",
    color: "#f97316", // orange-500
    icon: "Car",
    subcategories: expenseSubcategories.transportation,
  },
  {
    id: "groceries",
    name: "Groceries",
    color: "#84cc16", // lime-500
    icon: "ShoppingBasket",
    subcategories: expenseSubcategories.groceries,
  },
  {
    id: "utilities",
    name: "Utilities",
    color: "#06b6d4", // cyan-500
    icon: "Zap",
    subcategories: expenseSubcategories.utilities,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    color: "#8b5cf6", // violet-500
    icon: "Film",
    subcategories: expenseSubcategories.entertainment,
  },
  {
    id: "food",
    name: "Food",
    color: "#f43f5e", // rose-500
    icon: "UtensilsCrossed",
    subcategories: expenseSubcategories.food,
  },
  {
    id: "shopping",
    name: "Shopping",
    color: "#ec4899", // pink-500
    icon: "ShoppingBag",
    subcategories: expenseSubcategories.shopping,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    color: "#14b8a6", // teal-500
    icon: "HeartPulse",
    subcategories: expenseSubcategories.healthcare,
  },
  {
    id: "education",
    name: "Education",
    color: "#6366f1", // indigo-500
    icon: "GraduationCap",
    subcategories: expenseSubcategories.education,
  },
  {
    id: "personal",
    name: "Personal Care",
    color: "#d946ef", // fuchsia-500
    icon: "Smile",
    subcategories: expenseSubcategories.personal,
  },
  {
    id: "travel",
    name: "Travel",
    color: "#0ea5e9", // sky-500
    icon: "Plane",
    subcategories: expenseSubcategories.travel,
  },
  {
    id: "insurance",
    name: "Insurance",
    color: "#64748b", // slate-500
    icon: "Shield",
    subcategories: expenseSubcategories.insurance,
  },
  {
    id: "gifts",
    name: "Gifts & Donations",
    color: "#f472b6", // pink-400
    icon: "Gift",
    subcategories: expenseSubcategories.gifts,
  },
  {
    id: "bills",
    name: "Bills & Fees",
    color: "#fb7185", // rose-400
    icon: "Receipt",
    subcategories: expenseSubcategories.bills,
  },
  {
    id: "other-expense",
    name: "Other Expenses",
    color: "#94a3b8", // slate-400
    icon: "MoreHorizontal",
    subcategories: expenseSubcategories.other_expense,
  },
];
