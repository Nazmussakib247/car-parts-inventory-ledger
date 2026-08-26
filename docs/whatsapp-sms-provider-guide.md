# WhatsApp and SMS Provider Guide

The ledger does not depend on one messaging vendor. That is intentional: the shop may already have a WhatsApp Business setup, prefer an SMS gateway, or decide to keep reminders manual. The application supports the common parts of that workflow—customer consent, Bengali message templates, reminder records, delivery history, provider settings, and a copy-to-send fallback—without claiming that a message was delivered when no provider is connected.

## Choosing a provider

A deployment can connect an approved WhatsApp Business Solution Provider such as Meta WhatsApp Cloud API, Twilio WhatsApp, or 360dialog. An SMS gateway can also be used when it exposes a documented HTTPS API and supports the shop's sender identity and destination country.

The practical choice depends on sender verification, template approval, local availability, cost, delivery reporting, and the team's ability to maintain credentials and retries. The provider should be selected after confirming those details rather than coupling the sales flow to a vendor too early.

## Configuration to plan

A provider adapter normally needs the channel, provider name, API base URL, sender ID or phone number ID, approved template ID or message template, and enabled state. API keys and access tokens belong in deployment secret management. They must not be committed to Git or stored as ordinary database text.

Keep provider-specific fields behind the reminder adapter boundary. The sales and ledger procedures should only know that a reminder was requested and what outcome was recorded.

## Message data

The application can render the following values before a message is sent:

| Placeholder | Meaning |
|---|---|
| `{{customerName}}` | Customer display name |
| `{{amount}}` | Current outstanding amount |
| `{{invoiceNo}}` | Related invoice reference, when available |
| `{{dueDate}}` | Expected payment date, when available |
| `{{shopName}}` | Configured shop name |
| `{{shopPhone}}` | Configured shop contact number |

WhatsApp templates may require an approved template ID and fixed variable positions. Keep that provider-specific requirement in the adapter configuration instead of changing the customer ledger model.

## Safe delivery flow

A staff member should select the customer, review the outstanding amount and invoice references, confirm that the customer has opted in, preview the rendered message, and then send through the configured adapter or copy it manually. The system should record the channel, status, timestamp, provider response or failure reason, and the staff user who initiated the attempt.

A reminder must not be queued without explicit consent. If the provider is disabled, unavailable, rate-limited, or returns an error, use the manual copy fallback and record the failure honestly. A failed API request is not a delivered message.

## Adapter boundary

Future adapters can share a small contract such as:

```ts
type ReminderResult = {
  success: boolean;
  providerMessageId?: string;
  error?: string;
};

sendMessage(input: {
  to: string;
  message: string;
  invoiceNo?: string;
}): Promise<ReminderResult>;
```

Provider code should live outside the sales, inventory, and ledger procedures. This keeps the accounting system usable even when messaging configuration is incomplete and makes it possible to replace a provider without rewriting the POS workflow.

## Before enabling automatic delivery

Verify the business account, sender identity, approved template, customer consent, API permissions, HTTPS endpoint, rate limits, retry policy, duplicate-message protection, and failure logging. Send one test message to an authorized internal number first. Only enable the channel for staff after the stored delivery status matches the provider response.
