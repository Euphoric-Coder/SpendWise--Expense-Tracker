
export const processCsv = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (!text) throw new Error("Empty file or invalid content.");

        const rows = text.split("\n").filter((row) => row.trim());
        if (rows.length < 2)
          throw new Error(
            "CSV file must have a header and at least one data row."
          );

        const expenses = rows.slice(1).map((row) => {
          const [date, name, amount] = row
            .split(",")
            .map((item) => item.trim());
          return { date, name, amount };
        });

        resolve(expenses);
      } catch (error) {
        reject(error.message || "Error processing the CSV file.");
      }
    };

    reader.onerror = () => {
      reject("Failed to read the CSV file. Please try again.");
    };

    reader.readAsText(file);
  });
};
