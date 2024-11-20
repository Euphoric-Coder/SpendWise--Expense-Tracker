'use client';

import IncomeVisualization from '@/components/Finance/IncomeVisualization';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses, Incomes } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'

const page = () => {
      const { user } = useUser();

      const [budgetList, setBudgetList] = useState([]);
      const [incomeList, setIncomeList] = useState([]);
      const [expensesList, setExpensesList] = useState([]);
      const [totalIncome, setTotalIncome] = useState(0);

      useEffect(() => {
        user && getBudgetList();
      }, [user]);
      /**
       * used to get budget List
       */
      const getBudgetList = async () => {
        const result = await db
          .select({
            ...getTableColumns(Budgets),

            totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number),
          })
          .from(Budgets)
          .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
          .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
          .groupBy(Budgets.id)
          .orderBy(desc(Budgets.id));
        setBudgetList(result);
        getAllExpenses();
        getIncomeList();
      };

      /**
       * Get Income stream list
       */
      const getIncomeList = async () => {
        try {
          // Fetch the income list
          const incomeList = await db
            .select(
              {
                // id: Incomes.id,
                name: Incomes.name,
                amount: Incomes.amount,
                // createdAt: Incomes.createdAt,
              }
            )
            .from(Incomes)
            .where(
              eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress)
            )
            .orderBy(desc(Incomes.id));

          // Calculate the total income
          const totalIncomeResult = await db
            .select({
              totalIncome: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(
                Number
              ),
            })
            .from(Incomes)
            .where(
              eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress)
            );

          // Extract total income
          const totalIncome = totalIncomeResult[0]?.totalIncome || 0;

          // Set income list and log total income
          setIncomeList(incomeList);
          setTotalIncome(totalIncome);

        } catch (error) {
          console.error("Error fetching income list or total income:", error);
        }
      };


      /**
       * Used to get All expenses belong to users
       */
      const getAllExpenses = async () => {
        const result = await db
          .select({
            id: Expenses.id,
            name: Expenses.name,
            amount: Expenses.amount,
            createdAt: Expenses.createdAt,
            // budgetName: Budgets.name, // For getting the budget name associated with the expenses
          })
          .from(Budgets)
          .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
          .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
          .orderBy(desc(Expenses.id));
        setExpensesList(result);
      };

  return (
    <div>
      <IncomeVisualization incomeList={incomeList} totalIncome={totalIncome}/>
    </div>
  )
}

export default page