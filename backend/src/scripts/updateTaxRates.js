/**
 * This script manually updates all tax rates in the database
 * It can be run from the command line with:
 * node src/scripts/updateTaxRates.js
 */

require("dotenv").config();
const { updateTaxRates } = require("../utils/taxRateUpdater");
const connectDB = require("../../config/database");

// IIFE to allow async/await
(async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Starting manual tax rate update...");
    await updateTaxRates();

    console.log("Tax rate update completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating tax rates:", error);
    process.exit(1);
  }
})();
