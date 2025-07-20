const { v4: uuidv4 } = require('uuid');

function generateInvoiceNumber() {
  return `INV-${uuidv4()}`;  // Example: INV-2b6f8c3e-bf55-4e91-8a9b-12e81d8931a2
}

module.exports = generateInvoiceNumber;
