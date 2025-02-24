/** @type {import('next').NextConfig} */
import { startCronJobs } from "./lib/cron.js";

const nextConfig = {
  reactStrictMode: true,
};

// Start cron jobs when the server starts
startCronJobs();

export default nextConfig;
