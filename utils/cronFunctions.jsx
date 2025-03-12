import { db } from "./dbConfig";
import { and, eq, sql } from "drizzle-orm";
import { Incomes, Transactions } from "./schema";
import { getISTDate } from "./utilities";


export const incomeExpiration = async () => {
  const today = getISTDate();

  try {
    // Fetch all non-recurring incomes that have expired
    const expiredIncomes = await db
      .select()
      .from(Incomes)
      .where(
        and(
          sql`AGE(${Incomes.endDate}, ${today}) <= interval '0 days'`,
          eq(Incomes.incomeType, "non-recurring")
        )
      );

    for (const income of expiredIncomes) {
      const expirationDateTime = `${income.endDate} 23:59:00`;

      // Ensure deletion only happens if the current time is past 23:59:00 of the end date
      // if (getISTDateTime() >= expirationDateTime) {
        // Delete income from the database
        await db.delete(Incomes).where(eq(Incomes.id, income.id)).returning();
        await db
          .update(Transactions)
          .set({
            lastUpdated: getISTDate(),
            status: "expired",
            deletionRemark: `Income ${income.name} has expired on ${income.endDate}`,
          })
          .where(eq(Transactions.referenceId, income.id))
          .returning();
      // }
    }
  } catch {
    console.error("Error processing deletion of expired incomes!");
  }
};
