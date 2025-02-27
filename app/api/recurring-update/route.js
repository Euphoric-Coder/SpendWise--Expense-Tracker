import { incomeExpiration } from "@/utils/cronFunctions";

export async function GET(req) {
  console.log("📨 Recurring Updation API Triggered...");
  const result = await incomeExpiration();
  console.log(result);

  return new Response(
    JSON.stringify({
      message: "Recurring Updation (8:00 AM daily) executed successfully!",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
