export function generateSuggestions(seeds, guesses) {
  let categories = { 4: [], 5: [], 6: [], 7: [], 8: [] };
  const used = new Set(guesses.map((g) => g.value));

  seeds.forEach((item) => {
    const digits = item.value.replace(/\D/g, ""); // numbers only

    Object.keys(categories).forEach((lenStr) => {
      const len = parseInt(lenStr);
      for (let i = 0; i <= digits.length - len; i++) {
        const candidate = digits.substr(i, len);

        if (
          candidate &&
          !used.has(candidate) &&
          !categories[len].includes(candidate)
        ) {
          categories[len].push(candidate);
        }
      }
    });
  });

  // Limit to 3 per category
  Object.keys(categories).forEach((len) => {
    categories[len] = categories[len].slice(0, 3);
  });

  return categories;
}
