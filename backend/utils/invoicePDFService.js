const fs = require('fs');
const path = require('path');

class InvoicePDFService {
  constructor() {
    this.logoPath = path.join(__dirname, '../public/logos/company-logo.png');
    this.watermarkPath = path.join(__dirname, '../public/logos/watermark.png');
  }

  /**
   * Generate HTML template for invoice
   */
  generateInvoiceHTML(invoice, items) {
    const logoBase64 = this.getLogoAsBase64();
    const watermarkBase64 = this.getWatermarkAsBase64();
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice #${invoice.invoiceNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
          }
          
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            opacity: 0.1;
            z-index: -1;
            pointer-events: none;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #1e40af;
          }
          
          .logo {
            max-width: 200px;
            max-height: 80px;
          }
          
          .company-info h1 {
            color: #1e40af;
            font-size: 28px;
            margin-bottom: 5px;
          }
          
          .company-info p {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 3px;
          }
          
          .invoice-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          
          .invoice-details h2 {
            color: #1e40af;
            margin-bottom: 15px;
            font-size: 20px;
          }
          
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          
          .detail-group h3 {
            color: #374151;
            font-size: 14px;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .detail-group p {
            color: #111827;
            font-size: 16px;
            font-weight: 500;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .items-table th {
            background: #1e40af;
            color: #fff;
            padding: 15px;
            text-align: left;
            font-weight: 600;
          }
          
          .items-table td {
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .items-table tr:nth-child(even) {
            background: #f9fafb;
          }
          
          .total-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
          }
          
          .total-row.grand-total {
            font-size: 20px;
            font-weight: 700;
            color: #1e40af;
            border-top: 2px solid #e5e7eb;
            padding-top: 15px;
            margin-top: 15px;
          }
          
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e40af;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .print-button:hover {
            background: #1e3a8a;
          }
          
          @media print {
            .print-button {
              display: none;
            }
            
            .watermark {
              opacity: 0.15;
            }
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print()">🖨️ Print Invoice</button>
        
        <div class="invoice-container">
          <!-- Watermark -->
          <img src="data:image/png;base64,${watermarkBase64}" class="watermark" alt="Watermark">
          
          <!-- Header -->
          <div class="header">
            <div class="company-info">
              <h1>CHIM Sales</h1>
              <p>Premium Metal & Steel Products</p>
              <p>123 Industrial Avenue, Manufacturing District</p>
              <p>Phone: +1 (555) 123-4567 | Email: info@chimsales.com</p>
              <p>Website: www.chimsales.com</p>
            </div>
            <img src="data:image/png;base64,${logoBase64}" class="logo" alt="CHIM Sales Logo">
          </div>
          
          <!-- Invoice Details -->
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <div class="details-grid">
              <div class="detail-group">
                <h3>Invoice Number</h3>
                <p>${invoice.invoiceNumber}</p>
              </div>
              <div class="detail-group">
                <h3>Invoice Date</h3>
                <p>${new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
              <div class="detail-group">
                <h3>Due Date</h3>
                <p>${new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div class="detail-group">
                <h3>Status</h3>
                <p style="color: ${this.getStatusColor(invoice.status)}; font-weight: 600;">
                  ${invoice.status.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Customer Information -->
          <div class="invoice-details">
            <h2>CUSTOMER INFORMATION</h2>
            <div class="details-grid">
              <div class="detail-group">
                <h3>Customer Name</h3>
                <p>${invoice.customerName || 'N/A'}</p>
              </div>
              <div class="detail-group">
                <h3>Email</h3>
                <p>${invoice.customerEmail || 'N/A'}</p>
              </div>
              <div class="detail-group">
                <h3>Phone</h3>
                <p>${invoice.customerPhone || 'N/A'}</p>
              </div>
              <div class="detail-group">
                <h3>Address</h3>
                <p>${invoice.customerAddress || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.description || 'N/A'}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.toFixed(2)}</td>
                  <td>$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <!-- Totals -->
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>$${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax (${invoice.taxRate || 0}%):</span>
              <span>$${invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>$${invoice.shippingCost.toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total Amount:</span>
              <span>$${invoice.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p>Payment is due within ${this.getPaymentTerms(invoice.paymentTerms)} days</p>
            <p>For questions, please contact us at info@chimsales.com</p>
            <p>CHIM Sales - Your trusted partner in quality metal and steel products</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get logo as base64 for embedding in HTML
   */
  getLogoAsBase64() {
    try {
      if (fs.existsSync(this.logoPath)) {
        const logoBuffer = fs.readFileSync(this.logoPath);
        return logoBuffer.toString('base64');
      }
      // Return a placeholder if logo doesn't exist
      return this.getPlaceholderLogo();
    } catch (error) {
      console.error('Error reading logo:', error);
      return this.getPlaceholderLogo();
    }
  }

  /**
   * Get watermark as base64 for embedding in HTML
   */
  getWatermarkAsBase64() {
    try {
      if (fs.existsSync(this.watermarkPath)) {
        const watermarkBuffer = fs.readFileSync(this.watermarkPath);
        return watermarkBuffer.toString('base64');
      }
      // Return a placeholder if watermark doesn't exist
      return this.getPlaceholderWatermark();
    } catch (error) {
      console.error('Error reading watermark:', error);
      return this.getPlaceholderWatermark();
    }
  }

  /**
   * Generate placeholder logo (simple text-based logo)
   */
  getPlaceholderLogo() {
    // This would be a simple SVG logo as base64
    const svgLogo = `
      <svg width="200" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="80" fill="#1e40af" rx="8"/>
        <text x="100" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">CHIM</text>
        <text x="100" y="55" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">SALES</text>
      </svg>
    `;
    return Buffer.from(svgLogo).toString('base64');
  }

  /**
   * Generate placeholder watermark
   */
  getPlaceholderWatermark() {
    const svgWatermark = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <text x="200" y="100" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1e40af" text-anchor="middle" opacity="0.1">CHIM SALES</text>
      </svg>
    `;
    return Buffer.from(svgWatermark).toString('base64');
  }

  /**
   * Get status color for invoice status
   */
  getStatusColor(status) {
    const colors = {
      'paid': '#10b981',
      'pending': '#f59e0b',
      'overdue': '#ef4444',
      'cancelled': '#6b7280',
      'draft': '#3b82f6'
    };
    return colors[status.toLowerCase()] || '#6b7280';
  }

  /**
   * Get payment terms description
   */
  getPaymentTerms(terms) {
    const termMap = {
      15: '15',
      30: '30',
      45: '45',
      60: '60',
      90: '90'
    };
    return termMap[terms] || '30';
  }

  /**
   * Generate PDF from HTML (placeholder for actual PDF generation)
   */
  async generatePDF(html, options = {}) {
    // This is a placeholder - you'll need to implement actual PDF generation
    // Options: puppeteer, html-pdf-node, or other PDF libraries
    
    try {
      // For now, return the HTML as a string
      // In production, you'd use a PDF library here
      return {
        html: html,
        message: 'HTML generated successfully. PDF generation requires additional setup.',
        needsPDFLibrary: true
      };
    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }
}

module.exports = InvoicePDFService;
