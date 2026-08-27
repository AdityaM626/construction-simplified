import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';

import { HomeownerDashboard } from './components/homeowner/HomeownerDashboard';
import { BudgetDashboardView } from './components/homeowner/BudgetDashboardView';
import { MilestonesView } from './components/homeowner/MilestonesView';
import { BuilderDiscoveryView } from './components/homeowner/BuilderDiscoveryView';
import { IssueManagementView } from './components/homeowner/IssueManagementView';
import { ChangeOrdersView } from './components/homeowner/ChangeOrdersView';
import { DocumentVaultView } from './components/homeowner/DocumentVaultView';
import { VerifiedReviewsView } from './components/homeowner/VerifiedReviewsView';
import { OwnerMaterialTraceabilityView } from './components/homeowner/OwnerMaterialTraceabilityView';

import { BuilderDashboard } from './components/builder/BuilderDashboard';
import { BOQEstimationView } from './components/builder/BOQEstimationView';
import { BudgetVsActualView } from './components/builder/BudgetVsActualView';
import { InternalProcurementView } from './components/builder/InternalProcurementView';
import { ConstructionTeamRosterView } from './components/builder/ConstructionTeamRosterView';
import { ContractorAnalyticsView } from './components/builder/ContractorAnalyticsView';

import { SmartTimelineView } from './components/common/SmartTimelineView';
import { QualityDefectsView } from './components/common/QualityDefectsView';
import { DigitalHandoverView } from './components/common/DigitalHandoverView';
import { HomePassportView } from './components/common/HomePassportView';

import { AdminConsole } from './components/admin/AdminConsole';
import { AnalyticsDashboardView } from './components/common/AnalyticsDashboardView';
import { ConnectedProjectView } from './components/common/ConnectedProjectView';

import { PublicLandingPage } from './components/public/PublicLandingPage';
import { WorkshopsView } from './components/public/WorkshopsView';

const MainContent: React.FC = () => {
  const { currentUser, activeTab, isMobileViewport } = useAuth();

  const renderActiveView = () => {
    if (activeTab === 'public') return <PublicLandingPage />;
    if (activeTab === 'workshops') return <WorkshopsView />;
    if (activeTab === 'connected-project') return <ConnectedProjectView />;
    if (activeTab === 'traceability') return <OwnerMaterialTraceabilityView />;
    if (activeTab === 'team-roster') return <ConstructionTeamRosterView />;
    if (activeTab === 'handover') return <DigitalHandoverView />;
    if (activeTab === 'home-passport') return <HomePassportView />;
    if (activeTab === 'analytics-view') return <ContractorAnalyticsView />;

    if (currentUser.role === 'HOMEOWNER') {
      switch (activeTab) {
        case 'dashboard': return <HomeownerDashboard />;
        case 'financials': return <BudgetDashboardView />;
        case 'progress-timeline': return <SmartTimelineView />;
        case 'change-orders': return <ChangeOrdersView />;
        case 'issues': return <QualityDefectsView />;
        case 'documents': return <DocumentVaultView />;
        case 'builders': return <BuilderDiscoveryView />;
        case 'reviews': return <VerifiedReviewsView />;
        default: return <HomeownerDashboard />;
      }
    } else if (currentUser.role === 'BUILDER') {
      switch (activeTab) {
        case 'projects': return <BuilderDashboard />;
        case 'boq-estimation': return <BOQEstimationView />;
        case 'budget-vs-actual': return <BudgetVsActualView />;
        case 'procurement': return <InternalProcurementView />;
        case 'issues': return <QualityDefectsView />;
        default: return <BuilderDashboard />;
      }
    } else if (currentUser.role === 'ADMIN') {
      switch (activeTab) {
        case 'verifications': return <AdminConsole />;
        case 'analytics': return <AnalyticsDashboardView />;
        default: return <AdminConsole />;
      }
    }
    return <HomeownerDashboard />;
  };

  return (
    <div className={`min-h-screen flex flex-col ${isMobileViewport ? 'max-w-md mx-auto my-6 rounded-3xl border-8 border-slate-900 shadow-2xl overflow-hidden bg-slate-50' : 'bg-slate-50'}`}>
      <Header />
      <div className="flex flex-1">
        {!isMobileViewport && <Sidebar />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          {renderActiveView()}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default App;
