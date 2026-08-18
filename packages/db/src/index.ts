import seedData from './seedData.json';
import {
  User,
  ConstructionTeamMember,
  BuilderProfile,
  DealerProfile,
  Project,
  MaterialRequirement,
  Product,
  OrderRequest,
  DeliveryJob,
  ProjectLedgerEvent,
  Milestone,
  SiteUpdate,
  UserRole
} from '@construction-os/types';

class ConstructionDatabase {
  public users: User[];
  public constructionTeamMembers: ConstructionTeamMember[];
  public builderProfiles: BuilderProfile[];
  public dealerProfiles: DealerProfile[];
  public projects: Project[];
  public materialRequirements: MaterialRequirement[];
  public products: Product[];
  public orderRequests: OrderRequest[];
  public deliveryJobs: DeliveryJob[];
  public projectLedger: ProjectLedgerEvent[];
  public milestones: Milestone[];
  public siteUpdates: SiteUpdate[];

  constructor() {
    this.users = JSON.parse(JSON.stringify(seedData.users)) as User[];
    this.constructionTeamMembers = (seedData as any).constructionTeamMembers ? JSON.parse(JSON.stringify((seedData as any).constructionTeamMembers)) : [];
    this.builderProfiles = JSON.parse(JSON.stringify(seedData.builderProfiles)) as BuilderProfile[];
    this.dealerProfiles = JSON.parse(JSON.stringify(seedData.dealerProfiles)) as DealerProfile[];
    this.projects = JSON.parse(JSON.stringify(seedData.projects)) as Project[];
    this.materialRequirements = (seedData as any).materialRequirements ? JSON.parse(JSON.stringify((seedData as any).materialRequirements)) : [];
    this.products = JSON.parse(JSON.stringify(seedData.products)) as Product[];
    this.orderRequests = JSON.parse(JSON.stringify(seedData.orderRequests)) as OrderRequest[];
    this.deliveryJobs = (seedData as any).deliveryJobs ? JSON.parse(JSON.stringify((seedData as any).deliveryJobs)) : [];
    this.projectLedger = (seedData as any).projectLedger ? JSON.parse(JSON.stringify((seedData as any).projectLedger)) : [];
    this.milestones = JSON.parse(JSON.stringify(seedData.milestones)) as Milestone[];
    this.siteUpdates = (seedData as any).siteUpdates ? JSON.parse(JSON.stringify((seedData as any).siteUpdates)) : [];
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
