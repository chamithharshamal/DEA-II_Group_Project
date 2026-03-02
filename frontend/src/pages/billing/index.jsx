// ─── Billing Module (Member 5) ────────────────────────────────
// Service: billing-service  |  API base: /api/billing
// TODO: Create InvoiceList.jsx, BillingDetail.jsx
import Placeholder from '../../components/Placeholder';

export default function BillingRoutes() {
  return (
    <Placeholder
      module="Billing & Invoices"
      member="Member 5"
      routes={[
        'GET    /api/billing/invoices        → InvoiceList.jsx',
        'GET    /api/billing/invoices/:id    → BillingDetail.jsx',
        'POST   /api/billing/invoices        → BillingDetail.jsx (create)',
        'PUT    /api/billing/invoices/:id/pay (mark paid)',
      ]}
    />
  );
}
