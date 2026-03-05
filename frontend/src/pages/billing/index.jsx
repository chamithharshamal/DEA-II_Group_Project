import BillingDashboard from './BillingDashboard';

export default function BillingRoutes() {
  return (
    <div className="animate-fade-in">
        {/* We can embed this inside a larger layout if needed, for now just render the Dashboard directly which handles its own state and tabs */}
        <BillingDashboard />
    </div>
  );
}
