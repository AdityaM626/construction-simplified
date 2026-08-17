import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';

import { HomeownerDashboard } from './components/homeowner/HomeownerDashboard';
import { BudgetDashboardView } from './components/homeowner/BudgetDashboardView';
import { BOQProcurementView } from './components/homeowner/BOQProcurementView';
import { MilestonesView } from './components/homeowner/MilestonesView';
import { MaterialMarketplaceView } from './components/homeowner/MaterialMarketplaceView';
import { BuilderDiscoveryView } from './components/homeowner/BuilderDiscoveryView';
import { IssueManagementView } from './components/homeowner/IssueManagementView';
import { ChangeOrdersView } from './components/homeowner/ChangeOrdersView';
import { PaymentsView } from './components/homeowner/PaymentsView';
import { DocumentVaultView } from './components/homeowner/DocumentVaultView';
import { VerifiedReviewsView } from './components/homeowner/VerifiedReviewsView';

import { BuilderDashboard } from './components/builder/BuilderDashboard';
import { BuilderTasksMarginView } from './components/builder/BuilderTasksMarginView';

import { DealerDashboard } from './components/dealer/DealerDashboard';
import { InventoryManagementView } from './components/dealer/InventoryManagementView';

import { DeliveryLogisticsView } from './components/transport/DeliveryLogisticsView';

import { AdminConsole } from './components/admin/AdminConsole';
import { AnalyticsDashboardView } from './components/common/AnalyticsDashboardView';
import { ConnectedProjectView } from './components/common/ConnectedProjectView';

const MainContent: React.FC = () => {
  const { currentUser, activeTab, isMobileViewport } = useAuth();

  const renderActiveView = () => {
    if (activeTab === 'connected-project') {
      return <ConnectedProjectView />;
    }

    if (currentUser.role === 'HOMEOWNER') {
      switch (activeTab) {
        case 'dashboard': return <HomeownerDashboard />;
        case 'budget': return <BudgetDashboardView />;
        case 'boq': return <BOQProcurementView />;
        case 'milestones': return <MilestonesView />;
        case 'materials': return <MaterialMarketplaceView />;
        case 'builders': return <BuilderDiscoveryView />;
        case 'issues': return <IssueManagementView />;
        case 'change-orders': return <ChangeOrdersView />;
        case 'payments': return <PaymentsView />;
        case 'documents': return <DocumentVaultView />;
        case 'reviews': return <VerifiedReviewsView />;
        case 'analytics': return <AnalyticsDashboardView />;
        default: return <HomeownerDashboard />;
      }
    } else if (currentUser.role === 'BUILDER') {
      switch (activeTab) {
        case 'projects': return <BuilderDashboard />;
        case 'tasks': return <BuilderTasksMarginView />;
        case 'updates': return <BuilderDashboard />;
        case 'issues': return <IssueManagementView />;
        default: return <BuilderDashboard />;
      }
    } else if (currentUser.role === 'DEALER') {
      switch (activeTab) {
        case 'inventory': return <InventoryManagementView />;
        case 'orders': return <DealerDashboard />;
        default: return <InventoryManagementView />;
      }
    } else if (currentUser.role === 'TRANSPORT_PARTNER') {
      return <DeliveryLogisticsView />;
    } else if (currentUser.role === 'ADMIN') {
      switch (activeTab) {
        case 'verifications': return <AdminConsole />;
        case 'analytics': return <AnalyticsDashboardView />;
        case 'audit': return <AdminConsole />;
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
