import seedData from './seedData.json';
import {
  User,
  ConstructionTeamMember,
  BuilderProfile,
  Project,
  Milestone,
  SiteUpdate,
  BOQ,
  BudgetVsActualRecord,
  DailySiteReport,
  VendorProcurementRecord,
  ChangeOrder,
  IssueRecord,
  DocumentRecord,
  ContextualMessage,
  ProjectLedgerEvent,
  UserRole
} from '@construction-os/types';

class ConstructionDatabase {
  public users: User[];
  public constructionTeamMembers: ConstructionTeamMember[];
  public builderProfiles: BuilderProfile[];
  public projects: Project[];
  public milestones: Milestone[];
  public siteUpdates: SiteUpdate[];
  public boqs: BOQ[];
  public budgetVsActualRecords: BudgetVsActualRecord[];
  public dailySiteReports: DailySiteReport[];
  public vendorProcurementRecords: VendorProcurementRecord[];
  public changeOrders: ChangeOrder[];
  public issues: IssueRecord[];
  public documents: DocumentRecord[];
  public contextualMessages: ContextualMessage[];
  public projectLedger: ProjectLedgerEvent[];

  constructor() {
    this.users = JSON.parse(JSON.stringify(seedData.users)) as User[];
    this.constructionTeamMembers = (seedData as any).constructionTeamMembers ? JSON.parse(JSON.stringify((seedData as any).constructionTeamMembers)) : [];
    this.builderProfiles = JSON.parse(JSON.stringify(seedData.builderProfiles)) as BuilderProfile[];
    this.projects = JSON.parse(JSON.stringify(seedData.projects)) as Project[];
    this.milestones = JSON.parse(JSON.stringify(seedData.milestones)) as Milestone[];
    this.siteUpdates = (seedData as any).siteUpdates ? JSON.parse(JSON.stringify((seedData as any).siteUpdates)) : [];
    this.boqs = (seedData as any).boqs ? JSON.parse(JSON.stringify((seedData as any).boqs)) : [];
    this.budgetVsActualRecords = (seedData as any).budgetVsActualRecords ? JSON.parse(JSON.stringify((seedData as any).budgetVsActualRecords)) : [];
    this.dailySiteReports = (seedData as any).dailySiteReports ? JSON.parse(JSON.stringify((seedData as any).dailySiteReports)) : [];
    this.vendorProcurementRecords = (seedData as any).vendorProcurementRecords ? JSON.parse(JSON.stringify((seedData as any).vendorProcurementRecords)) : [];
    this.changeOrders = (seedData as any).changeOrders ? JSON.parse(JSON.stringify((seedData as any).changeOrders)) : [];
    this.issues = (seedData as any).issues ? JSON.parse(JSON.stringify((seedData as any).issues)) : [];
    this.documents = (seedData as any).documents ? JSON.parse(JSON.stringify((seedData as any).documents)) : [];
    this.contextualMessages = (seedData as any).contextualMessages ? JSON.parse(JSON.stringify((seedData as any).contextualMessages)) : [];
    this.projectLedger = (seedData as any).projectLedger ? JSON.parse(JSON.stringify((seedData as any).projectLedger)) : [];
  }

  public logLedger(projectId: string, actorId: string, actorName: string, actorRole: any, eventType: any, title: string, description: string, entityId?: string, metadata?: any) {
    const event: ProjectLedgerEvent = {
      id: `ledg-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      projectId,
      actorId,
      actorName,
      actorRole,
      eventType,
      title,
      description,
      entityId,
      metadata,
      timestamp: new Date().toISOString()
    };
    this.projectLedger.unshift(event);
    return event;
  }
}

export const db = new ConstructionDatabase();
