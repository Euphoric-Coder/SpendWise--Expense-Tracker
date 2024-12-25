export const processCsv = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (!text) throw new Error("Empty file or invalid content.");

        const rows = text.split("\n").filter((row) => row.trim());
        if (rows.length < 2) {
          throw new Error(
            "CSV file must have a header and at least one data row."
          );
        }

        const expenses = [];
        const errors = [];

        rows.slice(1).forEach((row, index) => {
          const [date, name, amount, description] = row
            .split(",")
            .map((item) => item.trim());

          // Validation
          if (!date || isNaN(Date.parse(date))) {
            errors.push(`Row ${index + 2}: Invalid date format.`);
            return;
          }
          if (!name) {
            errors.push(`Row ${index + 2}: Name cannot be empty.`);
            return;
          }
          if (!amount || isNaN(amount) || Number(amount) <= 0) {
            errors.push(`Row ${index + 2}: Invalid amount.`);
            return;
          }

          expenses.push({ date, name, amount, description });
        });

        if (errors.length > 0) {
          reject(`Errors in CSV file:\n${errors.join("\n")}`);
        } else {
          resolve(expenses);
        }
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
