export const parseCsv = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      try {
        const rows = text.split("\n").map((row) => row.trim());
        if (rows.length < 2) {
          throw new Error("The CSV file is empty or does not have valid data.");
        }

        const headers = rows[0].split(",").map((header) => header.trim());
        const data = rows.slice(1).map((row) => {
          const values = row.split(",").map((value) => value.trim());
          return headers.reduce((acc, header, index) => {
            acc[header] = values[index];
            return acc;
          }, {});
        });

        resolve(data);
      } catch (error) {
        reject(`Error parsing CSV: ${error.message}`);
      }
    };

    reader.onerror = () => {
      reject("Failed to read the file. Please try again.");
    };

    reader.readAsText(file);
  });
};
