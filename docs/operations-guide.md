# Operations Guide

This guide describes the intended day-to-day flow for a parts shop using the system. It is deliberately short on theory and focused on the points where a counter operator or owner needs a reliable decision.

## Start with the catalog

Create products with a stable SKU and barcode before selling them. Add the category, brand, part number, compatible vehicle information, purchase price, selling price, minimum stock, and rack location. The minimum stock value drives the low-stock warning shown in the sales and inventory views.

Customers and suppliers do not need to be fully prepared before a quick sale. The sales screen accepts a customer name and phone number directly, reuses a matching normalized phone number when available, or creates the customer during posting.

## Process a sale

Search by product name, SKU, barcode, category, brand, part number, or compatibility. A keyboard-wedge scanner can type into the barcode field and submit on Enter. Review stock warnings before adding an item, then confirm quantity, discount, tax mode, payment method, and paid amount. A partial payment leaves the remaining amount on the customer ledger as due.

After posting, the sale is connected to its line items, payment account, stock movements, customer ledger, and printable invoice. The invoice can use Bengali or English labels and can be printed as an A4 document or thermal receipt.

## Receive a purchase

Record the supplier, bill details, products, quantities, unit costs, and payment. Receiving increases stock and creates the supplier-side payable or payment effect. Purchase returns and corrections should be recorded through their dedicated workflow so the movement history remains understandable.

## Close the day

Open Daily closing for the business date. Review expected movement by payment channel, including collections, purchases, linked-account expenses, refunds, and adjustments. Enter the counted amount and notes, then save the closing. The resulting variance is a reconciliation signal for investigation; it is not a replacement for the underlying transaction records.

## Follow customer dues

The Customer due screen groups balances into aging buckets and shows the ledger or invoice references behind each balance. Use the customer history action to inspect the chronological record. If a reminder is appropriate, review consent and use the manual copy action. WhatsApp and SMS provider delivery is intentionally not hard-coded into the core application.

## Reports and exports

Use date presets or custom dates before reading a report. Print/PDF is intended for human-readable statements and invoices; Excel exports are intended for further analysis or sharing with an accountant. Exported values should be checked against the selected date range and report heading before distribution.

## Recommended operating discipline

Keep SKU and barcode values stable, use a reason for every stock adjustment, close each business date before changing the working date, and treat a variance as a prompt to compare the payment account, expense, refund, and ledger records. Avoid editing historical rows directly when a reversal or return workflow exists.
