// export default {
//   schema: "./utils/schema.jsx",
//   driver: "pg",
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL,
//   },
// };

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.jsx",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
});
