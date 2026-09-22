import fs from 'fs';
import path from 'path';
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
  QualityCheckpoint,
  DefectRecord,
  DigitalHandoverRecord,
  HomePassportRecord,
  UserRole
} from '@construction-os/types';

const DB_FILE_PATH = path.join(__dirname, 'persisted_db.json');

class ConstructionDatabase {
  public users: User[] = [];
  public constructionTeamMembers: ConstructionTeamMember[] = [];
  public builderProfiles: BuilderProfile[] = [];
  public projects: Project[] = [];
  public milestones: Milestone[] = [];
  public siteUpdates: SiteUpdate[] = [];
  public boqs: BOQ[] = [];
  public budgetVsActualRecords: BudgetVsActualRecord[] = [];
  public dailySiteReports: DailySiteReport[] = [];
  public vendorProcurementRecords: VendorProcurementRecord[] = [];
  public changeOrders: ChangeOrder[] = [];
  public issues: IssueRecord[] = [];
  public documents: DocumentRecord[] = [];
  public contextualMessages: ContextualMessage[] = [];
  public projectLedger: ProjectLedgerEvent[] = [];
  public qualityCheckpoints: QualityCheckpoint[] = [];
  public defectRecords: DefectRecord[] = [];
  public digitalHandover: DigitalHandoverRecord = {} as any;
  public homePassport: HomePassportRecord = {} as any;

  constructor() {
    this.loadFromDisk();
  }

  public loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf8');
        const data = JSON.parse(fileContent);
        this.users = data.users || [];
        this.constructionTeamMembers = data.constructionTeamMembers || [];
        this.builderProfiles = data.builderProfiles || [];
        this.projects = data.projects || [];
        this.milestones = data.milestones || [];
        this.siteUpdates = data.siteUpdates || [];
        this.boqs = data.boqs || [];
        this.budgetVsActualRecords = data.budgetVsActualRecords || [];
        this.dailySiteReports = data.dailySiteReports || [];
        this.vendorProcurementRecords = data.vendorProcurementRecords || [];
        this.changeOrders = data.changeOrders || [];
        this.issues = data.issues || [];
        this.documents = data.documents || [];
        this.contextualMessages = data.contextualMessages || [];
        this.projectLedger = data.projectLedger || [];
        this.qualityCheckpoints = data.qualityCheckpoints || [];
        this.defectRecords = data.defectRecords || [];
        this.digitalHandover = data.digitalHandover || (seedData as any).digitalHandover || {};
        this.homePassport = data.homePassport || (seedData as any).homePassport || {};
        return;
      }
    } catch (err) {
      console.warn('[Construction Database] Could not load persisted_db.json, re-initializing from seed data.', err);
    }

    // Initialize from Seed Data
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
    this.qualityCheckpoints = (seedData as any).qualityCheckpoints ? JSON.parse(JSON.stringify((seedData as any).qualityCheckpoints)) : [];
    this.defectRecords = (seedData as any).defectRecords ? JSON.parse(JSON.stringify((seedData as any).defectRecords)) : [];
    this.digitalHandover = (seedData as any).digitalHandover ? JSON.parse(JSON.stringify((seedData as any).digitalHandover)) : {} as any;
    this.homePassport = (seedData as any).homePassport ? JSON.parse(JSON.stringify((seedData as any).homePassport)) : {} as any;

    this.saveToDisk();
  }

  public saveToDisk() {
    try {
      const data = {
        users: this.users,
        constructionTeamMembers: this.constructionTeamMembers,
        builderProfiles: this.builderProfiles,
        projects: this.projects,
        milestones: this.milestones,
        siteUpdates: this.siteUpdates,
        boqs: this.boqs,
        budgetVsActualRecords: this.budgetVsActualRecords,
        dailySiteReports: this.dailySiteReports,
        vendorProcurementRecords: this.vendorProcurementRecords,
        changeOrders: this.changeOrders,
        issues: this.issues,
        documents: this.documents,
        contextualMessages: this.contextualMessages,
        projectLedger: this.projectLedger,
        qualityCheckpoints: this.qualityCheckpoints,
        defectRecords: this.defectRecords,
        digitalHandover: this.digitalHandover,
        homePassport: this.homePassport
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[Construction Database] Error saving to disk:', err);
    }
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
    this.saveToDisk();
    return event;
  }
}

export const db = new ConstructionDatabase();
