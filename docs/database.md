# Database Model

The schema is designed around a simple rule: a business event should leave enough evidence to explain what changed. Master records describe products, customers, suppliers, users, and payment accounts. Transaction records describe sales, purchases, expenses, payments, stock movements, ledger entries, returns, and daily closing.

## Relationship view

```mermaid
erDiagram
    USERS ||--o{ SALES : creates
    USERS ||--o{ PURCHASES : records
    CUSTOMERS ||--o{ SALES : buys
    SUPPLIERS ||--o{ PURCHASES : supplies
    PRODUCTS ||--o{ SALE_ITEMS : appears_in
    SALES ||--|{ SALE_ITEMS : contains
    PRODUCTS ||--o{ PURCHASE_ITEMS : appears_in
    PURCHASES ||--|{ PURCHASE_ITEMS : contains
    SALES ||--o{ PAYMENTS : receives
    PURCHASES ||--o{ PAYMENTS : receives
    ACCOUNTS ||--o{ PAYMENTS : settles_through
    PRODUCTS ||--o{ STOCK_TRANSACTIONS : changes
    CUSTOMERS ||--o{ LEDGER_ENTRIES : has_balance
    SUPPLIERS ||--o{ LEDGER_ENTRIES : has_balance
    EXPENSES }o--|| ACCOUNTS : paid_from
    DAILY_CLOSINGS ||--o{ DAILY_CLOSING_LINES : contains
    ACCOUNTS ||--o{ DAILY_CLOSING_LINES : reconciled_as

    USERS { bigint id string role }
    PRODUCTS { bigint id string sku string barcode int stockQty decimal sellingPrice }
    CUSTOMERS { bigint id string name string phone decimal openingBalance }
    SUPPLIERS { bigint id string name string phone decimal openingBalance }
    SALES { bigint id string invoiceNo bigint customerId decimal subtotal decimal taxAmount decimal due }
    SALE_ITEMS { bigint id bigint saleId bigint productId int quantity decimal unitPrice }
    PURCHASES { bigint id string billNo bigint supplierId decimal total decimal due }
    PURCHASE_ITEMS { bigint id bigint purchaseId bigint productId int quantity decimal unitCost }
    PAYMENTS { bigint id string referenceType bigint referenceId bigint accountId decimal amount }
    ACCOUNTS { bigint id string name string type decimal openingBalance }
    LEDGER_ENTRIES { bigint id string partyType bigint partyId string entryType decimal debit decimal credit }
    STOCK_TRANSACTIONS { bigint id bigint productId string type int quantity string reason }
    EXPENSES { bigint id string category decimal amount bigint accountId }
    DAILY_CLOSINGS { bigint id date closingDate decimal countedAmount decimal variance }
    DAILY_CLOSING_LINES { bigint id bigint closingId bigint accountId decimal expectedAmount decimal countedAmount }
```

## Important persistence choices

**Sales and purchases are document headers with line items.** This keeps the document total separate from the products and quantities that produced it. Product-level stock movement can therefore be reported without reconstructing the original invoice manually.

**Payments are linked to accounts.** Cash, bank, mobile money, and card collections can be reconciled by channel. Expense outflows use the same account model, which lets daily closing compare expected movement with the counted result.

**Ledgers are chronological.** Customer and supplier balances are built from dated debit and credit entries with references back to the originating sale, purchase, payment, return, or adjustment.

**Daily closing is additive.** A closing record stores the selected business date, channel-level expected movement, counted amount, notes, and variance. Saving a closing does not erase the underlying sales, expenses, refunds, or payments.

**Settings are persisted separately.** Shop identity, logo, tax mode, invoice language, receipt preferences, and provider-neutral reminder settings can change without changing historical transaction rows.

## Migration workflow

Schema changes start in `drizzle/schema.ts`. A migration is generated with Drizzle, reviewed, and applied to the configured MySQL/TiDB database. Application code should not assume that a column exists until the migration has been applied to the target environment.

```bash
pnpm drizzle-kit generate
pnpm check
pnpm test
```

Never commit connection strings, JWT secrets, OAuth credentials, or `.env` files. The database is the source of truth for business data; generated runtime files and local development logs are intentionally outside the repository.
