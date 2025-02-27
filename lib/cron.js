import cron from "node-cron";

// Function to start cron jobs
export function startCronJobs() {
  console.log("🚀 Initializing Cron Jobs...");

  // 🔹 Cron Job 1: Runs every day at 00:01 AM (Recurring Updation)
  cron.schedule("1 0 * * *", async () => {
    console.log("🔄 Running Recurring Updation (8:00 AM daily)...");
    try {
      const response = await fetch(
        "http://localhost:3000/api/recurring-update",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log("✅ Recurring Updation Response:", data);
    } catch (error) {
      console.error("❌ Recurring Updation Failed:", error);
    }
  });

  // 🔹 Cron Job 2: Runs every 5 minutes (Data Storage & Detail Updation)
  cron.schedule("*/2 * * * *", async () => {
    console.log(
      "📊 Running Data Storage & Detail Updation (Every 2 minutes)..."
    );
    try {
      const response = await fetch("http://localhost:3000/api/data-storage", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("✅ Data Storage Response:", data);
    } catch (error) {
      console.error("❌ Data Storage Failed:", error);
    }
  });

  // 🔹 Cron Job 3: Runs on the 1st day of the month at 8:00 AM (Monthly Report)
  cron.schedule("0 8 1 * *", async () => {
    console.log(
      "📅 Running Monthly Report (1st day of the month at 8:00 AM)..."
    );
    try {
      const response = await fetch("http://localhost:3000/api/monthly-report", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("✅ Monthly Report Response:", data);
    } catch (error) {
      console.error("❌ Monthly Report Failed:", error);
    }
  });

  console.log("✅ All cron jobs initialized...");
}
