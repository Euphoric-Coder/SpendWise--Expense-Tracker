export async function GET(req) {
  console.log("📨 Data Storage & Detail Updation API Triggered...");

  return new Response(
    JSON.stringify({
      message: "Data Storage (Every 5 mins) executed successfully!",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
