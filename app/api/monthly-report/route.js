export async function GET(req) {
  console.log("📨 Monthly Report API Triggered...");

  return new Response(
    JSON.stringify({
      message:
        "Monthly Report (1st day of the month at 8:00 AM) executed successfully!",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
