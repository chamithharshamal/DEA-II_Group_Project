// ─── Lab Report Module (Member 7) ────────────────────────────
// Service: lab-report-service  |  API base: /api/lab-reports
// TODO: Create ReportList.jsx, UploadReport.jsx
import Placeholder from '../../components/Placeholder';

export default function LabReportRoutes() {
  return (
    <Placeholder
      module="Lab Reports"
      member="Member 7"
      routes={[
        'GET    /api/lab-reports           → ReportList.jsx',
        'GET    /api/lab-reports/:id       → ReportDetail.jsx',
        'POST   /api/lab-reports           → UploadReport.jsx',
        'PUT    /api/lab-reports/:id       → UploadReport.jsx (update)',
        'DELETE /api/lab-reports/:id',
      ]}
    />
  );
}
