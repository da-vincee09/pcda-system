const SUPABASE_URL = "https://rlauwxqifqpyyiuzxdoe.supabase.co";
const SUPABASE_KEY = "sb_publishable_fQCecVQkPBTRBtWCM5zRYA_iiFt-gDK";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const state = {
  session: null,
  personnel: [],
  plans: [],
  planItems: [],
  doRecords: [],
  checkRecords: [],
  actions: [],
  companySettings: null,
  peopleProfiles: [],
  departments: [],
  personQualifications: [],
  personTrainings: [],
  personHealthCertificates: [],
  equipment: [],
  productLines: [],
  monitoringCategories: [],
  scheduleTemplates: [],
  generatedTasks: [],
  taskDoRecords: [],
  taskCheckRecords: [],
  actionCases: [],
  rolePermissions: [],
  notifications: [],
  auditLogs: [],
  fileAttachments: [],
  approvalRequests: [],
  monitoringTemplatesDb: [],
  dynamicChecklists: [],
  templateWorkflows: [],
  equipmentMaintenanceHistory: [],
  employeeDocuments: [],
  standardOperatingProcedures: [],
  sopMonitoringLinks: [],
  sopSummaryReports: [],
  assessmentTypes: [],
  assessmentTemplates: [],
  assessmentTemplateSections: [],
  assessmentTemplateQuestions: [],
  assessments: [],
  assessmentSections: [],
  assessmentFindings: [],
  assessmentCorrectiveActions: [],
  assessmentRatingScales: [],
  assessmentReports: [],
  attendanceRecords: [],
  userProfile: null,
  userProfiles: [],
  tableErrors: {},
  realtimeChannel: null,
  selectedPlanId: null,
  selectedPeopleProfileId: null,
  modalMode: null,
  editingId: null
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const workflowTemplates = [
  {
    id: "preventive-maintenance",
    category: "Operations Maintenance",
    objective: "Keep business assets inspected, serviced, and ready for scheduled operations.",
    target_standard: "Critical assets remain functional with service work completed on schedule.",
    frequency: "Scheduled weekly or monthly",
    expected_output: "Maintenance workspace with completed tasks, evidence, approvals, and follow-up actions.",
    remarks: "Reusable maintenance workflow for equipment, facilities, tools, or operational assets."
  },
  {
    id: "quality-control",
    category: "Quality Control",
    objective: "Verify products, services, or deliverables against defined quality standards.",
    target_standard: "Quality checks are completed, exceptions are reviewed, and issues are escalated.",
    frequency: "Per batch, shift, project, or service cycle",
    expected_output: "Quality workspace with checklists, results, evidence, and corrective actions.",
    remarks: "Reusable quality workflow for manufacturing, services, projects, and compliance teams."
  },
  {
    id: "receiving-inspection",
    category: "Receiving Inspection",
    objective: "Inspect incoming goods, documents, or service inputs before acceptance.",
    target_standard: "Incoming items meet acceptance criteria or are flagged for review.",
    frequency: "Every receiving activity",
    expected_output: "Receiving workspace with inspection results, exceptions, approvals, and attachments.",
    remarks: "Reusable inbound inspection workflow for inventory, materials, assets, or documents."
  },
  {
    id: "manufacturing-operations",
    category: "Production Operations",
    objective: "Coordinate recurring production, service delivery, or field operations tasks.",
    target_standard: "Operational tasks follow approved procedures with blockers escalated quickly.",
    frequency: "Daily or per shift",
    expected_output: "Operations workspace with assigned tasks, checklists, logs, and approvals.",
    remarks: "Reusable operating workflow for teams that run repeatable business processes."
  },
  {
    id: "workforce-readiness",
    category: "Workforce Readiness",
    objective: "Confirm people, roles, qualifications, and shift readiness before work starts.",
    target_standard: "Assigned team members are available, qualified, and ready for the workflow.",
    frequency: "Daily, per shift, or per project",
    expected_output: "HR workspace with readiness checks, assignments, exceptions, and approvals.",
    remarks: "Reusable workforce workflow for HR, operations, safety, and project teams."
  },
  {
    id: "cleaning-sanitation",
    category: "Facility Readiness",
    objective: "Keep facilities, work areas, tools, and shared spaces ready for operations.",
    target_standard: "Workspace readiness tasks are completed and verified on schedule.",
    frequency: "Daily, weekly, or per shift",
    expected_output: "Facility workspace with checklists, assignments, findings, and follow-up tasks.",
    remarks: "Reusable facilities workflow for offices, stores, warehouses, schools, and production sites."
  }
];

const industryTemplateLibrary = {
  food_manufacturing: workflowTemplates,
  restaurant: [
    moduleTemplate("store-operations", "Store Operations", "Coordinate opening, closing, service readiness, and shift handoffs.", "Shift workflows completed with unresolved blockers escalated.", "Daily opening, shift, and closing cycles", "Store operations workspace with tasks, approvals, and issue logs.", "Restaurant operating workflow.", ["store", "service", "shift", "operations"]),
    moduleTemplate("facility-readiness", "Facility Readiness", "Verify dining, kitchen, storage, and guest areas are ready for service.", "Readiness tasks completed and verified.", "Daily and per shift", "Facility readiness workspace with verifier notes.", "Restaurant facility workflow.", ["facility", "cleaning", "kitchen"]),
    moduleTemplate("vendor-service", "Vendor & Service Coordination", "Track service visits, vendor work, and recurring operational controls.", "Vendor activities are documented and escalated when needed.", "Weekly or as scheduled", "Vendor service log and escalation workflow.", "Restaurant external service workflow.", ["vendor", "service", "visit"]),
    moduleTemplate("customer-service-audit", "Customer Service Audit", "Check service quality, complaint handling, and front-of-house readiness.", "Service standards met for every shift.", "Per shift", "Service audit record with improvement notes.", "Front-of-house operations.", ["customer", "service", "audit"])
  ],
  retail: [
    moduleTemplate("store-cleanliness", "Store Cleanliness", "Monitor sales floor, stockroom, restroom, and facade cleanliness.", "Store areas are clean, safe, and customer-ready.", "Daily opening and closing", "Cleanliness checklist and verification.", "Retail store operations.", ["cleanliness", "store", "sales floor"]),
    moduleTemplate("inventory-checks", "Inventory Management", "Verify stock levels, variance, expiry, and shelf availability.", "Inventory variances investigated and critical stock replenished.", "Daily", "Inventory workflow log.", "Retail inventory control.", ["inventory", "stock", "shelf"]),
    moduleTemplate("cash-audit", "Cash Audit", "Review cashier balancing and cash control compliance.", "Cash variances documented and escalated.", "End of shift", "Cash audit record.", "Retail cash control.", ["cash", "audit", "cashier"]),
    moduleTemplate("maintenance-requests", "Maintenance Requests", "Track store equipment, fixture, and facility maintenance.", "Maintenance issues are logged and resolved.", "As needed", "Maintenance request and resolution log.", "Retail facility upkeep.", ["maintenance", "repair", "fixture"])
  ],
  warehouse: [
    moduleTemplate("warehouse-safety", "Warehouse Safety Checks", "Inspect aisles, racking, loading areas, and housekeeping.", "Warehouse hazards corrected or escalated.", "Daily", "Warehouse safety checklist.", "Warehouse operations safety.", ["warehouse", "safety", "aisle", "rack"]),
    moduleTemplate("vehicle-inspection", "Vehicle Inspection", "Inspect forklifts, trucks, vans, and delivery vehicles.", "Vehicles functional and safe before use.", "Before dispatch or use", "Vehicle inspection checklist.", "Fleet and logistics workflow.", ["vehicle", "forklift", "truck"]),
    moduleTemplate("delivery-compliance", "Delivery Compliance", "Track dispatch, delivery proof, route compliance, and returns.", "Deliveries completed according to schedule and documentation.", "Per delivery", "Delivery compliance record.", "Logistics delivery control.", ["delivery", "dispatch", "route"]),
    moduleTemplate("inventory-operations", "Inventory Operations", "Track cycle counts, storage condition, and discrepancies.", "Inventory records match actual stock.", "Daily or weekly", "Inventory variance record.", "Warehouse inventory control.", ["inventory", "cycle count", "stock"])
  ],
  logistics: [
    moduleTemplate("fleet-inspection", "Fleet Inspection", "Inspect fleet condition, readiness, and safety equipment.", "Fleet units are roadworthy before dispatch.", "Before dispatch", "Fleet inspection checklist.", "Logistics fleet control.", ["fleet", "vehicle", "inspection"]),
    moduleTemplate("route-compliance", "Route Compliance", "Track delivery routes, delays, and proof of delivery.", "Route deviations are documented and approved.", "Per trip", "Route compliance record.", "Logistics route workflow.", ["route", "delivery", "trip"]),
    moduleTemplate("cargo-condition", "Cargo Condition", "Track cargo seal, damage, temperature, and handover status.", "Cargo delivered with no unresolved condition issue.", "Pickup and delivery", "Cargo condition log.", "Logistics cargo control.", ["cargo", "seal", "handover"])
  ],
  construction: [
    moduleTemplate("safety-inspection", "Safety Inspection", "Inspect work areas, permits, hazards, and site controls.", "Hazards corrected before work continues.", "Daily pre-work and spot checks", "Site safety inspection record.", "Construction safety control.", ["safety", "site", "hazard"]),
    moduleTemplate("ppe-compliance", "PPE Compliance", "Verify PPE use for workers and visitors.", "Required PPE worn in controlled areas.", "Daily and random checks", "PPE compliance log.", "Construction PPE workflow.", ["ppe", "helmet", "vest"]),
    moduleTemplate("equipment-inspection", "Equipment Inspection", "Inspect tools, machinery, and lifting equipment.", "Equipment safe and fit for use.", "Before use", "Equipment inspection record.", "Construction equipment safety.", ["equipment", "tool", "machine"]),
    moduleTemplate("incident-reporting", "Incident Reporting", "Record incidents, near misses, and corrective actions.", "Incidents reported and investigated promptly.", "As needed", "Incident report and action record.", "Construction incident control.", ["incident", "near miss", "accident"])
  ],
  healthcare: [
    moduleTemplate("sterilization-workflow", "Sterilization Workflow", "Manage sterilization cycles, logs, and validation results.", "Sterilization records pass required standards.", "Per cycle", "Sterilization workflow record.", "Healthcare infection prevention.", ["sterilization", "sterile", "cycle"]),
    moduleTemplate("medication-compliance", "Medication Compliance", "Track medicine storage, expiry, administration, and reconciliation.", "Medication controls followed with variances documented.", "Daily", "Medication compliance log.", "Healthcare medication safety.", ["medication", "medicine", "expiry"]),
    moduleTemplate("infection-control", "Infection Control", "Verify hand hygiene, isolation controls, and cleaning compliance.", "Infection control procedures followed.", "Per shift", "Infection control audit.", "Healthcare infection control.", ["infection", "hygiene", "isolation"]),
    moduleTemplate("patient-safety", "Patient Safety", "Coordinate patient safety checks, incidents, and escalation.", "Patient safety checks completed and escalated when required.", "Per shift", "Patient safety workflow log.", "Healthcare patient safety.", ["patient", "safety", "incident"])
  ],
  pharmacy: [
    moduleTemplate("medicine-storage", "Medicine Storage", "Track temperature, humidity, storage, and expiry.", "Medicines stored within required conditions.", "Daily", "Medicine storage log.", "Pharmacy storage control.", ["medicine", "storage", "temperature"]),
    moduleTemplate("prescription-audit", "Prescription Audit", "Check prescription handling, documentation, and dispensing accuracy.", "Dispensing records complete and accurate.", "Daily sample audit", "Prescription audit record.", "Pharmacy compliance.", ["prescription", "dispensing", "audit"]),
    moduleTemplate("controlled-drugs", "Controlled Drug Workflow", "Manage controlled drug stock, access, and reconciliation.", "Controlled drug counts reconcile with records.", "Per shift", "Controlled drug workflow log.", "Pharmacy controlled substance control.", ["controlled", "drug", "reconciliation"])
  ],
  hospitality: [
    moduleTemplate("room-cleanliness", "Room Cleanliness Audit", "Inspect guest rooms and public areas.", "Cleanliness standards met before release.", "Daily", "Room cleanliness checklist.", "Hospitality housekeeping.", ["room", "housekeeping", "cleanliness"]),
    moduleTemplate("guest-service", "Guest Service Audit", "Monitor service quality, complaints, and response times.", "Guest concerns handled within standard time.", "Per shift", "Guest service audit.", "Hospitality service quality.", ["guest", "service", "complaint"]),
    moduleTemplate("facility-maintenance", "Facility Maintenance", "Track facility defects, preventive maintenance, and repair closure.", "Facility issues logged and resolved.", "Daily walkthrough", "Facility maintenance log.", "Hospitality facility control.", ["facility", "maintenance", "repair"])
  ],
  office_corporate: [
    moduleTemplate("office-safety", "Office Safety Check", "Inspect emergency exits, ergonomic issues, and workplace hazards.", "Office hazards corrected or escalated.", "Weekly", "Office safety checklist.", "Corporate workplace safety.", ["office", "safety", "hazard"]),
    moduleTemplate("asset-workflow", "Asset Management", "Track office equipment, IT assets, and service requests.", "Assets functional and issues logged.", "Monthly", "Asset workflow record.", "Corporate asset control.", ["asset", "equipment", "it"]),
    moduleTemplate("document-compliance", "Document Compliance Audit", "Track policy acknowledgement, records, and compliance documentation.", "Required documents current and accessible.", "Monthly", "Document compliance record.", "Corporate compliance.", ["document", "policy", "compliance"])
  ],
  agriculture: [
    moduleTemplate("crop-operations", "Crop Operations", "Track crop condition, pests, irrigation, and field observations.", "Field issues documented and acted upon.", "Daily or weekly", "Crop operations log.", "Agriculture field workflow.", ["crop", "field", "irrigation"]),
    moduleTemplate("equipment-maintenance", "Farm Equipment Maintenance", "Inspect tractors, pumps, tools, and machinery.", "Equipment functional and maintained.", "Weekly", "Farm equipment maintenance record.", "Agriculture equipment control.", ["tractor", "pump", "equipment"]),
    moduleTemplate("harvest-quality", "Harvest Quality Check", "Monitor harvest quality, handling, and storage condition.", "Harvest meets quality and handling standards.", "Per harvest", "Harvest quality record.", "Agriculture quality monitoring.", ["harvest", "quality", "storage"])
  ],
  laboratory: [
    moduleTemplate("lab-equipment-calibration", "Equipment Calibration", "Track calibration status and maintenance of lab instruments.", "Instruments calibrated and fit for use.", "Scheduled", "Calibration workflow record.", "Laboratory equipment control.", ["calibration", "instrument", "equipment"]),
    moduleTemplate("sample-handling", "Sample Handling", "Track sample receipt, storage, chain of custody, and disposal.", "Samples handled according to procedure.", "Per sample batch", "Sample handling record.", "Laboratory sample control.", ["sample", "custody", "batch"]),
    moduleTemplate("lab-safety", "Lab Safety Inspection", "Inspect PPE, chemicals, waste, and emergency controls.", "Lab safety controls maintained.", "Weekly", "Lab safety checklist.", "Laboratory safety.", ["lab", "chemical", "safety"])
  ],
  school_university: [
    moduleTemplate("campus-safety", "Campus Safety Inspection", "Inspect classrooms, walkways, facilities, and safety controls.", "Campus hazards corrected or escalated.", "Weekly", "Campus safety inspection record.", "Education safety workflow.", ["campus", "safety", "classroom"]),
    moduleTemplate("facility-cleanliness", "Facility Cleanliness", "Check classrooms, restrooms, cafeterias, and common areas.", "Facilities clean and usable.", "Daily", "Facility cleanliness checklist.", "School facility operations.", ["facility", "cleanliness", "restroom"]),
    moduleTemplate("attendance-compliance", "Attendance Compliance", "Track attendance submissions and exceptions.", "Attendance records complete and reviewed.", "Daily", "Attendance compliance record.", "School administration.", ["attendance", "student", "class"])
  ],
  manufacturing: [
    moduleTemplate("production-quality", "Production Quality Check", "Monitor process quality, defects, and output acceptance.", "Production output meets defined quality standards.", "Per batch or shift", "Production quality record.", "Manufacturing quality control.", ["production", "quality", "defect"]),
    moduleTemplate("machine-inspection", "Machine Inspection", "Inspect machine condition, safety guards, and readiness.", "Machines safe and ready before use.", "Before shift", "Machine inspection checklist.", "Manufacturing equipment control.", ["machine", "inspection", "equipment"]),
    moduleTemplate("process-compliance", "Process Compliance Audit", "Verify work instructions, process parameters, and documentation.", "Process controls followed and documented.", "Per shift", "Process compliance record.", "Manufacturing process control.", ["process", "work instruction", "compliance"])
  ],
  custom: []
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function moduleTemplate(id, category, objective, targetStandard, frequency, expectedOutput, remarks, keywords = []) {
  return {
    id,
    category,
    objective,
    target_standard: targetStandard,
    frequency,
    expected_output: expectedOutput,
    remarks,
    keywords
  };
}

const elements = {
  loginView: $("#loginView"),
  appShell: $("#appShell"),
  loginForm: $("#loginForm"),
  registerForm: $("#registerForm"),
  adminCreateUserForm: $("#adminCreateUserForm"),
  logoutBtn: $("#logoutBtn"),
  changePasswordNavBtn: $("#changePasswordNavBtn"),
  changePasswordMobileBtn: $("#changePasswordMobileBtn"),
  refreshBtn: $("#refreshBtn"),
  markAllNotificationsBtn: $("#markAllNotificationsBtn"),
  dashboardProductLineFilter: $("#dashboardProductLineFilter"),
  activeWorkspacesList: $("#activeWorkspacesList"),
  dashboardChartsGrid: $("#dashboardChartsGrid"),
  workspaceTasksDashboard: $("#workspaceTasksDashboard"),
  sopDashboardCards: $("#sopDashboardCards"),
  recentSopsDashboardTable: $("#recentSopsDashboardTable"),
  assessmentDashboardCards: $("#assessmentDashboardCards"),
  recentAssessmentsDashboardTable: $("#recentAssessmentsDashboardTable"),
  assessmentTable: $("#assessmentTable"),
  assessmentTemplatesTable: $("#assessmentTemplatesTable"),
  assessmentFindingsTable: $("#assessmentFindingsTable"),
  assessmentActionsTable: $("#assessmentActionsTable"),
  assessmentReportsTable: $("#assessmentReportsTable"),
  addAssessmentBtn: $("#addAssessmentBtn"),
  addAssessmentTemplateBtn: $("#addAssessmentTemplateBtn"),
  addAssessmentFindingBtn: $("#addAssessmentFindingBtn"),
  addAssessmentActionBtn: $("#addAssessmentActionBtn"),
  taskWorkspaceFilter: $("#taskWorkspaceFilter"),
  pageTitle: $("#pageTitle"),
  companyEyebrow: $("#companyEyebrow"),
  roleBadge: $("#roleBadge"),
  menuToggle: $("#menuToggle"),
  sidebarResizeHandle: $("#sidebarResizeHandle"),
  mobileNav: $("#mobileNav"),
  loadingOverlay: $("#loadingOverlay"),
  toast: $("#toast"),
  modalBackdrop: $("#modalBackdrop"),
  modalTitle: $("#modalTitle"),
  modalForm: $("#modalForm"),
  closeModalBtn: $("#closeModalBtn"),
  personnelTable: $("#personnelTable"),
  plansTable: $("#plansTable"),
  doTable: $("#doTable"),
  checkTable: $("#checkTable"),
  actionsTable: $("#actionsTable"),
  adminUsersTable: $("#adminUsersTable"),
  companySettingsCard: $("#companySettingsCard"),
  peopleProfilesTable: $("#peopleProfilesTable"),
  hrAccessNotice: $("#hrAccessNotice"),
  hrDashboardCards: $("#hrDashboardCards"),
  addDepartmentBtn: $("#addDepartmentBtn"),
  departmentDashboardCards: $("#departmentDashboardCards"),
  departmentsTable: $("#departmentsTable"),
  peopleSearchInput: $("#peopleSearchInput"),
  peopleDepartmentFilter: $("#peopleDepartmentFilter"),
  peopleStatusFilter: $("#peopleStatusFilter"),
  peopleSortSelect: $("#peopleSortSelect"),
  employeeProfilePanel: $("#employeeProfilePanel"),
  attendanceDateFilter: $("#attendanceDateFilter"),
  attendanceEmployeeFilter: $("#attendanceEmployeeFilter"),
  attendanceStatusFilter: $("#attendanceStatusFilter"),
  addAttendanceBtn: $("#addAttendanceBtn"),
  clearAttendanceFiltersBtn: $("#clearAttendanceFiltersBtn"),
  attendanceTable: $("#attendanceTable"),
  sopTable: $("#sopTable"),
  addSopBtn: $("#addSopBtn"),
  addWorkspaceBtn: $("#addWorkspaceBtn"),
  equipmentTable: $("#equipmentTable"),
  scheduleTemplatesTable: $("#scheduleTemplatesTable"),
  monitoringSetupList: $("#monitoringSetupList"),
  generatedTasksTable: $("#generatedTasksTable"),
  actionCasesTable: $("#actionCasesTable"),
  notificationsList: $("#notificationsList"),
  permissionMatrix: $("#permissionMatrix"),
  approvalRequestsTable: $("#approvalRequestsTable"),
  auditLogsTable: $("#auditLogsTable"),
  planDetailsPanel: $("#planDetailsPanel")
};

const iconPaths = {
  dashboard: '<rect x="3" y="3" width="7" height="8"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="15" width="7" height="6"></rect>',
  tasks: '<path d="M9 6h11"></path><path d="M9 12h11"></path><path d="M9 18h11"></path><path d="M4 6l1 1 2-2"></path><path d="M4 12l1 1 2-2"></path><path d="M4 18l1 1 2-2"></path>',
  people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.9"></path><path d="M16 3.1a4 4 0 0 1 0 7.8"></path>',
  equipment: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.9 7.9l-5.6 5.6a2.1 2.1 0 0 1-3-3l5.6-5.6a6 6 0 0 1 7.9-7.9l-3.1 3.1z"></path>',
  sop: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h5"></path><path d="M8 9h2"></path>',
  assessment: '<path d="M9 11l2 2 4-4"></path><path d="M21 12a9 9 0 1 1-3-6.7"></path><path d="M21 3v6h-6"></path>',
  settings: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1z"></path>',
  plan: '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path>',
  items: '<path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
  do: '<path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path>',
  check: '<path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="9"></circle>',
  act: '<path d="M12 2l2.4 6.9H22l-6.1 4.3 2.4 6.8L12 15.8 5.7 20l2.4-6.8L2 8.9h7.6L12 2z"></path>',
  manager: '<path d="M18 20a6 6 0 0 0-12 0"></path><circle cx="12" cy="10" r="4"></circle><path d="M19 8v5"></path><path d="M22 10.5h-6"></path>',
  approval: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M9 15l2 2 4-4"></path>',
  admin: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>',
  key: '<circle cx="7.5" cy="14.5" r="4.5"></circle><path d="M11 11l9-9"></path><path d="M15 7l2 2"></path><path d="M17 5l2 2"></path>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path>'
};

document.addEventListener("DOMContentLoaded", init);
exposeAppGlobals();

// Bootstraps Supabase auth before showing protected dashboard content.
async function init() {
  bindStaticEvents();
  renderMonitoringModules();
  const { data } = await db.auth.getSession();
  state.session = data.session;
  updateAuthView();

  db.auth.onAuthStateChange((_event, session) => {
    state.session = session;
    updateAuthView();
  });
}

function exposeAppGlobals() {
  Object.assign(window, {
    __pdcaState: state,
    workspaceDashboardDebug,
    loadAllData,
    renderMonitoringModules,
    openWorkspace,
    openSopWorkspace,
    openProductLineModal
  });
}

function bindStaticEvents() {
  renderNavigationIcons();
  setupResizableSidebar();
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.registerForm.addEventListener("submit", handleRegister);
  $("#showRegister").addEventListener("click", () => switchAuth("register"));
  $("#showLogin").addEventListener("click", () => switchAuth("login"));
  $$("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => togglePassword(button));
  });
  elements.logoutBtn.addEventListener("click", handleLogout);
  [elements.changePasswordNavBtn, elements.changePasswordMobileBtn].forEach((button) => {
    if (button) {
      button.addEventListener("click", () => {
        elements.mobileNav.classList.remove("is-open");
        openChangePasswordModal();
      });
    }
  });
  elements.refreshBtn.addEventListener("click", loadAllData);
  elements.markAllNotificationsBtn?.addEventListener("click", markAllNotificationsRead);
  elements.dashboardProductLineFilter?.addEventListener("change", renderMonitoringModules);
  elements.taskWorkspaceFilter?.addEventListener("change", renderTaskBoard);
  elements.closeModalBtn.addEventListener("click", closeModal);
  elements.modalBackdrop.addEventListener("click", (event) => {
    if (event.target === elements.modalBackdrop) closeModal();
  });
  elements.menuToggle.addEventListener("click", () => {
    const isMobile = window.matchMedia("(max-width: 820px)").matches;
    if (isMobile) {
      elements.mobileNav.classList.toggle("is-open");
      elements.menuToggle.setAttribute("aria-expanded", String(elements.mobileNav.classList.contains("is-open")));
      return;
    }

    elements.appShell.classList.toggle("sidebar-collapsed");
    elements.menuToggle.setAttribute("aria-expanded", String(!elements.appShell.classList.contains("sidebar-collapsed")));
  });

  $("#addPersonnelBtn").addEventListener("click", () => openPersonnelModal());
  $("#addPlanBtn").addEventListener("click", () => openPlanModal());
  $("#addDoBtn").addEventListener("click", () => openDoModal());
  $("#addCheckBtn").addEventListener("click", () => openCheckModal());
  $("#addActionBtn").addEventListener("click", () => openActionModal());
  $("#editCompanySettingsBtn")?.addEventListener("click", () => openCompanySettingsModal());
  $("#addPeopleProfileBtn")?.addEventListener("click", () => openPeopleProfileModal());
  elements.addDepartmentBtn?.addEventListener("click", () => openDepartmentModal());
  $("#addSopBtn")?.addEventListener("click", () => openSopModal());
  elements.addAssessmentBtn?.addEventListener("click", () => openAssessmentModal());
  elements.addAssessmentTemplateBtn?.addEventListener("click", () => openAssessmentTemplateModal());
  elements.addAssessmentFindingBtn?.addEventListener("click", () => openAssessmentFindingModal());
  elements.addAssessmentActionBtn?.addEventListener("click", () => openAssessmentCorrectiveActionModal());
  $("#addWorkspaceBtn")?.addEventListener("click", () => openProductLineModal());
  elements.peopleSearchInput?.addEventListener("input", renderPeopleProfiles);
  elements.peopleDepartmentFilter?.addEventListener("change", renderPeopleProfiles);
  elements.peopleStatusFilter?.addEventListener("change", renderPeopleProfiles);
  elements.peopleSortSelect?.addEventListener("change", renderPeopleProfiles);
  elements.attendanceDateFilter?.addEventListener("change", renderAttendance);
  elements.attendanceEmployeeFilter?.addEventListener("change", renderAttendance);
  elements.attendanceStatusFilter?.addEventListener("change", renderAttendance);
  elements.addAttendanceBtn?.addEventListener("click", () => openAttendanceModal());
  elements.clearAttendanceFiltersBtn?.addEventListener("click", () => {
    if (elements.attendanceDateFilter) elements.attendanceDateFilter.value = "";
    if (elements.attendanceEmployeeFilter) elements.attendanceEmployeeFilter.value = "";
    if (elements.attendanceStatusFilter) elements.attendanceStatusFilter.value = "";
    renderAttendance();
  });
  $("#addEquipmentBtn")?.addEventListener("click", () => openEquipmentModal());
  $("#addProductLineBtn")?.addEventListener("click", () => openProductLineModal());
  $("#addMonitoringCategoryBtn")?.addEventListener("click", () => openMonitoringCategoryModal());
  $("#addScheduleTemplateBtn")?.addEventListener("click", () => openScheduleTemplateModal());
  $("#addGeneratedTaskBtn")?.addEventListener("click", () => openGeneratedTaskModal());
  $("#addActionCaseBtn")?.addEventListener("click", () => openActionCaseModal());
  if (elements.adminCreateUserForm) {
    elements.adminCreateUserForm.addEventListener("submit", handleAdminCreateUser);
  }

  $$("[data-view]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  document.addEventListener("click", (event) => {
    const notificationButton = event.target.closest("[data-mark-notification]");
    if (notificationButton) {
      markNotificationRead(notificationButton.dataset.markNotification);
    }
  });
}

function renderNavigationIcons() {
  $$("[data-icon]").forEach((icon) => {
    const path = iconPaths[icon.dataset.icon];
    if (!path) return;
    icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${path}</svg>`;
  });
}

function setupResizableSidebar() {
  if (!elements.sidebarResizeHandle || !elements.appShell) return;

  const savedWidth = Number(localStorage.getItem("pdcaSidebarWidth"));
  if (savedWidth) setSidebarWidth(savedWidth);

  let isResizing = false;

  const startResize = (event) => {
    if (window.matchMedia("(max-width: 820px)").matches) return;
    isResizing = true;
    document.body.classList.add("is-resizing-sidebar");
    elements.sidebarResizeHandle.setPointerCapture?.(event.pointerId);
  };

  const resize = (event) => {
    if (!isResizing) return;
    setSidebarWidth(event.clientX);
  };

  const stopResize = (event) => {
    if (!isResizing) return;
    isResizing = false;
    document.body.classList.remove("is-resizing-sidebar");
    elements.sidebarResizeHandle.releasePointerCapture?.(event.pointerId);
    localStorage.setItem("pdcaSidebarWidth", String(currentSidebarWidth()));
  };

  elements.sidebarResizeHandle.addEventListener("pointerdown", startResize);
  window.addEventListener("pointermove", resize);
  window.addEventListener("pointerup", stopResize);
  window.addEventListener("resize", () => {
    if (window.matchMedia("(max-width: 820px)").matches) return;
    setSidebarWidth(currentSidebarWidth());
  });
  elements.sidebarResizeHandle.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const step = event.shiftKey ? 32 : 16;
    const current = currentSidebarWidth();
    const next = event.key === "Home"
      ? 220
      : event.key === "End"
        ? 420
        : current + (event.key === "ArrowRight" ? step : -step);
    setSidebarWidth(next);
    localStorage.setItem("pdcaSidebarWidth", String(currentSidebarWidth()));
  });
}

function setSidebarWidth(width) {
  const maxWidth = Math.min(440, Math.max(260, window.innerWidth * 0.38));
  const nextWidth = Math.min(Math.max(Number(width) || 280, 220), maxWidth);
  elements.appShell.style.setProperty("--sidebar-width", `${Math.round(nextWidth)}px`);
}

function currentSidebarWidth() {
  const value = getComputedStyle(elements.appShell).getPropertyValue("--sidebar-width");
  return Number.parseInt(value, 10) || 280;
}

async function updateAuthView() {
  if (state.session) {
    elements.loginView.classList.add("is-hidden");
    elements.appShell.classList.remove("is-hidden");
    await loadAllData();
    setupRealtime();
  } else {
    removeRealtime();
    elements.loginView.classList.remove("is-hidden");
    elements.appShell.classList.add("is-hidden");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  setLoading(true);

  const { error } = await db.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password")
  });

  setLoading(false);
  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast("Signed in successfully.", "success");
  form.reset();
}

async function handleRegister(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  setLoading(true);

  const { error } = await db.auth.signUp({
    email: formData.get("email"),
    password: formData.get("password"),
    options: {
      data: {
        full_name: String(formData.get("full_name") || "").trim(),
        role: "viewer"
      }
    }
  });

  setLoading(false);
  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast("Registration submitted. Check email confirmation if enabled.", "success");
  form.reset();
  switchAuth("login");
}

async function handleAdminCreateUser(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!isAdmin()) {
    showToast("Only administrators can create user accounts.", "error");
    return;
  }

  const formData = new FormData(form);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const role = String(formData.get("role") || "viewer");

  const authClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: `pdca-account-create-${Date.now()}`
    }
  });

  setLoading(true);
  try {
    const { data, error } = await authClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });

    if (error) throw error;

    if (data.user?.id) {
      const profilePayload = {
        id: data.user.id,
        email,
        full_name: fullName || null,
        role
      };
      const { error: profileError } = await db
        .from("user_profiles")
        .upsert(profilePayload, { onConflict: "id" });

      if (profileError) throw profileError;
    }

    showToast("User account created.", "success");
    form.reset();
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

function switchAuth(mode) {
  elements.loginForm.classList.toggle("is-hidden", mode !== "login");
  elements.registerForm.classList.toggle("is-hidden", mode !== "register");
}

function togglePassword(button) {
  const input = document.getElementById(button.dataset.togglePassword);
  if (!input) return;

  const isShowing = input.type === "text";
  input.type = isShowing ? "password" : "text";
  button.classList.toggle("hidden-password", isShowing);
  button.setAttribute("aria-label", isShowing ? "Show password" : "Hide password");
}

async function handleLogout() {
  setLoading(true);
  const { error } = await db.auth.signOut();
  setLoading(false);

  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast("Signed out.", "success");
}

async function loadAllData() {
  if (!state.session) return;
  setLoading(true);

  try {
    // Keep table requests independent so one policy issue does not blank every dropdown.
    const results = await Promise.allSettled([
      fetchTable("user_profiles", "created_at", true),
      fetchTable("personnel", "created_at", true),
      fetchTable("plans", "created_at", true),
      fetchTable("plan_items", "created_at", true),
      fetchTable("do_records", "created_at", true),
      fetchTable("check_records", "created_at", true),
      fetchTable("action_taken", "created_at", true),
      fetchTable("company_settings", "created_at", true),
      fetchTable("people_profiles", "created_at", true),
      fetchTable("departments", "department_name", false),
      fetchTable("person_qualifications", "created_at", true),
      fetchTable("person_trainings", "created_at", true),
      fetchTable("person_health_certificates", "created_at", true),
      fetchTable("equipment", "created_at", true),
      fetchTable("product_lines", "created_at", true),
      fetchTable("monitoring_categories", "created_at", true),
      fetchTable("monitoring_schedule_templates", "created_at", true),
      fetchTable("generated_tasks", "created_at", true),
      fetchTable("task_do_records", "created_at", true),
      fetchTable("task_check_records", "created_at", true),
      fetchTable("action_cases", "created_at", true),
      fetchTable("role_permissions", "created_at", false),
      fetchTable("notifications", "created_at", true),
      fetchTable("audit_logs", "created_at", true),
      fetchTable("file_attachments", "created_at", true),
      fetchTable("approval_requests", "created_at", true),
      fetchTable("monitoring_templates", "created_at", true),
      fetchTable("dynamic_checklists", "created_at", false),
      fetchTable("template_workflows", "created_at", false),
      fetchTable("equipment_maintenance_history", "created_at", true),
      fetchTable("employee_documents", "created_at", true),
      fetchTable("standard_operating_procedures", "created_at", true),
      fetchTable("sop_monitoring_links", "created_at", true),
      fetchTable("sop_summary_reports", "created_at", true),
      fetchTable("assessment_types", "type_name", false),
      fetchTable("assessment_templates", "created_at", true),
      fetchTable("assessment_template_sections", "sort_order", false),
      fetchTable("assessment_template_questions", "sort_order", false),
      fetchTable("assessments", "created_at", true),
      fetchTable("assessment_sections", "sort_order", false),
      fetchTable("assessment_findings", "created_at", true),
      fetchTable("assessment_corrective_actions", "created_at", true),
      fetchTable("assessment_rating_scales", "sort_order", false),
      fetchTable("assessment_reports", "created_at", true),
      fetchTable("attendance", "created_at", true)
    ]);

    const [
      userProfiles, personnel, plans, planItems, doRecords, checkRecords, actions,
      companySettings, peopleProfiles, departments, personQualifications, personTrainings, personHealthCertificates,
      equipment, productLines, monitoringCategories, scheduleTemplates, generatedTasks,
      taskDoRecords, taskCheckRecords, actionCases, rolePermissions, notifications, auditLogs,
      fileAttachments, approvalRequests, monitoringTemplatesDb, dynamicChecklists, templateWorkflows,
      equipmentMaintenanceHistory, employeeDocuments, standardOperatingProcedures, sopMonitoringLinks,
      sopSummaryReports, assessmentTypes, assessmentTemplates, assessmentTemplateSections, assessmentTemplateQuestions,
      assessments, assessmentSections, assessmentFindings, assessmentCorrectiveActions, assessmentRatingScales, assessmentReports,
      attendanceRecords
    ] = results.map((result) => (
      result.status === "fulfilled" ? result.value : []
    ));

    state.userProfiles = userProfiles;
    const authRole = state.session.user.user_metadata?.role || state.session.user.app_metadata?.role;
    state.userProfile = userProfiles.find((profile) => profile.id === state.session.user.id) || {
      id: state.session.user.id,
      email: state.session.user.email,
      full_name: "",
      role: authRole || "viewer"
    };
    state.personnel = personnel;
    state.plans = plans;
    state.planItems = planItems;
    state.doRecords = doRecords;
    state.checkRecords = checkRecords;
    state.actions = actions;
    state.companySettings = companySettings[0] || null;
    state.peopleProfiles = peopleProfiles;
    state.departments = departments;
    state.personQualifications = personQualifications;
    state.personTrainings = personTrainings;
    state.personHealthCertificates = personHealthCertificates;
    state.equipment = equipment;
    state.productLines = productLines.length ? productLines : await fetchWorkspacesDirect();
    state.monitoringCategories = monitoringCategories;
    state.scheduleTemplates = scheduleTemplates;
    state.generatedTasks = generatedTasks;
    state.taskDoRecords = taskDoRecords;
    state.taskCheckRecords = taskCheckRecords;
    state.actionCases = actionCases;
    state.rolePermissions = rolePermissions;
    state.notifications = notifications;
    state.auditLogs = auditLogs;
    state.fileAttachments = fileAttachments;
    state.approvalRequests = approvalRequests;
    state.monitoringTemplatesDb = monitoringTemplatesDb;
    state.dynamicChecklists = dynamicChecklists;
    state.templateWorkflows = templateWorkflows;
    state.equipmentMaintenanceHistory = equipmentMaintenanceHistory;
    state.employeeDocuments = employeeDocuments;
    state.standardOperatingProcedures = standardOperatingProcedures;
    state.sopMonitoringLinks = sopMonitoringLinks;
    state.sopSummaryReports = sopSummaryReports;
    state.assessmentTypes = assessmentTypes;
    state.assessmentTemplates = assessmentTemplates;
    state.assessmentTemplateSections = assessmentTemplateSections;
    state.assessmentTemplateQuestions = assessmentTemplateQuestions;
    state.assessments = assessments;
    state.assessmentSections = assessmentSections;
    state.assessmentFindings = assessmentFindings;
    state.assessmentCorrectiveActions = assessmentCorrectiveActions;
    state.assessmentRatingScales = assessmentRatingScales;
    state.assessmentReports = assessmentReports;
    state.attendanceRecords = attendanceRecords;

    const failedLoads = results.filter((result) => result.status === "rejected");
    state.tableErrors = failedLoads.reduce((errors, result) => {
      const tableName = result.reason.table || "unknown";
      errors[tableName] = result.reason.message || "Table could not load.";
      return errors;
    }, {});
    if (failedLoads.length) {
      console.warn("Some tables could not load:", failedLoads.map((result) => result.reason.message));
      showToast(`Some tables could not load: ${failedLoads.map((result) => result.reason.table || result.reason.message).slice(0, 3).join(", ")}`, "error");
    }

    if (state.selectedPlanId && !state.plans.some((plan) => plan.id === state.selectedPlanId)) {
      state.selectedPlanId = null;
    }

    renderAll();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function fetchTable(table, orderColumn, descending = false) {
  const { data, error } = await db
    .from(table)
    .select("*")
    .order(orderColumn, { ascending: !descending });

  if (error) {
    error.table = table;
    throw error;
  }
  return data || [];
}

async function fetchWorkspacesDirect() {
  if (typeof window.fetch !== "function") return [];

  try {
    const { data } = await db.auth.getSession();
    const token = data?.session?.access_token || SUPABASE_KEY;
    const response = await window.fetch(`${SUPABASE_URL}/rest/v1/product_lines?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      console.warn("Direct workspace fetch failed:", await response.text());
      return [];
    }

    return await response.json();
  } catch (error) {
    console.warn("Direct workspace fetch skipped:", error.message);
    return [];
  }
}

function setupRealtime() {
  if (state.realtimeChannel || !state.session) return;

  state.realtimeChannel = db
    .channel(`pdca-dashboard-${state.session.user.id}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, (payload) => {
      const recipient = payload.new?.recipient_user_id || payload.old?.recipient_user_id;
      if (recipient === state.session.user.id || isAdmin()) {
        if (payload.eventType === "INSERT") showToast(payload.new?.title || "New notification", "success");
        loadAllData();
      }
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "generated_tasks" }, () => loadAllData())
    .on("postgres_changes", { event: "*", schema: "public", table: "product_lines" }, () => loadAllData())
    .on("postgres_changes", { event: "*", schema: "public", table: "departments" }, () => loadAllData())
    .on("postgres_changes", { event: "*", schema: "public", table: "action_cases" }, () => loadAllData())
    .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, () => loadAllData())
    .on("postgres_changes", { event: "*", schema: "public", table: "standard_operating_procedures" }, () => loadAllData())
    .on("postgres_changes", { event: "*", schema: "public", table: "assessments" }, () => loadAllData())
    .on("postgres_changes", { event: "*", schema: "public", table: "assessment_findings" }, () => loadAllData())
    .on("postgres_changes", { event: "*", schema: "public", table: "assessment_corrective_actions" }, () => loadAllData())
    .subscribe();
}

function removeRealtime() {
  if (!state.realtimeChannel) return;
  db.removeChannel(state.realtimeChannel);
  state.realtimeChannel = null;
}

function renderAll() {
  applyPermissions();
  renderDashboard();
  renderTraceabilityDashboard();
  renderPersonnel();
  renderPlans();
  renderPlanDetails();
  renderDoRecords();
  renderCheckRecords();
  renderActions();
  renderAdminUsers();
  renderCompanySettings();
  renderPeopleProfiles();
  renderDepartments();
  renderAttendance();
  renderSops();
  renderSopSummaryReports();
  renderAssessmentDashboardSection();
  renderAssessments();
  renderAssessmentTemplates();
  renderAssessmentFindings();
  renderAssessmentCorrectiveActions();
  renderAssessmentReports();
  renderEquipment();
  renderMonitoringPlans();
  renderTaskBoard();
  renderActionCenter();
  renderNotifications();
  renderPermissionMatrix();
  renderApprovalRequests();
  renderAuditLogs();
}

function currentRole() {
  if (String(state.session?.user?.email || "").toLowerCase() === "admin@4kenterprise.com") {
    return "administrator";
  }

  const role = state.userProfile?.role || state.session?.user?.user_metadata?.role || state.session?.user?.app_metadata?.role || "viewer";
  return normalizeRole(role);
}

function normalizeRole(role) {
  const normalized = String(role || "viewer").trim().toLowerCase().replaceAll(" ", "_");
  if (["admin", "administrator", "system_admin", "system_administrator"].includes(normalized)) return "administrator";
  if (["hr_manager", "human_resources_manager"].includes(normalized)) return "hr_manager";
  if (["hr_staff", "human_resources_staff"].includes(normalized)) return "hr_staff";
  if (["general_manager", "general_mgr"].includes(normalized)) return "general_manager";
  if (["president", "company_president", "owner"].includes(normalized)) return normalized === "president" ? "president" : "owner";
  if (["food_safety_compliance_officer", "compliance_officer", "fsco"].includes(normalized)) return "food_safety_compliance_officer";
  if (["production_manager", "manager", "department_head"].includes(normalized)) return "production_manager";
  if (["production_supervisor", "supervisor"].includes(normalized)) return normalized === "supervisor" ? "supervisor" : "production_supervisor";
  if (["employee", "staff", "encoder", "user"].includes(normalized)) return normalized === "staff" ? "staff" : "employee";
  if (["food_handler"].includes(normalized)) return "employee";
  return "viewer";
}

function formattedRole(role = currentRole()) {
  return String(role || "viewer")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isAdmin() {
  return ["administrator", "general_manager"].includes(currentRole());
}

function canViewHRModule() {
  return permissionValue("hr", "view", ["administrator", "owner", "general_manager", "hr_manager", "hr_staff"].includes(currentRole()));
}

function permissionValue(moduleKey, actionKey, fallback) {
  const role = currentRole();
  if (role === "administrator") return true;
  if (!state.rolePermissions.length) return fallback;

  const permission = state.rolePermissions.find((item) => item.role === role && item.module_key === moduleKey)
    || state.rolePermissions.find((item) => item.role === role && item.module_key === "all");

  if (!permission) return fallback;
  const column = `can_${actionKey}`;
  return Boolean(permission[column]);
}

function canManageRecords() {
  return canManagePlans();
}

function canManagePersonnel() {
  return permissionValue("hr", "edit", ["administrator", "owner", "general_manager", "hr_manager", "hr_staff"].includes(currentRole()));
}

function canDeleteRecords() {
  return permissionValue("all", "delete", isAdmin());
}

function canManageCompanySettings() {
  return permissionValue("company", "edit", ["administrator", "general_manager"].includes(currentRole()));
}

function canManageEquipment() {
  return permissionValue("equipment", "edit", ["administrator", "general_manager", "production_manager", "food_safety_compliance_officer"].includes(currentRole()));
}

function canManagePlans() {
  return permissionValue("planning", "edit", ["administrator", "general_manager", "food_safety_compliance_officer", "production_manager"].includes(currentRole()));
}

function canDoTasks() {
  return permissionValue("do", "create", ["administrator", "general_manager", "food_safety_compliance_officer", "production_manager", "production_supervisor", "supervisor", "employee", "staff"].includes(currentRole()));
}

function canCheckTasks() {
  return permissionValue("check", "create", ["administrator", "general_manager", "production_manager", "production_supervisor", "supervisor"].includes(currentRole()));
}

function canManageActionCenter() {
  return permissionValue("act", "edit", ["administrator", "general_manager", "production_manager", "food_safety_compliance_officer"].includes(currentRole()));
}

function canApproveRecords() {
  return permissionValue("approvals", "approve", ["administrator", "general_manager", "owner", "president"].includes(currentRole()));
}

function canViewSops() {
  return Boolean(state.session);
}

function canViewAssessments() {
  return permissionValue("assessment_audit", "view", permissionValue("assessments", "view", Boolean(state.session)));
}

function canManageAssessments() {
  return permissionValue("assessment_audit", "edit", permissionValue("assessments", "edit", ["administrator", "owner", "president", "general_manager", "hr_manager", "production_manager", "production_supervisor", "supervisor", "food_safety_compliance_officer"].includes(currentRole())));
}

function canCreateAssessments() {
  return permissionValue("assessment_audit", "create", permissionValue("assessments", "create", canManageAssessments()));
}

function canApproveAssessments() {
  return permissionValue("assessment_audit", "approve", permissionValue("assessments", "approve", ["administrator", "owner", "president", "general_manager"].includes(currentRole())));
}

function canManageSops() {
  return permissionValue("sop", "edit", ["administrator", "owner", "general_manager", "production_manager", "production_supervisor", "supervisor", "hr_manager"].includes(currentRole()));
}

function applyPermissions() {
  const role = currentRole();
  if (elements.roleBadge) {
    elements.roleBadge.textContent = formattedRole(role);
    elements.roleBadge.dataset.role = role;
  }

  $$(".admin-only").forEach((item) => {
    item.hidden = !isAdmin();
  });
  $$(".approval-only").forEach((item) => {
    item.hidden = !canApproveRecords();
  });
  setControlAccess("#addPersonnelBtn", canManagePersonnel());
  setControlAccess("#addPeopleProfileBtn", canManagePersonnel());
  setControlAccess("#addDepartmentBtn", canManagePersonnel());
  setControlAccess("#addAttendanceBtn", canManagePersonnel());
  setControlAccess("#addSopBtn", canManageSops());
  setControlAccess("#addAssessmentBtn", canCreateAssessments());
  setControlAccess("#addAssessmentTemplateBtn", canManageAssessments());
  setControlAccess("#addAssessmentFindingBtn", canManageAssessments());
  setControlAccess("#addAssessmentActionBtn", canManageAssessments());
  setControlAccess("#addWorkspaceBtn", canManagePlans());
  setControlAccess("#editCompanySettingsBtn", canManageCompanySettings());
  setControlAccess("#addEquipmentBtn", canManageEquipment());
  ["#addPlanBtn", "#addProductLineBtn", "#addMonitoringCategoryBtn", "#addScheduleTemplateBtn", "#addGeneratedTaskBtn"].forEach((selector) => {
    setControlAccess(selector, canManagePlans());
  });
  setControlAccess("#addDoBtn", canDoTasks());
  setControlAccess("#addCheckBtn", canCheckTasks());
  ["#addActionBtn", "#addActionCaseBtn"].forEach((selector) => {
    setControlAccess(selector, canManageActionCenter());
  });

  const activeAdminView = $("#adminUsersView")?.classList.contains("is-active");
  if (activeAdminView && !isAdmin()) switchView("dashboardView");
  const activeApprovalView = $("#approvalRequestsView")?.classList.contains("is-active");
  if (activeApprovalView && !canApproveRecords()) switchView("dashboardView");
  const activeSopView = $("#sopView")?.classList.contains("is-active");
  if (activeSopView && !canViewSops()) switchView("dashboardView");
  const activeAssessmentView = $("#assessmentsView")?.classList.contains("is-active");
  if (activeAssessmentView && !canViewAssessments()) switchView("dashboardView");
}

function setControlAccess(selector, allowed) {
  const control = $(selector);
  if (!control) return;
  control.hidden = !allowed;
  control.disabled = !allowed;
}

function renderDashboard() {
  $("#totalPlans").textContent = state.scheduleTemplates.length || state.plans.length;

  const today = startOfDay(new Date());
  const todayInput = toDateInputValue(today);
  const openNewCases = state.actionCases.filter((item) => !["verified", "closed"].includes(item.case_status));
  const pendingApprovals = state.approvalRequests.filter((item) => (item.approval_status || item.status) === "pending").length;
  if (state.generatedTasks.length) {
    const newCompleted = state.generatedTasks.filter((task) => ["completed", "checked"].includes(task.task_status)).length;
    const newProgress = Math.round((newCompleted / state.generatedTasks.length) * 100);
    const newOverdue = state.generatedTasks
      .filter((task) => task.task_date && task.task_date < todayInput && !["completed", "checked", "cancelled"].includes(task.task_status))
      .sort((a, b) => startOfDay(a.task_date) - startOfDay(b.task_date));
    const newUpcoming = state.generatedTasks
      .filter((task) => task.task_date && task.task_date >= todayInput && !["completed", "checked", "cancelled"].includes(task.task_status))
      .sort((a, b) => startOfDay(a.task_date) - startOfDay(b.task_date));

    $("#totalPlanItems").textContent = state.generatedTasks.filter((task) => !["completed", "checked", "cancelled"].includes(task.task_status)).length;
    $("#totalDoRecords").textContent = `${newProgress}%`;
    $("#totalCheckRecords").textContent = pendingApprovals;
    $("#totalActions").textContent = openNewCases.length;
    $("#recentNonCompliances").textContent = newOverdue.length + openNewCases.length;
    $("#planningStatus").textContent = state.scheduleTemplates.length ? "Active" : "No Plans";
    $("#planningSubtext").textContent = `${state.scheduleTemplates.length} workflow${state.scheduleTemplates.length === 1 ? "" : "s"} configured.`;
    $("#planItemRing").style.setProperty("--progress", `${newProgress}%`);
    $("#planItemPercent").textContent = `${newProgress}%`;
    $("#planItemStatus").textContent = newProgress === 100 ? "Completed" : newProgress > 0 ? "In Progress" : "Not Started";
    $("#planItemSubtext").textContent = `${newCompleted} of ${state.generatedTasks.length} generated task${state.generatedTasks.length === 1 ? "" : "s"} completed.`;
    $("#checkStatus").textContent = state.taskCheckRecords.length ? "Verified" : "Waiting";
    $("#checkSubtext").textContent = `${state.taskCheckRecords.length} supervisor check${state.taskCheckRecords.length === 1 ? "" : "s"} recorded.`;
    $("#actionStatus").textContent = openNewCases.length ? "Open Cases" : "Clear";
    $("#actionSubtext").textContent = openNewCases.length ? `${openNewCases.length} action case${openNewCases.length === 1 ? "" : "s"} need manager action.` : "No open action cases.";

    const nearestTask = newUpcoming[0] || newOverdue[0];
    if (nearestTask) {
      const dayDelta = daysBetween(today, startOfDay(nearestTask.task_date));
      $("#nearestDueDays").textContent = dayDelta < 0 ? `${Math.abs(dayDelta)} Day${Math.abs(dayDelta) === 1 ? "" : "s"} Late` : dayDelta === 0 ? "Due Today" : `${dayDelta} Day${dayDelta === 1 ? "" : "s"}`;
      $("#nearestDueText").textContent = `${nearestTask.task_title} - ${formatDate(nearestTask.task_date)}`;
    }

    $("#overdueItemsTable").innerHTML = renderRows(newOverdue.slice(0, 5), (task) => `
      <tr><td><span class="status-pill danger">${Math.abs(daysBetween(today, startOfDay(task.task_date)))} Days</span></td><td><strong>${escapeHtml(task.task_title)}</strong></td><td>${formatDate(task.task_date)}</td><td>${peopleName(task.assigned_person_id)}</td></tr>
    `, 4, "No overdue tasks.");
    $("#upcomingItemsTable").innerHTML = renderRows(newUpcoming.slice(0, 5), (task) => `
      <tr><td>${daysBetween(today, startOfDay(task.task_date))} Days</td><td><strong>${escapeHtml(task.task_title)}</strong></td><td>${formatDate(task.task_date)}</td><td>${peopleName(task.assigned_person_id)}</td></tr>
    `, 4, "No upcoming tasks.");
    $("#planProgressList").innerHTML = renderNewTaskProgress();
    $("#latestActionsTable").innerHTML = renderRows(openNewCases.slice(0, 5), (item) => `
      <tr><td>${escapeHtml(item.non_compliance_note)}</td><td>${escapeHtml(item.manager_instruction || item.corrective_action || "Awaiting manager instruction")}</td></tr>
    `, 2, "No open action cases.");
    renderDashboardCharts();
    renderMonitoringModules();
    renderWorkspaceTasksDashboard();
    renderSopDashboardSection();
    renderAssessmentDashboardSection();
    return;
  }

  const planItemsWithDo = new Set(state.doRecords.map((record) => record.plan_item_id).filter(Boolean));
  const planItemsWithChecks = new Set(state.checkRecords.map((record) => record.plan_item_id).filter(Boolean));
  const planItemsWithActions = new Set(state.actions.map((action) => action.plan_item_id).filter(Boolean));
  const completedItems = state.planItems.filter((item) => planItemsWithDo.has(item.id)).length;
  const itemProgress = state.planItems.length ? Math.round((completedItems / state.planItems.length) * 100) : 0;
  const overdueItems = state.planItems
    .filter((item) => item.due_date && startOfDay(item.due_date) < today && !planItemsWithActions.has(item.id))
    .sort((a, b) => startOfDay(a.due_date) - startOfDay(b.due_date));
  const upcomingItems = state.planItems
    .filter((item) => item.due_date && startOfDay(item.due_date) >= today && !planItemsWithActions.has(item.id))
    .sort((a, b) => startOfDay(a.due_date) - startOfDay(b.due_date));

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentCount = state.actions.filter((record) => {
    const dateValue = record.date_checked || record.created_at;
    return dateValue && new Date(dateValue) >= sevenDaysAgo;
  }).length;
  $("#totalPlanItems").textContent = overdueItems.length + upcomingItems.length;
  $("#totalDoRecords").textContent = `${itemProgress}%`;
  $("#totalCheckRecords").textContent = pendingApprovals;
  $("#totalActions").textContent = state.actions.length;
  $("#recentNonCompliances").textContent = overdueItems.length + recentCount;

  $("#planningStatus").textContent = state.plans.length ? "Active" : "No Plans";
  $("#planningSubtext").textContent = state.plans.length
    ? `${state.plans.length} plan${state.plans.length === 1 ? "" : "s"} under control.`
    : "Create a plan to begin.";
  $("#planItemRing").style.setProperty("--progress", `${itemProgress}%`);
  $("#planItemPercent").textContent = `${itemProgress}%`;
  $("#planItemStatus").textContent = itemProgress === 100 ? "Completed" : itemProgress > 0 ? "In Progress" : "Not Started";
  $("#planItemSubtext").textContent = `${completedItems} of ${state.planItems.length} item${state.planItems.length === 1 ? "" : "s"} have Do records.`;
  $("#checkStatus").textContent = state.checkRecords.length ? "Verified" : "Waiting";
  $("#checkSubtext").textContent = `${state.planItems.filter((item) => planItemsWithChecks.has(item.id)).length} of ${state.planItems.length} item${state.planItems.length === 1 ? "" : "s"} have Check records.`;
  $("#actionStatus").textContent = state.actions.length ? "Documented" : "Waiting";
  $("#actionSubtext").textContent = state.actions.length
    ? `${state.actions.length} Act record${state.actions.length === 1 ? "" : "s"} logged.`
    : "No action records yet.";

  const nearestItem = upcomingItems[0] || overdueItems[0];
  if (nearestItem) {
    const dayDelta = daysBetween(today, startOfDay(nearestItem.due_date));
    $("#nearestDueDays").textContent = dayDelta < 0
      ? `${Math.abs(dayDelta)} Day${Math.abs(dayDelta) === 1 ? "" : "s"} Late`
      : dayDelta === 0
        ? "Due Today"
        : `${dayDelta} Day${dayDelta === 1 ? "" : "s"}`;
    $("#nearestDueText").textContent = `${nearestItem.category || "Plan item"} - ${formatDate(nearestItem.due_date)}`;
  } else {
    $("#nearestDueDays").textContent = "No Date";
    $("#nearestDueText").textContent = "No upcoming deadlines.";
  }

  $("#planProgressList").innerHTML = renderPlanProgress(planItemsWithActions);

  $("#overdueItemsTable").innerHTML = renderRows(
    overdueItems.slice(0, 5),
    (item) => {
      const overdueDays = Math.abs(daysBetween(today, startOfDay(item.due_date)));
      return `
        <tr>
          <td><span class="status-pill danger">${overdueDays} Day${overdueDays === 1 ? "" : "s"}</span></td>
          <td><strong>${escapeHtml(item.category || item.objective)}</strong></td>
          <td>${formatDate(item.due_date)}</td>
          <td>${personName(item.responsible_person)}</td>
        </tr>
      `;
    },
    4,
    "No overdue plan items."
  );

  $("#upcomingItemsTable").innerHTML = renderRows(
    upcomingItems.slice(0, 5),
    (item) => {
      const dueIn = daysBetween(today, startOfDay(item.due_date));
      return `
        <tr>
          <td><span class="status-pill">${dueIn === 0 ? "Today" : `${dueIn} Day${dueIn === 1 ? "" : "s"}`}</span></td>
          <td><strong>${escapeHtml(item.category || item.objective)}</strong></td>
          <td>${formatDate(item.due_date)}</td>
          <td>${personName(item.responsible_person)}</td>
        </tr>
      `;
    },
    4,
    "No upcoming deadlines."
  );

  $("#latestActionsTable").innerHTML = renderRows(
    state.actions.slice(0, 5),
    (action) => `
      <tr>
        <td>${escapeHtml(action.not_compliant_observation)}</td>
        <td>${escapeHtml(action.corrective_action)}</td>
      </tr>
    `,
    2,
    "No corrective action records yet."
  );

  renderMonitoringModules();
  renderWorkspaceTasksDashboard();
  renderSopDashboardSection();
  renderAssessmentDashboardSection();
  renderDashboardCharts();
}

function renderDashboardCharts() {
  if (!elements.dashboardChartsGrid) return;

  const pdcaCounts = dashboardPdcaDistribution();
  const taskStatusCounts = dashboardTaskStatusCounts();
  const completionTrend = dashboardCompletionTrend();
  const attendanceCounts = attendanceStatusCounts();
  const sopCounts = sopStatusCounts();

  elements.dashboardChartsGrid.innerHTML = [
    chartCard("Workspace PDCA Distribution", renderDonutChart(pdcaCounts)),
    chartCard("Workspace Task Status", renderBarChart(taskStatusCounts)),
    chartCard("Task Completion Trend", renderLineChart(completionTrend)),
    chartCard("Attendance Summary", state.tableErrors.attendance ? chartErrorState("Attendance table unavailable") : renderBarChart(attendanceCounts)),
    chartCard("SOP Status Summary", state.tableErrors.standard_operating_procedures ? chartErrorState("SOP table unavailable") : renderDonutChart(sopCounts))
  ].join("");
}

function chartCard(title, chartMarkup) {
  return `
    <section class="chart-card">
      <header>
        <strong>${escapeHtml(title)}</strong>
      </header>
      ${chartMarkup}
    </section>
  `;
}

function dashboardPdcaDistribution() {
  const counts = { Planning: 0, Do: 0, Check: 0, Act: 0, Completed: 0 };

  state.productLines.forEach((workspace) => {
    const stage = String(workspace.pdca_stage || workspace.stage || workspace.status || "planning").toLowerCase();
    if (["completed", "complete", "closed", "done"].includes(stage)) counts.Completed += 1;
    else if (stage.includes("act")) counts.Act += 1;
    else if (stage.includes("check")) counts.Check += 1;
    else if (stage.includes("do") || stage.includes("progress")) counts.Do += 1;
    else counts.Planning += 1;
  });

  if (!state.productLines.length && state.generatedTasks.length) {
    state.generatedTasks.forEach((task) => {
      const status = taskDisplayStatus(task);
      if (["completed", "checked"].includes(status)) counts.Completed += 1;
      else if (status === "not_compliant") counts.Act += 1;
      else if (status === "in_progress") counts.Do += 1;
      else if (status === "overdue") counts.Check += 1;
      else counts.Planning += 1;
    });
  }

  return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function dashboardTaskStatusCounts() {
  const counts = { Open: 0, "In Progress": 0, Completed: 0, Overdue: 0 };
  state.generatedTasks.forEach((task) => {
    const status = taskDisplayStatus(task);
    if (status === "overdue") counts.Overdue += 1;
    else if (status === "in_progress" || status === "at_risk" || status === "due_today") counts["In Progress"] += 1;
    else if (["completed", "checked"].includes(status)) counts.Completed += 1;
    else if (status !== "cancelled") counts.Open += 1;
  });
  return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function dashboardCompletionTrend() {
  const completed = state.generatedTasks
    .filter((task) => ["completed", "checked"].includes(task.task_status))
    .map((task) => task.completed_at || task.checked_at || task.updated_at || task.task_date || task.created_at)
    .filter(Boolean)
    .map((value) => dateKey(value))
    .filter(Boolean)
    .sort();

  const counts = completed.reduce((summary, dateValue) => {
    summary[dateValue] = (summary[dateValue] || 0) + 1;
    return summary;
  }, {});

  return Object.entries(counts).slice(-12).map(([label, value]) => ({ label: formatShortDate(label), value }));
}

function attendanceStatusCounts() {
  const counts = { Present: 0, Late: 0, Absent: 0, "On Leave": 0 };
  state.attendanceRecords.forEach((record) => {
    const status = String(record.status || "present").toLowerCase();
    if (status === "late") counts.Late += 1;
    else if (status === "absent") counts.Absent += 1;
    else if (status === "on_leave") counts["On Leave"] += 1;
    else counts.Present += 1;
  });
  return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function sopStatusCounts() {
  const counts = { Active: 0, "Pending Review": 0, Draft: 0, Archived: 0 };
  state.standardOperatingProcedures.forEach((sop) => {
    const status = String(sop.status || "draft").toLowerCase();
    if (status === "active") counts.Active += 1;
    else if (["pending_review", "under_review", "review"].includes(status)) counts["Pending Review"] += 1;
    else if (status === "archived") counts.Archived += 1;
    else counts.Draft += 1;
  });
  return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function renderBarChart(data) {
  const maxValue = Math.max(...data.map((item) => item.value), 0);
  if (!maxValue) return chartEmptyState();

  return `
    <div class="bar-chart" role="img" aria-label="${escapeAttribute(data.map((item) => `${item.label}: ${item.value}`).join(", "))}">
      ${data.map((item) => {
        const height = Math.max(8, Math.round((item.value / maxValue) * 100));
        return `
          <div class="bar-chart-item">
            <div class="bar-chart-track"><span style="height:${height}%"></span></div>
            <strong>${escapeHtml(item.value)}</strong>
            <small>${escapeHtml(item.label)}</small>
          </div>
        `;
      }).join("")}
    </div>
    ${chartLegend(data)}
  `;
}

function renderDonutChart(data) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (!total) return chartEmptyState();

  let cumulative = 0;
  const segments = data.map((item, index) => {
    const dash = (item.value / total) * 100;
    const markup = `<circle class="donut-segment chart-color-${index % 5}" cx="50" cy="50" r="36" pathLength="100" stroke-dasharray="${dash} ${100 - dash}" stroke-dashoffset="${-cumulative}"></circle>`;
    cumulative += dash;
    return markup;
  }).join("");

  return `
    <div class="donut-chart-wrap">
      <svg class="donut-chart" viewBox="0 0 100 100" role="img" aria-label="${escapeAttribute(data.map((item) => `${item.label}: ${item.value}`).join(", "))}">
        <circle class="donut-bg" cx="50" cy="50" r="36"></circle>
        ${segments}
        <text x="50" y="49" text-anchor="middle">${total}</text>
        <text x="50" y="61" text-anchor="middle">total</text>
      </svg>
      ${chartLegend(data)}
    </div>
  `;
}

function renderLineChart(data) {
  if (!data.length) return chartEmptyState();
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const width = 300;
  const height = 150;
  const points = data.map((item, index) => {
    const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
    const y = height - ((item.value / maxValue) * (height - 28)) - 14;
    return { ...item, x, y };
  });

  return `
    <div class="line-chart-wrap">
      <svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeAttribute(data.map((item) => `${item.label}: ${item.value}`).join(", "))}">
        <polyline points="${points.map((point) => `${point.x},${point.y}`).join(" ")}"></polyline>
        ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4"><title>${escapeHtml(point.label)}: ${escapeHtml(point.value)}</title></circle>`).join("")}
      </svg>
      <div class="line-chart-labels">
        <span>${escapeHtml(points[0]?.label || "")}</span>
        <span>${escapeHtml(points.at(-1)?.label || "")}</span>
      </div>
    </div>
  `;
}

function chartLegend(data) {
  return `
    <div class="chart-legend">
      ${data.map((item, index) => `
        <span><i class="chart-color-${index % 5}"></i>${escapeHtml(item.label)} <strong>${escapeHtml(item.value)}</strong></span>
      `).join("")}
    </div>
  `;
}

function chartEmptyState() {
  return '<div class="chart-empty">No records yet</div>';
}

function chartErrorState(message) {
  return `<div class="chart-empty chart-error">${escapeHtml(message)}</div>`;
}

function renderMonitoringModules() {
  const container = elements.activeWorkspacesList || $("#activeWorkspacesList");
  if (!container) return;
  renderDashboardProductLineFilter();
  const selectedProductLine = elements.dashboardProductLineFilter?.value || "";
  const visibleModules = activeWorkspaceTemplates(selectedProductLine)
    .map((template) => buildMonitoringModuleMetrics(template, selectedProductLine));

  container.innerHTML = visibleModules.length
    ? visibleModules.map(renderMonitoringModuleCard).join("")
    : '<div class="empty-state"><p>No active workspaces found. Create a Workspace first, then add Workspace Tasks inside it.</p></div>';
}

function renderWorkspaceTasksDashboard() {
  if (!elements.workspaceTasksDashboard) return;
  const today = toDateInputValue(new Date());
  const openTasks = state.generatedTasks.filter((task) => !["completed", "checked", "cancelled"].includes(task.task_status));
  const dueToday = openTasks.filter((task) => task.task_date === today);
  const overdue = openTasks.filter((task) => taskDisplayStatus(task) === "overdue");
  const atRisk = openTasks.filter((task) => taskDisplayStatus(task) === "at_risk");
  const recentTasks = [...state.generatedTasks]
    .sort((a, b) => new Date(b.updated_at || b.created_at || b.task_date) - new Date(a.updated_at || a.created_at || a.task_date))
    .slice(0, 5);

  elements.workspaceTasksDashboard.innerHTML = `
    <div class="summary-grid mini task-metric-grid">
      <article class="summary-card"><span>Open Tasks</span><strong>${openTasks.length}</strong></article>
      <article class="summary-card"><span>Due Today</span><strong>${dueToday.length}</strong></article>
      <article class="summary-card alert"><span>Overdue</span><strong>${overdue.length}</strong></article>
      <article class="summary-card"><span>At Risk</span><strong>${atRisk.length}</strong></article>
    </div>
    <div class="table-wrap compact-table">
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Workspace</th>
            <th>Status</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          ${renderRows(recentTasks, (task) => `
            <tr>
              <td><strong>${escapeHtml(task.task_title)}</strong></td>
              <td>${productLineName(taskWorkspaceId(task))}</td>
              <td><span class="status-pill ${statusPillClass(taskDisplayStatus(task))}">${formattedRoleLabel(taskDisplayStatus(task))}</span></td>
              <td>${formatDate(task.task_date)} ${escapeHtml(task.due_time || "")}</td>
            </tr>
          `, 4, "No workspace tasks found.")}
        </tbody>
      </table>
    </div>
  `;
}

function renderTraceabilityDashboard() {
  const table = $("#traceabilityTable");
  if (!table) return;
  const tasks = [...state.generatedTasks]
    .sort((a, b) => new Date(b.updated_at || b.created_at || b.task_date) - new Date(a.updated_at || a.created_at || a.task_date))
    .slice(0, 8);

  table.innerHTML = renderRows(tasks, (task) => {
    const plan = planForTask(task);
    const planItem = planItemForTask(task);
    const sop = sopForTask(task);
    const status = taskComplianceStatus(task);
    return `
      <tr>
        <td>${escapeHtml(plan?.plan_title || "Not linked")}</td>
        <td>${escapeHtml(planItem?.category || planItem?.objective || "Not linked")}</td>
        <td>${productLineName(taskWorkspaceId(task))}</td>
        <td><strong>${escapeHtml(task.task_title)}</strong></td>
        <td>${escapeHtml(sop ? sopDisplayName(sop) : "Not linked")}</td>
        <td><span class="status-pill ${statusPillClass(status)}">${formattedRoleLabel(status)}</span></td>
      </tr>
    `;
  }, 6, "No workspace task traceability records yet.");
}

function renderSopDashboardSection() {
  if (!elements.sopDashboardCards || !elements.recentSopsDashboardTable) return;
  const sops = canViewSops() ? state.standardOperatingProcedures : [];
  const active = sops.filter((sop) => sop.status === "active").length;
  const pendingReview = sops.filter((sop) => ["pending_review", "under_review"].includes(sop.status)).length;
  const updateThreshold = startOfDay(new Date());
  updateThreshold.setDate(updateThreshold.getDate() - 30);
  const recentlyUpdated = sops.filter((sop) => {
    const updatedAt = sop.updated_at || sop.last_updated_at || sop.created_at;
    if (!updatedAt) return false;
    const updatedDate = new Date(updatedAt);
    updatedDate.setHours(0, 0, 0, 0);
    return !Number.isNaN(updatedDate.getTime()) && updatedDate >= updateThreshold;
  }).length;
  const latest = [...sops]
    .sort((a, b) => new Date(b.updated_at || b.last_updated_at || b.created_at || 0) - new Date(a.updated_at || a.last_updated_at || a.created_at || 0))
    .slice(0, 4);

  elements.sopDashboardCards.innerHTML = [
    ["Total SOPs", sops.length],
    ["Active SOPs", active],
    ["Pending Review", pendingReview],
    ["Recently Updated", recentlyUpdated]
  ].map(([label, value]) => `<article class="summary-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("");

  elements.recentSopsDashboardTable.innerHTML = renderRows(latest, (sop) => `
    <tr>
      <td><strong>${escapeHtml(sop.title || sop.sop_title || "Untitled SOP")}</strong></td>
      <td><span class="status-pill ${["pending_review", "under_review"].includes(sop.status) ? "warning" : sop.status === "archived" ? "danger" : ""}">${formattedRoleLabel(sop.status || "draft")}</span></td>
      <td>${formatDate(sop.updated_at || sop.last_updated_at || sop.created_at)}</td>
    </tr>
  `, 3, canViewSops() ? "No SOP records found." : "You do not have access to SOP records.");
}

function workspaceDashboardDebug() {
  return {
    productLines: state.productLines.map((item) => ({
      id: item.id,
      product_name: item.product_name,
      status: item.status
    })),
    scheduleTemplates: state.scheduleTemplates.map((item) => ({
      id: item.id,
      template_title: item.template_title,
      product_line_id: item.product_line_id,
      status: item.status
    })),
    generatedTasks: state.generatedTasks.map((item) => ({
      id: item.id,
      task_title: item.task_title,
      product_line_id: item.product_line_id,
      workspace_id: item.workspace_id,
      task_status: item.task_status
    })),
    dashboardTemplates: activeWorkspaceTemplates().map((item) => ({
      id: item.id,
      category: item.category,
      product_line_id: item.product_line_id || null,
      sop_module: Boolean(item.sop_module)
    }))
  };
}

function renderDashboardProductLineFilter() {
  if (!elements.dashboardProductLineFilter) return;
  const selectedValue = elements.dashboardProductLineFilter.value;
  elements.dashboardProductLineFilter.innerHTML = `
    <option value="">All workspaces</option>
    ${state.productLines.map((line) => `
      <option value="${escapeAttribute(line.id)}" ${line.id === selectedValue ? "selected" : ""}>${escapeHtml(line.product_name)}</option>
    `).join("")}
  `;
}

function buildMonitoringModuleMetrics(template, productLineId = "") {
  if (template.sop_module) return buildSopWorkspaceMetrics(template);
  const moduleTemplates = template.schedule_id
    ? state.scheduleTemplates.filter((schedule) => schedule.id === template.schedule_id)
    : template.product_line_id
      ? state.scheduleTemplates.filter((schedule) => schedule.product_line_id === template.product_line_id)
    : state.scheduleTemplates.filter((schedule) => monitoringTemplateMatches(template, schedule));
  const templateIds = new Set(moduleTemplates.map((schedule) => schedule.id));
  const moduleTasks = state.generatedTasks.filter((task) => {
    const matchesTemplate = templateIds.has(task.template_id)
      || (template.product_line_id && taskWorkspaceId(task) === template.product_line_id)
      || (!template.schedule_id && !template.product_line_id && monitoringTextMatches(template, `${task.task_title} ${categoryNameRaw(task.category_id)}`));
    const matchesProductLine = !productLineId || taskWorkspaceId(task) === productLineId;
    return matchesTemplate && matchesProductLine;
  });
  const taskIds = new Set(moduleTasks.map((task) => task.id));
  const checks = state.taskCheckRecords.filter((record) => taskIds.has(record.task_id));
  const doRecords = state.taskDoRecords.filter((record) => taskIds.has(record.task_id));
  const cases = state.actionCases.filter((item) => taskIds.has(item.task_id));
  const completed = moduleTasks.filter((task) => ["completed", "checked"].includes(task.task_status)).length;
  const failed = checks.filter((record) => ["not_compliant", "failed", "needs_follow_up"].includes(record.check_result)).length + cases.filter((item) => !["verified", "closed"].includes(item.case_status)).length;
  const overdue = moduleTasks.filter((task) => taskDisplayStatus(task) === "overdue").length;
  const atRisk = moduleTasks.filter((task) => taskDisplayStatus(task) === "at_risk").length;
  const pending = moduleTasks.filter((task) => ["scheduled", "due_today", "in_progress", "at_risk"].includes(taskDisplayStatus(task))).length;
  const total = moduleTasks.length;
  const compliance = total ? Math.round((completed / total) * 100) : 0;
  const latestActivity = latestModuleActivity(moduleTasks, doRecords, checks, cases);
  const nextTask = moduleTasks
    .filter((task) => !["completed", "checked", "cancelled"].includes(task.task_status))
    .sort(compareTaskSchedule)[0];
  const assignedPeople = uniquePeople(moduleTasks.map((task) => task.assigned_person_id).filter(Boolean));
  const assignedDepartments = uniqueLabels(moduleTasks
    .map((task) => personDepartmentName(task.assigned_person_id))
    .filter(Boolean));
  const supervisor = latestActivity?.checked_by || moduleTemplates.find((item) => item.approved_by)?.approved_by || "";
  const productLines = uniqueLabels(moduleTasks.map((task) => productLineNameRaw(taskWorkspaceId(task))).filter(Boolean));
  const workspaceLabels = productLines.length ? productLines : template.product_line_name ? [template.product_line_name] : [];
  const status = monitoringModuleStatus({ failed, overdue, atRisk, pending, compliance, moduleTemplates });

  return {
    template,
    moduleTemplates,
    tasks: moduleTasks,
    checks,
    cases,
    completed,
    total,
    failed,
    overdue,
    pending,
    compliance,
    nextTask,
    latestActivity,
    assignedPeople,
    assignedDepartments,
    supervisor,
    productLines: workspaceLabels,
    status,
    monthly: monthlyModuleSummary(moduleTasks, checks),
    specific: moduleSpecificMetrics(template, moduleTasks, checks, cases)
  };
}

function buildSopWorkspaceMetrics(template) {
  const sops = state.standardOperatingProcedures || [];
  const active = sops.filter((sop) => sop.status === "active").length;
  const underReview = sops.filter((sop) => sop.status === "under_review").length;
  const upcomingReview = sops
    .filter((sop) => sop.review_date)
    .sort((a, b) => startOfDay(a.review_date) - startOfDay(b.review_date))[0];
  const ownerIds = uniqueLabels(sops.map((sop) => sop.owner_person_id).filter(Boolean));
  const compliance = sops.length ? Math.round((active / sops.length) * 100) : 0;
  const status = underReview
    ? { key: "due_soon", label: "Under Review" }
    : active
      ? { key: "compliant", label: "Active" }
      : { key: "info", label: "No SOPs" };
  return {
    template,
    moduleTemplates: [],
    tasks: [],
    checks: [],
    cases: [],
    completed: active,
    total: sops.length,
    failed: 0,
    overdue: 0,
    pending: underReview,
    compliance,
    nextTask: upcomingReview ? {
      task_status: "scheduled",
      due_time: "Review",
      task_date: upcomingReview.review_date
    } : null,
    latestActivity: null,
    assignedPeople: uniquePeople(ownerIds),
    supervisor: "",
    productLines: ["SOP Library"],
    status,
    monthly: { total: sops.length, passed: active, failed: 0, rate: compliance },
    specific: []
  };
}

function renderMonitoringModuleCard(module) {
  const statusClass = statusClassName(module.status.key);
  const workspaceId = module.template.product_line_id || "";
  const canEditWorkspace = workspaceId && state.productLines.some((workspace) => workspace.id === workspaceId) && canManagePlans();
  const canDeleteWorkspace = workspaceId && state.productLines.some((workspace) => workspace.id === workspaceId) && canDeleteRecords();
  const primaryKpi = module.template.sop_module
    ? `${module.completed} Active SOP${module.completed === 1 ? "" : "s"}`
    : `${module.compliance}% Workflow Completion`;
  const nextAction = module.nextTask
    ? `${escapeHtml(module.nextTask.due_time || "Any time")} Â· ${formatDate(module.nextTask.task_date)}`
    : "No upcoming task";
  const team = module.assignedDepartments?.length
    ? module.assignedDepartments.map(escapeHtml).slice(0, 2).join(", ")
    : module.assignedPeople.length
    ? module.assignedPeople.map(escapeHtml).slice(0, 2).join(", ")
    : module.productLines.slice(0, 2).map(escapeHtml).join(", ") || "Unassigned team";
  return `
    <article class="module-template-card operational-card ${statusClass}">
      <header class="module-card-header">
        <div class="module-icon" aria-hidden="true">${moduleIcon(module.template.id)}</div>
        <div>
          <strong>${escapeHtml(module.template.category)}</strong>
          <span>${escapeHtml(module.template.remarks || module.template.frequency)}</span>
        </div>
        <span class="status-pill ${statusClass}">${module.status.label}</span>
      </header>

      <div class="workspace-card-body">
        <div class="workspace-kpi">
          <span>Primary KPI</span>
          <strong>${primaryKpi}</strong>
          <div class="mini-progress"><i style="--width:${module.compliance}%"></i></div>
        </div>
        <div class="workspace-meta">
          <span>Next Action</span>
          <strong>${nextAction}</strong>
        </div>
        <div class="workspace-meta">
          <span>Assigned Department</span>
          <strong>${team}</strong>
        </div>
      </div>

      <div class="module-actions">
        <button type="button" onclick="${module.template.sop_module ? "openSopWorkspace()" : `openWorkspace('${escapeAttribute(module.template.id)}')`}">Open Workspace -&gt;</button>
        ${canEditWorkspace ? `<button type="button" onclick="openProductLineModal('${escapeAttribute(workspaceId)}')">Edit</button>` : ""}
        ${canDeleteWorkspace ? `<button class="delete-action" type="button" onclick="deleteWorkspace('${escapeAttribute(workspaceId)}')">Delete</button>` : ""}
      </div>
    </article>
  `;
}

function monitoringTemplateMatches(template, schedule) {
  return monitoringTextMatches(template, `${schedule.template_title} ${categoryNameRaw(schedule.category_id)} ${schedule.frequency}`);
}

function monitoringTextMatches(template, text) {
  const normalized = String(text || "").toLowerCase();
  const keys = template.keywords?.length ? template.keywords : ({
    "preventive-maintenance": ["preventive", "maintenance", "equipment"],
    "temperature-monitoring": ["temperature", "freezer", "chiller"],
    "raw-meat-receiving": ["receiving", "raw", "meat", "material"],
    "manufacturing-operations": ["manufacturing", "operations", "production", "gmp"],
    "personnel-hygiene": ["personnel", "hygiene", "ppe", "food handler"],
    "cleaning-sanitation": ["cleaning", "sanitation", "sanitize"]
  }[template.id] || [template.category.toLowerCase()]);
  return keys.some((key) => normalized.includes(key));
}

function monitoringModuleStatus({ failed, overdue, atRisk, pending, compliance, moduleTemplates }) {
  if (failed > 0) return { key: "failed", label: "Needs Review" };
  if (overdue > 0) return { key: "overdue", label: "At Risk" };
  if (atRisk > 0) return { key: "at_risk", label: "At Risk" };
  if (pending > 0) return { key: "due_soon", label: "In Progress" };
  if (moduleTemplates.some((item) => item.status === "inactive")) return { key: "info", label: "Inactive" };
  if (compliance >= 90) return { key: "compliant", label: "Healthy" };
  return { key: "info", label: "Active" };
}

function statusClassName(statusKey) {
  if (["compliant", "passed", "closed"].includes(statusKey)) return "success";
  if (["due_soon", "at_risk"].includes(statusKey)) return "warning";
  if (["overdue", "failed"].includes(statusKey)) return "danger";
  return "info";
}

function moduleIcon(templateId) {
  const icons = {
    "sop-library": "SOP",
    "preventive-maintenance": "ðŸ”§",
    "temperature-monitoring": "Â°C",
    "raw-meat-receiving": "RCV",
    "manufacturing-operations": "OPS",
    "personnel-hygiene": "PPE",
    "cleaning-sanitation": "SAN"
  };
  return icons[templateId] || "MOD";
}

function compareTaskSchedule(a, b) {
  return new Date(`${a.task_date || "9999-12-31"}T${a.due_time || "23:59"}`) - new Date(`${b.task_date || "9999-12-31"}T${b.due_time || "23:59"}`);
}

function countdownToTask(task) {
  if (!task?.task_date) return "not scheduled";
  const due = new Date(`${task.task_date}T${task.due_time || "23:59"}`);
  if (Number.isNaN(due.getTime())) return "not scheduled";
  const diff = due - new Date();
  const abs = Math.abs(diff);
  const hours = Math.floor(abs / (1000 * 60 * 60));
  const minutes = Math.floor((abs / (1000 * 60)) % 60);
  const text = hours ? `${hours}h ${minutes}m` : `${minutes}m`;
  return diff < 0 ? `${text} late` : `in ${text}`;
}

function latestModuleActivity(tasks, doRecords, checks, cases) {
  const activities = [
    ...doRecords.map((record) => ({
      at: record.performed_at || record.created_at,
      checked_by: "",
      text: `${peopleNameRaw(record.performed_by)} recorded work: ${record.work_done || record.output_result || "Monitoring entry saved."}`
    })),
    ...checks.map((record) => ({
      at: record.checked_at || record.created_at,
      checked_by: record.checked_by,
      text: `${peopleNameRaw(record.checked_by)} checked result: ${formattedRoleLabel(record.check_result)}`
    })),
    ...cases.map((record) => ({
      at: record.created_at,
      checked_by: record.opened_by,
      text: `Corrective action ${formattedRoleLabel(record.case_status)}: ${record.case_title || record.non_compliance_note}`
    })),
    ...tasks.map((task) => ({
      at: task.created_at,
      checked_by: "",
      text: `Task scheduled: ${task.task_title} for ${formatDate(task.task_date)}`
    }))
  ].filter((item) => item.at);
  return activities.sort((a, b) => new Date(b.at) - new Date(a.at))[0] || null;
}

function monthlyModuleSummary(tasks, checks) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTasks = tasks.filter((task) => task.task_date && startOfDay(task.task_date) >= monthStart);
  const monthChecks = checks.filter((record) => new Date(record.created_at) >= monthStart);
  const failed = monthChecks.filter((record) => ["not_compliant", "failed", "needs_follow_up"].includes(record.check_result)).length;
  const passed = monthChecks.filter((record) => record.check_result === "passed").length;
  const total = Math.max(monthTasks.length, monthChecks.length);
  const rate = total ? Math.round((passed / total) * 100) : 0;
  return { total, passed, failed, rate };
}

function moduleSpecificMetrics(template, tasks, checks, cases) {
  const failed = checks.filter((record) => ["not_compliant", "failed", "needs_follow_up"].includes(record.check_result)).length;
  if (template.id === "temperature-monitoring") {
    const latestTemp = latestTemperatureReading(tasks, checks);
    return [
      { label: "Latest Temp", value: latestTemp || "No reading" },
      { label: "Allowed Range", value: "-18Â°C to -21Â°C" },
      { label: "Failed Readings", value: String(failed) }
    ];
  }
  if (template.id === "preventive-maintenance") {
    const functional = state.equipment.filter((item) => item.status === "functional").length;
    const repair = state.equipment.filter((item) => ["needs_repair", "non_functional"].includes(item.status)).length;
    return [
      { label: "Equipment Functional", value: `${functional}/${state.equipment.length || 0}` },
      { label: "Pending Repair", value: String(repair) },
      { label: "Open Cases", value: String(cases.filter((item) => !["verified", "closed"].includes(item.case_status)).length) }
    ];
  }
  if (template.id === "personnel-hygiene") {
    const passed = checks.filter((record) => record.check_result === "passed").length;
    const total = checks.length || tasks.length;
    return [
      { label: "PPE Compliance", value: total ? `${Math.round((passed / total) * 100)}%` : "0%" },
      { label: "Violations", value: String(failed) },
      { label: "Failed Inspections", value: String(failed) }
    ];
  }
  if (template.id === "cleaning-sanitation") {
    const completed = tasks.filter((task) => ["completed", "checked"].includes(task.task_status)).length;
    const missed = tasks.filter((task) => taskDisplayStatus(task) === "overdue").length;
    return [
      { label: "Areas Cleaned", value: String(completed) },
      { label: "Missed Schedules", value: String(missed) },
      { label: "Verification", value: checks.length ? "Recorded" : "Pending" }
    ];
  }
  if (template.id === "raw-meat-receiving") {
    return [
      { label: "Receiving Checks", value: String(tasks.length) },
      { label: "Failed Lots", value: String(failed) },
      { label: "Workspaces", value: uniqueLabels(tasks.map((task) => productLineNameRaw(taskWorkspaceId(task))).filter(Boolean)).join(", ") || "Not set" }
    ];
  }
  return [
    { label: "Operations Checks", value: String(tasks.length) },
    { label: "Failed Checks", value: String(failed) },
    { label: "Workspaces", value: uniqueLabels(tasks.map((task) => productLineNameRaw(taskWorkspaceId(task))).filter(Boolean)).join(", ") || "Not set" }
  ];
}

function latestTemperatureReading(tasks, checks) {
  const text = [...checks, ...tasks]
    .sort((a, b) => new Date(b.created_at || b.task_date) - new Date(a.created_at || a.task_date))
    .map((item) => `${item.observation || ""} ${item.remarks || ""} ${item.output_result || ""} ${item.task_title || ""}`)
    .join(" ");
  const match = text.match(/-?\d+(?:\.\d+)?\s?Â°?\s?c/i);
  return match ? match[0].replace(/\s+/g, "").toUpperCase().replace("C", "Â°C") : "";
}

function uniquePeople(ids) {
  return uniqueLabels(ids.map((id) => peopleNameRaw(id)).filter(Boolean));
}

function uniqueLabels(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function renderPlanProgress(planItemsWithActions) {
  if (!state.plans.length) {
    return '<div class="empty-state"><p>No plans created yet.</p></div>';
  }

  return state.plans.slice(0, 5).map((plan) => {
    const items = state.planItems.filter((item) => item.plan_id === plan.id);
    const completed = items.filter((item) => planItemsWithActions.has(item.id)).length;
    const percent = items.length ? Math.round((completed / items.length) * 100) : 0;

    return `
      <div class="progress-item">
        <div class="progress-head">
          <strong>${escapeHtml(plan.plan_title)}</strong>
          <span>${percent}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="--width: ${percent}%"></div>
        </div>
        <div class="progress-meta">
          ${completed} of ${items.length} item${items.length === 1 ? "" : "s"} documented | ${formatPeriod(plan.period_month, plan.period_year)}
        </div>
      </div>
    `;
  }).join("");
}

function renderNewTaskProgress() {
  if (!state.peopleProfiles.length) {
    return '<div class="empty-state"><p>No people profiles available for workload segmentation.</p></div>';
  }

  return state.peopleProfiles.map((person) => {
    const tasks = state.generatedTasks.filter((task) => task.assigned_person_id === person.id);
    const done = tasks.filter((task) => ["completed", "checked"].includes(task.task_status)).length;
    const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    return `
      <div class="progress-item">
        <div class="progress-head">
          <strong>${escapeHtml(person.complete_name)}</strong>
          <span>${percent}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="--width: ${percent}%"></div>
        </div>
        <div class="progress-meta">
          ${done} of ${tasks.length} assigned task${tasks.length === 1 ? "" : "s"} completed
        </div>
      </div>
    `;
  }).join("");
}

function renderPersonnel() {
  elements.personnelTable.innerHTML = renderRows(
    state.personnel,
    (person) => {
      const actions = canManagePersonnel()
        ? `<div class="table-actions">
            <button type="button" onclick="openPersonnelModal('${person.id}')">Edit</button>
            <button class="delete-action" type="button" onclick="deleteRecord('personnel', '${person.id}')">Delete</button>
          </div>`
        : `<span class="muted-action">View only</span>`;
      return `
        <tr>
          <td><strong>${escapeHtml(person.full_name)}</strong></td>
          <td>${escapeHtml(person.position)}</td>
          <td>${escapeHtml(person.role)}</td>
          <td class="actions-cell">${actions}</td>
        </tr>
      `;
    },
    4,
    "No personnel records found."
  );
}

function renderPlans() {
  renderPlanPersonnelNotice();

  elements.plansTable.innerHTML = renderRows(
    state.plans,
    (plan) => {
      const editButton = canManagePlans() ? `<button type="button" onclick="openPlanModal('${plan.id}')">Edit</button>` : "";
      const deleteButton = canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteRecord('plans', '${plan.id}')">Delete</button>` : "";
      return `
        <tr class="${plan.id === state.selectedPlanId ? "selected-row" : ""}">
          <td><strong>${escapeHtml(plan.plan_title)}</strong></td>
          <td>${formatPeriod(plan.period_month, plan.period_year)}</td>
          <td>${personName(plan.created_by)}</td>
          <td>${personName(plan.approved_by)}</td>
          <td class="actions-cell">
            <div class="table-actions">
              <button type="button" onclick="selectPlan('${plan.id}')">View</button>
              ${editButton}
              ${deleteButton}
            </div>
          </td>
        </tr>
      `;
    },
    5,
    "No plans created yet."
  );
}

function renderPlanPersonnelNotice() {
  const notice = $("#planPersonnelNotice");
  if (!notice) return;

  if (state.personnel.length) {
    notice.innerHTML = `
      <div class="form-note success">
        Created By and Approved By will use ${state.personnel.length} personnel option${state.personnel.length === 1 ? "" : "s"}.
      </div>
    `;
    return;
  }

  notice.innerHTML = `
    <div class="form-note warning">
      <strong>No personnel options yet.</strong>
      Add personnel first so the Create Plan form can show Created By and Approved By choices.
      ${canManagePersonnel() ? '<button class="ghost-btn" type="button" onclick="quickAddPersonnel()">Add Personnel</button>' : ''}
    </div>
  `;
}

function renderPlanDetails() {
  const plan = state.plans.find((item) => item.id === state.selectedPlanId);
  if (!plan) {
    elements.planDetailsPanel.innerHTML = `
      <div class="empty-state">
        <h4>Select a plan</h4>
        <p>Choose a plan to see its plan items. Plan items are the actionable tasks that connect Planning to Do, Check, and Act records.</p>
      </div>
    `;
    return;
  }

  const items = state.planItems.filter((item) => item.plan_id === plan.id);
  const planSop = sopForPlan(plan.id);
  elements.planDetailsPanel.innerHTML = `
    <div class="detail-title">
      <div>
        <p class="eyebrow">Plan Details</p>
        <h4>${escapeHtml(plan.plan_title)}</h4>
        <p class="detail-helper">This plan is the container for the period. Add plan items for each actual monitoring activity, inspection, or work instruction.</p>
      </div>
      ${canManagePlans() ? '<button class="primary-btn" type="button" onclick="openPlanItemModal()">Add Plan Item</button>' : '<span class="muted-action">View only</span>'}
    </div>
    <ul class="meta-list">
      <li><span>Period</span><strong>${formatPeriod(plan.period_month, plan.period_year)}</strong></li>
      <li><span>Start</span><strong>${formatDate(plan.start_date)}</strong></li>
      <li><span>End</span><strong>${formatDate(plan.end_date)}</strong></li>
      <li><span>Related SOP</span><strong>${planSop ? escapeHtml(sopDisplayName(planSop)) : "Not linked"}</strong></li>
      <li><span>Created By</span><strong>${personName(plan.created_by)}</strong></li>
      <li><span>Approved By</span><strong>${personName(plan.approved_by)}</strong></li>
    </ul>
    <div>
      ${items.length ? items.map(renderPlanItemCard).join("") : '<div class="empty-state"><h4>No plan items yet</h4><p>Add plan items to define the actual activities that employees will perform and supervisors will verify.</p></div>'}
    </div>
  `;
}

function renderPlanItemCard(item) {
  const itemSop = sopForPlanItem(item.id) || sopForPlan(item.plan_id);
  const actions = canManagePlans()
    ? `<div class="table-actions">
        <button type="button" onclick="openPlanItemModal('${item.id}')">Edit</button>
        ${canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteRecord('plan_items', '${item.id}')">Delete</button>` : ""}
      </div>`
    : `<span class="muted-action">View only</span>`;
  return `
    <article class="item-card">
      <div class="detail-title">
        <div>
          <span class="item-card-label">Plan Item</span>
          <strong>${escapeHtml(item.category)}</strong>
        </div>
        ${actions}
      </div>
      <p><strong>Activity Objective:</strong> ${escapeHtml(item.objective)}</p>
      <p><strong>Target Standard:</strong> ${escapeHtml(item.target_standard)}</p>
      <p><strong>Related SOP:</strong> ${itemSop ? escapeHtml(sopDisplayName(itemSop)) : "Not linked"}</p>
      <p><strong>Responsible:</strong> ${personName(item.responsible_person)} | <strong>Frequency:</strong> ${escapeHtml(item.frequency)}</p>
      <p><strong>Expected Output:</strong> ${escapeHtml(item.expected_output)}</p>
      <p><strong>Due:</strong> ${formatDate(item.due_date)} | <strong>Remarks:</strong> ${escapeHtml(item.remarks)}</p>
      <p><strong>Workspace Tasks:</strong> ${state.generatedTasks.filter((task) => task.plan_item_id === item.id).length} linked executable task${state.generatedTasks.filter((task) => task.plan_item_id === item.id).length === 1 ? "" : "s"}</p>
    </article>
  `;
}

function renderDoRecords() {
  elements.doTable.innerHTML = renderRows(
    state.doRecords,
    (record) => {
      const editButton = canDoTasks() ? `<button type="button" onclick="openDoModal('${record.id}')">Edit</button>` : "";
      const deleteButton = canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteRecord('do_records', '${record.id}')">Delete</button>` : "";
      return `
        <tr>
          <td><strong>${escapeHtml(planItemName(record.plan_item_id))}</strong></td>
          <td>${personName(record.performed_by)}</td>
          <td>${formatDate(record.date_performed)}</td>
          <td>${escapeHtml(record.activity_done)}</td>
          <td>${escapeHtml(record.output_result)}</td>
          <td>${escapeHtml(record.remarks)}</td>
          <td class="actions-cell">
            ${editButton || deleteButton ? `<div class="table-actions">${editButton}${deleteButton}</div>` : '<span class="muted-action">View only</span>'}
          </td>
        </tr>
      `;
    },
    7,
    "No Do records found."
  );
}

function renderCheckRecords() {
  elements.checkTable.innerHTML = renderRows(
    state.checkRecords,
    (record) => {
      const editButton = canCheckTasks() ? `<button type="button" onclick="openCheckModal('${record.id}')">Edit</button>` : "";
      const deleteButton = canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteRecord('check_records', '${record.id}')">Delete</button>` : "";
      return `
        <tr>
          <td><strong>${escapeHtml(planItemName(record.plan_item_id))}</strong></td>
          <td>${personName(record.checked_by)}</td>
          <td>${formatDate(record.date_checked)}</td>
          <td><span class="status-pill ${record.check_result === "Not Compliant" ? "danger" : ""}">${escapeHtml(record.check_result)}</span></td>
          <td>${escapeHtml(record.observation)}</td>
          <td>${escapeHtml(record.evidence)}</td>
          <td>${escapeHtml(record.remarks)}</td>
          <td class="actions-cell">
            ${editButton || deleteButton ? `<div class="table-actions">${editButton}${deleteButton}</div>` : '<span class="muted-action">View only</span>'}
          </td>
        </tr>
      `;
    },
    8,
    "No Check records found."
  );
}

function renderActions() {
  elements.actionsTable.innerHTML = renderRows(
    state.actions,
    (action) => `
      <tr>
        <td>${escapeHtml(action.not_compliant_observation)}</td>
        <td>${escapeHtml(action.corrective_action)}</td>
        <td>${escapeHtml(action.remarks)}</td>
        <td>${escapeHtml(action.preventive_action)}</td>
      </tr>
    `,
    4,
    "No action taken records found."
  );
}

function renderAdminUsers() {
  if (!elements.adminUsersTable) return;

  elements.adminUsersTable.innerHTML = renderRows(
    state.userProfiles,
    (profile) => {
      const isCurrentUser = profile.id === state.session.user.id;
      const rowActions = isCurrentUser
        ? `<span class="muted-action">Current account</span>`
        : `<div class="table-actions">
            <button type="button" onclick="openUserProfileModal('${profile.id}')">Edit</button>
          </div>`;

      return `
        <tr>
          <td><strong>${escapeHtml(profile.email || "No email")}</strong></td>
          <td>${escapeHtml(profile.full_name || "Not set")}</td>
          <td>
            <select class="admin-role-select" onchange="updateUserRole('${profile.id}', this.value)" ${isCurrentUser ? "disabled" : ""}>
              ${roleOptions(profile.role)}
            </select>
          </td>
          <td>${formatDate(profile.created_at)}</td>
          <td class="actions-cell">${rowActions}</td>
        </tr>
      `;
    },
    5,
    "No user profiles found."
  );
}

function renderNotifications() {
  if (!elements.notificationsList) return;
  const visibleNotifications = state.notifications.filter(canSeeNotification);

  elements.notificationsList.innerHTML = visibleNotifications.length
    ? visibleNotifications.map((item) => `
      <article class="notification-item ${item.is_read ? "" : "is-unread"}">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.message)}</p>
          <span>${formattedRoleLabel(item.notification_type)} | ${formatDateTime(item.created_at)}</span>
        </div>
        ${item.is_read ? '<span class="status-pill">Read</span>' : `<button type="button" data-mark-notification="${escapeAttribute(item.id)}">Mark Read</button>`}
      </article>
    `).join("")
    : '<div class="empty-state"><p>No notifications yet.</p></div>';

  elements.notificationsList.querySelectorAll("[data-mark-notification]").forEach((button) => {
    button.addEventListener("click", () => markNotificationRead(button.dataset.markNotification));
  });
}

function renderPermissionMatrix() {
  if (!elements.permissionMatrix || !isAdmin()) return;
  const modules = permissionModules();
  const roles = systemRoleOptions().map((option) => option.value);
  const actions = ["view", "create", "edit", "delete", "approve", "export"];

  elements.permissionMatrix.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Module</th>
            ${actions.map((action) => `<th>${formattedRoleLabel(action)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${roles.flatMap((role) => modules.map((module) => {
            const permission = permissionFor(role, module.key);
            return `
              <tr>
                <td><strong>${formattedRole(role)}</strong></td>
                <td>${module.label}</td>
                ${actions.map((action) => `
                  <td>
                    <input
                      type="checkbox"
                      aria-label="${formattedRole(role)} ${module.label} ${action}"
                      ${permission[`can_${action}`] ? "checked" : ""}
                      onchange="updateRolePermission('${role}', '${module.key}', '${action}', this.checked)"
                    >
                  </td>
                `).join("")}
              </tr>
            `;
          })).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderApprovalRequests() {
  if (!elements.approvalRequestsTable) return;
  elements.approvalRequestsTable.innerHTML = renderRows(
    state.approvalRequests,
    (item) => {
      const canAct = canApproveRecords() && item.approval_status === "pending";
      return `
        <tr>
          <td><strong>${escapeHtml(item.related_table)}</strong><br><span>${escapeHtml(item.related_record_id)}</span></td>
          <td><span class="status-pill ${item.approval_status === "rejected" ? "danger" : ""}">${formattedRoleLabel(item.approval_status)}</span></td>
          <td>${userEmail(item.requested_by)}</td>
          <td>${item.approver_person_id ? peopleName(item.approver_person_id) : userEmail(item.approver_user_id)}</td>
          <td class="actions-cell">
            ${canAct ? `<div class="table-actions"><button type="button" onclick="decideApproval('${item.id}', 'approved')">Approve</button><button class="delete-action" type="button" onclick="decideApproval('${item.id}', 'rejected')">Reject</button></div>` : '<span class="muted-action">No action</span>'}
          </td>
        </tr>
      `;
    },
    5,
    "No approval requests found."
  );
}

function renderAuditLogs() {
  if (!elements.auditLogsTable) return;
  elements.auditLogsTable.innerHTML = renderRows(
    state.auditLogs.slice(0, 80),
    (item) => `
      <tr>
        <td>${formatDateTime(item.created_at)}</td>
        <td>${escapeHtml(item.user_email || userEmail(item.user_id))}</td>
        <td><span class="status-pill">${escapeHtml(item.action)}</span></td>
        <td>${escapeHtml(item.table_name || "N/A")}</td>
        <td>${escapeHtml(item.record_id || "N/A")}</td>
      </tr>
    `,
    5,
    "No audit records found."
  );
}

function renderCompanySettings() {
  if (!elements.companySettingsCard) return;
  const settings = state.companySettings || {};
  if (elements.companyEyebrow) {
    elements.companyEyebrow.textContent = settings.company_name || "Workflow Operations Platform";
  }
  document.title = settings.system_name || "Workflow Operations Platform";
  elements.companySettingsCard.innerHTML = `
    ${profileField("Company", settings.company_name || "Business Workspace")}
    ${profileField("System Name", settings.system_name || "Workflow Operations Platform")}
    ${profileField("Business Type", businessTypeLabel(settings.business_type, settings.custom_business_type))}
    ${profileField("Industry", settings.industry || businessTypeLabel(settings.business_type, settings.custom_business_type))}
    ${profileField("Workflow Preferences", settings.workflow_preferences || "Scheduling, tasks, approvals, checklists, escalations, corrective actions, attachments, notifications, analytics")}
    ${profileField("Address", settings.address || "Not set")}
    ${profileField("Contact", settings.contact_number || "Not set")}
    ${profileField("Email", settings.email || "Not set")}
    ${profileField("Logo URL", settings.logo_url || "Not set")}
  `;
}

function renderPeopleProfiles() {
  if (!elements.peopleProfilesTable) return;
  const canManage = canManagePersonnel();
  const canViewAll = canViewHRModule();
  const currentUserId = state.session?.user?.id;
  let visiblePeople = canViewAll
    ? [...state.peopleProfiles]
    : state.peopleProfiles.filter((person) => person.user_id === currentUserId || String(person.email || "").toLowerCase() === String(state.session?.user?.email || "").toLowerCase());

  const search = String(elements.peopleSearchInput?.value || "").toLowerCase();
  const department = elements.peopleDepartmentFilter?.value || "";
  const status = elements.peopleStatusFilter?.value || "";
  visiblePeople = visiblePeople.filter((person) => {
    const text = [person.complete_name, person.employee_id, person.position, departmentNameRaw(person.department_id) || person.department, person.operational_role, person.email].join(" ").toLowerCase();
    return (!search || text.includes(search))
      && (!department || personDepartmentFilterValue(person) === department)
      && (!status || (person.employment_status || "active") === status);
  });

  const sortBy = elements.peopleSortSelect?.value || "name";
  visiblePeople.sort((a, b) => peopleSortValue(a, sortBy).localeCompare(peopleSortValue(b, sortBy)));

  updatePeopleFilters();
  renderHrDashboardCards(visiblePeople, canViewAll);
  if (elements.hrAccessNotice) {
    elements.hrAccessNotice.innerHTML = canViewAll
      ? ""
      : "<strong>Limited employee access.</strong> You can view your own profile and assigned workflow information only.";
  }

  elements.peopleProfilesTable.innerHTML = visiblePeople.length
    ? visiblePeople.map((person) => renderEmployeeCard(person, canManage)).join("")
    : '<div class="empty-state"><p>No employee profiles found.</p></div>';

  const selected = visiblePeople.find((person) => person.id === state.selectedPeopleProfileId) || visiblePeople[0];
  state.selectedPeopleProfileId = selected?.id || null;
  renderEmployeeProfilePanel(selected, canManage);
}

function peopleSortValue(person, sortBy) {
  if (sortBy === "department") return departmentNameRaw(person.department_id) || person.department || "Unassigned";
  if (sortBy === "status") return person.employment_status || "active";
  if (sortBy === "date_hired") return person.date_hired || "";
  return person.complete_name || "";
}

function updatePeopleFilters() {
  if (elements.peopleDepartmentFilter) {
    const selected = elements.peopleDepartmentFilter.value;
    const departmentOptionsHtml = departmentFilterOptions().map((item) => `<option value="${escapeAttribute(item.value)}" ${item.value === selected ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("");
    elements.peopleDepartmentFilter.innerHTML = `<option value="">All departments</option>${departmentOptionsHtml}`;
  }
  if (elements.peopleStatusFilter) {
    const selected = elements.peopleStatusFilter.value;
    elements.peopleStatusFilter.innerHTML = `<option value="">All statuses</option>${employmentStatusOptions().map((item) => `<option value="${escapeAttribute(item.value)}" ${item.value === selected ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}`;
  }
}

function renderHrDashboardCards(people, canViewAll) {
  if (!elements.hrDashboardCards) return;
  const allPeople = canViewAll ? state.peopleProfiles : people;
  const active = allPeople.filter((person) => (person.employment_status || "active") === "active").length;
  const inactive = allPeople.filter((person) => ["inactive", "suspended", "resigned", "terminated"].includes(person.employment_status)).length;
  const missingDocs = allPeople.filter((person) => isMissingEmployeeDocuments(person)).length;
  const expiring = expiringPeopleRequirementCount(allPeople);
  const departments = uniqueLabels(allPeople.map((person) => departmentNameRaw(person.department_id) || person.department).filter(Boolean)).length;
  const participation = employeeWorkflowParticipationRate(allPeople);
  const attendanceToday = attendanceForDate(toDateInputValue(new Date()), allPeople.map((person) => person.id));
  elements.hrDashboardCards.innerHTML = [
    ["Total Employees", allPeople.length],
    ["Active Employees", active],
    ["Inactive / Exited", inactive],
    ["Expiring Requirements", expiring],
    ["Missing Documents", missingDocs],
    ["Departments", departments],
    ["Present Today", attendanceToday.present],
    ["Late Today", attendanceToday.late],
    ["Absent Today", attendanceToday.absent],
    ["On Leave Today", attendanceToday.on_leave],
    ["Workflow Participation", `${participation}%`]
  ].map(([label, value]) => `<article class="summary-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("");
}

function renderDepartments() {
  if (!elements.departmentsTable) return;
  const canManage = canManagePersonnel();
  const today = toDateInputValue(new Date());
  const sourceDepartments = departmentRecordsForDisplay();

  if (elements.departmentDashboardCards) {
    const activeDepartments = sourceDepartments.filter((department) => (department.status || "active") === "active").length;
    const mappedEmployees = state.peopleProfiles.filter((person) => person.department_id).length;
    const heads = sourceDepartments.filter((department) => department.department_head_id).length;
    const attendanceDepartments = uniqueLabels(state.attendanceRecords
      .filter((record) => record.attendance_date === today)
      .map((record) => {
        const person = state.peopleProfiles.find((item) => item.id === record.person_id);
        return personDepartmentFilterValue(person);
      })
      .filter(Boolean)).length;

    elements.departmentDashboardCards.innerHTML = [
      ["Departments", sourceDepartments.length],
      ["Active", activeDepartments],
      ["Employees Mapped", mappedEmployees],
      ["With Department Head", heads],
      ["Attendance Today", attendanceDepartments]
    ].map(([label, value]) => `<article class="summary-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("");
  }

  elements.departmentsTable.innerHTML = renderRows(sourceDepartments, (department) => {
    const employees = state.peopleProfiles.filter((person) => personDepartmentFilterValue(person) === departmentFilterValue(department));
    const presentToday = state.attendanceRecords.filter((record) => {
      const person = employees.find((item) => item.id === record.person_id);
      return person && record.attendance_date === today && record.status === "present";
    }).length;
    const realDepartment = Boolean(department.id);
    const actions = canManage && realDepartment
      ? `<div class="table-actions"><button type="button" onclick="openDepartmentModal('${escapeAttribute(department.id)}')">Edit</button>${canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteRecord('departments', '${escapeAttribute(department.id)}')">Delete</button>` : ""}</div>`
      : '<span class="muted-action">Text-only legacy department</span>';
    return `
      <tr>
        <td><strong>${escapeHtml(department.department_name)}</strong><br><span>${escapeHtml(department.description || "")}</span></td>
        <td>${department.department_head_id ? peopleName(department.department_head_id) : "Not assigned"}</td>
        <td>${employees.length}</td>
        <td>${presentToday}</td>
        <td><span class="status-pill ${department.status === "inactive" ? "warning" : department.status === "archived" ? "danger" : ""}">${formattedRoleLabel(department.status || "active")}</span></td>
        <td class="actions-cell">${actions}</td>
      </tr>
    `;
  }, 6, "No departments found.");
}

function departmentRecordsForDisplay() {
  const mapped = state.departments.map((department) => ({ ...department, legacy: false }));
  const mappedNames = new Set(mapped.map((department) => String(department.department_name || "").toLowerCase()));
  const legacy = uniqueLabels(state.peopleProfiles.map((person) => person.department).filter(Boolean))
    .filter((name) => !mappedNames.has(String(name).toLowerCase()))
    .map((name) => ({ id: "", department_name: name, status: "active", legacy: true }));
  return [...mapped, ...legacy].sort((a, b) => String(a.department_name || "").localeCompare(String(b.department_name || "")));
}

function departmentFilterOptions() {
  return departmentRecordsForDisplay().map((department) => ({
    value: departmentFilterValue(department),
    label: department.department_name
  }));
}

function departmentFilterValue(department) {
  return department?.id || `legacy:${department?.department_name || "Unassigned"}`;
}

function personDepartmentFilterValue(person = {}) {
  if (person.department_id) return person.department_id;
  return `legacy:${person.department || "Unassigned"}`;
}

function attendanceForDate(dateValue, personIds = []) {
  const allowedPeople = personIds.length ? new Set(personIds) : null;
  return state.attendanceRecords
    .filter((record) => record.attendance_date === dateValue && (!allowedPeople || allowedPeople.has(record.person_id)))
    .reduce((summary, record) => {
      const status = record.status || "present";
      summary[status] = (summary[status] || 0) + 1;
      return summary;
    }, { present: 0, late: 0, absent: 0, on_leave: 0 });
}

function renderEmployeeCard(person, canManage) {
  const status = person.employment_status || "active";
  const initials = employeeInitials(person);
  const certificates = employeeHealthCertificates(person.id);
  const hasExpiring = certificates.some((item) => isExpiringDate(item.expiry_date));
  return `
    <article class="employee-card ${state.selectedPeopleProfileId === person.id ? "is-selected" : ""}" onclick="selectPeopleProfile('${escapeAttribute(person.id)}')">
      <div class="employee-avatar">${escapeHtml(initials)}</div>
      <div>
        <strong>${escapeHtml(person.complete_name || "Unnamed employee")}</strong>
        <span>${escapeHtml(person.employee_id || "No employee ID")} Â· ${escapeHtml(person.position || "No position")}</span>
        <small>${escapeHtml(departmentNameRaw(person.department_id) || person.department || "Unassigned department")} Â· ${escapeHtml(person.employment_type || "Employment type not set")}</small>
      </div>
      <div class="employee-card-meta">
        <span class="status-pill ${statusPillClass(status)}">${formattedRoleLabel(status)}</span>
        <small>${escapeHtml(person.contact_number || person.email || "No contact")}</small>
        ${hasExpiring ? '<span class="status-pill warning">Renewal Due</span>' : ""}
      </div>
      ${canManage ? `<button type="button" onclick="event.stopPropagation(); openPeopleProfileModal('${escapeAttribute(person.id)}')">Edit</button>` : ""}
    </article>
  `;
}

function renderEmployeeProfilePanel(person, canManage) {
  if (!elements.employeeProfilePanel) return;
  if (!person) {
    elements.employeeProfilePanel.innerHTML = '<div class="empty-state"><h4>No profile selected</h4><p>Employee details appear here.</p></div>';
    return;
  }
  const qualifications = employeeQualifications(person.id);
  const trainings = employeeTrainings(person.id);
  const health = employeeHealthCertificates(person.id);
  const docs = employeeDocuments(person.id);
  const performance = employeePerformanceSummary(person.id);
  elements.employeeProfilePanel.innerHTML = `
    <div class="employee-profile-head">
      <div class="employee-avatar large">${escapeHtml(employeeInitials(person))}</div>
      <div>
        <h4>${escapeHtml(person.complete_name || "Unnamed employee")}</h4>
        <p>${escapeHtml(person.employee_id || "No employee ID")} Â· ${escapeHtml(person.position || "No position")}</p>
      </div>
      ${canManage ? `<div class="table-actions"><button type="button" onclick="openPeopleProfileModal('${escapeAttribute(person.id)}')">Edit</button><button type="button" onclick="openEmployeeDocumentModal(null, '${escapeAttribute(person.id)}')">Add Document</button></div>` : ""}
    </div>
    <div class="employee-tabs">
      <section><h5>Overview</h5><div class="profile-grid">
        ${profileField("Department", departmentNameRaw(person.department_id) || person.department || "Unassigned")}
        ${profileField("Status", formattedRoleLabel(person.employment_status || "active"))}
        ${profileField("Contact", person.contact_number || "Not set")}
        ${profileField("Email", person.email || "Not set")}
      </div></section>
      <section><h5>Employment</h5><div class="profile-grid">
        ${profileField("Employment Type", person.employment_type || "Not set")}
        ${profileField("Date Hired", formatDate(person.date_hired))}
        ${profileField("Supervisor", peopleName(person.supervisor_id) || person.supervisor_name || "Not set")}
        ${profileField("Assigned Team", person.assigned_team || "Not set")}
        ${profileField("Work Location", person.work_location || "Not set")}
        ${profileField("Shift Schedule", person.shift_schedule || "Not set")}
      </div></section>
      <section><h5>Qualifications</h5>${renderProfileList([...qualifications, ...trainings], "No qualifications or trainings recorded.")}</section>
      <section><h5>Documents</h5>${canManage ? `<button type="button" onclick="openEmployeeDocumentModal(null, '${escapeAttribute(person.id)}')">Add Document</button>` : ""}${renderProfileList(docs, "No employee documents uploaded.")}</section>
      <section><h5>Compliance</h5>${renderProfileList(health, "No health or compliance records found.")}</section>
      <section><h5>Performance</h5><div class="profile-grid">
        ${profileField("Task Completion", `${performance.completion}%`)}
        ${profileField("Assigned Workflows", performance.assigned)}
        ${profileField("Backlogs", performance.backlogs)}
        ${profileField("Corrective Actions", performance.cases)}
      </div></section>
      <section><h5>Activity Logs</h5>${renderEmployeeTimeline(person)}</section>
    </div>
  `;
}

function renderAttendance() {
  if (!elements.attendanceTable) return;
  const canManage = canManagePersonnel();
  const canViewAll = canViewHRModule();
  const currentUserId = state.session?.user?.id;
  const visiblePeople = canViewAll
    ? state.peopleProfiles
    : state.peopleProfiles.filter((person) => person.user_id === currentUserId || String(person.email || "").toLowerCase() === String(state.session?.user?.email || "").toLowerCase());
  const visiblePersonIds = new Set(visiblePeople.map((person) => person.id));

  updateAttendanceFilters(visiblePeople);

  const dateFilter = elements.attendanceDateFilter?.value || "";
  const employeeFilter = elements.attendanceEmployeeFilter?.value || "";
  const statusFilter = elements.attendanceStatusFilter?.value || "";
  const records = state.attendanceRecords
    .filter((record) => visiblePersonIds.has(record.person_id))
    .filter((record) => !dateFilter || record.attendance_date === dateFilter)
    .filter((record) => !employeeFilter || record.person_id === employeeFilter)
    .filter((record) => !statusFilter || record.status === statusFilter)
    .sort((a, b) => new Date(`${b.attendance_date || "1900-01-01"}T${b.time_in || "00:00"}`) - new Date(`${a.attendance_date || "1900-01-01"}T${a.time_in || "00:00"}`));

  elements.attendanceTable.innerHTML = renderRows(records, (record) => {
    const person = state.peopleProfiles.find((item) => item.id === record.person_id);
    return `
      <tr>
        <td><strong>${peopleName(record.person_id)}</strong></td>
        <td>${escapeHtml(person?.employee_id || "N/A")}</td>
        <td>${formatDate(record.attendance_date)}</td>
        <td>${escapeHtml(formatTime(record.time_in))}</td>
        <td>${escapeHtml(formatTime(record.time_out))}</td>
        <td><span class="status-pill ${attendanceStatusClass(record.status)}">${formattedRoleLabel(record.status)}</span></td>
        <td>${escapeHtml(record.notes || "")}</td>
        <td class="actions-cell">${canManage ? `<div class="table-actions"><button type="button" onclick="openAttendanceModal('${escapeAttribute(record.id)}')">Edit</button></div>` : '<span class="muted-action">View only</span>'}</td>
      </tr>
    `;
  }, 8, "No attendance records found.");
}

function updateAttendanceFilters(people) {
  if (!elements.attendanceEmployeeFilter) return;
  const selected = elements.attendanceEmployeeFilter.value;
  elements.attendanceEmployeeFilter.innerHTML = `
    <option value="">All employees</option>
    ${people.map((person) => `<option value="${escapeAttribute(person.id)}" ${person.id === selected ? "selected" : ""}>${escapeHtml(person.complete_name || "Unnamed employee")}</option>`).join("")}
  `;
}

function attendanceStatusClass(status) {
  if (status === "present") return "success";
  if (status === "late" || status === "on_leave") return "warning";
  if (status === "absent") return "danger";
  return "";
}

function formatTime(value) {
  if (!value) return "N/A";
  return String(value).slice(0, 5);
}

function selectPeopleProfile(id) {
  state.selectedPeopleProfileId = id;
  renderPeopleProfiles();
}

function employeeInitials(person) {
  return String(person.complete_name || "Employee")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "E";
}

function statusPillClass(status = "") {
  if (["terminated", "suspended"].includes(status)) return "danger";
  if (["probationary", "resigned"].includes(status)) return "warning";
  return "";
}

function employeeQualifications(personId) {
  return state.personQualifications.filter((item) => item.person_id === personId);
}

function employeeTrainings(personId) {
  return state.personTrainings.filter((item) => item.person_id === personId);
}

function employeeHealthCertificates(personId) {
  return state.personHealthCertificates.filter((item) => item.person_id === personId);
}

function employeeDocuments(personId) {
  const documentRecords = state.employeeDocuments
    .filter((item) => item.person_id === personId)
    .map((item) => ({
      ...item,
      title: item.document_title,
      file_name: item.document_title,
      document_type: item.document_type,
      expiry_date: item.expiry_date
    }));
  const attachmentRecords = state.fileAttachments.filter((item) => item.related_table === "people_profiles" && item.related_record_id === personId);
  return [...documentRecords, ...attachmentRecords];
}

function isExpiringDate(value) {
  if (!value) return false;
  const today = startOfDay(new Date());
  const expiry = startOfDay(value);
  const days = daysBetween(today, expiry);
  return days >= 0 && days <= 30;
}

function isMissingEmployeeDocuments(person) {
  return !employeeDocuments(person.id).length && !person.document_notes;
}

function expiringPeopleRequirementCount(people) {
  const ids = new Set(people.map((person) => person.id));
  return [
    ...state.personQualifications,
    ...state.personTrainings,
    ...state.personHealthCertificates
  ].filter((item) => ids.has(item.person_id) && isExpiringDate(item.expiry_date || item.valid_until || item.expiration_date)).length;
}

function employeeWorkflowParticipationRate(people) {
  const ids = new Set(people.map((person) => person.id));
  const assigned = state.generatedTasks.filter((task) => ids.has(task.assigned_person_id));
  if (!assigned.length) return 0;
  const completed = assigned.filter((task) => ["completed", "checked"].includes(task.task_status)).length;
  return Math.round((completed / assigned.length) * 100);
}

function employeePerformanceSummary(personId) {
  const tasks = state.generatedTasks.filter((task) => task.assigned_person_id === personId);
  const completed = tasks.filter((task) => ["completed", "checked"].includes(task.task_status)).length;
  const backlogs = tasks.filter((task) => ["overdue", "at_risk"].includes(taskDisplayStatus(task))).length;
  const taskIds = new Set(tasks.map((task) => task.id));
  const cases = state.actionCases.filter((item) => taskIds.has(item.task_id)).length;
  return {
    assigned: tasks.length,
    completion: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    backlogs,
    cases
  };
}

function renderProfileList(records, emptyMessage) {
  if (!records.length) return `<div class="empty-state compact"><p>${escapeHtml(emptyMessage)}</p></div>`;
  return `
    <div class="timeline-list">
      ${records.slice(0, 8).map((item) => `
        <article>
          <strong>${escapeHtml(item.title || item.training_title || item.qualification_title || item.qualification_name || item.certificate_name || item.certificate_number || item.file_name || item.document_type || "Record")}</strong>
          <span>${escapeHtml(item.status || item.result || item.issuer || item.file_type || "Recorded")}</span>
          <small>${escapeHtml(formatDate(item.expiry_date || item.valid_until || item.expiration_date || item.created_at))}</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderEmployeeTimeline(person) {
  const logs = [
    ...state.auditLogs.filter((item) => item.record_id === person.id).map((item) => ({
      title: formattedRoleLabel(item.action),
      detail: item.table_name || "Profile update",
      at: item.created_at
    })),
    ...state.generatedTasks.filter((task) => task.assigned_person_id === person.id).map((task) => ({
      title: task.task_title,
      detail: `Workflow status: ${formattedRoleLabel(taskDisplayStatus(task))}`,
      at: task.task_date || task.created_at
    }))
  ].filter((item) => item.at).sort((a, b) => new Date(b.at) - new Date(a.at));
  if (!logs.length) return '<div class="empty-state compact"><p>No activity logged yet.</p></div>';
  return `<div class="timeline-list">${logs.slice(0, 8).map((item) => `<article><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span><small>${escapeHtml(formatDateTime(item.at))}</small></article>`).join("")}</div>`;
}

function renderEquipment() {
  if (!elements.equipmentTable) return;
  elements.equipmentTable.innerHTML = renderRows(
    state.equipment,
    (item) => `
      <tr>
        <td><strong>${escapeHtml(item.equipment_name)}</strong></td>
        <td>${escapeHtml(item.equipment_type || "Not set")}</td>
        <td>${escapeHtml(item.serial_number || "N/A")}</td>
        <td>${escapeHtml(item.specification || "Not set")}</td>
        <td>${escapeHtml(item.year_acquired || "N/A")}</td>
        <td><span class="status-pill ${["needs_repair", "under_maintenance"].includes(item.status) ? "danger" : ""}">${formattedRoleLabel(item.functional_state || item.status)}</span></td>
        <td>${equipmentMaintenanceSummary(item.id)}</td>
        <td class="actions-cell">${canManageEquipment() ? `<div class="table-actions"><button type="button" onclick="openEquipmentModal('${item.id}')">Edit</button><button type="button" onclick="openMaintenanceModal(null, '${item.id}')">Maintenance</button></div>` : '<span class="muted-action">View only</span>'}</td>
      </tr>
    `,
    8,
    "No equipment records found."
  );
}

function equipmentMaintenanceSummary(equipmentId) {
  const records = state.equipmentMaintenanceHistory.filter((item) => item.equipment_id === equipmentId);
  if (!records.length) return "No history";
  const latest = records[0];
  return `${records.length} record${records.length === 1 ? "" : "s"} | Next: ${formatDate(latest.next_due_date)}`;
}

function renderSops() {
  if (!elements.sopTable) return;
  const canManage = canManageSops();
  const visibleSops = canViewSops() ? state.standardOperatingProcedures : [];
  elements.sopTable.innerHTML = renderRows(
    visibleSops,
    (sop) => `
      <tr>
        <td>
          <strong>${escapeHtml(sop.title)}</strong>
          <span class="muted-action">${escapeHtml(sop.sop_code || "No code")} | ${escapeHtml(sop.category || "General")}</span>
        </td>
        <td>${escapeHtml(departmentNameRaw(sop.department_id) || sop.department || "All departments")}</td>
        <td>${peopleName(sop.owner_person_id)}</td>
        <td>${escapeHtml(sop.version || "1.0")}</td>
        <td><span class="status-pill ${sop.status === "archived" ? "danger" : sop.status === "under_review" ? "warning" : ""}">${formattedRoleLabel(sop.status || "draft")}</span></td>
        <td>${formatDate(sop.review_date)}</td>
        <td>${sopAttachmentSummary(sop.id)}</td>
        <td class="actions-cell"><div class="table-actions"><button type="button" onclick="openSopSummaryReportModal('${escapeAttribute(sop.id)}')">Summary Report</button>${canManage ? `<button type="button" onclick="openSopModal('${escapeAttribute(sop.id)}')">Edit</button>${canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteRecord('standard_operating_procedures', '${escapeAttribute(sop.id)}')">Delete</button>` : ""}` : ""}</div></td>
      </tr>
    `,
    8,
    canViewSops() ? "No SOP records found." : "You do not have access to SOP records."
  );
}

function renderSopSummaryReports() {
  const table = $("#sopSummaryReportsTable");
  if (!table) return;
  const reports = canViewSops() ? state.sopSummaryReports : [];
  table.innerHTML = renderRows(
    reports,
    (report) => {
      const sop = state.standardOperatingProcedures.find((item) => item.id === report.sop_id);
      return `
        <tr>
          <td>
            <strong>${escapeHtml(sop?.title || report.summary_snapshot?.sop_title || "SOP Summary Report")}</strong>
            <span class="muted-action">${escapeHtml(sop?.sop_code || report.summary_snapshot?.sop_code || "No SOP code")}</span>
          </td>
          <td>${escapeHtml(`${formatDate(report.period_start)} - ${formatDate(report.period_end)}`)}</td>
          <td>${peopleName(report.prepared_by)}</td>
          <td><span class="status-pill ${report.report_status === "archived" ? "danger" : ""}">${formattedRoleLabel(report.report_status || "generated")}</span></td>
          <td>${escapeHtml(report.compliance_percentage ?? 0)}%</td>
          <td>${formatDateTime(report.generated_at || report.created_at)}</td>
          <td class="actions-cell">
            <div class="table-actions">
              <button type="button" onclick="printSavedSopSummaryReport('${escapeAttribute(report.id)}')">Print / Save PDF</button>
              ${canManageSops() ? `<button type="button" onclick="openSopSummaryReportHistoryModal('${escapeAttribute(report.id)}')">Edit</button>` : ""}
              ${canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteRecord('sop_summary_reports', '${escapeAttribute(report.id)}')">Delete</button>` : ""}
            </div>
          </td>
        </tr>
      `;
    },
    7,
    canViewSops() ? "No SOP Summary Reports generated yet." : "You do not have access to SOP summary reports."
  );
}

function sopAttachmentSummary(sopId) {
  const attachments = recordAttachments("standard_operating_procedures", sopId);
  if (!attachments.length) return '<span class="muted-action">No files</span>';
  const latest = attachments[0];
  return `<span class="status-pill">${attachments.length} file${attachments.length === 1 ? "" : "s"}</span><br><span class="muted-action">${escapeHtml(latest.file_name || "Attachment")}</span>`;
}

function recordAttachments(tableName, recordId) {
  return state.fileAttachments
    .filter((item) => item.related_table === tableName && item.related_record_id === recordId)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

function linkedSopSummary({ taskId = "", workspaceId = "", workflowTemplateId = "", planId = "", planItemId = "", departmentId = "" } = {}) {
  const matches = state.standardOperatingProcedures.filter((sop) => (
    (taskId && sop.task_id === taskId)
    || (workspaceId && sop.workspace_id === workspaceId)
    || (workflowTemplateId && sop.workflow_template_id === workflowTemplateId)
    || (planId && sop.plan_id === planId)
    || (planItemId && sop.plan_item_id === planItemId)
    || (departmentId && sop.department_id === departmentId)
  ));
  if (!matches.length) return '<span class="muted-action">None linked</span>';
  return `<span class="status-pill">${matches.length} SOP${matches.length === 1 ? "" : "s"}</span>`;
}

function renderMonitoringPlans() {
  if (!elements.scheduleTemplatesTable) return;
  elements.scheduleTemplatesTable.innerHTML = renderRows(
    state.scheduleTemplates,
    (template) => `
      <tr>
        <td><strong>${escapeHtml(template.template_title)}</strong></td>
        <td>${categoryName(template.category_id)}</td>
        <td>${productLineName(template.product_line_id)}</td>
        <td>${escapeHtml(template.frequency)}</td>
        <td>${escapeHtml(template.due_time || "Flexible")}</td>
        <td class="actions-cell">${canManagePlans() ? `<div class="table-actions"><button type="button" onclick="openScheduleTemplateModal('${template.id}')">Edit</button><button type="button" onclick="openGeneratedTaskModal(null, '${template.id}')">Add Task</button></div>` : '<span class="muted-action">View only</span>'}</td>
      </tr>
    `,
    6,
    "No workflow templates found."
  );

  if (elements.monitoringSetupList) {
    const suggestions = activeMonitoringTemplates();
    elements.monitoringSetupList.innerHTML = `
      <div class="setup-group industry-setup">
        <h4>${escapeHtml(currentBusinessTypeLabel())} Suggestions</h4>
        <p>Enable recommended workspaces for this business type, customize them, or create your own workflow.</p>
        <div class="suggested-module-list">
          ${suggestions.length ? suggestions.map((template) => {
            const active = isTemplateActivated(template);
            return `
              <article class="suggested-module ${active ? "is-active" : ""}">
                <strong>${escapeHtml(template.category)}</strong>
                <span>${escapeHtml(template.frequency)}</span>
                <div class="table-actions">
                  <button type="button" ${active ? "disabled" : ""} onclick="activateSuggestedModule('${escapeAttribute(template.id)}')">${active ? "Enabled" : "Enable"}</button>
                  <button type="button" onclick="customizeSuggestedModule('${escapeAttribute(template.id)}')">Customize</button>
                </div>
              </article>
            `;
          }).join("") : "<p>Select a business type or create custom workflow modules.</p>"}
        </div>
      </div>
      <div class="setup-group">
        <h4>Workspaces</h4>
        ${state.productLines.length ? state.productLines.map((item) => `
          <div class="table-actions">
            <button type="button" ${canManagePlans() ? `onclick="openProductLineModal('${item.id}')"` : "disabled"}>${escapeHtml(item.product_name)}</button>
            ${canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteWorkspace('${item.id}')">Delete</button>` : ""}
          </div>
        `).join("") : "<p>No workspaces yet.</p>"}
      </div>
      <div class="setup-group">
        <h4>Workflow Groups</h4>
        ${state.monitoringCategories.length ? state.monitoringCategories.map((item) => `<button type="button" ${canManagePlans() ? `onclick="openMonitoringCategoryModal('${item.id}')"` : "disabled"}>${escapeHtml(item.category_name)}</button>`).join("") : "<p>No workflow groups yet.</p>"}
      </div>
      <div class="setup-group">
        <h4>Database Templates</h4>
        <div class="table-actions">
          ${canManagePlans() ? '<button type="button" onclick="openDbTemplateModal()">Create Template</button><button type="button" onclick="openChecklistModal()">Add Checklist</button><button type="button" onclick="openTemplateWorkflowModal()">Add Workflow Step</button>' : ""}
        </div>
        ${state.monitoringTemplatesDb.length ? state.monitoringTemplatesDb.slice(0, 8).map((template) => `
          <button type="button" ${canManagePlans() ? `onclick="openDbTemplateModal('${template.id}')"` : "disabled"}>
            ${escapeHtml(template.module_name || template.template_name)}
          </button>
        `).join("") : "<p>No database templates yet.</p>"}
      </div>
    `;
  }
}

function renderTaskBoard() {
  if (!elements.generatedTasksTable) return;
  renderTaskWorkspaceFilter();
  const selectedWorkspaceId = elements.taskWorkspaceFilter?.value || "";
  const visibleTasks = state.generatedTasks.filter((task) => !selectedWorkspaceId || taskWorkspaceId(task) === selectedWorkspaceId);
  const visibleTaskIds = new Set(visibleTasks.map((task) => task.id));
  const today = toDateInputValue(new Date());
  $("#newDueToday").textContent = visibleTasks.filter((task) => task.task_date === today).length;
  $("#newOverdue").textContent = visibleTasks.filter((task) => task.task_date < today && !["completed", "checked", "cancelled"].includes(task.task_status)).length;
  $("#newCompleted").textContent = visibleTasks.filter((task) => ["completed", "checked"].includes(task.task_status)).length;
  $("#newOpenCases").textContent = state.actionCases.filter((item) => visibleTaskIds.has(item.task_id) && !["verified", "closed"].includes(item.case_status)).length;

  elements.generatedTasksTable.innerHTML = renderRows(
    visibleTasks,
    (task) => {
      const displayStatus = taskDisplayStatus(task);
      const actions = [
        canManagePlans() ? `<button type="button" onclick="openGeneratedTaskModal('${task.id}')">Edit</button>` : "",
        canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteGeneratedTask('${task.id}')">Delete</button>` : "",
        canDoTasks() ? `<button type="button" onclick="openTaskDoModal('${task.id}')">Do</button>` : "",
        canCheckTasks() ? `<button type="button" onclick="openTaskCheckModal('${task.id}')">Check</button>` : ""
      ].filter(Boolean).join("");
      return `
        <tr>
          <td><strong>${escapeHtml(task.task_title)}</strong></td>
          <td>${escapeHtml(planForTask(task)?.plan_title || "Not linked")}</td>
          <td>${escapeHtml(planItemForTask(task)?.category || planItemForTask(task)?.objective || "Not linked")}</td>
          <td>${productLineName(taskWorkspaceId(task))}</td>
          <td>${formatDate(task.task_date)}</td>
          <td>${escapeHtml(task.due_time || "Any time")}</td>
          <td>${peopleName(task.assigned_person_id)}</td>
          <td>${escapeHtml(sopForTask(task) ? sopDisplayName(sopForTask(task)) : "Not linked")}</td>
          <td><span class="status-pill ${["overdue", "not_compliant"].includes(displayStatus) ? "danger" : displayStatus === "at_risk" ? "warning" : ""}">${formattedRoleLabel(displayStatus)}</span></td>
          <td class="actions-cell">${actions ? `<div class="table-actions">${actions}</div>` : '<span class="muted-action">View only</span>'}</td>
        </tr>
      `;
    },
    10,
    selectedWorkspaceId ? "No workspace tasks found for this workspace." : "No workspace tasks yet."
  );
}

function renderTaskWorkspaceFilter() {
  if (!elements.taskWorkspaceFilter) return;
  const selectedValue = elements.taskWorkspaceFilter.value;
  elements.taskWorkspaceFilter.innerHTML = `
    <option value="">All workspace tasks</option>
    ${state.productLines.map((line) => `
      <option value="${escapeAttribute(line.id)}" ${line.id === selectedValue ? "selected" : ""}>${escapeHtml(line.product_name)}</option>
    `).join("")}
  `;
}

function renderActionCenter() {
  if (!elements.actionCasesTable) return;
  elements.actionCasesTable.innerHTML = renderRows(
    state.actionCases,
    (item) => `
      <tr>
        <td><strong>${escapeHtml(item.case_title)}</strong></td>
        <td>${escapeHtml(item.non_compliance_note)}</td>
        <td>${peopleName(item.assigned_manager_id)}</td>
        <td><span class="status-pill ${item.case_status === "open" ? "danger" : ""}">${formattedRoleLabel(item.case_status)}</span></td>
        <td>${formatDateTime(item.due_at)}</td>
        <td class="actions-cell">${canManageActionCenter() ? `<div class="table-actions"><button type="button" onclick="openActionCaseModal('${item.id}')">Edit</button></div>` : '<span class="muted-action">View only</span>'}</td>
      </tr>
    `,
    6,
    "No action cases opened."
  );
}

function profileField(label, value) {
  return `<div class="profile-field"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderRows(records, template, colspan, emptyMessage) {
  if (!records.length) {
    return `<tr><td colspan="${colspan}" class="empty-table">${emptyMessage}</td></tr>`;
  }
  return records.map(template).join("");
}

function exportPersonnelCsv() {
  const rows = state.personnel.map((person) => ({
    "Full Name": person.full_name,
    Position: person.position,
    Role: person.role,
    "Created At": formatDateTime(person.created_at)
  }));
  downloadCsv("personnel-records", rows);
}

function exportSopCsv() {
  const rows = state.standardOperatingProcedures.map((sop) => ({
    Code: sop.sop_code,
    Title: sop.title,
    Department: departmentNameRaw(sop.department_id) || sop.department,
    Category: sop.category,
    Version: sop.version,
    Status: formattedRoleLabel(sop.status),
    "Effective Date": sop.effective_date,
    "Review Date": sop.review_date,
    Owner: peopleNameRaw(sop.owner_person_id),
    "Approved By": peopleNameRaw(sop.approved_by),
    Summary: sop.summary
  }));
  downloadCsv("standard-operating-procedures", rows);
}

function exportPlansCsv() {
  const planRows = state.plans.map((plan) => ({
    Type: "Plan",
    "Plan Title": plan.plan_title,
    "Plan Item": "",
    Period: formatPeriod(plan.period_month, plan.period_year),
    "Start Date": plan.start_date,
    "End/Due Date": plan.end_date,
    "Created By": rawPersonName(plan.created_by),
    "Approved/Responsible": rawPersonName(plan.approved_by),
    Frequency: "",
    Objective: "",
    "Target Standard": "",
    "Expected Output": "",
    Remarks: ""
  }));
  const itemRows = state.planItems.map((item) => {
    const plan = state.plans.find((record) => record.id === item.plan_id);
    return {
      Type: "Plan Item",
      "Plan Title": plan?.plan_title || "",
      "Plan Item": item.category,
      Period: plan ? formatPeriod(plan.period_month, plan.period_year) : "",
      "Start Date": item.start_date,
      "End/Due Date": item.due_date,
      "Created By": "",
      "Approved/Responsible": rawPersonName(item.responsible_person),
      Frequency: item.frequency,
      Objective: item.objective,
      "Target Standard": item.target_standard,
      "Expected Output": item.expected_output,
      Remarks: item.remarks
    };
  });
  downloadCsv("plans-and-plan-items", [...planRows, ...itemRows]);
}

function exportActionsCsv() {
  const rows = state.actions.map((action) => {
    const item = state.planItems.find((record) => record.id === action.plan_item_id);
    const plan = item ? state.plans.find((record) => record.id === item.plan_id) : null;
    return {
      Plan: plan?.plan_title || "",
      "Plan Item": item?.category || "",
      "Checked By": rawPersonName(action.checked_by),
      "Action Owner": rawPersonName(action.action_owner),
      "Date Checked": action.date_checked,
      "Target Completion": action.target_completion_date,
      "Completion Date": action.completion_date,
      Status: action.action_status,
      "NOT COMPLIANT": action.not_compliant_observation,
      "CORRECTIVE ACTION": action.corrective_action,
      REMARKS: action.remarks,
      "PREVENTIVE ACTION": action.preventive_action
    };
  });
  downloadCsv("action-taken-records", rows);
}

function exportDoCsv() {
  const rows = state.doRecords.map((record) => ({
    "Plan Item": planItemName(record.plan_item_id),
    "Performed By": rawPersonName(record.performed_by),
    "Date Performed": record.date_performed,
    "Activity Done": record.activity_done,
    "Output Result": record.output_result,
    Remarks: record.remarks
  }));
  downloadCsv("do-records", rows);
}

function exportCheckCsv() {
  const rows = state.checkRecords.map((record) => ({
    "Plan Item": planItemName(record.plan_item_id),
    "Checked By": rawPersonName(record.checked_by),
    "Date Checked": record.date_checked,
    Result: record.check_result,
    Observation: record.observation,
    Evidence: record.evidence,
    Remarks: record.remarks
  }));
  downloadCsv("check-records", rows);
}

function printPersonnelReport() {
  const rows = state.personnel.map((person) => [
    person.full_name,
    person.position,
    person.role,
    formatDateTime(person.created_at)
  ]);
  printReport("Personnel Management", ["Full Name", "Position", "Role", "Created At"], rows);
}

function printSopReport() {
  const rows = state.standardOperatingProcedures.map((sop) => [
    sop.sop_code,
    sop.title,
    departmentNameRaw(sop.department_id) || sop.department || "All departments",
    sop.category || "General",
    sop.version || "1.0",
    formattedRoleLabel(sop.status || "draft"),
    formatDate(sop.review_date),
    peopleNameRaw(sop.owner_person_id)
  ]);
  printReport("Standard Operating Procedures", ["Code", "Title", "Department", "Category", "Version", "Status", "Review Date", "Owner"], rows);
}

function openSopSummaryReportModal(sopId = "") {
  if (!canViewSops()) {
    showToast("You do not have access to SOP records.", "error");
    return;
  }
  if (!state.standardOperatingProcedures.length) {
    showToast("Create an SOP first before generating a summary report.", "error");
    return;
  }

  const today = new Date();
  const periodStart = toDateInputValue(new Date(today.getFullYear(), today.getMonth(), 1));
  const periodEnd = toDateInputValue(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  const selectedSop = state.standardOperatingProcedures.find((item) => item.id === sopId) || state.standardOperatingProcedures[0];
  const defaults = sopSummaryDefaults(selectedSop);

  openModal({
    title: "Generate SOP Summary Report",
    mode: "sop_summary_report_generator",
    editingId: null,
    fields: [
      `<div class="form-note">
        <strong>SOP Summary Report</strong>
        <span>Department, workspace, owner, and approval details are pulled from the selected SOP. Choose only the report period, then fill any missing signatory if needed.</span>
      </div>`,
      selectField("sop_id", "SOP", sopOptions(), selectedSop?.id || sopId, true),
      hiddenField("department_id", defaults.departmentId),
      hiddenField("workspace_id", defaults.workspaceId),
      inputField("department_display", "Department", "text", defaults.departmentLabel, false, { readonly: "readonly" }),
      inputField("workspace_display", "Workspace / Product Line", "text", defaults.workspaceLabel, false, { readonly: "readonly" }),
      inputField("period_start", "Period Start", "date", periodStart, true),
      inputField("period_end", "Period End", "date", periodEnd, true),
      selectField("prepared_by", "Prepared By", peopleOptions(), defaults.preparedBy, false),
      selectField("reviewed_by", "Reviewed By", peopleOptions(), defaults.reviewedBy, false),
      selectField("approved_by", "Approved By", peopleOptions(), defaults.approvedBy, false)
    ]
  });
  const submitButton = elements.modalForm.querySelector('.form-actions .primary-btn');
  if (submitButton) submitButton.textContent = "Generate Report";
  applySopSummaryDefaults(selectedSop?.id || sopId);
}

function sopSummaryDefaults(sop = {}) {
  const departmentId = sop?.department_id || "";
  const workspaceId = sop?.workspace_id || "";
  return {
    departmentId,
    workspaceId,
    departmentLabel: departmentNameRaw(departmentId) || sop?.department || "All departments",
    workspaceLabel: productLineNameRaw(workspaceId) || "All workspaces",
    preparedBy: sop?.owner_person_id || "",
    reviewedBy: sop?.owner_person_id || "",
    approvedBy: sop?.approved_by || ""
  };
}

function applySopSummaryDefaults(sopId) {
  const form = elements.modalForm;
  const sop = state.standardOperatingProcedures.find((item) => item.id === sopId);
  if (!form || !sop) return;
  const defaults = sopSummaryDefaults(sop);
  if (form.elements.department_id) form.elements.department_id.value = defaults.departmentId;
  if (form.elements.workspace_id) form.elements.workspace_id.value = defaults.workspaceId;
  if (form.elements.department_display) form.elements.department_display.value = defaults.departmentLabel;
  if (form.elements.workspace_display) form.elements.workspace_display.value = defaults.workspaceLabel;
  if (form.elements.prepared_by) form.elements.prepared_by.value = defaults.preparedBy;
  if (form.elements.reviewed_by) form.elements.reviewed_by.value = defaults.reviewedBy;
  if (form.elements.approved_by) form.elements.approved_by.value = defaults.approvedBy;
}

function openSopSummaryReportHistoryModal(id) {
  if (!canManageSops()) {
    showToast("Your role cannot edit SOP summary reports.", "error");
    return;
  }
  const report = state.sopSummaryReports.find((item) => item.id === id);
  if (!report) {
    showToast("SOP Summary Report record was not found.", "error");
    return;
  }
  const sop = state.standardOperatingProcedures.find((item) => item.id === report.sop_id);
  const defaults = sopSummaryDefaults(sop || {});
  openModal({
    title: "Edit SOP Summary Report",
    mode: "sop_summary_reports",
    editingId: id,
    fields: [
      `<div class="form-note">
        <strong>Report Metadata Only</strong>
        <span>Editing this changes the saved report record. DO, CHECK, and ACT details still come from their source records when printed.</span>
      </div>`,
      selectField("sop_id", "SOP", sopOptions(), report.sop_id, true),
      hiddenField("department_id", report.department_id || defaults.departmentId),
      hiddenField("workspace_id", report.workspace_id || defaults.workspaceId),
      inputField("department_display", "Department", "text", departmentNameRaw(report.department_id) || defaults.departmentLabel, false, { readonly: "readonly" }),
      inputField("workspace_display", "Workspace / Product Line", "text", productLineNameRaw(report.workspace_id) || defaults.workspaceLabel, false, { readonly: "readonly" }),
      inputField("period_start", "Period Start", "date", report.period_start, true),
      inputField("period_end", "Period End", "date", report.period_end, true),
      selectField("prepared_by", "Prepared By", peopleOptions(), report.prepared_by || defaults.preparedBy, false),
      selectField("reviewed_by", "Reviewed By", peopleOptions(), report.reviewed_by || defaults.reviewedBy, false),
      selectField("approved_by", "Approved By", peopleOptions(), report.approved_by || defaults.approvedBy, false),
      selectField("report_status", "Report Status", sopSummaryReportStatusOptions(), report.report_status || "generated", true)
    ]
  });
  const submitButton = elements.modalForm.querySelector('.form-actions .primary-btn');
  if (submitButton) submitButton.textContent = "Save Report";
}

async function handleSopSummaryReportSubmit(form) {
  const payload = Object.fromEntries(new FormData(form).entries());
  if (!payload.sop_id || !payload.period_start || !payload.period_end) {
    showToast("Select an SOP and reporting period.", "error");
    return;
  }
  if (payload.period_end < payload.period_start) {
    showToast("Period end cannot be earlier than period start.", "error");
    return;
  }

  setLoading(true);
  try {
    await refreshSopReportSourceData();
    const report = buildSopSummaryReportData(payload);
    if (!report.sop) {
      showToast("Selected SOP was not found.", "error");
      return;
    }

    const reportPayload = {
      sop_id: payload.sop_id,
      department_id: payload.department_id || report.sop.department_id || null,
      workspace_id: payload.workspace_id || report.sop.workspace_id || null,
      period_start: payload.period_start,
      period_end: payload.period_end,
      prepared_by: payload.prepared_by || null,
      reviewed_by: payload.reviewed_by || null,
      approved_by: payload.approved_by || null,
      report_status: "generated",
      total_activities: report.summary.totalActivities,
      completed_activities: report.summary.completedActivities,
      checked_activities: report.summary.checkedActivities,
      passed_checks: report.summary.passedChecks,
      failed_checks: report.summary.failedChecks,
      non_compliant_activities: report.summary.nonCompliantActivities,
      open_corrective_actions: report.summary.openCorrectiveActions,
      closed_corrective_actions: report.summary.closedCorrectiveActions,
      compliance_percentage: report.summary.compliancePercentage,
      summary_snapshot: report.snapshot
    };

    const { data: savedReport, error } = await db.from("sop_summary_reports").insert(reportPayload).select("*").single();
    if (error) {
      showToast(`Opening print dialog. Report history was not saved: ${error.message}`, "error");
    } else {
      report.reportRecordId = savedReport?.id || "";
      report.reportStatus = savedReport?.report_status || report.reportStatus;
      report.generatedAt = savedReport?.generated_at || report.generatedAt;
      showToast("SOP Summary Report generated from current Supabase records. Choose Save as PDF in the print dialog.", "success");
    }

    closeModal();
    printSopSummaryReport(report);
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function refreshSopReportSourceData() {
  const [
    companySettings,
    peopleProfiles,
    departments,
    productLines,
    plans,
    planItems,
    scheduleTemplates,
    generatedTasks,
    taskDoRecords,
    taskCheckRecords,
    actionCases,
    approvalRequests,
    standardOperatingProcedures,
    sopMonitoringLinks
  ] = await Promise.all([
    fetchTable("company_settings", "created_at", true),
    fetchTable("people_profiles", "created_at", true),
    fetchTable("departments", "department_name", false),
    fetchTable("product_lines", "created_at", true),
    fetchTable("plans", "created_at", true),
    fetchTable("plan_items", "created_at", true),
    fetchTable("monitoring_schedule_templates", "created_at", true),
    fetchTable("generated_tasks", "created_at", true),
    fetchTable("task_do_records", "created_at", true),
    fetchTable("task_check_records", "created_at", true),
    fetchTable("action_cases", "created_at", true),
    fetchTable("approval_requests", "created_at", true),
    fetchTable("standard_operating_procedures", "created_at", true),
    fetchTable("sop_monitoring_links", "created_at", true)
  ]);

  state.companySettings = companySettings[0] || {};
  state.peopleProfiles = peopleProfiles;
  state.departments = departments;
  state.productLines = productLines;
  state.plans = plans;
  state.planItems = planItems;
  state.scheduleTemplates = scheduleTemplates;
  state.generatedTasks = generatedTasks;
  state.taskDoRecords = taskDoRecords;
  state.taskCheckRecords = taskCheckRecords;
  state.actionCases = actionCases;
  state.approvalRequests = approvalRequests;
  state.standardOperatingProcedures = standardOperatingProcedures;
  state.sopMonitoringLinks = sopMonitoringLinks;
}

function buildSopSummaryReportData(payload) {
  const sop = state.standardOperatingProcedures.find((item) => item.id === payload.sop_id);
  if (!sop) return { sop: null };

  const periodStart = payload.period_start;
  const periodEnd = payload.period_end;
  const selectedDepartment = payload.department_id || sop.department_id || "";
  const selectedWorkspace = payload.workspace_id || sop.workspace_id || "";
  const linkedTemplateIds = uniqueLabels([
    ...state.sopMonitoringLinks.filter((link) => link.sop_id === sop.id).map((link) => link.template_id),
    sop.workflow_template_id
  ].filter(Boolean));
  const taskInPeriod = (task) => {
    const value = dateKey(task.task_date || task.due_at || task.created_at);
    return value && value >= periodStart && value <= periodEnd;
  };
  const tasks = state.generatedTasks
    .filter((task) => (
      task.sop_id === sop.id
      || task.id === sop.task_id
      || (linkedTemplateIds.length && linkedTemplateIds.includes(task.template_id))
      || (selectedWorkspace && taskWorkspaceId(task) === selectedWorkspace)
      || (sop.plan_id && task.plan_id === sop.plan_id)
      || (sop.plan_item_id && task.plan_item_id === sop.plan_item_id)
      || (sop.plan_id && planItemForTask(task)?.plan_id === sop.plan_id)
    ))
    .filter((task) => !selectedWorkspace || taskWorkspaceId(task) === selectedWorkspace || task.id === sop.task_id || task.sop_id === sop.id)
    .filter(taskInPeriod);
  const taskIds = new Set(tasks.map((task) => task.id));
  if (sop.task_id) taskIds.add(sop.task_id);

  const doRecords = state.taskDoRecords
    .filter((record) => taskIds.has(record.task_id))
    .filter((record) => dateKey(record.performed_at || record.created_at) >= periodStart && dateKey(record.performed_at || record.created_at) <= periodEnd);
  const checkRecords = state.taskCheckRecords
    .filter((record) => taskIds.has(record.task_id))
    .filter((record) => dateKey(record.checked_at || record.created_at) >= periodStart && dateKey(record.checked_at || record.created_at) <= periodEnd);
  const checkIds = new Set(checkRecords.map((record) => record.id));
  const actionCases = state.actionCases
    .filter((item) => taskIds.has(item.task_id) || checkIds.has(item.check_record_id))
    .filter((item) => {
      const value = dateKey(item.created_at || item.due_at);
      return !value || (value >= periodStart && value <= periodEnd);
    });
  const templates = state.scheduleTemplates.filter((template) => linkedTemplateIds.includes(template.id));
  const completedTaskIds = new Set([
    ...doRecords.map((record) => record.task_id),
    ...tasks.filter((task) => ["completed", "checked"].includes(taskDisplayStatus(task))).map((task) => task.id)
  ].filter(Boolean));
  const nonCompliantTaskIds = new Set([
    ...checkRecords.filter((record) => record.check_result === "not_compliant").map((record) => record.task_id),
    ...actionCases.filter((item) => !["resolved", "verified", "closed"].includes(item.case_status)).map((item) => item.task_id)
  ].filter(Boolean));
  const completedActivities = completedTaskIds.size;
  const nonCompliantActivities = nonCompliantTaskIds.size;
  const closedCorrectiveActions = actionCases.filter((item) => ["resolved", "verified", "closed"].includes(item.case_status)).length;
  const openCorrectiveActions = Math.max(actionCases.length - closedCorrectiveActions, 0);
  const totalActivities = Math.max(tasks.length, doRecords.length, checkRecords.length, templates.length);
  const compliancePercentage = totalActivities ? Math.max(0, Math.round(((totalActivities - nonCompliantActivities) / totalActivities) * 10000) / 100) : 0;
  const traceabilityRows = tasks.map((task) => ({
    task,
    plan: planForTask(task) || sopPlan(sop),
    planItem: planItemForTask(task) || sopPlanItem(sop),
    workspace: state.productLines.find((item) => item.id === taskWorkspaceId(task)) || null,
    sop: sopForTask(task) || sop,
    doRecords: doRecords.filter((record) => record.task_id === task.id),
    checkRecords: checkRecords.filter((record) => record.task_id === task.id),
    actionCases: actionCases.filter((record) => record.task_id === task.id),
    complianceStatus: taskComplianceStatus(task)
  }));

  const summary = {
    totalActivities,
    completedActivities,
    checkedActivities: checkRecords.length,
    passedChecks: checkRecords.filter((record) => record.check_result === "passed").length,
    failedChecks: checkRecords.filter((record) => ["not_compliant", "needs_follow_up", "failed"].includes(record.check_result)).length,
    nonCompliantActivities,
    openCorrectiveActions,
    closedCorrectiveActions,
    compliancePercentage
  };

  return {
    sop,
    periodStart,
    periodEnd,
    departmentId: selectedDepartment,
    workspaceId: selectedWorkspace,
    preparedBy: payload.prepared_by,
    reviewedBy: payload.reviewed_by,
    approvedBy: payload.approved_by,
    reportRecordId: payload.report_id || "",
    reportStatus: payload.report_status || "generated",
    generatedAt: payload.generated_at || new Date().toISOString(),
    templates,
    tasks,
    traceabilityRows,
    doRecords,
    checkRecords,
    actionCases,
    summary,
    snapshot: {
      sop_code: sop.sop_code,
      sop_title: sop.title,
      department: departmentNameRaw(selectedDepartment) || sop.department || "",
      workspace: productLineNameRaw(selectedWorkspace),
      period_start: periodStart,
      period_end: periodEnd,
      traceability: traceabilityRows.map((row) => ({
        plan: row.plan?.plan_title || "",
        plan_item: row.planItem?.category || row.planItem?.objective || "",
        workspace: row.workspace?.product_name || "",
        task: row.task?.task_title || "",
        sop: row.sop ? sopDisplayName(row.sop) : "",
        compliance_status: row.complianceStatus
      })),
      generated_at: payload.generated_at || new Date().toISOString(),
      summary
    }
  };
}

function printSopSummaryReport(report) {
  const company = state.companySettings || {};
  const sop = report.sop;
  const approvalInfo = sopSummaryApprovalInfo(report);
  const productLine = productLineNameRaw(report.workspaceId) || "All workspaces";
  const department = departmentNameRaw(report.departmentId) || sop.department || "All departments";
  const docCode = `${sop.sop_code || "SOP"}-SUMMARY`;
  const effectivityDate = formatReportDate(sop.effective_date, "Not set");
  const generatedDate = formatReportDateTime(report.generatedAt, "Not generated");
  printHtmlReport("SOP Summary Report", `
    <section class="sop-summary-document">
      <table class="document-control-table">
        <tbody>
          <tr>
            <td class="document-logo-cell" rowspan="4">
              ${company.logo_url ? `<img src="${escapeAttribute(company.logo_url)}" alt="">` : `<strong class="document-logo-text">${escapeHtml(company.company_name || "PDCA")}</strong>`}
            </td>
            <td class="document-company-cell" rowspan="4">
              <strong>${escapeHtml(company.company_name || "PDCA System")}</strong>
              ${company.system_name ? `<span>operating under the system of</span><span>${escapeHtml(company.system_name)}</span>` : ""}
              ${company.address ? `<span>${escapeHtml(company.address)}</span>` : ""}
              ${company.contact_number || company.email ? `<span>${escapeHtml([company.contact_number, company.email].filter(Boolean).join(" | "))}</span>` : ""}
              <b>SOP SUMMARY REPORT</b>
            </td>
            <th>Document Code:</th>
            <td>${escapeHtml(docCode)}</td>
            <th>Effectivity Date</th>
          </tr>
          <tr>
            <th>Revision No.</th>
            <td>${escapeHtml(sop.version || "1.0")}</td>
            <td>${escapeHtml(effectivityDate)}</td>
          </tr>
          <tr>
            <th>Document Title:</th>
            <td>${escapeHtml("SOP Summary Report")}</td>
            <td>Auto-paginated</td>
          </tr>
          <tr>
            <th>SOP Reference:</th>
            <td colspan="2">${escapeHtml(`${sop.sop_code || "No code"} - ${sop.title || "Untitled SOP"}`)}</td>
          </tr>
        </tbody>
      </table>

      <div class="report-period-block">
        <p><strong>Period Covered:</strong> ${escapeHtml(`${formatReportDate(report.periodStart)} to ${formatReportDate(report.periodEnd)}`)}</p>
        <p><strong>Product Lines:</strong> ${escapeHtml(productLine)}</p>
        <p><strong>Department:</strong> ${escapeHtml(department)}</p>
        <p><strong>Report Generated:</strong> ${escapeHtml(generatedDate)}</p>
      </div>

      ${buildSopApprovalPrintSection(report, approvalInfo)}

      ${buildSopTraceabilityPrintSection(report)}

      ${buildSopSummaryPrintSections(report)}

      ${buildSopExecutiveSummary(report)}

      ${buildSopComplianceConclusion(report)}
    </section>
  `, "sop-summary-print");
}

function sopSummaryApprovalInfo(report) {
  const relatedIds = [report.reportRecordId, report.sop?.id].filter(Boolean);
  const requests = state.approvalRequests.filter((request) => (
    (request.related_table === "sop_summary_reports" && relatedIds.includes(request.related_record_id))
    || (request.related_table === "standard_operating_procedures" && request.related_record_id === report.sop?.id)
  ));
  const latest = requests.sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")))[0];
  const approvedRequest = requests.find((request) => request.approval_status === "approved" && request.decided_at);
  const statusValue = latest?.approval_status || report.reportStatus || "generated";
  const approvalStatus = sopApprovalStatusLabel(statusValue, Boolean(approvedRequest || report.sop?.approved_at));
  const approvalDate = approvedRequest?.decided_at
    || (approvalStatus === "Approved" ? report.sop?.approved_at : "")
    || "";

  return {
    approvalStatus,
    approvalDate: formatReportDateTime(approvalDate, "Not yet approved"),
    approver: peopleNameRaw(latest?.approver_person_id) || peopleNameRaw(report.approvedBy) || peopleNameRaw(report.sop?.approved_by) || "Not assigned",
    reviewStatus: sopReviewStatusLabel(report.reportStatus, latest?.approval_status),
    approvalNote: latest?.approval_note || "",
    requestNote: latest?.request_note || "",
    requestCount: requests.length,
    approvedRequest
  };
}

function sopApprovalStatusLabel(status, hasApprovedDate = false) {
  const value = String(status || "").toLowerCase();
  if (value === "approved" || hasApprovedDate) return "Approved";
  if (value === "rejected") return "Rejected";
  if (value === "cancelled" || value === "canceled") return "Cancelled";
  if (value === "pending") return "Pending Approval";
  if (value === "reviewed") return "Reviewed";
  if (value === "draft") return "Draft";
  return "Pending Review";
}

function sopReviewStatusLabel(reportStatus, approvalStatus) {
  const reportValue = String(reportStatus || "").toLowerCase();
  const approvalValue = String(approvalStatus || "").toLowerCase();
  if (approvalValue === "approved" || reportValue === "approved") return "Approved";
  if (approvalValue === "rejected") return "Rejected";
  if (approvalValue === "pending") return "Pending Approval";
  if (reportValue === "reviewed") return "Reviewed";
  if (reportValue === "draft") return "Draft";
  return "Pending Review";
}

function buildSopApprovalPrintSection(report, approvalInfo) {
  const approvalRows = sopApprovalRoleRows(report, approvalInfo);
  return `
    <section class="approval-print-section compliance-summary">
      <h2>Approval and Review Control</h2>
      <table class="print-standard-table approval-print-table">
        <thead>
          <tr>
            <th>Responsibility</th>
            <th>Name / Position</th>
            <th>Status / Date</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${approvalRows.map((row) => `
            <tr>
              <th>${escapeHtml(row.roles.join(" and "))}</th>
              <td>${printDetailList([row.name, row.position])}</td>
              <td>${printDetailList(row.statusLines)}</td>
              <td>${escapeHtml(row.notes || "No notes recorded")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function sopApprovalRoleRows(report, approvalInfo) {
  const generatedDate = formatReportDateTime(report.generatedAt, "Not generated");
  const roles = [
    {
      role: "Prepared By",
      personId: report.preparedBy || report.sop?.owner_person_id || "",
      fallback: peopleNameRaw(report.preparedBy) || peopleNameRaw(report.sop?.owner_person_id) || "Not assigned",
      statusLines: [`Date: ${generatedDate}`],
      notes: "Report preparation record"
    },
    {
      role: "Reviewed By",
      personId: report.reviewedBy || "",
      fallback: peopleNameRaw(report.reviewedBy) || "Not assigned",
      statusLines: [`Status: ${approvalInfo.reviewStatus}`],
      notes: approvalInfo.requestNote || "Review status from approval workflow"
    },
    {
      role: "Approved By",
      personId: report.approvedBy || report.sop?.approved_by || "",
      fallback: approvalInfo.approver || "Not assigned",
      statusLines: [`Status: ${approvalInfo.approvalStatus}`, `Date: ${approvalInfo.approvalDate}`],
      notes: approvalInfo.approvalNote || approvalInfo.requestNote || "Approval status from approval workflow"
    }
  ];
  const grouped = new Map();
  roles.forEach((item) => {
    const key = item.personId || `${item.role}:${item.fallback}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        roles: [],
        name: item.fallback,
        position: peoplePosition(item.personId) || "",
        statusLines: [],
        notes: []
      });
    }
    const record = grouped.get(key);
    record.roles.push(item.role.replace(" By", ""));
    record.statusLines.push(...item.statusLines);
    if (item.notes) record.notes.push(item.notes);
  });
  return Array.from(grouped.values()).map((item) => ({
    ...item,
    notes: uniqueLabels(item.notes).join(" | ")
  }));
}

function buildSopExecutiveSummary(report) {
  const status = !report.summary.checkedActivities
    ? "Pending Verification"
    : report.summary.nonCompliantActivities > 0 || report.summary.failedChecks > 0
    ? "Non-Compliant"
    : "Compliant";
  return `
    <section class="sop-executive-summary">
      <h2>Executive Compliance Summary</h2>
      <div class="sop-summary-cards">
        <article class="${status === "Non-Compliant" ? "is-alert" : status === "Compliant" ? "is-good" : "is-pending"}">
          <span>Overall Compliance</span>
          <strong>${escapeHtml(`${report.summary.compliancePercentage}%`)}</strong>
          <em>${escapeHtml(status)}</em>
        </article>
        <article><span>Overall Status</span><strong>${escapeHtml(status)}</strong><em>Based on verification records</em></article>
        <article><span>Monitoring Activities</span><strong>${report.summary.totalActivities}</strong><em>Total in period</em></article>
        <article><span>Passed</span><strong>${report.summary.passedChecks}</strong><em>Verified compliant</em></article>
        <article><span>Failed / Follow-Up</span><strong>${report.summary.failedChecks}</strong><em>Requires attention</em></article>
        <article><span>Corrective Actions Open</span><strong>${report.summary.openCorrectiveActions}</strong><em>Action center</em></article>
        <article><span>Corrective Actions Closed</span><strong>${report.summary.closedCorrectiveActions}</strong><em>Resolved / verified</em></article>
      </div>
    </section>
  `;
}

function buildSopComplianceConclusion(report) {
  const status = !report.summary.checkedActivities
    ? "Pending Verification"
    : report.summary.nonCompliantActivities > 0 || report.summary.failedChecks > 0
    ? "Non-Compliant"
    : "Compliant";
  const openActions = report.summary.openCorrectiveActions;
  const failedChecks = report.summary.failedChecks;
  const reasons = [
    !report.summary.checkedActivities ? "No verification record has been completed for the selected reporting period." : "",
    failedChecks ? `${failedChecks} failed or follow-up verification record${failedChecks === 1 ? "" : "s"} identified.` : "",
    openActions ? `${openActions} corrective action case${openActions === 1 ? "" : "s"} remain open.` : "",
    report.summary.checkedActivities && !failedChecks && !openActions ? "All completed verification records were compliant for the selected reporting period." : ""
  ].filter(Boolean);
  const recommendation = status === "Compliant"
    ? "Maintain the current SOP implementation and continue scheduled monitoring."
    : status === "Pending Verification"
    ? "Complete supervisor verification before closing the monitoring period."
    : openActions
    ? "Complete corrective actions, verify effectiveness, and close the action cases before final closure."
    : "Review failed findings and document corrective or preventive action before closing the monitoring period.";
  return `
    <section class="sop-conclusion">
      <h2>SOP Compliance Conclusion</h2>
      <table class="print-standard-table sop-conclusion-table">
        <tbody>
          <tr>
            <th>Status</th>
            <td>${escapeHtml(status)}</td>
            <th>Open Corrective Actions</th>
            <td>${escapeHtml(String(openActions))}</td>
          </tr>
          <tr>
            <th>Reason</th>
            <td colspan="3">${printDetailList(reasons)}</td>
          </tr>
          <tr>
            <th>Recommendation</th>
            <td colspan="3">${escapeHtml(recommendation)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `;
}

function buildSopTraceabilityPrintSection(report) {
  const rows = report.traceabilityRows?.length
    ? report.traceabilityRows.map((row) => {
      const template = templateForTask(row.task);
      const plan = row.plan || planForTemplate(template) || sopPlan(row.sop || report.sop);
      const planItemTitle = row.planItem?.category || row.planItem?.objective || template?.template_title || "";
      const objective = row.planItem?.objective || template?.objective || row.task?.task_title || "";
      const targetStandard = row.planItem?.target_standard || template?.target_standard || "";
      const expectedOutput = row.planItem?.expected_output || template?.expected_output || "";
      const frequency = row.planItem?.frequency || template?.frequency || "";
      return `
      <tr>
        <td>${printDetailList([
          plan?.plan_title ? `Plan Name: ${plan.plan_title}` : "Plan Name: No linked plan record",
          plan?.description ? `Plan Description: ${plan.description}` : "",
          plan ? `Plan Period: ${formatPeriod(plan.period_month, plan.period_year)}` : "",
          plan?.status ? `Plan Status: ${formattedRoleLabel(plan.status)}` : "",
          planItemTitle ? `Plan Item / Template: ${planItemTitle}` : "Plan Item / Template: No linked record",
          objective ? `Objective: ${objective}` : "",
          targetStandard ? `Target Standard: ${targetStandard}` : "",
          expectedOutput ? `Expected Output: ${expectedOutput}` : "",
          frequency ? `Frequency: ${frequency}` : ""
        ])}</td>
        <td>${printDetailList([
          row.workspace?.product_name ? `Workspace: ${row.workspace.product_name}` : "Workspace: No linked workspace",
          row.task?.task_title ? `Task: ${row.task.task_title}` : "Task: No linked task",
          row.task?.assigned_person_id ? `Assigned: ${peopleNameRaw(row.task.assigned_person_id)}` : "",
          row.task?.task_date ? `Schedule: ${formatReportDate(row.task.task_date)} ${row.task.due_time || ""}` : "",
          row.task?.priority ? `Priority: ${formattedRoleLabel(row.task.priority)}` : "",
          `Status: ${formattedRoleLabel(taskDisplayStatus(row.task))}`
        ])}</td>
        <td>${printDetailList([
          row.sop ? `${row.sop.sop_code || "SOP"} - ${row.sop.title || "Untitled SOP"}` : "No linked SOP",
          row.sop?.version ? `Version: ${row.sop.version}` : "",
          row.sop?.effective_date ? `Effective: ${formatReportDate(row.sop.effective_date)}` : "",
          row.sop?.review_date ? `Review: ${formatReportDate(row.sop.review_date)}` : ""
        ])}</td>
        <td>${printDetailList([
          `Execution Records: ${row.doRecords.length}`,
          `Verification Records: ${row.checkRecords.length}`,
          `Corrective Actions: ${row.actionCases.length}`,
          `Compliance Status: ${formattedRoleLabel(row.complianceStatus)}`
        ])}</td>
      </tr>
    `;
    }).join("")
    : '<tr><td colspan="4">No linked workspace tasks found for this SOP and period.</td></tr>';

  return `
    <section class="traceability-print-section">
      <h2>Planning to SOP Traceability</h2>
      <table class="print-standard-table traceability-print-table">
        <thead>
          <tr>
            <th>Plan / Plan Item</th>
            <th>Workspace / Task</th>
            <th>SOP</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

async function printSavedSopSummaryReport(reportId) {
  setLoading(true);
  try {
    await refreshSopReportSourceData();
  } catch (error) {
    showToast(error.message, "error");
    setLoading(false);
    return;
  }
  setLoading(false);

  const savedReport = state.sopSummaryReports.find((item) => item.id === reportId);
  if (!savedReport) {
    showToast("SOP Summary Report record was not found.", "error");
    return;
  }
  const report = buildSopSummaryReportData({
    sop_id: savedReport.sop_id,
    department_id: savedReport.department_id || "",
    workspace_id: savedReport.workspace_id || "",
    period_start: savedReport.period_start,
    period_end: savedReport.period_end,
    prepared_by: savedReport.prepared_by || "",
    reviewed_by: savedReport.reviewed_by || "",
    approved_by: savedReport.approved_by || "",
    report_id: savedReport.id,
    report_status: savedReport.report_status || "generated",
    generated_at: savedReport.generated_at || savedReport.created_at || ""
  });
  if (!report.sop) {
    showToast("The SOP linked to this report no longer exists.", "error");
    return;
  }
  printSopSummaryReport(report);
}

function buildSopSummaryPrintSections(report) {
  const sections = report.templates.length
    ? report.templates
    : [{ id: "", template_title: report.sop?.title || report.sop?.sop_code || "SOP", frequency: "", product_line_id: report.workspaceId }];

  return sections.map((template, index) => {
    const tasks = report.tasks.filter((task) => !template.id || task.template_id === template.id);
    const taskIds = new Set(tasks.map((task) => task.id));
    const doRecords = report.doRecords.filter((record) => !template.id || taskIds.has(record.task_id));
    const checkRecords = report.checkRecords.filter((record) => !template.id || taskIds.has(record.task_id));
    const actionCases = report.actionCases.filter((record) => !template.id || taskIds.has(record.task_id));
    const personnel = uniqueLabels([
      ...tasks.map((task) => peopleNameRaw(task.assigned_person_id)),
      ...doRecords.map((record) => peopleNameRaw(record.performed_by))
    ].filter(Boolean)).join(", ") || "Not assigned";
    const rows = tasks.length
      ? tasks.map((task, taskIndex) => {
        const taskDoRecords = doRecords.filter((record) => record.task_id === task.id);
        const records = taskDoRecords.length ? taskDoRecords : [null];
        return records.map((record, recordIndex) => buildSopActivityBlock(task, record, checkRecords, actionCases, report.sop, taskIndex + 1, recordIndex + 1)).join("");
      }).join("")
      : '<div class="sop-empty-record">No linked task records found for this SOP and period.</div>';

    return `
      <section class="monitoring-report-section">
        <h2>${index + 1}. ${escapeHtml(template.template_title || template.category || "Monitoring Activity")}</h2>
        ${template.frequency ? `<p><strong>Frequency:</strong> ${escapeHtml(template.frequency)}</p>` : ""}
        <p><strong>Personnel:</strong> ${escapeHtml(personnel)}</p>
        <div class="sop-record-list">${rows}</div>
      </section>
    `;
  }).join("");
}

function buildSopActivityBlock(task, doRecord, checkRecords, actionCases, reportSop, taskNumber, recordNumber) {
  const check = doRecord
    ? checkRecords.find((item) => item.do_record_id === doRecord.id || item.task_id === task.id)
    : checkRecords.find((item) => item.task_id === task.id);
  const relatedActions = actionCases.filter((item) => item.task_id === task.id || item.check_record_id === check?.id);
  const activityDate = doRecord?.performed_at || task.task_date || task.due_at || task.created_at;
  const template = templateForTask(task);
  const plan = planForTask(task) || planForTemplate(template) || sopPlan(reportSop);
  const planItem = planItemForTask(task) || sopPlanItem(reportSop);
  const workspace = state.productLines.find((item) => item.id === taskWorkspaceId(task)) || null;
  const sop = sopForTask(task) || reportSop;
  const activityName = planItem?.objective || planItem?.category || template?.template_title || task.task_title || "Monitoring activity";
  const targetStandard = planItem?.target_standard || template?.target_standard || "No target standard recorded";
  const expectedOutput = planItem?.expected_output || template?.expected_output || "No expected output recorded";
  const frequency = planItem?.frequency || template?.frequency || "No frequency recorded";

  return `
    <article class="sop-record-card">
      <header class="sop-record-header">
        <strong>Monitoring Record ${escapeHtml(`${taskNumber}.${recordNumber}`)} - ${escapeHtml(activityName)}</strong>
        <span>${escapeHtml(sopReportResultLabel(check))}</span>
      </header>

      <table class="print-standard-table sop-record-meta">
        <tbody>
          <tr>
            <th>Plan</th>
            <td>${escapeHtml(plan?.plan_title || "No linked plan record")}</td>
            <th>Plan Item / Template</th>
            <td>${escapeHtml(activityName)}</td>
          </tr>
          <tr>
            <th>Workspace</th>
            <td>${escapeHtml(workspace?.product_name || "No linked workspace")}</td>
            <th>SOP</th>
            <td>${escapeHtml(sop ? sopDisplayName(sop) : "No linked SOP")}</td>
          </tr>
          <tr>
            <th>Task</th>
            <td>${escapeHtml(task.task_title || "No task title available")}</td>
            <th>Schedule</th>
            <td>${escapeHtml([activityDate ? formatReportDateTime(activityDate) : "", task.due_time ? `Due ${task.due_time}` : ""].filter(Boolean).join(" | ") || "Not scheduled")}</td>
          </tr>
          <tr>
            <th>Assigned Personnel</th>
            <td>${escapeHtml(peopleNameRaw(task.assigned_person_id) || "Not assigned")}</td>
            <th>Task Status</th>
            <td>${escapeHtml(formattedRoleLabel(taskDisplayStatus(task)))}</td>
          </tr>
          <tr>
            <th>Target Standard</th>
            <td>${escapeHtml(targetStandard)}</td>
            <th>Expected Output</th>
            <td>${escapeHtml(expectedOutput)}</td>
          </tr>
          <tr>
            <th>Frequency</th>
            <td>${escapeHtml(frequency)}</td>
            <th>Priority</th>
            <td>${escapeHtml(formattedRoleLabel(task.priority || "normal"))}</td>
          </tr>
        </tbody>
      </table>

      <div class="sop-pdca-grid">
        <section class="monitoring-record">
          <h3>Monitoring Activity</h3>
          ${printDetailList([
            plan?.plan_title ? `Plan: ${plan.plan_title}` : "Plan: No linked plan",
            plan?.description ? `Purpose: ${plan.description}` : "",
            `Activity: ${activityName}`,
            targetStandard ? `Target standard: ${targetStandard}` : "",
            expectedOutput ? `Expected output: ${expectedOutput}` : "",
            workspace?.product_name ? `Where: ${workspace.product_name}` : "Where: Workspace not linked",
            sop ? `Procedure: ${sopDisplayName(sop)}` : "Procedure: SOP not linked"
          ])}
        </section>
        <section class="monitoring-record">
          <h3>Execution Summary</h3>
          ${printDetailList(sopReportDoDetails(doRecord))}
        </section>
        <section class="findings-section">
          <h3>Findings</h3>
          ${printDetailList(sopReportFindings(check, relatedActions))}
        </section>
        <section class="compliance-summary">
          <h3>Verification Result</h3>
          ${printDetailList([
            `Result: ${sopReportResultLabel(check)}`,
            ...sopReportVerificationDetails(check)
          ])}
        </section>
        <section class="corrective-action-section">
          <h3>Corrective Actions</h3>
          ${printDetailList([
            ...sopReportManagerInstructions(relatedActions),
            ...sopReportCorrectiveActions(relatedActions)
          ])}
        </section>
        <section class="preventive-action-section">
          <h3>Preventive Actions</h3>
          ${printDetailList([
            ...sopReportPreventiveActions(relatedActions)
          ])}
        </section>
      </div>
    </article>
  `;
}

function sopReportDoDetails(doRecord) {
  if (!doRecord) return ["No DO record submitted"];
  return [
    doRecord.performed_by ? `Performed by: ${peopleNameRaw(doRecord.performed_by)}` : "",
    doRecord.performed_at ? `Performed at: ${formatReportDateTime(doRecord.performed_at)}` : "",
    doRecord.work_done ? `Work done: ${doRecord.work_done}` : "",
    doRecord.output_result ? `Output result: ${doRecord.output_result}` : "",
    doRecord.remarks ? `DO remarks: ${doRecord.remarks}` : "",
    doRecord.evidence_url ? `Evidence: ${doRecord.evidence_url}` : "",
    doRecord.evidence_note ? `Evidence note: ${doRecord.evidence_note}` : ""
  ];
}

function sopReportResultLabel(checkRecord) {
  const result = String(checkRecord?.check_result || "").toLowerCase();
  if (result === "passed") return "Compliant";
  if (result === "not_compliant") return "Non-Compliant";
  if (result === "needs_follow_up") return "Needs Follow-Up";
  return "Not yet checked";
}

function sopReportFindings(checkRecord, actionRecords = []) {
  const result = String(checkRecord?.check_result || "").toLowerCase();
  const status = result === "not_compliant"
    ? "Open finding"
    : result === "needs_follow_up"
    ? "Requires follow-up"
    : result === "passed"
    ? "Closed - compliant"
    : "Pending verification";
  const impact = result === "not_compliant"
    ? "Potential SOP non-compliance requiring corrective action review."
    : result === "needs_follow_up"
    ? "Requires additional verification before closure."
    : result === "passed"
    ? "No adverse compliance impact recorded."
    : "Impact cannot be confirmed until verification is completed.";
  const values = [
    checkRecord?.observation ? `Finding: ${checkRecord.observation}` : "",
    `Impact: ${impact}`,
    checkRecord?.remarks ? `Verification remarks: ${checkRecord.remarks}` : "",
    `Finding status: ${status}`
  ].map((value) => String(value || "").trim()).filter(Boolean);
  return values.length ? values : ["No findings recorded"];
}

function sopReportManagerInstructions(actionRecords = []) {
  const values = actionRecords.flatMap((action) => [
    action.non_compliance_note ? `Non-compliance: ${action.non_compliance_note}` : "",
    action.manager_instruction ? `Manager instruction: ${action.manager_instruction}` : "",
    action.case_status ? `Case status: ${formattedRoleLabel(action.case_status)}` : "",
    action.due_at ? `Due: ${formatReportDateTime(action.due_at)}` : "",
    action.resolved_at ? `Resolved: ${formatReportDateTime(action.resolved_at)}` : ""
  ]);
  return values.some((value) => String(value || "").trim()) ? values : ["No manager instruction recorded"];
}

function sopReportCorrectiveActions(actionRecords = []) {
  const values = actionRecords.map((action) => action.corrective_action ? `Corrective action: ${action.corrective_action}` : "");
  return values.some((value) => String(value || "").trim()) ? values : ["No corrective action recorded"];
}

function sopReportPreventiveActions(actionRecords = []) {
  const values = actionRecords.map((action) => action.preventive_action ? `Preventive action: ${action.preventive_action}` : "");
  return values.some((value) => String(value || "").trim()) ? values : ["No preventive action recorded"];
}

function sopReportVerificationDetails(checkRecord) {
  if (!checkRecord) return ["Not yet verified"];
  return [
    checkRecord.checked_by ? `Checked by: ${peopleNameRaw(checkRecord.checked_by)}` : "",
    checkRecord.checked_at ? `Checked at: ${formatReportDateTime(checkRecord.checked_at)}` : "",
    checkRecord.evidence_url ? `Evidence: ${checkRecord.evidence_url}` : "",
    checkRecord.correction_due_at ? `Correction due: ${formatReportDateTime(checkRecord.correction_due_at)}` : ""
  ];
}

function printDetailLines(values = []) {
  const items = values
    .map((value) => String(value || "").trim())
    .filter(Boolean);
  if (!items.length) return "";
  return items.map((item) => `<span class="print-detail-line">${escapeHtml(item)}</span>`).join("");
}

function printDetailList(values = []) {
  const items = values
    .map((value) => String(value || "").trim())
    .filter(Boolean);
  if (!items.length) return '<p class="print-empty-line">No record available</p>';
  return `<ul class="print-detail-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function peoplePosition(id) {
  if (!id) return "";
  const person = state.peopleProfiles.find((item) => item.id === id);
  return person?.position || formattedRoleLabel(person?.operational_role || "");
}

function printPlansReport() {
  if (!state.plans.length) {
    showToast("No plans available to print.", "error");
    return;
  }

  const groups = state.plans.map((plan, index) => {
    const items = state.planItems.filter((item) => item.plan_id === plan.id);
    const itemRows = items.length
      ? items.map((item) => `
        <tr>
          <td>${escapeHtml(item.category)}</td>
          <td>${escapeHtml(item.objective)}</td>
          <td>${escapeHtml(item.target_standard)}</td>
          <td>${escapeHtml(rawPersonName(item.responsible_person))}</td>
          <td>${escapeHtml(item.frequency)}</td>
          <td>${escapeHtml(formatDate(item.start_date))}</td>
          <td>${escapeHtml(formatDate(item.due_date))}</td>
          <td>${escapeHtml(item.remarks)}</td>
        </tr>
      `).join("")
      : '<tr><td colspan="8">No plan items recorded for this plan.</td></tr>';

    return `
      <section class="print-plan-group ${index < state.plans.length - 1 ? "page-break-after" : ""}">
        <h2>${escapeHtml(plan.plan_title)}</h2>
        <table class="print-meta-table">
          <tbody>
            <tr>
              <th>Period</th>
              <td>${escapeHtml(formatPeriod(plan.period_month, plan.period_year))}</td>
              <th>Start Date</th>
              <td>${escapeHtml(formatDate(plan.start_date))}</td>
              <th>End Date</th>
              <td>${escapeHtml(formatDate(plan.end_date))}</td>
            </tr>
            <tr>
              <th>Created By</th>
              <td colspan="2">${escapeHtml(rawPersonName(plan.created_by))}</td>
              <th>Approved By</th>
              <td colspan="2">${escapeHtml(rawPersonName(plan.approved_by))}</td>
            </tr>
          </tbody>
        </table>

        <h3>Plan Items</h3>
        <table class="print-items-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Objective</th>
              <th>Target Standard</th>
              <th>Responsible</th>
              <th>Frequency</th>
              <th>Start</th>
              <th>Due</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </section>
    `;
  }).join("");

  printHtmlReport("PDCA Planning", groups, "plan-print");
}

function printActionsReport() {
  const rows = state.actions.map((action) => {
    const item = state.planItems.find((record) => record.id === action.plan_item_id);
    const plan = item ? state.plans.find((record) => record.id === item.plan_id) : null;
    return [
      plan?.plan_title || "",
      item?.category || "",
      rawPersonName(action.checked_by),
      rawPersonName(action.action_owner),
      formatDate(action.date_checked),
      formatDate(action.target_completion_date),
      formatDate(action.completion_date),
      action.action_status,
      action.not_compliant_observation,
      action.corrective_action,
      action.remarks,
      action.preventive_action
    ];
  });
  printReport(
    "Corrective Action Records",
    ["Plan", "Plan Item", "Checked By", "Owner", "Date Checked", "Target", "Completed", "Status", "NOT COMPLIANT", "CORRECTIVE ACTION", "REMARKS", "PREVENTIVE ACTION"],
    rows
  );
}

function printDoReport() {
  const rows = state.doRecords.map((record) => [
    planItemName(record.plan_item_id),
    rawPersonName(record.performed_by),
    formatDate(record.date_performed),
    record.activity_done,
    record.output_result,
    record.remarks
  ]);
  printReport("Do Records", ["Plan Item", "Performed By", "Date", "Activity Done", "Output Result", "Remarks"], rows);
}

function printCheckReport() {
  const rows = state.checkRecords.map((record) => [
    planItemName(record.plan_item_id),
    rawPersonName(record.checked_by),
    formatDate(record.date_checked),
    record.check_result,
    record.observation,
    record.evidence,
    record.remarks
  ]);
  printReport("Check Records", ["Plan Item", "Checked By", "Date", "Result", "Observation", "Evidence", "Remarks"], rows);
}

function downloadCsv(baseName, rows) {
  if (!rows.length) {
    showToast("No records available to export.", "error");
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(","))
  ].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${baseName}-${toDateInputValue(new Date())}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("CSV export prepared.", "success");
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function printReport(title, headers, rows) {
  if (!rows.length) {
    showToast("No records available to print.", "error");
    return;
  }

  const tableRows = rows.map((row) => `
    <tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>
  `).join("");
  const tableHeaders = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");

  printHtmlReport(title, `
    <table class="print-standard-table">
      <thead><tr>${tableHeaders}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  `);
}

function printHtmlReport(title, bodyHtml, extraClass = "") {
  const printArea = $("#printArea");
  printArea.className = `print-area ${extraClass}`.trim();
  printArea.innerHTML = extraClass.includes("sop-summary-print") ? bodyHtml : `
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(state.companySettings?.company_name || "PDCA System")} | Generated ${escapeHtml(formatDateTime(new Date().toISOString()))}</p>
    ${bodyHtml}
  `;
  window.setTimeout(() => window.print(), 150);
}

function switchView(viewId) {
  if (viewId === "adminUsersView" && !isAdmin()) {
    showToast("Only administrators can open Users & Roles.", "error");
    return;
  }

  $$(".view").forEach((view) => view.classList.toggle("is-active", view.id === viewId));
  $$(".nav-link").forEach((link) => link.classList.toggle("is-active", link.dataset.view === viewId));
  elements.mobileNav.classList.remove("is-open");

  const titleMap = {
    dashboardView: "Dashboard",
    settingsView: "Company Settings",
    peopleProfilesView: "People / HR",
    equipmentView: "Equipment",
    sopView: "Standard Operating Procedure",
    notificationsView: "Notifications",
    monitoringPlansView: "Workflow Modules",
    taskBoardView: "Workspace Tasks",
    actionCenterView: "Manager Actions",
    approvalRequestsView: "Approvals",
    personnelView: "People",
    plansView: "Plan Items",
    doView: "Do",
    checkView: "Check",
    actionsView: "Act",
    adminUsersView: "Users & Roles"
  };
  elements.pageTitle.textContent = titleMap[viewId] || "Dashboard";
}

function openDepartmentModal(id = null) {
  if (!canManagePersonnel()) {
    showToast("Only HR or authorized managers can manage departments.", "error");
    return;
  }
  const department = id ? state.departments.find((item) => item.id === id) : {};
  openModal({
    title: id ? "Edit Department" : "Add Department",
    mode: "departments",
    editingId: id,
    fields: [
      inputField("department_name", "Department Name", "text", department?.department_name, true),
      textareaField("description", "Description", department?.description, false),
      selectField("department_head_id", "Department Head", peopleOptions(), department?.department_head_id, false),
      selectField("status", "Status", [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "archived", label: "Archived" }
      ], department?.status || "active", true)
    ]
  });
}

function openPersonnelModal(id = null) {
  if (!canManagePersonnel()) {
    showToast("Only administrators can manage personnel.", "error");
    return;
  }

  const person = id ? state.personnel.find((item) => item.id === id) : {};
  openModal({
    title: id ? "Edit Personnel" : "Add Personnel",
    mode: "personnel",
    editingId: id,
    fields: [
      inputField("full_name", "Full Name", "text", person?.full_name, true),
      selectField("position", "Position", positionOptions(), person?.position, true),
      selectField("role", "Role", operationalRoleOptions(), normalizeRole(person?.role || "staff"), true)
    ]
  });
}

function openPlanModal(id = null) {
  if (!canManagePlans()) {
    showToast("Your account is view-only until an administrator assigns a role.", "error");
    return;
  }

  const plan = id ? state.plans.find((item) => item.id === id) : {};
  const relatedSop = id ? sopForPlan(id) : null;
  const people = personnelOptions();
  const today = toDateInputValue(new Date());
  const selectedMonth = Number(plan?.period_month || new Date().getMonth() + 1);
  const selectedYear = Number(plan?.period_year || new Date().getFullYear());
  const periodBounds = getPeriodDateBounds(selectedMonth, selectedYear);
  const minStartDate = maxDateInputValue(today, periodBounds.start);
  openModal({
    title: id ? "Edit Plan" : "Create Plan",
    mode: "plans",
    editingId: id,
    fields: [
      `<div class="form-note success">
        <strong>What is a Plan?</strong>
        <span>A plan is the period-level schedule for executing approved SOPs. Link an SOP here when the whole plan follows one procedure, then add plan items for the actual activities.</span>
      </div>`,
      personnelPromptField(people.length),
      inputField("plan_title", "Plan Title", "text", plan?.plan_title, true),
      canManageSops()
        ? selectField("related_sop_id", "Related SOP", sopOptions(), relatedSop?.id || "", false)
        : inputField("related_sop_display", "Related SOP", "text", relatedSop ? sopDisplayName(relatedSop) : "Not linked", false, { readonly: "readonly" }),
      selectField("period_month", "Period Month", monthNames.map((name, index) => ({ value: index + 1, label: name })), plan?.period_month, true),
      inputField("period_year", "Period Year", "number", plan?.period_year || new Date().getFullYear(), true),
      inputField("start_date", "Start Date", "date", plan?.start_date, true, { min: minStartDate, max: periodBounds.end }),
      inputField("end_date", "End Date", "date", plan?.end_date, true, { min: plan?.start_date || minStartDate, max: periodBounds.end }),
      selectField("created_by", "Created By", people, plan?.created_by, true),
      selectField("approved_by", "Approved By", people, plan?.approved_by, true)
    ]
  });
  bindDateGuards();
  updatePlanPeriodDateLimits();
}

function openPlanItemModal(id = null) {
  if (!canManagePlans()) {
    showToast("Your account is view-only until an administrator assigns a role.", "error");
    return;
  }

  if (!state.selectedPlanId) {
    showToast("Select a plan before adding items.", "error");
    return;
  }

  const item = id ? state.planItems.find((record) => record.id === id) : {};
  const plan = state.plans.find((record) => record.id === state.selectedPlanId);
  const relatedSop = id ? sopForPlanItem(id) : sopForPlan(state.selectedPlanId);
  const minDate = maxDateInputValue(toDateInputValue(new Date()), plan?.start_date);
  const maxDate = plan?.end_date || "";
  openModal({
    title: id ? "Edit Plan Item" : "Add Plan Item",
    mode: "plan_items",
    editingId: id,
    fields: [
      `<div class="form-note success">
        <strong>What is a Plan Item?</strong>
        <span>A plan item is one specific SOP-based activity inside the selected plan. Do records, supervisor checks, and corrective actions connect here.</span>
      </div>`,
      templatePickerField(),
      hiddenField("plan_id", state.selectedPlanId),
      canManageSops()
        ? selectField("related_sop_id", "Related SOP", sopOptions(), relatedSop?.id || "", false)
        : inputField("related_sop_display", "Related SOP", "text", relatedSop ? sopDisplayName(relatedSop) : "Not linked", false, { readonly: "readonly" }),
      selectField("category", "Category", workflowCategoryTextOptions(), item?.category, true),
      textareaField("objective", "Objective", item?.objective, true),
      textareaField("target_standard", "Target Standard", item?.target_standard, true),
      selectField("responsible_person", "Responsible Person", personnelOptions(), item?.responsible_person, true),
      selectField("frequency", "Frequency", frequencyOptions(), item?.frequency, true),
      textareaField("expected_output", "Expected Output", item?.expected_output, true),
      inputField("start_date", "Start Date", "date", item?.start_date, true, { min: minDate, max: maxDate }),
      inputField("due_date", "Due Date", "date", item?.due_date, true, { min: item?.start_date || minDate, max: maxDate }),
      textareaField("remarks", "Remarks", item?.remarks, false)
    ]
  });
  bindDateGuards();
}

function openDoModal(id = null) {
  if (!canDoTasks()) {
    showToast("Your role cannot record task work.", "error");
    return;
  }

  const record = id ? state.doRecords.find((item) => item.id === id) : {};
  openModal({
    title: id ? "Edit Do Record" : "Add Do Record",
    mode: "do_records",
    editingId: id,
    fields: [
      planItemSelectField(record?.plan_item_id, "plan_item_id", "Plan Item"),
      selectField("performed_by", "Performed By", personnelOptions(), record?.performed_by, true),
      inputField("date_performed", "Date Performed", "date", record?.date_performed, true, { max: toDateInputValue(new Date()) }),
      textareaField("activity_done", "Activity Done", record?.activity_done, true),
      textareaField("output_result", "Output Result", record?.output_result, false),
      textareaField("remarks", "Remarks", record?.remarks, false)
    ]
  });
}

function openCheckModal(id = null) {
  if (!canCheckTasks()) {
    showToast("Only supervisors and managers can check records.", "error");
    return;
  }

  const record = id ? state.checkRecords.find((item) => item.id === id) : {};
  openModal({
    title: id ? "Edit Check Record" : "Add Check Record",
    mode: "check_records",
    editingId: id,
    fields: [
      planItemSelectField(record?.plan_item_id, "plan_item_id", "Plan Item"),
      selectField("checked_by", "Checked By", personnelOptions(), record?.checked_by, true),
      inputField("date_checked", "Date Checked", "date", record?.date_checked, true, { max: toDateInputValue(new Date()) }),
      selectField("check_result", "Check Result", [
        { value: "Compliant", label: "Compliant" },
        { value: "Not Compliant", label: "Not Compliant" },
        { value: "Needs Follow-up", label: "Needs Follow-up" }
      ], record?.check_result, true),
      textareaField("observation", "Observation", record?.observation, false),
      textareaField("evidence", "Evidence", record?.evidence, false),
      textareaField("remarks", "Remarks", record?.remarks, false)
    ]
  });
}

function openActionModal(id = null) {
  if (!canManageActionCenter()) {
    showToast("Your role cannot manage corrective actions.", "error");
    return;
  }

  const action = id ? state.actions.find((record) => record.id === id) : {};
  const selectedItem = state.planItems.find((item) => item.id === action?.plan_item_id);
  openModal({
    title: id ? "Edit Corrective Action" : "Add Corrective Action",
    mode: "action_taken",
    editingId: id,
    fields: [
      actionPlanItemPromptField(),
      actionPlanFilterField(selectedItem?.plan_id || ""),
      planItemSelectField(action?.plan_item_id),
      selectField("check_record_id", "Related Check Record", checkRecordOptions(), action?.check_record_id, false),
      selectField("checked_by", "Checked By", personnelOptions(), action?.checked_by, true),
      selectField("action_owner", "Action Owner", personnelOptions(), action?.action_owner, false),
      inputField("date_checked", "Date Checked", "date", action?.date_checked, true, { max: toDateInputValue(new Date()) }),
      inputField("target_completion_date", "Target Completion Date", "date", action?.target_completion_date, false),
      inputField("completion_date", "Completion Date", "date", action?.completion_date, false, { max: toDateInputValue(new Date()) }),
      selectField("action_status", "Action Status", [
        { value: "Open", label: "Open" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
        { value: "Verified", label: "Verified" }
      ], action?.action_status || "Open", true),
      textareaField("not_compliant_observation", "Not Compliant Observation", action?.not_compliant_observation, true),
      textareaField("corrective_action", "Corrective Action", action?.corrective_action, true),
      textareaField("remarks", "Remarks", action?.remarks, false),
      textareaField("preventive_action", "Preventive Action", action?.preventive_action, true)
    ]
  });
  filterActionPlanItems(selectedItem?.plan_id || "");
}

function openUserProfileModal(id) {
  if (!isAdmin()) {
    showToast("Only administrators can edit user accounts.", "error");
    return;
  }

  if (id === state.session.user.id) {
    showToast("You cannot edit your own account here.", "error");
    return;
  }

  const profile = state.userProfiles.find((item) => item.id === id);
  if (!profile) {
    showToast("User profile was not found.", "error");
    return;
  }

  openModal({
    title: "Edit User Account",
    mode: "user_profiles",
    editingId: id,
    fields: [
      inputField("email", "Email", "email", profile.email, true),
      inputField("full_name", "Full Name", "text", profile.full_name, false),
      selectField("role", "Role", systemRoleOptions(), normalizeRole(profile.role), true)
    ]
  });
}

function openCompanySettingsModal() {
  if (!canManageCompanySettings()) {
    showToast("Only managers can update company settings.", "error");
    return;
  }
  const settings = state.companySettings || {};
  openModal({
    title: "Company Settings",
    mode: "company_settings",
    editingId: settings.id || null,
    fields: [
      inputField("company_name", "Company Name", "text", settings.company_name || "Business Workspace", true),
      inputField("system_name", "System Name", "text", settings.system_name || "Workflow Operations Platform", true),
      selectField("business_type", "Business Type", businessTypeOptions(), settings.business_type || "food_manufacturing", true),
      inputField("custom_business_type", "Custom Business Type", "text", settings.custom_business_type, false, { placeholder: "Use when Business Type is Custom" }),
      inputField("industry", "Industry", "text", settings.industry || businessTypeLabel(settings.business_type, settings.custom_business_type), false, { placeholder: "Manufacturing, healthcare, logistics, education, custom..." }),
      textareaField("workflow_preferences", "Workflow Preferences", settings.workflow_preferences || "Scheduling, tasks, approvals, checklists, assignments, escalations, corrective actions, attachments, notifications, analytics", false),
      textareaField("address", "Address", settings.address, false),
      inputField("contact_number", "Contact Number", "text", settings.contact_number, false),
      inputField("email", "Email", "email", settings.email, false),
      inputField("logo_url", "Logo URL", "url", settings.logo_url, false)
    ]
  });
}

function openPeopleProfileModal(id = null) {
  if (!canManagePersonnel()) {
    showToast("Only administrators or general managers can manage HR profiles.", "error");
    return;
  }
  const person = id ? state.peopleProfiles.find((item) => item.id === id) : {};
  openModal({
    title: id ? "Edit Employee Profile" : "Add Employee Profile",
    mode: "people_profiles",
    editingId: id,
    fields: [
      selectField("user_id", "Linked Login Account", userProfileOptions(), person?.user_id, false),
      inputField("complete_name", "Complete Name", "text", person?.complete_name, true),
      inputField("employee_id", "Employee ID", "text", person?.employee_id, false),
      inputField("first_name", "First Name", "text", person?.first_name, false),
      inputField("middle_name", "Middle Name", "text", person?.middle_name, false),
      inputField("last_name", "Last Name", "text", person?.last_name, false),
      inputField("suffix", "Suffix", "text", person?.suffix, false),
      selectField("gender", "Gender", [
        { value: "female", label: "Female" },
        { value: "male", label: "Male" },
        { value: "non_binary", label: "Non-binary" },
        { value: "prefer_not_to_say", label: "Prefer not to say" }
      ], person?.gender, false),
      inputField("civil_status", "Civil Status", "text", person?.civil_status, false),
      inputField("nationality", "Nationality", "text", person?.nationality, false),
      textareaField("address", "Address", person?.address, false),
      inputField("contact_number", "Contact Number", "text", person?.contact_number, false),
      inputField("email", "Email", "email", person?.email, false),
      inputField("emergency_contact_number", "Emergency Contact Number", "text", person?.emergency_contact_number, false),
      state.departments.length
        ? selectField("department_id", "Department", departmentOptions(), person?.department_id, false)
        : inputField("department", "Department", "text", person?.department, false),
      selectField("position", "Position", positionOptions(), person?.position, false),
      selectField("operational_role", "Operational Role", operationalRoleOptions(), person?.operational_role || "staff", true),
      selectField("employment_type", "Employment Type", employmentTypeOptions(), person?.employment_type, false),
      inputField("date_hired", "Date Hired", "date", person?.date_hired, false),
      selectField("supervisor_id", "Supervisor", peopleOptions(), person?.supervisor_id, false),
      selectField("assigned_team", "Assigned Team / Department", teamOptions(), person?.assigned_team || departmentNameRaw(person?.department_id) || person?.department, false),
      selectField("work_location", "Work Location", workLocationOptions(), person?.work_location, false),
      inputField("shift_schedule", "Shift Schedule", "text", person?.shift_schedule, false),
      inputField("birth_date", "Birth Date", "date", person?.birth_date, false),
      inputField("emergency_contact", "Emergency Contact", "text", person?.emergency_contact, false),
      selectField("employment_status", "Employment Status", employmentStatusOptions(), person?.employment_status || "active", true),
      textareaField("education_background", "Educational Background", person?.education_background, false),
      textareaField("skills_competencies", "Skills / Competencies", person?.skills_competencies, false),
      textareaField("document_notes", "Employee Document Notes", person?.document_notes, false),
      textareaField("compliance_notes", "Health & Compliance Notes", person?.compliance_notes, false),
      textareaField("biodata_notes", "Biodata / Checklist Notes", person?.biodata_notes, false),
      fileField("evidence_file", "Upload Employee Document")
    ]
  });
}

function openEmployeeDocumentModal(id = null, personId = "") {
  if (!canManagePersonnel()) {
    showToast("Only HR or managers can manage employee documents.", "error");
    return;
  }
  const item = id ? state.employeeDocuments.find((record) => record.id === id) : {};
  openModal({
    title: id ? "Edit Employee Document" : "Add Employee Document",
    mode: "employee_documents",
    editingId: id,
    fields: [
      selectField("person_id", "Employee", peopleOptions(), item?.person_id || personId, true),
      selectField("document_type", "Document Type", [
        { value: "resume", label: "Resume / CV" },
        { value: "government_id", label: "Government ID" },
        { value: "contract", label: "Contract" },
        { value: "certificate", label: "Certificate" },
        { value: "medical_record", label: "Medical Record" },
        { value: "performance_review", label: "Performance Review" },
        { value: "disciplinary_record", label: "Disciplinary Record" },
        { value: "other", label: "Other" }
      ], item?.document_type || "certificate", true),
      inputField("document_title", "Document Title", "text", item?.document_title, true),
      inputField("issue_date", "Issue Date", "date", item?.issue_date, false),
      inputField("expiry_date", "Expiry Date", "date", item?.expiry_date, false),
      selectField("status", "Status", [
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
        { value: "pending", label: "Pending" },
        { value: "archived", label: "Archived" }
      ], item?.status || "active", true),
      textareaField("remarks", "Remarks", item?.remarks, false),
      fileField("evidence_file", "Upload Document File")
    ]
  });
}

function openEquipmentModal(id = null) {
  if (!canManageEquipment()) {
    showToast("Only managers can manage equipment.", "error");
    return;
  }
  const item = id ? state.equipment.find((record) => record.id === id) : {};
  openModal({
    title: id ? "Edit Equipment" : "Add Equipment",
    mode: "equipment",
    editingId: id,
    fields: [
      inputField("equipment_name", "Equipment Name", "text", item?.equipment_name, true),
      selectField("equipment_type", "Type", equipmentTypeOptions(), item?.equipment_type, false),
      inputField("serial_number", "Serial Number", "text", item?.serial_number, false),
      textareaField("specification", "Specification", item?.specification, false),
      inputField("year_acquired", "Year Acquired", "number", item?.year_acquired, false),
      selectField("status", "Status", [
        { value: "functional", label: "Functional" },
        { value: "needs_repair", label: "Needs Repair" },
        { value: "under_maintenance", label: "Under Maintenance" },
        { value: "retired", label: "Retired" }
      ], item?.status || "functional", true),
      selectField("functional_state", "Functional State", [
        { value: "functional", label: "Functional" },
        { value: "limited_use", label: "Limited Use" },
        { value: "needs_repair", label: "Needs Repair" },
        { value: "non_functional", label: "Non-functional" }
      ], item?.functional_state || item?.status || "functional", false),
      selectField("location", "Location", workLocationOptions(), item?.location, false),
      textareaField("maintenance_notes", "Maintenance Notes", item?.maintenance_notes, false),
      textareaField("remarks", "Remarks", item?.remarks, false)
    ]
  });
}

function openProductLineModal(id = null) {
  if (!canManagePlans()) {
    showToast("Only authorized planning roles can manage workspaces.", "error");
    return;
  }
  const item = id ? state.productLines.find((record) => record.id === id) : {};
  const governingSop = item?.id ? governingSopForWorkspace(item.id) : null;
  const fields = [
    `<div class="form-note success">
      <strong>Workspace Process Link</strong>
      <span>Choose the SOP that governs this workspace. Workspace tasks will stay connected through this workspace.</span>
    </div>`,
    inputField("product_name", "Workspace Name", "text", item?.product_name, true),
    textareaField("description", "Description", item?.description, false),
    canManageSops()
      ? selectField("governing_sop_id", "Governing SOP", sopOptions(), governingSop?.id || "", false)
      : inputField("governing_sop_display", "Governing SOP", "text", governingSop ? sopDisplayName(governingSop) : "Not linked", false, { readonly: "readonly" }),
    selectField("status", "Status", workspaceStatusOptions(), item?.status || "active", true)
  ];

  if (tableHasColumn(state.productLines, "pdca_stage")) {
    fields.push(selectField("pdca_stage", "PDCA Stage", pdcaStageOptions(), item?.pdca_stage || "plan", false));
  }

  if (tableHasColumn(state.productLines, "assigned_person_id")) {
    fields.push(selectField("assigned_person_id", "Assigned Member", peopleOptions(), item?.assigned_person_id, false));
  }

  if (tableHasColumn(state.productLines, "target_date")) {
    fields.push(inputField("target_date", "Target Date", "date", item?.target_date, false));
  }

  openModal({
    title: id ? "Edit Workspace" : "Create Workspace",
    mode: "product_lines",
    editingId: id,
    fields
  });
}

function openMaintenanceModal(id = null, equipmentId = "") {
  if (!canManageEquipment()) {
    showToast("Your role cannot manage maintenance records.", "error");
    return;
  }
  const item = id ? state.equipmentMaintenanceHistory.find((record) => record.id === id) : {};
  openModal({
    title: id ? "Edit Maintenance Record" : "Add Maintenance Record",
    mode: "equipment_maintenance_history",
    editingId: id,
    fields: [
      selectField("equipment_id", "Equipment", equipmentOptions(), item?.equipment_id || equipmentId, true),
      selectField("maintenance_type", "Maintenance Type", [
        { value: "preventive", label: "Preventive" },
        { value: "repair", label: "Repair" },
        { value: "inspection", label: "Inspection" },
        { value: "calibration", label: "Calibration" },
        { value: "other", label: "Other" }
      ], item?.maintenance_type || "preventive", true),
      selectField("performed_by", "Performed By", peopleOptions(), item?.performed_by, false),
      inputField("maintenance_date", "Maintenance Date", "date", item?.maintenance_date || toDateInputValue(new Date()), true),
      textareaField("findings", "Findings", item?.findings, false),
      textareaField("action_taken", "Action Taken", item?.action_taken, false),
      inputField("next_due_date", "Next Due Date", "date", item?.next_due_date, false),
      selectField("status", "Status", [
        { value: "scheduled", label: "Scheduled" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "deferred", label: "Deferred" }
      ], item?.status || "completed", true)
    ]
  });
}

function openSopModal(id = null) {
  if (!canManageSops()) {
    showToast("Your role cannot manage SOP records.", "error");
    return;
  }
  const sop = id ? state.standardOperatingProcedures.find((record) => record.id === id) : {};
  const attachments = id ? recordAttachments("standard_operating_procedures", id) : [];
  openModal({
    title: id ? "Edit SOP" : "Create SOP",
    mode: "standard_operating_procedures",
    editingId: id,
    fields: [
      `<div class="form-note success">
        <strong>SOP Document Control</strong>
        <span>Link this SOP to the correct department, workspace, workflow, task, or plan so users can find it automatically.</span>
      </div>`,
      inputField("sop_code", "SOP Code", "text", sop?.sop_code, true, { placeholder: "SOP-OPS-001" }),
      inputField("title", "Title", "text", sop?.title, true),
      selectField("department_id", "Department", departmentOptions(), sop?.department_id, false),
      selectField("workspace_id", "Workspace", productLineOptions(), sop?.workspace_id, false),
      selectField("workflow_template_id", "Workflow", scheduleTemplateOptions(), sop?.workflow_template_id, false),
      selectField("task_id", "Workspace Task", generatedTaskOptions(), sop?.task_id, false),
      selectField("plan_id", "Related Plan", planOptions(), sop?.plan_id, false),
      selectField("plan_item_id", "Related Plan Item", allPlanItemOptions(), sop?.plan_item_id, false),
      selectField("category", "Category", sopCategoryOptions(), sop?.category, false),
      inputField("version", "Version", "text", sop?.version || "1.0", true),
      selectField("status", "Status", sopStatusOptions(), sop?.status || "draft", true),
      inputField("effective_date", "Effective Date", "date", sop?.effective_date, false),
      inputField("review_date", "Review Date", "date", sop?.review_date, false),
      selectField("owner_person_id", "Owner", peopleOptions(), sop?.owner_person_id, false),
      selectField("approved_by", "Approved By", peopleOptions(), sop?.approved_by, false),
      textareaField("summary", "Summary", sop?.summary, false),
      textareaField("scope", "SOP Scope", sop?.scope, false),
      textareaField("procedure_body", "Procedure", sop?.procedure_body, false),
      textareaField("responsibilities", "Responsibilities", sop?.responsibilities, false),
      textareaField("required_forms", "Required Forms", sop?.required_forms, false),
      checkboxField("attachments_required", "Attachments required", sop?.attachments_required),
      sopAttachmentUploadField(sop?.attachments_required),
      sopCurrentAttachmentsField(attachments)
    ]
  });
}

function openAttendanceModal(id = null) {
  if (!canManagePersonnel()) {
    showToast("Only HR or authorized managers can manage attendance.", "error");
    return;
  }
  const item = id ? state.attendanceRecords.find((record) => record.id === id) : {};
  openModal({
    title: id ? "Edit Attendance Record" : "Add Attendance Record",
    mode: "attendance",
    editingId: id,
    fields: [
      selectField("person_id", "Employee", peopleOptions(), item?.person_id, true),
      inputField("attendance_date", "Date", "date", item?.attendance_date || toDateInputValue(new Date()), true),
      inputField("time_in", "Time In", "time", item?.time_in, false),
      inputField("time_out", "Time Out", "time", item?.time_out, false),
      selectField("status", "Status", attendanceStatusOptions(), item?.status || "present", true),
      textareaField("notes", "Notes / Remarks", item?.notes, false)
    ]
  });
}

function attendanceStatusOptions() {
  return [
    { value: "present", label: "Present" },
    { value: "late", label: "Late" },
    { value: "absent", label: "Absent" },
    { value: "on_leave", label: "On Leave" }
  ];
}

function openMonitoringCategoryModal(id = null) {
  if (!canManagePlans()) {
    showToast("Only authorized planning roles can manage workflow groups.", "error");
    return;
  }
  const item = id ? state.monitoringCategories.find((record) => record.id === id) : {};
  openModal({
    title: id ? "Edit Workflow Group" : "Add Workflow Group",
    mode: "monitoring_categories",
    editingId: id,
    fields: [
      inputField("category_name", "Workflow Group Name", "text", item?.category_name, true),
      textareaField("description", "Description", item?.description, false),
      selectField("default_frequency", "Default Frequency", frequencyOptions(), item?.default_frequency, false),
      selectField("status", "Status", [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }], item?.status || "active", true)
    ]
  });
}

function openDbTemplateModal(id = null) {
  if (!canManagePlans()) {
    showToast("Your role cannot manage module templates.", "error");
    return;
  }
  const item = id ? state.monitoringTemplatesDb.find((record) => record.id === id) : {};
  openModal({
    title: id ? "Edit Module Template" : "Create Module Template",
    mode: "monitoring_templates",
    editingId: id,
    fields: [
      selectField("business_type", "Business Type", businessTypeOptions(), item?.business_type || currentBusinessType(), true),
      inputField("module_name", "Module Name", "text", item?.module_name, true),
      selectField("module_category", "Module Category", workflowCategoryTextOptions(), item?.module_category, false),
      textareaField("description", "Description", item?.description, false),
      selectField("default_frequency", "Default Frequency", frequencyOptions(), item?.default_frequency, false),
      textareaField("objective", "Objective", item?.objective, false),
      textareaField("target_standard", "Target Standard", item?.target_standard, false),
      textareaField("expected_output", "Expected Output", item?.expected_output, false),
      checkboxField("checklist_enabled", "Checklist enabled", item?.checklist_enabled !== false),
      checkboxField("verification_required", "Verification required", item?.verification_required !== false),
      checkboxField("corrective_action_required", "Corrective action required", item?.corrective_action_required !== false),
      checkboxField("is_active", "Template active", item?.is_active !== false)
    ]
  });
}

function openChecklistModal(id = null, templateId = "") {
  if (!canManagePlans()) {
    showToast("Your role cannot manage checklists.", "error");
    return;
  }
  const item = id ? state.dynamicChecklists.find((record) => record.id === id) : {};
  openModal({
    title: id ? "Edit Checklist Item" : "Add Checklist Item",
    mode: "dynamic_checklists",
    editingId: id,
    fields: [
      selectField("template_id", "Module Template", dbTemplateOptions(), item?.template_id || templateId, true),
      textareaField("checklist_item", "Checklist Item", item?.checklist_item, true),
      textareaField("pass_fail_condition", "Pass / Fail Condition", item?.pass_fail_condition, false),
      checkboxField("requires_evidence", "Requires evidence", item?.requires_evidence),
      inputField("sort_order", "Sort Order", "number", item?.sort_order || 0, false)
    ]
  });
}

function openTemplateWorkflowModal(id = null, templateId = "") {
  if (!canManagePlans()) {
    showToast("Your role cannot manage template workflows.", "error");
    return;
  }
  const item = id ? state.templateWorkflows.find((record) => record.id === id) : {};
  openModal({
    title: id ? "Edit Workflow Step" : "Add Workflow Step",
    mode: "template_workflows",
    editingId: id,
    fields: [
      selectField("template_id", "Module Template", dbTemplateOptions(), item?.template_id || templateId, true),
      inputField("workflow_step", "Workflow Step", "text", item?.workflow_step, true),
      selectField("assigned_role", "Assigned Role", systemRoleOptions(), item?.assigned_role, false),
      selectField("escalation_role", "Escalation Role", systemRoleOptions(), item?.escalation_role, false),
      inputField("due_after_hours", "Due After Hours", "number", item?.due_after_hours, false, { min: 0 }),
      checkboxField("requires_approval", "Requires approval", item?.requires_approval),
      inputField("sort_order", "Sort Order", "number", item?.sort_order || 0, false)
    ]
  });
}

function openScheduleTemplateModal(id = null) {
  if (!canManagePlans()) {
    showToast("Only managers can manage workflows.", "error");
    return;
  }
  const item = id ? state.scheduleTemplates.find((record) => record.id === id) : {};
  openModal({
    title: id ? "Edit Workflow" : "Create Workflow",
    mode: "monitoring_schedule_templates",
    editingId: id,
    fields: [
      inputField("template_title", "Workflow Name", "text", item?.template_title, true),
      selectField("category_id", "Workflow Group", categoryOptions(), item?.category_id, false),
      selectField("product_line_id", "Workspace", productLineOptions(), item?.product_line_id, false),
      selectField("equipment_id", "Equipment", equipmentOptions(), item?.equipment_id, false),
      textareaField("objective", "Objective", item?.objective, false),
      textareaField("target_standard", "Target Standard", item?.target_standard, false),
      textareaField("expected_output", "Expected Output", item?.expected_output, false),
      selectField("frequency", "Frequency", frequencyOptions(), item?.frequency || "Daily", true),
      inputField("start_date", "Start Date", "date", item?.start_date, false),
      inputField("end_date", "End Date", "date", item?.end_date, false),
      inputField("due_time", "Due Time", "time", item?.due_time, false),
      selectField("recurrence_type", "Recurrence Type", recurrenceTypeOptions(), item?.recurrence_type || "manual", true),
      inputField("recurrence_days", "Recurring Days", "text", Array.isArray(item?.recurrence_days) ? item.recurrence_days.join(", ") : "", false, { placeholder: "monday, tuesday, friday" }),
      inputField("recurrence_times", "Recurring Times", "text", Array.isArray(item?.recurrence_times) ? item.recurrence_times.join(", ") : "", false, { placeholder: "08:00, 12:00, 17:00" }),
      inputField("monthly_day", "Monthly Day", "number", item?.monthly_day, false, { min: 1, max: 31 }),
      checkboxField("auto_generate", "Automatically generate tasks from this workflow", item?.auto_generate),
      inputField("generation_start_date", "Generation Start Date", "date", item?.generation_start_date, false),
      inputField("generation_end_date", "Generation End Date", "date", item?.generation_end_date, false),
      inputField("at_risk_hours", "At Risk Hours Before Due", "number", item?.at_risk_hours || 6, true, { min: 1 }),
      checkboxField("requires_approval", "Require approval before activating", item?.requires_approval),
      selectField("approval_status", "Approval Status", approvalStatusOptions(), item?.approval_status || "draft", true),
      selectField("created_by", "Created By", peopleOptions(), item?.created_by, false),
      selectField("approved_by", "Approved By", peopleOptions(), item?.approved_by, false),
      selectField("status", "Status", [
        { value: "draft", label: "Draft" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "archived", label: "Archived" }
      ], item?.status || "active", true),
      textareaField("remarks", "Remarks", item?.remarks, false)
    ]
  });
}

function openGeneratedTaskModal(id = null, templateId = "") {
  if (!canManagePlans()) {
    showToast("Only managers can create tasks.", "error");
    return;
  }
  const item = id ? state.generatedTasks.find((record) => record.id === id) : {};
  const template = state.scheduleTemplates.find((record) => record.id === (templateId || item?.template_id));
  const selectedWorkspaceId = elements.taskWorkspaceFilter?.value || "";
  openModal({
    title: id ? "Edit Workspace Task" : "Add Workspace Task",
    mode: "generated_tasks",
    editingId: id,
    fields: [
      `<div class="form-note success">
        <strong>Workspace Task Traceability</strong>
        <span>Actual assigned work performed within a workspace. Link the Plan, Plan Item, Workspace, and SOP so the SOP Summary Report can prove the full audit trail.</span>
      </div>`,
      selectField("plan_id", "Plan", planOptions(), item?.plan_id || template?.plan_id || "", false),
      selectField("plan_item_id", "Plan Item", allPlanItemOptions(), item?.plan_item_id || template?.plan_item_id || "", false),
      selectField("template_id", "Workflow", scheduleTemplateOptions(), item?.template_id || templateId, false),
      hiddenField("category_id", item?.category_id || template?.category_id || ""),
      selectField("product_line_id", "Workspace", productLineOptions(), taskWorkspaceId(item) || template?.product_line_id || selectedWorkspaceId, false),
      selectField("sop_id", "SOP", sopOptions(), item?.sop_id || governingSopForWorkspace(taskWorkspaceId(item) || template?.product_line_id || selectedWorkspaceId)?.id || "", false),
      `<div class="form-note">
        <strong>SOP</strong>
        <span>Defines the approved procedure and standard for performing work. A direct SOP link is used first; workspace and workflow SOP links remain as backup.</span>
      </div>`,
      hiddenField("equipment_id", item?.equipment_id || template?.equipment_id || ""),
      inputField("task_title", "Workspace Task Title", "text", item?.task_title || template?.template_title, true),
      textareaField("remarks", "Description", item?.remarks, false),
      inputField("task_date", "Task Date", "date", item?.task_date || toDateInputValue(new Date()), true),
      inputField("due_time", "Due Time", "time", item?.due_time || template?.due_time, false),
      selectField("assigned_person_id", "Assigned To", peopleOptions(), item?.assigned_person_id, false),
      selectField("assigned_by", "Assigned By", peopleOptions(), item?.assigned_by, false),
      selectField("task_status", "Status", taskStatusOptions(), item?.task_status || "scheduled", true),
      selectField("priority", "Priority", [
        { value: "low", label: "Low" },
        { value: "normal", label: "Normal" },
        { value: "high", label: "High" },
        { value: "critical", label: "Critical" }
      ], item?.priority || "normal", true)
    ]
  });
}

function openTaskDoModal(taskId) {
  if (!canDoTasks()) {
    showToast("Your role cannot record task work.", "error");
    return;
  }
  const task = state.generatedTasks.find((record) => record.id === taskId);
  openModal({
    title: "Record Work Done",
    mode: "task_do_records",
    editingId: null,
    fields: [
      hiddenField("task_id", taskId),
      selectField("performed_by", "Performed By", peopleOptions(), task?.assigned_person_id, true),
      textareaField("work_done", "Work Done", "", true),
      textareaField("output_result", "Output Result", "", false),
      textareaField("remarks", "Remarks", "", false),
      inputField("evidence_url", "Evidence URL", "url", "", false),
      fileField("evidence_file", "Upload Evidence")
    ]
  });
}

function openTaskCheckModal(taskId) {
  if (!canCheckTasks()) {
    showToast("Only supervisors and managers can check tasks.", "error");
    return;
  }
  openModal({
    title: "Supervisor Check",
    mode: "task_check_records",
    editingId: null,
    fields: [
      hiddenField("task_id", taskId),
      selectField("do_record_id", "Related Do Record", taskDoOptions(taskId), "", false),
      selectField("checked_by", "Checked By", peopleOptions(), "", true),
      selectField("check_result", "Result", [
        { value: "passed", label: "Passed" },
        { value: "not_compliant", label: "Not Compliant" },
        { value: "needs_follow_up", label: "Needs Follow Up" }
      ], "passed", true),
      textareaField("observation", "Observation", "", false),
      inputField("evidence_url", "Evidence URL", "url", "", false),
      fileField("evidence_file", "Upload Evidence"),
      inputField("correction_due_at", "Correction Due At", "datetime-local", "", false),
      checkboxField("manager_notified", "Manager notified", false),
      textareaField("remarks", "Remarks", "", false)
    ]
  });
}

function openActionCaseModal(id = null) {
  if (!canManageActionCenter()) {
    showToast("Only action center roles can manage cases.", "error");
    return;
  }
  const item = id ? state.actionCases.find((record) => record.id === id) : {};
  openModal({
    title: id ? "Edit Action Case" : "Open Action Case",
    mode: "action_cases",
    editingId: id,
    fields: [
      selectField("task_id", "Task", generatedTaskOptions(), item?.task_id, true),
      selectField("check_record_id", "Related Check", taskCheckOptions(), item?.check_record_id, false),
      selectField("opened_by", "Opened By", peopleOptions(), item?.opened_by, false),
      selectField("assigned_manager_id", "Assigned Manager", peopleOptions(), item?.assigned_manager_id, false),
      inputField("case_title", "Case Title", "text", item?.case_title, true),
      textareaField("non_compliance_note", "Non Compliance Note", item?.non_compliance_note, true),
      textareaField("manager_instruction", "Manager Instruction", item?.manager_instruction, false),
      textareaField("corrective_action", "Corrective Action", item?.corrective_action, false),
      textareaField("preventive_action", "Preventive Action", item?.preventive_action, false),
      selectField("case_status", "Case Status", [
        { value: "open", label: "Open" },
        { value: "instructed", label: "Instructed" },
        { value: "in_progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" },
        { value: "verified", label: "Verified" },
        { value: "closed", label: "Closed" }
      ], item?.case_status || "open", true),
      inputField("due_at", "Due At", "datetime-local", toDatetimeLocalValue(item?.due_at), false),
      textareaField("remarks", "Remarks", item?.remarks, false)
    ]
  });
}

function openChangePasswordModal() {
  openModal({
    title: "Change Password",
    mode: "change_password",
    editingId: null,
    fields: [
      `<div class="form-note success">
        Set a new password for your signed-in account. Use at least 6 characters.
      </div>`,
      inputField("new_password", "New Password", "password", "", true, { minlength: 6, autocomplete: "new-password" }),
      inputField("confirm_password", "Confirm New Password", "password", "", true, { minlength: 6, autocomplete: "new-password" })
    ]
  });
}

function openModal({ title, mode, editingId, fields }) {
  state.modalMode = mode;
  state.editingId = editingId;
  elements.modalTitle.textContent = title;
  // One reusable modal keeps create/edit forms consistent across modules.
  elements.modalForm.innerHTML = `
    <div class="form-grid two">
      ${fields.join("")}
    </div>
    <div class="form-actions">
      <button class="ghost-btn" type="button" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" type="submit">Save Record</button>
    </div>
  `;
  elements.modalForm.onsubmit = handleModalSubmit;
  elements.modalBackdrop.classList.remove("is-hidden");
  bindRelationshipAutofill();
}

function closeModal() {
  elements.modalBackdrop.classList.add("is-hidden");
  elements.modalForm.reset();
  elements.modalForm.onsubmit = null;
  state.modalMode = null;
  state.editingId = null;
}

function bindRelationshipAutofill() {
  const form = elements.modalForm;
  if (!form) return;

  if (state.modalMode === "people_profiles") {
    form.elements.department_id?.addEventListener("change", (event) => {
      const departmentName = departmentNameRaw(event.target.value);
      if (form.elements.assigned_team && departmentName) form.elements.assigned_team.value = departmentName;
    });
  }

  if (state.modalMode === "generated_tasks") {
    form.elements.template_id?.addEventListener("change", (event) => applyTaskWorkflow(event.target.value));
    form.elements.plan_id?.addEventListener("change", (event) => applyTaskPlanRelationship(event.target.value));
    form.elements.plan_item_id?.addEventListener("change", (event) => applyTaskPlanItemRelationship(event.target.value));
    form.elements.product_line_id?.addEventListener("change", (event) => applyTaskWorkspaceRelationship(event.target.value));
    form.elements.sop_id?.addEventListener("change", (event) => applyTaskSopRelationship(event.target.value));
  }

  if (state.modalMode === "standard_operating_procedures") {
    form.elements.task_id?.addEventListener("change", (event) => applySopTaskRelationship(event.target.value));
    form.elements.workflow_template_id?.addEventListener("change", (event) => applySopWorkflowRelationship(event.target.value));
    form.elements.workspace_id?.addEventListener("change", (event) => applySopWorkspaceRelationship(event.target.value));
    form.elements.plan_id?.addEventListener("change", (event) => applySopPlanRelationship(event.target.value));
    const attachmentToggle = form.elements.attachments_required;
    const uploadField = form.querySelector("[data-sop-attachment-upload]");
    const syncAttachmentUpload = () => {
      if (!uploadField) return;
      const checked = Boolean(form.querySelector('[name="attachments_required"][type="checkbox"]')?.checked);
      uploadField.hidden = !checked;
      const input = uploadField.querySelector('input[type="file"]');
      if (input && !checked) input.value = "";
    };
    if (attachmentToggle) {
      form.querySelector('[name="attachments_required"][type="checkbox"]')?.addEventListener("change", syncAttachmentUpload);
      syncAttachmentUpload();
    }
  }

  if (state.modalMode === "sop_summary_report_generator") {
    form.elements.sop_id?.addEventListener("change", (event) => applySopSummaryDefaults(event.target.value));
  }

  if (state.modalMode === "sop_summary_reports") {
    form.elements.sop_id?.addEventListener("change", (event) => applySopSummaryDefaults(event.target.value));
  }

  if (["assessment_templates", "assessments", "assessment_sections", "assessment_findings"].includes(state.modalMode)) {
    setupAssessmentRatingControls(form);
    form.elements.assessment_type_id?.addEventListener("change", () => setupAssessmentRatingControls(form));
    form.elements.template_id?.addEventListener("change", () => setupAssessmentRatingControls(form));
    form.elements.assessment_id?.addEventListener("change", () => setupAssessmentRatingControls(form));
    form.elements.assessment_source?.addEventListener("change", () => {
      if (form.elements.assessment_source.value === "consultant" && form.elements.evaluator_organization && !form.elements.evaluator_organization.value) {
        form.elements.evaluator_organization.value = "CSA Business Consultancy";
      }
    });
    form.elements.evaluator_type?.addEventListener("change", () => {
      if (form.elements.evaluator_type.value === "consultant" && form.elements.evaluator_organization && !form.elements.evaluator_organization.value) {
        form.elements.evaluator_organization.value = "CSA Business Consultancy";
      }
    });
  }
}

function applyTaskWorkflow(templateId) {
  const form = elements.modalForm;
  const template = state.scheduleTemplates.find((record) => record.id === templateId);
  if (!form || !template) return;

  if (form.elements.category_id) form.elements.category_id.value = template.category_id || "";
  if (form.elements.product_line_id) form.elements.product_line_id.value = template.product_line_id || "";
  if (form.elements.sop_id && template.product_line_id && !form.elements.sop_id.value) {
    form.elements.sop_id.value = governingSopForWorkspace(template.product_line_id)?.id || "";
  }
  if (form.elements.equipment_id) form.elements.equipment_id.value = template.equipment_id || "";
  if (form.elements.due_time) form.elements.due_time.value = template.due_time || "";
  if (form.elements.task_title && (!form.elements.task_title.value || form.elements.task_title.value === "Workspace Task Title")) {
    form.elements.task_title.value = template.template_title || "";
  }
  if (form.elements.remarks && !form.elements.remarks.value) form.elements.remarks.value = template.remarks || template.objective || "";
}

function applyTaskPlanRelationship(planId) {
  const form = elements.modalForm;
  if (!form) return;
  const item = state.planItems.find((record) => record.plan_id === planId);
  if (form.elements.plan_item_id && item) form.elements.plan_item_id.value = item.id;
}

function applyTaskPlanItemRelationship(planItemId) {
  const form = elements.modalForm;
  const item = state.planItems.find((record) => record.id === planItemId);
  if (!form || !item) return;
  if (form.elements.plan_id) form.elements.plan_id.value = item.plan_id || "";
  if (form.elements.task_title && !form.elements.task_title.value) form.elements.task_title.value = item.category || item.objective || "";
  if (form.elements.remarks && !form.elements.remarks.value) form.elements.remarks.value = item.objective || item.expected_output || "";
}

function applyTaskWorkspaceRelationship(workspaceId) {
  const form = elements.modalForm;
  if (!form || !workspaceId) return;
  if (form.elements.sop_id && !form.elements.sop_id.value) {
    form.elements.sop_id.value = governingSopForWorkspace(workspaceId)?.id || "";
  }
}

function applyTaskSopRelationship(sopId) {
  const form = elements.modalForm;
  const sop = state.standardOperatingProcedures.find((record) => record.id === sopId);
  if (!form || !sop) return;
  if (form.elements.product_line_id && sop.workspace_id) form.elements.product_line_id.value = sop.workspace_id;
  if (form.elements.template_id && sop.workflow_template_id && !form.elements.template_id.value) form.elements.template_id.value = sop.workflow_template_id;
  if (form.elements.plan_id && sop.plan_id && !form.elements.plan_id.value) form.elements.plan_id.value = sop.plan_id;
  if (form.elements.plan_item_id && sop.plan_item_id && !form.elements.plan_item_id.value) form.elements.plan_item_id.value = sop.plan_item_id;
}

function applySopTaskRelationship(taskId) {
  const form = elements.modalForm;
  const task = state.generatedTasks.find((record) => record.id === taskId);
  if (!form || !task) return;

  if (form.elements.workspace_id) form.elements.workspace_id.value = taskWorkspaceId(task) || "";
  if (form.elements.workflow_template_id) form.elements.workflow_template_id.value = task.template_id || "";
  if (form.elements.plan_id) form.elements.plan_id.value = task.plan_id || "";
  if (form.elements.plan_item_id) form.elements.plan_item_id.value = task.plan_item_id || "";
  const person = state.peopleProfiles.find((record) => record.id === task.assigned_person_id);
  if (form.elements.department_id && person?.department_id) form.elements.department_id.value = person.department_id;
  if (form.elements.owner_person_id && task.assigned_person_id) form.elements.owner_person_id.value = task.assigned_person_id;
}

function applySopWorkflowRelationship(templateId) {
  const form = elements.modalForm;
  const template = state.scheduleTemplates.find((record) => record.id === templateId);
  if (!form || !template) return;
  if (form.elements.workspace_id) form.elements.workspace_id.value = template.product_line_id || "";
  if (form.elements.category && !form.elements.category.value) form.elements.category.value = categoryNameRaw(template.category_id) || "";
}

function applySopWorkspaceRelationship(workspaceId) {
  const form = elements.modalForm;
  if (!form || !workspaceId) return;
  const task = state.generatedTasks.find((record) => taskWorkspaceId(record) === workspaceId);
  if (task && form.elements.task_id && !form.elements.task_id.value) applySopTaskRelationship(task.id);
}

function applySopPlanRelationship(planId) {
  const form = elements.modalForm;
  if (!form || !planId) return;
  const item = state.planItems.find((record) => record.plan_id === planId);
  if (item && form.elements.plan_item_id && !form.elements.plan_item_id.value) form.elements.plan_item_id.value = item.id;
}

async function handleModalSubmit(event) {
  event.preventDefault();
  if (state.modalMode === "change_password") {
    await handleChangePasswordSubmit(event.currentTarget);
    return;
  }
  if (state.modalMode === "sop_summary_report_generator") {
    await handleSopSummaryReportSubmit(event.currentTarget);
    return;
  }

  if (state.modalMode === "user_profiles" && !isAdmin()) {
    showToast("Only administrators can edit user accounts.", "error");
    return;
  }
  if (state.modalMode === "personnel" && !canManagePersonnel()) {
    showToast("Only administrators can manage personnel.", "error");
    return;
  }
  if (state.modalMode === "people_profiles" && !canManagePersonnel()) {
    showToast("Only administrators or general managers can manage HR profiles.", "error");
    return;
  }
  if (state.modalMode === "employee_documents" && !canManagePersonnel()) {
    showToast("Only HR or managers can manage employee document records.", "error");
    return;
  }
  if (state.modalMode === "departments" && !canManagePersonnel()) {
    showToast("Only HR or authorized managers can manage departments.", "error");
    return;
  }
  if (state.modalMode === "attendance" && !canManagePersonnel()) {
    showToast("Only HR or authorized managers can manage attendance.", "error");
    return;
  }
  if (state.modalMode === "standard_operating_procedures" && !canManageSops()) {
    showToast("Your role cannot manage SOP records.", "error");
    return;
  }
  if (state.modalMode === "sop_summary_reports" && !canManageSops()) {
    showToast("Your role cannot edit SOP summary reports.", "error");
    return;
  }
  if (["assessment_templates", "assessment_template_sections", "assessment_template_questions", "assessment_sections", "assessment_findings", "assessment_corrective_actions", "assessment_rating_scales", "assessment_reports"].includes(state.modalMode) && !canManageAssessments()) {
    showToast("Your role cannot manage assessment records.", "error");
    return;
  }
  if (state.modalMode === "assessments" && !canCreateAssessments() && !canManageAssessments()) {
    showToast("Your role cannot create assessments.", "error");
    return;
  }
  if (state.modalMode === "company_settings" && !canManageCompanySettings()) {
    showToast("Only general managers can update company settings.", "error");
    return;
  }
  if (["equipment", "equipment_maintenance_history"].includes(state.modalMode) && !canManageEquipment()) {
    showToast("Your role cannot manage equipment.", "error");
    return;
  }
  if (["product_lines", "monitoring_categories", "monitoring_schedule_templates", "monitoring_templates", "dynamic_checklists", "template_workflows", "generated_tasks"].includes(state.modalMode) && !canManagePlans()) {
    showToast("Your role cannot manage workflows or generated tasks.", "error");
    return;
  }
  if (["plans", "plan_items"].includes(state.modalMode) && !canManagePlans()) {
    showToast("Your role cannot manage plans.", "error");
    return;
  }
  if (state.modalMode === "do_records" && !canDoTasks()) {
    showToast("Your role cannot record implementation work.", "error");
    return;
  }
  if (state.modalMode === "check_records" && !canCheckTasks()) {
    showToast("Only supervisors and managers can verify records.", "error");
    return;
  }
  if (state.modalMode === "action_taken" && !canManageActionCenter()) {
    showToast("Your role cannot manage corrective actions.", "error");
    return;
  }
  if (state.modalMode === "task_do_records" && !canDoTasks()) {
    showToast("Your role cannot record task work.", "error");
    return;
  }
  if (state.modalMode === "task_check_records" && !canCheckTasks()) {
    showToast("Only supervisors and managers can check tasks.", "error");
    return;
  }
  if (state.modalMode === "action_cases" && !canManageActionCenter()) {
    showToast("Your role cannot manage action cases.", "error");
    return;
  }
  if (![
    "personnel", "user_profiles", "people_profiles", "departments", "attendance", "change_password",
    "company_settings", "equipment", "equipment_maintenance_history", "product_lines", "monitoring_categories",
    "monitoring_schedule_templates", "monitoring_templates", "dynamic_checklists", "template_workflows", "generated_tasks", "task_do_records",
    "task_check_records", "action_cases", "plans", "plan_items", "do_records",
    "check_records", "action_taken", "employee_documents", "standard_operating_procedures", "sop_summary_reports",
    "assessment_templates", "assessment_template_sections", "assessment_template_questions", "assessments", "assessment_sections",
    "assessment_findings", "assessment_corrective_actions", "assessment_rating_scales", "assessment_reports"
  ].includes(state.modalMode) && !canManageRecords()) {
    showToast("Your account is view-only until an administrator assigns a role.", "error");
    return;
  }

  const formData = new FormData(event.currentTarget);
  let evidenceFiles = formData.getAll("evidence_file").filter((file) => file instanceof File && file.size);
  const payload = Object.fromEntries(formData.entries());
  delete payload.evidence_file;
  delete payload.department_display;
  delete payload.workspace_display;
  delete payload.governing_sop_display;
  delete payload.related_sop_display;
  const selectedGoverningSopId = state.modalMode === "product_lines" ? payload.governing_sop_id || null : undefined;
  const selectedRelatedSopId = ["plans", "plan_items"].includes(state.modalMode) ? payload.related_sop_id || null : undefined;
  delete payload.governing_sop_id;
  delete payload.related_sop_id;

  Object.keys(payload).forEach((key) => {
    if (payload[key] === "") payload[key] = null;
  });

  if (payload.period_month) payload.period_month = Number(payload.period_month);
  if (payload.period_year) payload.period_year = Number(payload.period_year);
  ["monthly_day", "at_risk_hours", "sort_order", "due_after_hours"].forEach((key) => {
    if (payload[key]) payload[key] = Number(payload[key]);
  });
  ["overall_score", "section_score", "score", "min_score", "max_score", "percentage_value", "star_value", "numeric_value", "overall_percentage_value", "overall_star_value", "overall_numeric_value", "star_max", "numeric_min", "numeric_max", "passing_threshold", "score_value"].forEach((key) => {
    if (payload[key] !== null && payload[key] !== undefined && payload[key] !== "") payload[key] = Number(payload[key]);
  });
  ["auto_generate", "requires_approval", "manager_notified", "evidence_required", "rating_required", "is_required", "requires_corrective_action", "checklist_enabled", "verification_required", "corrective_action_required", "is_active", "is_passing", "allow_not_applicable", "requires_evidence", "attachments_required"].forEach((key) => {
    if (key in payload) payload[key] = payload[key] === "true";
  });
  if (state.modalMode === "standard_operating_procedures" && !payload.attachments_required) {
    evidenceFiles = [];
  }
  ["recurrence_days", "recurrence_times"].forEach((key) => {
    if (payload[key]) {
      payload[key] = String(payload[key]).split(",").map((item) => item.trim()).filter(Boolean);
    }
  });
  if (state.modalMode === "monitoring_schedule_templates" && payload.requires_approval && payload.approval_status === "draft") {
    payload.approval_status = "pending";
  }
  if (state.modalMode === "people_profiles" && "department_id" in payload) {
    payload.department = payload.department_id ? departmentNameRaw(payload.department_id) : null;
    payload.assigned_team = payload.department || payload.assigned_team || null;
  }
  if (state.modalMode === "standard_operating_procedures" && "department_id" in payload) {
    payload.department = payload.department_id ? departmentNameRaw(payload.department_id) : null;
  }
  if (state.modalMode === "sop_summary_reports") {
    const report = buildSopSummaryReportData(payload);
    if (report.sop) {
      payload.total_activities = report.summary.totalActivities;
      payload.completed_activities = report.summary.completedActivities;
      payload.non_compliant_activities = report.summary.nonCompliantActivities;
      payload.open_corrective_actions = report.summary.openCorrectiveActions;
      payload.closed_corrective_actions = report.summary.closedCorrectiveActions;
      payload.compliance_percentage = report.summary.compliancePercentage;
      payload.summary_snapshot = report.snapshot;
    }
  }
  if (state.modalMode === "assessment_templates") {
    payload.scoring_method = payload.rating_method || payload.scoring_method || "custom";
  }
  if (state.modalMode === "assessments") {
    payload.assessed_business_name = payload.assessed_business_name || payload.assessed_company_name || null;
    payload.assessed_company_name = payload.assessed_company_name || payload.assessed_business_name || null;
    payload.assessed_address = payload.assessed_address || payload.assessed_location || null;
    payload.assessed_location = payload.assessed_location || payload.assessed_address || null;
    payload.assessment_start_time = payload.assessment_start_time || payload.start_time || null;
    payload.start_time = payload.start_time || payload.assessment_start_time || null;
    payload.assessment_end_time = payload.assessment_end_time || payload.end_time || null;
    payload.end_time = payload.end_time || payload.assessment_end_time || null;
    payload.evaluator_type = payload.evaluator_type || payload.assessment_source || "internal";
    payload.assessment_source = payload.assessment_source || payload.evaluator_type || "internal";
    payload.overall_compliance_level = payload.overall_compliance_level || payload.compliance_level || null;
    payload.compliance_level = payload.compliance_level || payload.overall_compliance_level || null;
    payload.general_findings = payload.general_findings || payload.findings_summary || null;
    payload.findings_summary = payload.findings_summary || payload.general_findings || null;
    applyAssessmentRatingPayload(payload, "overall");
  }
  if (state.modalMode === "assessment_sections") {
    applyAssessmentRatingPayload(payload, "section");
  }
  if (state.modalMode === "assessment_findings") {
    applyAssessmentRatingPayload(payload, "finding");
  }

  const validationMessage = validateDates(state.modalMode, payload);
  if (validationMessage) {
    showToast(validationMessage, "error");
    return;
  }

  if (state.modalMode === "generated_tasks") {
    if (payload.plan_item_id && !payload.plan_id) {
      payload.plan_id = state.planItems.find((item) => item.id === payload.plan_item_id)?.plan_id || null;
    }
    payload.workspace_id = payload.product_line_id || null;
  }

  if (state.modalMode === "generated_tasks" || ["assessments", "assessment_templates", "assessment_sections", "assessment_findings", "assessment_corrective_actions", "assessment_reports"].includes(state.modalMode) || (state.modalMode === "product_lines" && tableHasColumn(state.productLines, "updated_at")) || state.modalMode === "departments") {
    payload.updated_at = new Date().toISOString();
  }

  setLoading(true);
  try {
    const { savedRecord } = await saveModalRecord(state.modalMode, payload, state.editingId);
    const recordId = savedRecord?.id || state.editingId;
    const uploadedAttachments = [];
    if (evidenceFiles.length && recordId) {
      for (const evidenceFile of evidenceFiles) {
        const attachmentRecord = await uploadAttachment(evidenceFile, state.modalMode, recordId, attachmentTypeForMode(state.modalMode));
        uploadedAttachments.push(attachmentRecord);
      }
      if (state.modalMode === "employee_documents" && uploadedAttachments[0]?.id) {
        await db.from("employee_documents").update({ file_attachment_id: uploadedAttachments[0].id }).eq("id", recordId);
      }
    }
    if (state.modalMode === "product_lines" && recordId) {
      await syncWorkspaceGoverningSop(recordId, selectedGoverningSopId);
    }
    if (state.modalMode === "plans" && recordId) {
      await syncPlanSopLink(recordId, selectedRelatedSopId);
    }
    if (state.modalMode === "plan_items" && recordId) {
      await syncPlanItemSopLink(recordId, savedRecord?.plan_id || payload.plan_id, selectedRelatedSopId);
    }
    await afterRecordSaved(state.modalMode, payload, savedRecord);
    await logAudit(state.editingId ? "update" : "insert", state.modalMode, recordId, payload);
    showToast("Record saved successfully.", "success");
    closeModal();
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function handleChangePasswordSubmit(form) {
  const formData = new FormData(form);
  const newPassword = String(formData.get("new_password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (newPassword.length < 6) {
    showToast("Password must be at least 6 characters.", "error");
    return;
  }

  if (newPassword !== confirmPassword) {
    showToast("Password confirmation does not match.", "error");
    return;
  }

  setLoading(true);
  try {
    const { error } = await db.auth.updateUser({ password: newPassword });
    if (error) throw error;
    showToast("Password changed successfully.", "success");
    closeModal();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function uploadAttachment(file, relatedTable, relatedRecordId, attachmentType = "evidence") {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${relatedTable}/${relatedRecordId}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await db.storage
    .from("pdca-attachments")
    .upload(filePath, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data, error } = await db.from("file_attachments").insert({
    bucket_name: "pdca-attachments",
    file_path: filePath,
    file_name: file.name,
    file_type: file.type || "application/octet-stream",
    file_size: file.size,
    related_table: relatedTable,
    related_record_id: relatedRecordId,
    attachment_type: attachmentType
  }).select("*").single();

  if (error) throw error;
  return data;
}

async function saveModalRecord(tableName, payload, editingId = null) {
  const runSave = async (dataPayload) => {
    const query = db.from(tableName);
    return editingId
      ? await query.update(dataPayload).eq("id", editingId).select("*").single()
      : await query.insert(dataPayload).select("*").single();
  };

  let { data, error } = await runSave(payload);
  if (!error) return { savedRecord: data };

  const retryPayload = schemaCompatiblePayload(tableName, payload, error);
  if (!retryPayload) throw error;

  const retry = await runSave(retryPayload);
  if (retry.error) throw retry.error;
  showToast("Saved without new traceability columns. Run the Supabase migration to activate full Plan/SOP task links.", "error");
  return { savedRecord: retry.data };
}

function schemaCompatiblePayload(tableName, payload, error) {
  const message = String(error?.message || "");
  if (tableName !== "generated_tasks" || !/plan_id|plan_item_id|sop_id|schema cache|column/i.test(message)) return null;
  const retryPayload = { ...payload };
  ["plan_id", "plan_item_id", "sop_id"].forEach((key) => delete retryPayload[key]);
  return retryPayload;
}

function attachmentTypeForMode(mode) {
  if (mode === "employee_documents") return "employee_document";
  if (mode === "standard_operating_procedures") return "sop_document";
  if (String(mode || "").startsWith("assessment")) return "assessment_evidence";
  return "evidence";
}

async function logAudit(action, tableName, recordId, newData = null) {
  try {
    await db.from("audit_logs").insert({
      user_id: state.session?.user?.id || null,
      user_email: state.session?.user?.email || "",
      action,
      table_name: tableName,
      record_id: recordId || null,
      new_data: newData
    });
  } catch (error) {
    console.warn("Audit log skipped:", error.message);
  }
}

async function createNotification({ recipientUserId, recipientPersonId, title, message, type = "info", relatedTable, relatedRecordId }) {
  if (!recipientUserId && !recipientPersonId) return;
  try {
    await db.from("notifications").insert({
      recipient_user_id: recipientUserId || null,
      recipient_person_id: recipientPersonId || null,
      title,
      message,
      notification_type: type,
      related_table: relatedTable || null,
      related_record_id: relatedRecordId || null
    });
  } catch (error) {
    console.warn("Notification skipped:", error.message);
  }
}

async function notifyManagers(title, message, relatedTable, relatedRecordId) {
  const managerRoles = ["administrator", "general_manager", "production_manager", "food_safety_compliance_officer"];
  const recipients = state.userProfiles.filter((profile) => managerRoles.includes(normalizeRole(profile.role)));
  await Promise.all(recipients.map((profile) => createNotification({
    recipientUserId: profile.id,
    title,
    message,
    type: "warning",
    relatedTable,
    relatedRecordId
  })));
}

async function createApprovalRequestForRecord(record, relatedTable) {
  if (!record?.id) return;
  const approverUserId = personUserId(record.approved_by);
  try {
    const duplicate = state.approvalRequests.some((item) => (
      item.related_table === relatedTable && item.related_record_id === record.id && item.approval_status === "pending"
    ));
    if (duplicate) return;

    await db.from("approval_requests").insert({
      related_table: relatedTable,
      related_record_id: record.id,
      approver_user_id: approverUserId,
      approver_person_id: record.approved_by || null,
      approval_status: "pending",
      request_note: "Approval requested from the PDCA planning workflow."
    });

    await createNotification({
      recipientUserId: approverUserId,
      recipientPersonId: record.approved_by,
      title: "Approval required",
      message: `${record.template_title || "A workflow"} is waiting for approval.`,
      type: "approval",
      relatedTable,
      relatedRecordId: record.id
    });
  } catch (error) {
    console.warn("Approval request skipped:", error.message);
  }
}

async function afterRecordSaved(mode, payload, savedRecord = null) {
  if (mode === "task_do_records" && payload.task_id) {
    await db.from("generated_tasks").update({ task_status: "completed", completed_at: new Date().toISOString() }).eq("id", payload.task_id);
  }

  if (mode === "task_check_records" && payload.task_id) {
    const nextStatus = payload.check_result === "not_compliant" ? "not_compliant" : "checked";
    await db.from("generated_tasks").update({ task_status: nextStatus, checked_at: new Date().toISOString() }).eq("id", payload.task_id);

    if (payload.check_result === "not_compliant") {
      const task = state.generatedTasks.find((item) => item.id === payload.task_id);
      const { data: actionCase } = await db.from("action_cases").insert({
        task_id: payload.task_id,
        opened_by: payload.checked_by || null,
        case_title: `Action needed: ${task?.task_title || "Task"}`,
        non_compliance_note: payload.observation || payload.remarks || "Supervisor marked this task as not compliant.",
        case_status: "open"
      }).select("*").single();

      await notifyManagers(
        "Corrective action opened",
        `${task?.task_title || "A task"} was marked not compliant by the supervisor.`,
        "action_cases",
        actionCase?.id || null
      );
    }
  }

  if (mode === "generated_tasks" && savedRecord?.assigned_person_id) {
    await createNotification({
      recipientUserId: personUserId(savedRecord.assigned_person_id),
      recipientPersonId: savedRecord.assigned_person_id,
      title: "New task assigned",
      message: `${savedRecord.task_title || "A PDCA task"} is scheduled for ${formatDate(savedRecord.task_date)}.`,
      type: "task",
      relatedTable: "generated_tasks",
      relatedRecordId: savedRecord.id
    });
  }

  if (mode === "monitoring_schedule_templates" && savedRecord?.requires_approval) {
    await createApprovalRequestForRecord(savedRecord, "monitoring_schedule_templates");
  }

  if (mode === "monitoring_schedule_templates" && savedRecord?.auto_generate && (!savedRecord.requires_approval || savedRecord.approval_status === "approved")) {
    await generateTasksFromTemplate(savedRecord);
  }

  if (mode === "assessments" && savedRecord?.id) {
    await ensureAssessmentSectionsFromTemplate(savedRecord);
    await notifyAssessmentStakeholders(savedRecord, "Assessment saved", `${savedRecord.assessment_title || "Assessment"} is now ${formattedRoleLabel(savedRecord.assessment_status || "draft")}.`);
  }

  if (mode === "assessment_findings" && savedRecord?.requires_corrective_action) {
    await notifyManagers("Assessment finding needs action", savedRecord.observation || savedRecord.question_text || "A finding requires corrective action.", "assessment_findings", savedRecord.id);
  }

  if (mode === "assessment_corrective_actions" && savedRecord?.assigned_to) {
    await createNotification({
      recipientUserId: personUserId(savedRecord.assigned_to),
      recipientPersonId: savedRecord.assigned_to,
      title: "Assessment action assigned",
      message: savedRecord.action_title || "A corrective action was assigned to you.",
      type: "assessment",
      relatedTable: "assessment_corrective_actions",
      relatedRecordId: savedRecord.id
    });
  }

  if (mode === "assessment_reports" && savedRecord?.id) {
    await notifyManagers("Assessment report generated", savedRecord.report_title || "An assessment report was generated.", "assessment_reports", savedRecord.id);
  }
}

async function syncWorkspaceGoverningSop(workspaceId, sopId = null) {
  if (!workspaceId || !canManageSops()) return;

  const clearQuery = db
    .from("standard_operating_procedures")
    .update({ workspace_id: null })
    .eq("workspace_id", workspaceId);

  const { error: clearError } = sopId
    ? await clearQuery.neq("id", sopId)
    : await clearQuery;

  if (clearError) throw clearError;

  if (sopId) {
    const { error: linkError } = await db
      .from("standard_operating_procedures")
      .update({ workspace_id: workspaceId })
      .eq("id", sopId);

    if (linkError) throw linkError;
  }
}

async function syncPlanSopLink(planId, sopId = null) {
  if (!planId || !canManageSops()) return;

  const clearQuery = db
    .from("standard_operating_procedures")
    .update({ plan_id: null })
    .eq("plan_id", planId)
    .is("plan_item_id", null);

  const { error: clearError } = sopId
    ? await clearQuery.neq("id", sopId)
    : await clearQuery;

  if (clearError) throw clearError;

  if (sopId) {
    const { error: linkError } = await db
      .from("standard_operating_procedures")
      .update({ plan_id: planId })
      .eq("id", sopId);

    if (linkError) throw linkError;
  }
}

async function syncPlanItemSopLink(planItemId, planId, sopId = null) {
  if (!planItemId || !canManageSops()) return;

  const clearQuery = db
    .from("standard_operating_procedures")
    .update({ plan_item_id: null })
    .eq("plan_item_id", planItemId);

  const { error: clearError } = sopId
    ? await clearQuery.neq("id", sopId)
    : await clearQuery;

  if (clearError) throw clearError;

  if (sopId) {
    const { error: linkError } = await db
      .from("standard_operating_procedures")
      .update({ plan_id: planId || null, plan_item_id: planItemId })
      .eq("id", sopId);

    if (linkError) throw linkError;
  }
}

async function generateTasksFromTemplate(template) {
  const start = template.generation_start_date || template.start_date;
  const end = template.generation_end_date || template.end_date || start;
  if (!start || !end) return;

  const dates = datesForRecurrence(template, start, end);
  const times = Array.isArray(template.recurrence_times) && template.recurrence_times.length
    ? template.recurrence_times
    : [template.due_time || null];

  const existingKeys = new Set(
    state.generatedTasks
      .filter((task) => task.template_id === template.id)
      .map((task) => `${task.task_date}|${task.due_time || ""}`)
  );

  const tasks = dates.flatMap((dateValue) => times.map((timeValue) => ({
    template_id: template.id,
    category_id: template.category_id || null,
    product_line_id: template.product_line_id || null,
    workspace_id: template.product_line_id || null,
    sop_id: governingSopForWorkspace(template.product_line_id)?.id || null,
    equipment_id: template.equipment_id || null,
    task_title: template.template_title,
    task_date: dateValue,
    due_time: timeValue,
    assigned_by: template.created_by || null,
    task_status: dateValue === toDateInputValue(new Date()) ? "due_today" : "scheduled",
    priority: "normal",
    at_risk_at: atRiskTimestamp(dateValue, timeValue, template.at_risk_hours || 6),
    remarks: template.remarks || null
  }))).filter((task) => !existingKeys.has(`${task.task_date}|${task.due_time || ""}`));

  if (!tasks.length) return;

  try {
    let { error } = await db.from("generated_tasks").insert(tasks);
    if (error) {
      const retryTasks = tasks.map((task) => {
        const clone = { ...task };
        ["plan_id", "plan_item_id", "sop_id"].forEach((key) => delete clone[key]);
        return clone;
      });
      const retry = await db.from("generated_tasks").insert(retryTasks);
      error = retry.error;
    }
    if (error) throw error;
    await logAudit("generate_tasks", "generated_tasks", template.id, { count: tasks.length, template_id: template.id });
  } catch (error) {
    console.warn("Task generation skipped:", error.message);
  }
}

function datesForRecurrence(template, start, end) {
  const dates = [];
  const cursor = startOfDay(start);
  const last = startOfDay(end);
  const recurrenceType = template.recurrence_type || "manual";
  const days = Array.isArray(template.recurrence_days)
    ? template.recurrence_days.map((day) => String(day).toLowerCase())
    : [];
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  while (cursor <= last) {
    const dayName = dayNames[cursor.getDay()];
    const dateValue = toDateInputValue(cursor);
    const includeDate =
      recurrenceType === "manual" ||
      recurrenceType === "daily" ||
      (recurrenceType === "weekly" && (!days.length || days.includes(dayName))) ||
      (recurrenceType === "monthly" && cursor.getDate() === Number(template.monthly_day || 1));

    if (includeDate) dates.push(dateValue);
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

function atRiskTimestamp(dateValue, timeValue, hoursBefore = 6) {
  if (!dateValue || !timeValue) return null;
  const date = new Date(`${dateValue}T${timeValue}`);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(date.getHours() - Number(hoursBefore || 6));
  return date.toISOString();
}

async function deleteRecord(table, id) {
  if (table === "product_lines") {
    await deleteWorkspace(id);
    return;
  }

  if (table === "generated_tasks") {
    await deleteGeneratedTask(id);
    return;
  }

  if (!canDeleteRecords()) {
    showToast("Only administrators can delete records.", "error");
    return;
  }

  const confirmed = window.confirm("Delete this record? This action cannot be undone.");
  if (!confirmed) return;

  setLoading(true);
  try {
    const { error } = await db.from(table).delete().eq("id", id);
    if (error) throw error;
    await logAudit("delete", table, id);
    showToast("Record deleted.", "success");
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function deleteWorkspace(workspaceId) {
  if (!canDeleteRecords()) {
    showToast("Only administrators can delete workspaces.", "error");
    return;
  }

  const confirmed = window.confirm("Deleting this workspace will also delete all tasks under it. This action cannot be undone.");
  if (!confirmed) return;

  setLoading(true);
  try {
    const { error } = await db.from("product_lines").delete().eq("id", workspaceId);
    if (error) throw error;
    await logAudit("delete", "product_lines", workspaceId);
    showToast("Workspace deleted.", "success");
    await loadAllData();
  } catch (error) {
    const message = String(error.message || "");
    const canRetryWithManualChildDelete = /foreign key|constraint|violates|conflict/i.test(message);

    if (!canRetryWithManualChildDelete) {
      showToast(error.message, "error");
      setLoading(false);
      return;
    }

    try {
      await deleteWorkspaceTasksForWorkspace(workspaceId);
      const { error: workspaceDeleteError } = await db.from("product_lines").delete().eq("id", workspaceId);
      if (workspaceDeleteError) throw workspaceDeleteError;
      await logAudit("delete", "generated_tasks", workspaceId, { workspace_id: workspaceId, reason: "workspace_delete_child_cleanup" });
      await logAudit("delete", "product_lines", workspaceId);
      showToast("Workspace and its tasks deleted.", "success");
      await loadAllData();
    } catch (fallbackError) {
      showToast(fallbackError.message, "error");
    } finally {
      setLoading(false);
    }
    return;
  } finally {
    setLoading(false);
  }
}

async function deleteWorkspaceTasksForWorkspace(workspaceId) {
  const { error } = await db
    .from("generated_tasks")
    .delete()
    .or(`workspace_id.eq.${workspaceId},product_line_id.eq.${workspaceId}`);

  if (!error) return;

  const { error: productLineDeleteError } = await db
    .from("generated_tasks")
    .delete()
    .eq("product_line_id", workspaceId);

  if (productLineDeleteError) throw productLineDeleteError;
}

async function deleteGeneratedTask(taskId) {
  if (!canDeleteRecords()) {
    showToast("Only administrators can delete workspace tasks.", "error");
    return;
  }

  const confirmed = window.confirm("Delete this workspace task? This action cannot be undone.");
  if (!confirmed) return;

  setLoading(true);
  try {
    const { error } = await db.from("generated_tasks").delete().eq("id", taskId);
    if (error) throw error;
    await logAudit("delete", "generated_tasks", taskId);
    showToast("Workspace task deleted.", "success");
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function updateRolePermission(role, moduleKey, action, checked) {
  if (!isAdmin()) {
    showToast("Only administrators can update permissions.", "error");
    renderPermissionMatrix();
    return;
  }

  const existing = state.rolePermissions.find((item) => item.role === role && item.module_key === moduleKey);
  const payload = {
    role,
    module_key: moduleKey,
    can_view: existing?.can_view || false,
    can_create: existing?.can_create || false,
    can_edit: existing?.can_edit || false,
    can_delete: existing?.can_delete || false,
    can_approve: existing?.can_approve || false,
    can_export: existing?.can_export || false,
    [`can_${action}`]: checked,
    updated_at: new Date().toISOString()
  };

  setLoading(true);
  try {
    const { error } = await db.from("role_permissions").upsert(payload, { onConflict: "role,module_key" });
    if (error) throw error;
    await logAudit("update_permission", "role_permissions", existing?.id || null, payload);
    showToast("Permission updated.", "success");
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
    renderPermissionMatrix();
  } finally {
    setLoading(false);
  }
}

async function markNotificationRead(id) {
  const notification = state.notifications.find((item) => item.id === id);
  if (!notification || !canSeeNotification(notification)) {
    showToast("You cannot update this notification.", "error");
    return;
  }

  setLoading(true);
  try {
    setNotificationReadLocally([id]);
    renderNotifications();
    const { data, error } = await db
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Notification update was blocked by Supabase RLS. Apply the notification read policy SQL, then try again.");
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function markAllNotificationsRead() {
  const ids = state.notifications
    .filter((item) => !item.is_read && canSeeNotification(item))
    .map((item) => item.id);
  if (!ids.length) {
    showToast("No unread notifications.", "success");
    return;
  }

  setLoading(true);
  try {
    setNotificationReadLocally(ids);
    renderNotifications();
    const { data, error } = await db
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .in("id", ids)
      .select("id");
    if (error) throw error;
    if (!data || data.length !== ids.length) throw new Error("Some notification updates were blocked by Supabase RLS. Apply the notification read policy SQL, then try again.");
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function decideApproval(id, status) {
  if (!canApproveRecords()) {
    showToast("Your role cannot approve records.", "error");
    return;
  }

  const request = state.approvalRequests.find((item) => item.id === id);
  setLoading(true);
  try {
    const { error } = await db
      .from("approval_requests")
      .update({
        approval_status: status,
        approval_note: status === "approved" ? "Approved from admin queue." : "Rejected from admin queue.",
        decided_at: new Date().toISOString()
      })
      .eq("id", id);
    if (error) throw error;

    if (request?.related_table && request?.related_record_id) {
      await db.from(request.related_table).update({ approval_status: status }).eq("id", request.related_record_id);
      if (status === "approved" && request.related_table === "monitoring_schedule_templates") {
        const template = state.scheduleTemplates.find((item) => item.id === request.related_record_id);
        if (template?.auto_generate) await generateTasksFromTemplate({ ...template, approval_status: "approved" });
      }
    }

    await logAudit(status, "approval_requests", id, { approval_status: status });
    showToast(`Request ${status}.`, "success");
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function activateSuggestedModule(templateId) {
  if (!canManagePlans()) {
    showToast("Your role cannot activate workflow modules.", "error");
    return;
  }

  const template = activeMonitoringTemplates().find((item) => item.id === templateId);
  if (!template) return;

  setLoading(true);
  try {
    const categoryId = await ensureMonitoringCategory(template);
    const { error } = await db.from("monitoring_schedule_templates").insert({
      template_title: template.category,
      category_id: categoryId,
      objective: template.objective,
      target_standard: template.target_standard,
      expected_output: template.expected_output,
      frequency: template.frequency,
      recurrence_type: inferRecurrenceType(template.frequency),
      at_risk_hours: 6,
      status: "active",
      remarks: template.remarks
    });
    if (error) throw error;
    await logAudit("activate_module", "monitoring_schedule_templates", null, { template_id: templateId });
    showToast(`${template.category} enabled.`, "success");
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function ensureMonitoringCategory(template) {
  const existing = state.monitoringCategories.find((item) => item.category_name.toLowerCase() === template.category.toLowerCase());
  if (existing) return existing.id;

  const { data, error } = await db
    .from("monitoring_categories")
    .insert({
      category_name: template.category,
      description: template.objective,
      default_frequency: template.frequency,
      status: "active"
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

function customizeSuggestedModule(templateId) {
  const template = activeMonitoringTemplates().find((item) => item.id === templateId);
  openScheduleTemplateModal();
  if (!template) return;
  requestAnimationFrame(() => {
    const map = {
      template_title: template.category,
      objective: template.objective,
      target_standard: template.target_standard,
      frequency: template.frequency,
      expected_output: template.expected_output,
      remarks: template.remarks,
      recurrence_type: inferRecurrenceType(template.frequency)
    };
    Object.entries(map).forEach(([name, value]) => {
      const control = elements.modalForm.elements[name];
      if (control) control.value = value || "";
    });
  });
}

function inferRecurrenceType(frequency = "") {
  const text = String(frequency).toLowerCase();
  if (text.includes("monthly")) return "monthly";
  if (text.includes("weekly") || text.includes("sunday") || text.includes("monday")) return "weekly";
  if (text.includes("daily") || text.includes("shift")) return "daily";
  return "manual";
}

function moduleMetricsById(templateId) {
  const template = activeWorkspaceTemplates().find((item) => item.id === templateId)
    || activeMonitoringTemplates().find((item) => item.id === templateId);
  if (!template) return null;
  return buildMonitoringModuleMetrics(template, elements.dashboardProductLineFilter?.value || "");
}

function openWorkspace(templateId) {
  const module = moduleMetricsById(templateId);
  const workspaceId = module?.template?.product_line_id || "";
  if (elements.taskWorkspaceFilter) elements.taskWorkspaceFilter.value = workspaceId;
  switchView("taskBoardView");
  renderTaskBoard();
  showToast(module ? `Workspace opened: ${module.template.category}. Showing its workspace tasks.` : "Workspace tasks opened.", "success");
}

function openSopWorkspace() {
  switchView("sopView");
  showToast("Workspace opened: SOP Library.", "success");
}

function viewModuleRecords(templateId) {
  openWorkspace(templateId);
}

function addModuleMonitoringEntry(templateId) {
  const module = moduleMetricsById(templateId);
  const task = module?.tasks.find((item) => ["scheduled", "due_today", "in_progress", "at_risk"].includes(taskDisplayStatus(item))) || module?.tasks[0];
  if (task) {
    openTaskDoModal(task.id);
    return;
  }

  const schedule = module?.moduleTemplates[0];
  if (schedule && canManagePlans()) {
    openGeneratedTaskModal(null, schedule.id);
    return;
  }

  showToast("Create a workflow and task first.", "error");
}

function viewModuleBacklogs(templateId) {
  const module = moduleMetricsById(templateId);
  switchView("taskBoardView");
  const count = module?.tasks.filter((task) => ["overdue", "at_risk", "due_today"].includes(taskDisplayStatus(task))).length || 0;
  showToast(`${count} backlog or urgent task${count === 1 ? "" : "s"} found for this module.`, count ? "error" : "success");
}

function createModuleCorrectiveAction(templateId) {
  const module = moduleMetricsById(templateId);
  const failedTask = module?.tasks.find((task) => ["not_compliant", "overdue", "at_risk"].includes(taskDisplayStatus(task))) || module?.tasks[0];
  if (!failedTask) {
    showToast("No task is available for corrective action.", "error");
    return;
  }

  if (!canManageActionCenter()) {
    showToast("Your role cannot create corrective actions.", "error");
    return;
  }

  openActionCaseModal();
  requestAnimationFrame(() => {
    const taskSelect = elements.modalForm.querySelector('[name="task_id"]');
    const titleInput = elements.modalForm.querySelector('[name="case_title"]');
    const noteInput = elements.modalForm.querySelector('[name="non_compliance_note"]');
    if (taskSelect) taskSelect.value = failedTask.id;
    if (titleInput) titleInput.value = `Action needed: ${failedTask.task_title}`;
    if (noteInput) noteInput.value = `${module.template.category} requires corrective action.`;
  });
}

function exportModuleReport(templateId) {
  const module = moduleMetricsById(templateId);
  if (!module) return;
  const rows = module.tasks.map((task) => ({
    Module: module.template.category,
    Task: task.task_title,
    Workspace: productLineNameRaw(taskWorkspaceId(task)),
    AssignedTo: peopleNameRaw(task.assigned_person_id),
    Date: task.task_date,
    DueTime: task.due_time || "",
    Status: taskDisplayStatus(task),
    Compliance: `${module.compliance}%`,
    OpenCases: module.cases.filter((item) => !["verified", "closed"].includes(item.case_status)).length
  }));
  downloadCsv(`${module.template.category.replaceAll(" ", "-").toLowerCase()}-monitoring-report.csv`, rows);
}

async function updateUserRole(id, role) {
  if (!isAdmin()) {
    showToast("Only administrators can update roles.", "error");
    return;
  }

  if (id === state.session.user.id) {
    showToast("You cannot change your own role while signed in.", "error");
    renderAdminUsers();
    return;
  }

  setLoading(true);
  try {
    const { error } = await db
      .from("user_profiles")
      .update({ role })
      .eq("id", id);

    if (error) throw error;
    showToast("User role updated.", "success");
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

function selectPlan(id) {
  state.selectedPlanId = id;
  renderPlans();
  renderPlanDetails();
}

function inputField(name, label, type = "text", value = "", required = false, attributes = {}) {
  const extraAttributes = Object.entries(attributes)
    .filter(([, attributeValue]) => attributeValue !== undefined && attributeValue !== null && attributeValue !== "")
    .map(([attributeName, attributeValue]) => `${attributeName}="${escapeAttribute(attributeValue)}"`)
    .join(" ");

  return `
    <label>
      ${label}
      <input name="${name}" type="${type}" value="${escapeAttribute(value || "")}" ${required ? "required" : ""} ${extraAttributes}>
    </label>
  `;
}

function textareaField(name, label, value = "", required = false) {
  return `
    <label>
      ${label}
      <textarea name="${name}" ${required ? "required" : ""}>${escapeHtml(value || "")}</textarea>
    </label>
  `;
}

function selectField(name, label, options, selectedValue = "", required = false) {
  const disabled = required && !options.length ? "disabled" : "";
  const placeholder = options.length ? `Select ${label}` : `No ${label.toLowerCase()} options yet`;
  return `
    <label>
      ${label}
      <select name="${name}" ${required ? "required" : ""} ${disabled}>
        <option value="">${placeholder}</option>
        ${options.map((option) => `
          <option value="${escapeAttribute(option.value)}" ${String(option.value) === String(selectedValue || "") ? "selected" : ""}>
            ${escapeHtml(option.label)}
          </option>
        `).join("")}
      </select>
    </label>
  `;
}

function hiddenField(name, value) {
  return `<input type="hidden" name="${name}" value="${escapeAttribute(value)}">`;
}

function checkboxField(name, label, checked = false) {
  return `
    <label class="checkbox-field">
      <input type="hidden" name="${name}" value="false">
      <input name="${name}" type="checkbox" value="true" ${checked ? "checked" : ""}>
      <span>${label}</span>
    </label>
  `;
}

function fileField(name, label, multiple = false) {
  return `
    <label>
      ${label}
      <input name="${name}" type="file" ${multiple ? "multiple" : ""} accept="application/pdf,image/jpeg,image/png,image/webp,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
      <small class="field-hint">Accepted: PDF, images, Word, and Excel files.</small>
    </label>
  `;
}

function sopAttachmentUploadField(visible = false) {
  return `
    <label data-sop-attachment-upload ${visible ? "" : "hidden"}>
      Upload SOP Attachment
      <input name="evidence_file" type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
      <small class="field-hint">Accepted: PDF, images, Word, and Excel files. This field appears only when attachments are required.</small>
    </label>
  `;
}

function sopCurrentAttachmentsField(attachments = []) {
  if (!attachments.length) return "";
  return `
    <div class="form-note">
      <strong>Current Attachments</strong>
      <span>${attachments.map((item) => escapeHtml(item.file_name || "Attachment")).join(", ")}</span>
    </div>
  `;
}

function personnelPromptField(count) {
  if (count > 0) {
    return `
      <div class="form-note success">
        ${count} personnel record${count === 1 ? "" : "s"} available for Created By and Approved By.
      </div>
    `;
  }

  return `
    <div class="form-note warning">
      <strong>No personnel records yet.</strong>
      Add personnel first so Created By and Approved By will have options.
      <button class="ghost-btn" type="button" onclick="quickAddPersonnel()">Add Personnel</button>
    </div>
  `;
}

function quickAddPersonnel() {
  closeModal();
  switchView("personnelView");
  openPersonnelModal();
}

function actionPlanItemPromptField() {
  if (state.planItems.length) {
    return `
      <div class="form-note success">
        Choose a plan first, then select the specific plan item that needs corrective action.
      </div>
    `;
  }

  return `
    <div class="form-note warning">
      <strong>No plan items available.</strong>
      Corrective action records attach to plan items, not directly to plans. Open a plan and add at least one plan item first.
      <button class="ghost-btn" type="button" onclick="quickGoToPlans()">Go to Plans</button>
    </div>
  `;
}

function actionPlanFilterField(selectedPlanId = "") {
  return `
    <label>
      Plan
      <select id="actionPlanFilter" onchange="filterActionPlanItems(this.value)" ${state.plans.length ? "" : "disabled"}>
        <option value="">${state.plans.length ? "All plans" : "No plans created yet"}</option>
        ${state.plans.map((plan) => `
          <option value="${escapeAttribute(plan.id)}" ${String(plan.id) === String(selectedPlanId) ? "selected" : ""}>
            ${escapeHtml(plan.plan_title)}
          </option>
        `).join("")}
      </select>
    </label>
  `;
}

function planItemSelectField(selectedItemId = "", name = "plan_item_id", label = "Plan Item", id = "actionPlanItemSelect") {
  const disabled = state.planItems.length ? "" : "disabled";
  return `
    <label>
      ${label}
      <select name="${name}" id="${id}" required ${disabled}>
        <option value="">${state.planItems.length ? "Select Plan Item" : "No plan items available"}</option>
        ${state.planItems.map((item) => {
          const plan = state.plans.find((record) => record.id === item.plan_id);
          return `
            <option value="${escapeAttribute(item.id)}" data-plan-id="${escapeAttribute(item.plan_id || "")}" ${String(item.id) === String(selectedItemId || "") ? "selected" : ""}>
              ${escapeHtml(plan?.plan_title || "Plan")} - ${escapeHtml(item.category || item.objective || "Plan Item")}
            </option>
          `;
        }).join("")}
      </select>
    </label>
  `;
}

function filterActionPlanItems(planId = "") {
  const select = $("#actionPlanItemSelect");
  if (!select) return;

  let visibleCount = 0;
  Array.from(select.options).forEach((option, index) => {
    if (index === 0) return;
    const visible = !planId || option.dataset.planId === planId;
    option.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  const selectedOption = select.options[select.selectedIndex];
  if (selectedOption?.hidden) select.value = "";
  select.options[0].textContent = visibleCount ? "Select Plan Item" : "This plan has no plan items yet";
}

function quickGoToPlans() {
  closeModal();
  switchView("plansView");
}

function templatePickerField() {
  const templates = activeMonitoringTemplates();
  return `
    <label>
      Workflow Template
      <select id="templatePicker" onchange="applyMonitoringTemplate(this.value)">
        <option value="">Start blank or choose a workflow template</option>
        ${templates.map((template) => `
          <option value="${escapeAttribute(template.id)}">${escapeHtml(template.category)}</option>
        `).join("")}
      </select>
    </label>
  `;
}

function applyMonitoringTemplate(templateId) {
  const template = activeMonitoringTemplates().find((item) => item.id === templateId);
  if (!template) return;

  ["category", "objective", "target_standard", "frequency", "expected_output", "remarks"].forEach((field) => {
    const control = elements.modalForm.elements[field];
    if (control) control.value = template[field] || "";
  });
}

function personnelOptions() {
  return state.personnel.map((person) => ({
    value: person.id,
    label: `${person.full_name} - ${person.position || person.role || "Personnel"}`
  }));
}

function peopleOptions() {
  return state.peopleProfiles.map((person) => ({
    value: person.id,
    label: `${person.complete_name} - ${person.position || formattedRoleLabel(person.operational_role)}`
  }));
}

function sopOptions() {
  return state.standardOperatingProcedures.map((sop) => ({
    value: sop.id,
    label: sopDisplayName(sop)
  }));
}

function sopDisplayName(sop) {
  return `${sop?.sop_code || "SOP"} - ${sop?.title || "Untitled SOP"}`;
}

function governingSopForWorkspace(workspaceId) {
  return state.standardOperatingProcedures.find((sop) => sop.workspace_id === workspaceId) || null;
}

function textOptions(values) {
  return uniqueLabels(values.map((value) => String(value || "").trim()).filter(Boolean))
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value, label: value }));
}

function mergedTextOptions(defaults, values = []) {
  return textOptions([...defaults, ...values]);
}

function departmentOptions() {
  return state.departments.map((department) => ({
    value: department.id,
    label: department.department_name
  }));
}

function departmentNameOptions() {
  return textOptions(departmentRecordsForDisplay().map((department) => department.department_name));
}

function positionOptions() {
  return mergedTextOptions([
    "Owner",
    "General Manager",
    "HR Manager",
    "HR Staff",
    "Production Manager",
    "Production Supervisor",
    "Food Safety Compliance Officer",
    "Quality Assurance Officer",
    "Quality Control Staff",
    "Warehouse Staff",
    "Maintenance Staff",
    "Food Handler",
    "Employee",
    "Staff"
  ], [
    ...state.peopleProfiles.map((person) => person.position),
    ...state.personnel.map((person) => person.position)
  ]);
}

function teamOptions() {
  return mergedTextOptions([
    "Management",
    "Operations",
    "Production",
    "Quality Assurance",
    "Quality Control",
    "Food Safety",
    "Warehouse",
    "Maintenance",
    "Human Resources"
  ], [
    ...departmentNameOptions().map((option) => option.value),
    ...state.peopleProfiles.map((person) => person.assigned_team),
    ...state.peopleProfiles.map((person) => departmentNameRaw(person.department_id) || person.department)
  ]);
}

function workLocationOptions() {
  return mergedTextOptions([
    "Main Office",
    "Production Area",
    "Warehouse",
    "Receiving Area",
    "Cold Storage",
    "Quality Control Area",
    "Maintenance Area",
    "Field / Site",
    "Remote"
  ], [
    ...state.peopleProfiles.map((person) => person.work_location),
    ...state.equipment.map((item) => item.location),
    ...state.productLines.map((workspace) => workspace.product_name)
  ]);
}

function equipmentTypeOptions() {
  return mergedTextOptions([
    "Production Equipment",
    "Cold Storage",
    "Cooking Equipment",
    "Packaging Equipment",
    "Vehicle",
    "Tool",
    "Facility",
    "IT Equipment",
    "Safety Equipment"
  ], state.equipment.map((item) => item.equipment_type));
}

function workflowCategoryTextOptions() {
  return mergedTextOptions([
    "Operations",
    "Quality",
    "Safety",
    "Maintenance",
    "HR",
    "Compliance",
    "Inventory",
    "Logistics",
    "Production"
  ], [
    ...state.monitoringCategories.map((category) => category.category_name),
    ...state.planItems.map((item) => item.category),
    ...state.monitoringTemplatesDb.map((template) => template.module_category),
    ...workflowTemplates.map((template) => template.category)
  ]);
}

function sopCategoryOptions() {
  return mergedTextOptions([
    "Policy",
    "Procedure",
    "Work Instruction",
    "Checklist",
    "Form",
    "Operations",
    "Safety",
    "Quality",
    "HR",
    "Maintenance"
  ], [
    ...state.standardOperatingProcedures.map((sop) => sop.category),
    ...state.monitoringCategories.map((category) => category.category_name)
  ]);
}

function frequencyOptions() {
  return mergedTextOptions([
    "Manual",
    "Daily",
    "Per Shift",
    "Weekly",
    "Monthly",
    "Quarterly",
    "Annually",
    "Every receiving activity",
    "Before use",
    "After use",
    "As needed"
  ], [
    ...state.planItems.map((item) => item.frequency),
    ...state.monitoringCategories.map((category) => category.default_frequency),
    ...state.scheduleTemplates.map((template) => template.frequency),
    ...state.monitoringTemplatesDb.map((template) => template.default_frequency)
  ]);
}

function userProfileOptions() {
  return state.userProfiles.map((profile) => ({
    value: profile.id,
    label: `${profile.email || "User"} - ${formattedRole(profile.role)}`
  }));
}

function operationalRoleOptions() {
  return systemRoleOptions().filter((option) => option.value !== "administrator");
}

function employmentTypeOptions() {
  return [
    { value: "regular", label: "Regular" },
    { value: "probationary", label: "Probationary" },
    { value: "contractual", label: "Contractual" },
    { value: "part_time", label: "Part-Time" },
    { value: "temporary", label: "Temporary" }
  ];
}

function employmentStatusOptions() {
  return [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
    { value: "probationary", label: "Probationary" },
    { value: "resigned", label: "Resigned" },
    { value: "terminated", label: "Terminated" }
  ];
}

function businessTypeOptions() {
  return [
    { value: "food_manufacturing", label: "Food Manufacturing" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "construction", label: "Construction" },
    { value: "restaurant", label: "Restaurant" },
    { value: "retail", label: "Retail" },
    { value: "logistics", label: "Logistics" },
    { value: "warehouse", label: "Warehouse" },
    { value: "healthcare", label: "Healthcare" },
    { value: "hospitality", label: "Hospitality" },
    { value: "office_corporate", label: "Corporate" },
    { value: "school_university", label: "Education" },
    { value: "pharmacy", label: "Pharmacy" },
    { value: "agriculture", label: "Agriculture" },
    { value: "laboratory", label: "Laboratory" },
    { value: "custom", label: "Custom" }
  ];
}

function currentBusinessType() {
  return state.companySettings?.business_type || "food_manufacturing";
}

function currentBusinessTypeLabel() {
  return businessTypeLabel(currentBusinessType(), state.companySettings?.custom_business_type);
}

function businessTypeLabel(value = "food_manufacturing", customValue = "") {
  if (value === "custom" && customValue) return customValue;
  return businessTypeOptions().find((option) => option.value === value)?.label || "Food Manufacturing";
}

function activeMonitoringTemplates() {
  const businessType = currentBusinessType();
  const dbTemplates = state.monitoringTemplatesDb
    .filter((template) => template.is_active !== false && (!template.business_type || template.business_type === businessType || template.business_type === "custom"))
    .map(dbTemplateToModuleTemplate);
  const suggested = dbTemplates.length ? dbTemplates : (industryTemplateLibrary[businessType] || industryTemplateLibrary.custom || []);
  const customTemplates = state.scheduleTemplates
    .filter((schedule) => !suggested.some((template) => monitoringTemplateMatches(template, schedule)))
    .map(scheduleToTemplate);
  return [...suggested, ...customTemplates];
}

function activeWorkspaceTemplates(productLineId = "") {
  const workspaceTemplates = state.productLines
    .filter((workspace) => workspaceIsDashboardVisible(workspace) && (!productLineId || workspace.id === productLineId))
    .map(productLineToWorkspaceTemplate);

  const orphanWorkflowTemplates = state.scheduleTemplates
    .filter((schedule) => {
      const isActive = ["active", "approved"].includes(schedule.status || "active") || schedule.approval_status === "approved";
      const hasWorkspace = Boolean(schedule.product_line_id);
      return isActive && (!hasWorkspace || !state.productLines.length) && !productLineId;
    })
    .map(scheduleToTemplate);

  const taskWorkspaceTemplates = !workspaceTemplates.length && !orphanWorkflowTemplates.length && !productLineId
    ? taskDerivedWorkspaceTemplates()
    : [];

  return [...workspaceTemplates, ...orphanWorkflowTemplates, ...taskWorkspaceTemplates];
}

function workspaceIsDashboardVisible(workspace) {
  const status = String(workspace?.status || "active").toLowerCase();
  return !["inactive", "archived", "disabled"].includes(status);
}

function taskDerivedWorkspaceTemplates() {
  const workspaceIds = uniqueLabels(state.generatedTasks.map((task) => taskWorkspaceId(task)).filter(Boolean));
  if (workspaceIds.length) {
    return workspaceIds.map((workspaceId) => ({
      id: `task-workspace-${workspaceId}`,
      product_line_id: workspaceId,
      product_line_name: productLineNameRaw(workspaceId) || "Workspace",
      category: productLineNameRaw(workspaceId) || "Workspace",
      objective: "Workspace inferred from existing workspace tasks.",
      target_standard: "Tasks remain assigned to a valid workspace.",
      frequency: "Task-driven",
      expected_output: "Workspace tasks, records, approvals, and activity.",
      remarks: "Workspace inferred from task records.",
      keywords: [workspaceId]
    }));
  }

  return state.generatedTasks.length ? [{
    id: "unassigned-workspace",
    category: "Unassigned Workspace Tasks",
    objective: "Workspace tasks exist without a linked workspace.",
    target_standard: "Every workspace task should reference one workspace.",
    frequency: "Needs workspace assignment",
    expected_output: "Tasks should be moved into a real workspace.",
    remarks: "Create a workspace and assign these tasks to it.",
    keywords: ["task", "workspace"]
  }] : [];
}

function sopWorkspaceTemplate() {
  return {
    id: "sop-library",
    sop_module: true,
    category: "SOP Library",
    objective: "Controlled standard operating procedure workspace.",
    target_standard: "Current, approved, and review-ready SOP records.",
    frequency: "Knowledge base",
    expected_output: "Published SOPs, review dates, ownership, exports, and print-ready records.",
    remarks: "Standard operating procedure workspace.",
    keywords: ["sop", "procedure", "standard operating procedure"]
  };
}

function productLineToWorkspaceTemplate(scope) {
  return {
    id: `scope-${scope.id}`,
    product_line_id: scope.id,
    product_line_name: scope.product_name,
    category: scope.product_name || "Workspace",
    objective: scope.description || "Configurable business workspace.",
    target_standard: "Defined by workspace configuration.",
    frequency: "Workspace",
    expected_output: "Workspace tasks, records, approvals, and activity.",
    remarks: scope.description || "Active workspace created from company configuration.",
    keywords: [scope.id, scope.product_name].filter(Boolean)
  };
}

function dbTemplateToModuleTemplate(template) {
  return {
    id: `db-template-${template.id}`,
    db_template_id: template.id,
    category: template.module_name || template.template_name || "Workflow Template",
    objective: template.objective || template.description || "Configurable workflow template.",
    target_standard: template.target_standard || "Defined by company procedure.",
    frequency: template.default_frequency || "Custom schedule",
    expected_output: template.expected_output || "Completed workflow record.",
    remarks: template.description || template.module_category || "Database-driven module template.",
    keywords: [template.module_name, template.template_name, template.module_category, template.business_type].filter(Boolean)
  };
}

function scheduleToTemplate(schedule) {
  return {
    id: `schedule-${schedule.id}`,
    schedule_id: schedule.id,
    product_line_id: schedule.product_line_id,
    category: schedule.template_title,
    objective: schedule.objective || "Custom monitoring module.",
    target_standard: schedule.target_standard || "Defined by company procedure.",
    frequency: schedule.frequency || "Custom schedule",
    expected_output: schedule.expected_output || "Completed workflow record.",
    remarks: schedule.remarks || "Custom module created by the company.",
    keywords: [schedule.id, schedule.template_title, categoryNameRaw(schedule.category_id)].filter(Boolean)
  };
}

function isTemplateActivated(template) {
  return state.scheduleTemplates.some((schedule) => monitoringTemplateMatches(template, schedule));
}

function productLineOptions() {
  return state.productLines.map((item) => ({ value: item.id, label: item.product_name }));
}

function planOptions() {
  return state.plans.map((item) => ({ value: item.id, label: item.plan_title }));
}

function allPlanItemOptions() {
  return state.planItems.map((item) => ({
    value: item.id,
    label: `${item.category || item.objective || "Plan item"} - ${planTitle(item.plan_id)}`
  }));
}

function categoryOptions() {
  return state.monitoringCategories.map((item) => ({ value: item.id, label: item.category_name }));
}

function equipmentOptions() {
  return state.equipment.map((item) => ({ value: item.id, label: `${item.equipment_name} - ${formattedRoleLabel(item.status)}` }));
}

function scheduleTemplateOptions() {
  return state.scheduleTemplates.map((item) => ({ value: item.id, label: item.template_title }));
}

function dbTemplateOptions() {
  return state.monitoringTemplatesDb.map((item) => ({
    value: item.id,
    label: `${item.module_name || item.template_name} - ${businessTypeLabel(item.business_type)}`
  }));
}

function generatedTaskOptions() {
  return state.generatedTasks.map((item) => ({ value: item.id, label: `${item.task_title} - ${formatDate(item.task_date)}` }));
}

function taskDoOptions(taskId = "") {
  return state.taskDoRecords
    .filter((item) => !taskId || item.task_id === taskId)
    .map((item) => ({ value: item.id, label: `${peopleName(item.performed_by)} - ${formatDateTime(item.performed_at)}` }));
}

function taskCheckOptions() {
  return state.taskCheckRecords.map((item) => ({ value: item.id, label: `${taskName(item.task_id)} - ${formattedRoleLabel(item.check_result)}` }));
}

function taskStatusOptions() {
  return ["scheduled", "due_today", "in_progress", "completed", "checked", "not_compliant", "overdue", "cancelled"]
    .map((value) => ({ value, label: formattedRoleLabel(value) }));
}

function workspaceStatusOptions() {
  return ["active", "inactive", "archived"]
    .map((value) => ({ value, label: formattedRoleLabel(value) }));
}

function pdcaStageOptions() {
  return [
    { value: "plan", label: "Plan" },
    { value: "do", label: "Do" },
    { value: "check", label: "Check" },
    { value: "act", label: "Act" }
  ];
}

function recurrenceTypeOptions() {
  return ["manual", "daily", "weekly", "monthly"].map((value) => ({ value, label: formattedRoleLabel(value) }));
}

function approvalStatusOptions() {
  return ["draft", "pending", "approved", "rejected"].map((value) => ({ value, label: formattedRoleLabel(value) }));
}

function sopStatusOptions() {
  return [
    { value: "draft", label: "Draft" },
    { value: "under_review", label: "Under Review" },
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" }
  ];
}

function sopSummaryReportStatusOptions() {
  return ["draft", "generated", "reviewed", "approved", "archived"]
    .map((value) => ({ value, label: formattedRoleLabel(value) }));
}

function permissionModules() {
  return [
    { key: "all", label: "All Modules" },
    { key: "hr", label: "People / HR" },
    { key: "sop", label: "Standard Operating Procedure" },
    { key: "company", label: "Company Settings" },
    { key: "planning", label: "Plan" },
    { key: "do", label: "Do" },
    { key: "check", label: "Check" },
    { key: "act", label: "Act" },
    { key: "equipment", label: "Equipment" },
    { key: "approvals", label: "Approvals" }
  ];
}

function permissionFor(role, moduleKey) {
  return state.rolePermissions.find((item) => item.role === role && item.module_key === moduleKey) || {
    role,
    module_key: moduleKey,
    can_view: moduleKey === "all" && role === "viewer",
    can_create: false,
    can_edit: false,
    can_delete: false,
    can_approve: false,
    can_export: false
  };
}

function roleOptions(selectedRole = "viewer") {
  return systemRoleOptions().map((option) => `
    <option value="${option.value}" ${option.value === normalizeRole(selectedRole || "viewer") ? "selected" : ""}>${option.label}</option>
  `).join("");
}

function systemRoleOptions() {
  return [
    { value: "viewer", label: "Viewer" },
    { value: "employee", label: "Employee" },
    { value: "staff", label: "Staff" },
    { value: "supervisor", label: "Supervisor" },
    { value: "hr_staff", label: "HR Staff" },
    { value: "hr_manager", label: "HR Manager" },
    { value: "president", label: "President" },
    { value: "food_handler", label: "Frontline Operator" },
    { value: "production_supervisor", label: "Production Supervisor" },
    { value: "production_manager", label: "Production Manager" },
    { value: "food_safety_compliance_officer", label: "Compliance Officer" },
    { value: "owner", label: "Owner" },
    { value: "general_manager", label: "General Manager" },
    { value: "administrator", label: "System Administrator" }
  ];
}

function formattedRoleLabel(value = "") {
  return String(value || "not_set")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function peopleName(id) {
  if (!id) return "Not assigned";
  const person = state.peopleProfiles.find((item) => item.id === id);
  return person ? escapeHtml(person.complete_name) : "Not assigned";
}

function peopleNameRaw(id) {
  if (!id) return "";
  const person = state.peopleProfiles.find((item) => item.id === id);
  return person?.complete_name || "";
}

function userEmail(id) {
  if (!id) return "Not assigned";
  const profile = state.userProfiles.find((item) => item.id === id);
  return escapeHtml(profile?.email || "Not assigned");
}

function currentUserPersonIds() {
  const authUserId = state.session?.user?.id;
  const profilePersonnelId = state.userProfile?.personnel_id;
  return state.peopleProfiles
    .filter((person) => person.user_id === authUserId || person.id === profilePersonnelId)
    .map((person) => person.id);
}

function canSeeNotification(notification) {
  if (!notification) return false;
  if (isAdmin()) return true;
  const authUserId = state.session?.user?.id;
  if (notification.recipient_user_id && notification.recipient_user_id === authUserId) return true;
  const personIds = currentUserPersonIds();
  return Boolean(notification.recipient_person_id && personIds.includes(notification.recipient_person_id));
}

function setNotificationReadLocally(ids) {
  const idSet = new Set(ids);
  const readAt = new Date().toISOString();
  state.notifications = state.notifications.map((item) => (
    idSet.has(item.id) ? { ...item, is_read: true, read_at: readAt } : item
  ));
}

function personUserId(personId) {
  const person = state.peopleProfiles.find((item) => item.id === personId);
  return person?.user_id || null;
}

function productLineName(id) {
  const item = state.productLines.find((record) => record.id === id);
  return item ? escapeHtml(item.product_name) : "Not set";
}

function productLineNameRaw(id) {
  const item = state.productLines.find((record) => record.id === id);
  return item?.product_name || "";
}

function departmentName(id) {
  return escapeHtml(departmentNameRaw(id) || "Not set");
}

function departmentNameRaw(id) {
  const item = state.departments.find((record) => record.id === id);
  return item?.department_name || "";
}

function personDepartmentName(personId) {
  const person = state.peopleProfiles.find((record) => record.id === personId);
  if (!person) return "";
  return departmentNameRaw(person.department_id) || person.department || "";
}

function taskWorkspaceId(task) {
  return task?.workspace_id || task?.product_line_id || "";
}

function planItemForTask(task) {
  if (!task) return null;
  const template = templateForTask(task);
  return state.planItems.find((item) => item.id === task.plan_item_id)
    || state.planItems.find((item) => item.id === template?.plan_item_id)
    || state.planItems.find((item) => item.plan_id && item.plan_id === task.plan_id)
    || null;
}

function planForTask(task) {
  if (!task) return null;
  const planItem = planItemForTask(task);
  const template = templateForTask(task);
  return state.plans.find((plan) => plan.id === (task.plan_id || planItem?.plan_id || template?.plan_id)) || null;
}

function templateForTask(task) {
  if (!task) return null;
  return state.scheduleTemplates.find((template) => template.id === task.template_id)
    || state.scheduleTemplates.find((template) => template.plan_item_id && template.plan_item_id === task.plan_item_id)
    || null;
}

function planForTemplate(template) {
  if (!template) return null;
  const item = template.plan_item_id ? state.planItems.find((record) => record.id === template.plan_item_id) : null;
  return state.plans.find((plan) => plan.id === (template.plan_id || item?.plan_id)) || null;
}

function sopPlan(sop) {
  if (!sop) return null;
  const item = sopPlanItem(sop);
  return state.plans.find((plan) => plan.id === (sop.plan_id || item?.plan_id)) || null;
}

function sopPlanItem(sop) {
  if (!sop) return null;
  return state.planItems.find((item) => item.id === sop.plan_item_id)
    || (sop.plan_id ? state.planItems.find((item) => item.plan_id === sop.plan_id) : null)
    || null;
}

function sopForPlan(planId) {
  if (!planId) return null;
  return state.standardOperatingProcedures.find((sop) => sop.plan_id === planId && !sop.plan_item_id) || null;
}

function sopForPlanItem(planItemId) {
  if (!planItemId) return null;
  return state.standardOperatingProcedures.find((sop) => sop.plan_item_id === planItemId) || null;
}

function sopForTask(task) {
  if (!task) return null;
  const workspaceId = taskWorkspaceId(task);
  return state.standardOperatingProcedures.find((sop) => sop.id === task.sop_id)
    || state.standardOperatingProcedures.find((sop) => sop.task_id === task.id)
    || state.standardOperatingProcedures.find((sop) => task.template_id && sop.workflow_template_id === task.template_id)
    || state.standardOperatingProcedures.find((sop) => workspaceId && sop.workspace_id === workspaceId)
    || state.standardOperatingProcedures.find((sop) => task.plan_item_id && sop.plan_item_id === task.plan_item_id)
    || state.standardOperatingProcedures.find((sop) => task.plan_id && sop.plan_id === task.plan_id)
    || null;
}

function taskComplianceStatus(task) {
  if (!task) return "not_linked";
  const checks = state.taskCheckRecords.filter((record) => record.task_id === task.id);
  const actions = state.actionCases.filter((record) => record.task_id === task.id);
  if (checks.some((record) => ["not_compliant", "needs_follow_up", "failed"].includes(record.check_result))) return "not_compliant";
  if (actions.some((record) => !["resolved", "verified", "closed"].includes(record.case_status))) return "open_action";
  if (checks.some((record) => record.check_result === "passed")) return "compliant";
  return taskDisplayStatus(task);
}

function tableHasColumn(records, columnName) {
  return records.some((record) => Object.prototype.hasOwnProperty.call(record, columnName));
}

function categoryName(id) {
  const item = state.monitoringCategories.find((record) => record.id === id);
  return item ? escapeHtml(item.category_name) : "Not set";
}

function categoryNameRaw(id) {
  const item = state.monitoringCategories.find((record) => record.id === id);
  return item?.category_name || "";
}

function planTitle(id) {
  const item = state.plans.find((record) => record.id === id);
  return item?.plan_title || "Plan";
}

function taskName(id) {
  const item = state.generatedTasks.find((record) => record.id === id);
  return item ? item.task_title : "Task";
}

function taskDisplayStatus(task) {
  if (!task) return "scheduled";
  if (["completed", "checked", "not_compliant", "cancelled"].includes(task.task_status)) return task.task_status;
  const now = new Date();
  const today = toDateInputValue(now);
  if (task.task_date && task.task_date < today) return "overdue";
  if (task.at_risk_at && new Date(task.at_risk_at) <= now) return "at_risk";
  if (task.task_date === today) return "due_today";
  return task.task_status || "scheduled";
}

function planItemOptions() {
  return state.planItems.map((item) => {
    const plan = state.plans.find((record) => record.id === item.plan_id);
    return {
      value: item.id,
      label: `${plan?.plan_title || "Plan"} - ${item.category || item.objective || "Item"}`
    };
  });
}

function checkRecordOptions() {
  return state.checkRecords.map((record) => ({
    value: record.id,
    label: `${planItemName(record.plan_item_id)} - ${record.check_result || "Check"} (${formatDate(record.date_checked)})`
  }));
}

function planItemName(id) {
  const item = state.planItems.find((record) => record.id === id);
  if (!item) return "Not assigned";
  const plan = state.plans.find((record) => record.id === item.plan_id);
  return `${plan?.plan_title || "Plan"} - ${item.category || item.objective || "Plan Item"}`;
}

function personName(id) {
  if (!id) return "Not assigned";
  const person = state.personnel.find((item) => item.id === id);
  return person ? escapeHtml(person.full_name) : "Not assigned";
}

function rawPersonName(id) {
  if (!id) return "";
  const person = state.personnel.find((item) => item.id === id);
  return person?.full_name || "";
}

function formatPeriod(month, year) {
  const monthName = monthNames[Number(month) - 1] || "Month";
  return `${monthName} ${year || ""}`.trim();
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = parseFlexibleDate(value);
  if (!date) return "N/A";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatShortDate(value) {
  if (!value) return "";
  const date = parseFlexibleDate(value);
  if (!date) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}

function formatDateTime(value) {
  if (!value) return "N/A";
  const date = parseFlexibleDate(value, true);
  if (!date) return "N/A";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatReportDate(value, fallback = "Not set") {
  if (!value) return fallback;
  const date = parseFlexibleDate(value);
  if (!date) return fallback;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatReportDateTime(value, fallback = "Not recorded") {
  if (!value) return fallback;
  const date = parseFlexibleDate(value, true);
  if (!date) return fallback;
  return date.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function parseFlexibleDate(value, keepTime = false) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const text = String(value);
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(text);
  const date = new Date(dateOnly && !keepTime ? `${text}T00:00:00` : text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(value) {
  const date = value instanceof Date ? new Date(value) : new Date(`${value}T00:00:00`);
  date.setHours(0, 0, 0, 0);
  return date;
}

function daysBetween(fromDate, toDate) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.round((toDate - fromDate) / millisecondsPerDay);
}

function toDateInputValue(value) {
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateKey(value) {
  if (!value) return "";
  const date = value instanceof Date
    ? value
    : String(value).includes("T")
      ? new Date(value)
      : new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return toDateInputValue(date);
}

function toDatetimeLocalValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function maxDateInputValue(...values) {
  const validValues = values.filter(Boolean);
  if (!validValues.length) return "";

  return validValues
    .map((value) => toDateInputValue(value))
    .sort()
    .at(-1);
}

function getPeriodDateBounds(month, year) {
  const safeMonth = Number(month) || new Date().getMonth() + 1;
  const safeYear = Number(year) || new Date().getFullYear();
  const start = new Date(safeYear, safeMonth - 1, 1);
  const end = new Date(safeYear, safeMonth, 0);

  return {
    start: toDateInputValue(start),
    end: toDateInputValue(end)
  };
}

function validateDates(mode, payload) {
  const today = toDateInputValue(new Date());

  if (mode === "plans") {
    const bounds = getPeriodDateBounds(payload.period_month, payload.period_year);

    if (payload.start_date && payload.start_date < today) {
      return "Plan start date cannot be in the past.";
    }

    if (payload.start_date && payload.end_date && payload.end_date < payload.start_date) {
      return "Plan end date cannot be earlier than the start date.";
    }

    if (payload.start_date && (payload.start_date < bounds.start || payload.start_date > bounds.end)) {
      return `Plan start date must be within ${formatPeriod(payload.period_month, payload.period_year)}.`;
    }

    if (payload.end_date && (payload.end_date < bounds.start || payload.end_date > bounds.end)) {
      return `Plan end date must be within ${formatPeriod(payload.period_month, payload.period_year)}.`;
    }
  }

  if (mode === "plan_items") {
    const plan = state.plans.find((record) => record.id === payload.plan_id);

    if (payload.start_date && payload.start_date < today) {
      return "Plan item start date cannot be in the past.";
    }

    if (payload.start_date && payload.due_date && payload.due_date < payload.start_date) {
      return "Plan item due date cannot be earlier than its start date.";
    }

    if (plan?.start_date && payload.start_date && payload.start_date < plan.start_date) {
      return "Plan item start date cannot be earlier than the plan start date.";
    }

    if (plan?.end_date && payload.due_date && payload.due_date > plan.end_date) {
      return "Plan item due date cannot be later than the plan end date.";
    }

    if (plan?.end_date && payload.start_date && payload.start_date > plan.end_date) {
      return "Plan item start date cannot be later than the plan end date.";
    }
  }

  if (mode === "action_taken" && payload.date_checked && payload.date_checked > today) {
    return "Date checked cannot be in the future.";
  }

  if (mode === "do_records" && payload.date_performed && payload.date_performed > today) {
    return "Date performed cannot be in the future.";
  }

  if (mode === "check_records" && payload.date_checked && payload.date_checked > today) {
    return "Date checked cannot be in the future.";
  }

  return "";
}

function bindDateGuards() {
  const periodMonth = elements.modalForm.elements.period_month;
  const periodYear = elements.modalForm.elements.period_year;
  const startDate = elements.modalForm.elements.start_date;
  const endDate = elements.modalForm.elements.end_date;
  const dueDate = elements.modalForm.elements.due_date;

  if (periodMonth && periodYear && startDate && endDate) {
    periodMonth.addEventListener("change", updatePlanPeriodDateLimits);
    periodYear.addEventListener("input", updatePlanPeriodDateLimits);
    periodYear.addEventListener("change", updatePlanPeriodDateLimits);
  }

  if (startDate && endDate) {
    startDate.addEventListener("change", () => {
      endDate.min = startDate.value || endDate.min;
      if (endDate.value && startDate.value && endDate.value < startDate.value) endDate.value = "";
    });
  }

  if (startDate && dueDate) {
    startDate.addEventListener("change", () => {
      dueDate.min = startDate.value || dueDate.min;
      if (dueDate.value && startDate.value && dueDate.value < startDate.value) dueDate.value = "";
    });
  }
}

function updatePlanPeriodDateLimits() {
  if (state.modalMode !== "plans") return;

  const periodMonth = elements.modalForm.elements.period_month;
  const periodYear = elements.modalForm.elements.period_year;
  const startDate = elements.modalForm.elements.start_date;
  const endDate = elements.modalForm.elements.end_date;
  if (!periodMonth || !periodYear || !startDate || !endDate) return;

  const bounds = getPeriodDateBounds(periodMonth.value, periodYear.value);
  const minStartDate = maxDateInputValue(toDateInputValue(new Date()), bounds.start);
  startDate.min = minStartDate;
  startDate.max = bounds.end;
  endDate.max = bounds.end;
  endDate.min = startDate.value || minStartDate;

  if (startDate.value && (startDate.value < startDate.min || startDate.value > startDate.max)) {
    startDate.value = "";
  }

  if (endDate.value && (endDate.value < endDate.min || endDate.value > endDate.max)) {
    endDate.value = "";
  }
}

function setLoading(isLoading) {
  elements.loadingOverlay.classList.toggle("is-hidden", !isLoading);
}

function showToast(message, type = "success") {
  elements.toast.textContent = friendlyError(message);
  elements.toast.className = `toast is-visible ${type}`;
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 3600);
}

function friendlyError(message) {
  const text = String(message || "Something went wrong.");
  const lower = text.toLowerCase();

  if (lower.includes("row-level security") || lower.includes("violates row-level security")) {
    return "Permission denied by Supabase RLS. Run supabase-rls-policies.sql in the Supabase SQL Editor, then try again.";
  }

  return text;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

window.openPersonnelModal = openPersonnelModal;
window.openPlanModal = openPlanModal;
window.openPlanItemModal = openPlanItemModal;
window.openDoModal = openDoModal;
window.openCheckModal = openCheckModal;
window.openActionModal = openActionModal;
window.openUserProfileModal = openUserProfileModal;
window.openCompanySettingsModal = openCompanySettingsModal;
window.openDepartmentModal = openDepartmentModal;
window.openPeopleProfileModal = openPeopleProfileModal;
window.openEmployeeDocumentModal = openEmployeeDocumentModal;
window.selectPeopleProfile = selectPeopleProfile;
window.openEquipmentModal = openEquipmentModal;
window.openMaintenanceModal = openMaintenanceModal;
window.openSopModal = openSopModal;
window.openSopSummaryReportModal = openSopSummaryReportModal;
window.openAttendanceModal = openAttendanceModal;
window.openProductLineModal = openProductLineModal;
window.openMonitoringCategoryModal = openMonitoringCategoryModal;
window.openDbTemplateModal = openDbTemplateModal;
window.openChecklistModal = openChecklistModal;
window.openTemplateWorkflowModal = openTemplateWorkflowModal;
window.openScheduleTemplateModal = openScheduleTemplateModal;
window.openWorkspace = openWorkspace;
window.openSopWorkspace = openSopWorkspace;
window.workspaceDashboardDebug = workspaceDashboardDebug;
window.openGeneratedTaskModal = openGeneratedTaskModal;
window.openTaskDoModal = openTaskDoModal;
window.openTaskCheckModal = openTaskCheckModal;
window.openActionCaseModal = openActionCaseModal;
window.deleteRecord = deleteRecord;
window.deleteWorkspace = deleteWorkspace;
window.deleteGeneratedTask = deleteGeneratedTask;
window.updateUserRole = updateUserRole;
window.updateRolePermission = updateRolePermission;
window.markNotificationRead = markNotificationRead;
window.markAllNotificationsRead = markAllNotificationsRead;
window.decideApproval = decideApproval;
window.activateSuggestedModule = activateSuggestedModule;
window.customizeSuggestedModule = customizeSuggestedModule;
window.viewModuleRecords = viewModuleRecords;
window.addModuleMonitoringEntry = addModuleMonitoringEntry;
window.viewModuleBacklogs = viewModuleBacklogs;
window.createModuleCorrectiveAction = createModuleCorrectiveAction;
window.exportModuleReport = exportModuleReport;
window.selectPlan = selectPlan;
window.closeModal = closeModal;
window.applyMonitoringTemplate = applyMonitoringTemplate;
window.quickAddPersonnel = quickAddPersonnel;
window.filterActionPlanItems = filterActionPlanItems;
window.quickGoToPlans = quickGoToPlans;
window.exportPersonnelCsv = exportPersonnelCsv;
window.exportSopCsv = exportSopCsv;
window.exportPlansCsv = exportPlansCsv;
window.exportDoCsv = exportDoCsv;
window.exportCheckCsv = exportCheckCsv;
window.exportActionsCsv = exportActionsCsv;
window.printPersonnelReport = printPersonnelReport;
window.printSopReport = printSopReport;
window.printSavedSopSummaryReport = printSavedSopSummaryReport;
window.printPlansReport = printPlansReport;
window.printDoReport = printDoReport;
window.printCheckReport = printCheckReport;
window.printActionsReport = printActionsReport;






// Generic Assessment & Audit module
function canUseAssessmentTables() {
  return !state.tableErrors.assessments;
}

function renderAssessmentDashboardSection() {
  const cards = elements.assessmentDashboardCards;
  const table = elements.recentAssessmentsDashboardTable;
  if (!cards && !table) return;
  const records = canViewAssessments() ? state.assessments : [];
  const actions = canViewAssessments() ? state.assessmentCorrectiveActions : [];
  const avg = records.length ? Math.round(records.reduce((sum, item) => sum + Number(item.overall_score || 0), 0) / records.length) : 0;
  const data = [
    ["Total", records.length],
    ["Scheduled", records.filter((item) => item.assessment_status === "scheduled").length],
    ["In Progress", records.filter((item) => item.assessment_status === "in_progress").length],
    ["Completed", records.filter((item) => ["completed", "reviewed", "approved"].includes(item.assessment_status)).length],
    ["Low Rated", records.filter((item) => Number(item.overall_score || 100) < 75).length],
    ["Open Actions", actions.filter((item) => !["verified", "closed"].includes(item.action_status)).length],
    ["Average", records.length ? `${avg}%` : "0%"]
  ];
  if (cards) cards.innerHTML = data.map(([label, value]) => `<article class="summary-card ${["Low Rated", "Open Actions"].includes(label) ? "alert" : ""}"><span>${label}</span><strong>${value}</strong></article>`).join("");
  if (table) {
    const latest = [...records].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)).slice(0, 5);
    table.innerHTML = renderRows(latest, (item) => `
      <tr>
        <td><strong>${escapeHtml(item.assessment_title || "Untitled Assessment")}</strong><span class="muted-action">${escapeHtml(item.assessment_reference_no || assessmentTypeName(item.assessment_type_id) || "No reference")}</span></td>
        <td>${escapeHtml(assessmentScopeLabel(item))}</td>
        <td><span class="status-pill ${item.assessment_status === "draft" ? "warning" : ""}">${formattedRoleLabel(item.assessment_status || "draft")}</span></td>
        <td>${escapeHtml(item.overall_score ?? "-")}</td>
        <td>${formatDate(item.assessment_date || item.created_at)}</td>
      </tr>
    `, 5, canUseAssessmentTables() ? "No assessments yet." : "Run the assessment SQL migration first.");
  }
}

function renderAssessments() {
  if (!elements.assessmentTable) return;
  const records = canViewAssessments() ? state.assessments : [];
  elements.assessmentTable.innerHTML = renderRows(records, (item) => `
    <tr>
      <td><strong>${escapeHtml(item.assessment_title || "Untitled Assessment")}</strong><span class="muted-action">${escapeHtml(item.assessment_reference_no || "No reference")}</span></td>
      <td>${escapeHtml(assessmentTypeName(item.assessment_type_id) || "Custom")}</td>
      <td>${escapeHtml(assessmentScopeLabel(item))}</td>
      <td>${formatDate(item.assessment_date)}</td>
      <td><span class="status-pill ${item.assessment_status === "draft" ? "warning" : ""}">${formattedRoleLabel(item.assessment_status || "draft")}</span></td>
      <td>${escapeHtml(item.overall_score ?? "-")}</td>
      <td class="actions-cell"><div class="table-actions"><button class="pdf-action" type="button" onclick="printAssessmentReport('${escapeAttribute(item.id)}')">Print PDF</button>${canManageAssessments() ? `<button type="button" onclick="openAssessmentModal('${escapeAttribute(item.id)}')">Edit</button><button type="button" onclick="openAssessmentSectionModal('', '${escapeAttribute(item.id)}')">Section</button><button type="button" onclick="openAssessmentReportModal('', '${escapeAttribute(item.id)}')">Report</button>${canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteRecord('assessments', '${escapeAttribute(item.id)}')">Delete</button>` : ""}` : ""}</div></td>
    </tr>
  `, 7, canUseAssessmentTables() ? "No assessment records found." : "Run the assessment SQL migration first.");
}

function renderAssessmentTemplates() {
  if (!elements.assessmentTemplatesTable) return;
  const records = canViewAssessments() ? state.assessmentTemplates : [];
  elements.assessmentTemplatesTable.innerHTML = renderRows(records, (item) => `
    <tr>
      <td><strong>${escapeHtml(item.template_name || "Untitled Template")}</strong><span class="muted-action">${escapeHtml(item.description || "Reusable criteria")}</span></td>
      <td>${escapeHtml(assessmentTypeName(item.assessment_type_id) || "Custom")}</td>
      <td>${formattedRoleLabel(item.scoring_method || "custom")}</td>
      <td>${state.assessmentTemplateSections.filter((section) => section.template_id === item.id).length}</td>
      <td>${state.assessmentRatingScales.filter((scale) => scale.template_id === item.id).length}</td>
      <td><span class="status-pill ${item.is_active === false ? "danger" : ""}">${item.is_active === false ? "Inactive" : "Active"}</span></td>
      <td class="actions-cell"><div class="table-actions">${canManageAssessments() ? `<button type="button" onclick="openAssessmentTemplateModal('${escapeAttribute(item.id)}')">Edit</button><button type="button" onclick="openAssessmentTemplateSectionModal('', '${escapeAttribute(item.id)}')">Section</button><button type="button" onclick="openAssessmentRatingScaleModal('', '${escapeAttribute(item.id)}')">Rating</button>` : ""}</div></td>
    </tr>
  `, 7, "No assessment templates found.");
}

function renderAssessmentFindings() {
  if (!elements.assessmentFindingsTable) return;
  const records = canViewAssessments() ? state.assessmentFindings : [];
  elements.assessmentFindingsTable.innerHTML = renderRows(records, (item) => `
    <tr>
      <td><strong>${escapeHtml(assessmentTitle(item.assessment_id))}</strong><span class="muted-action">${escapeHtml(assessmentSectionTitle(item.section_id) || "General")}</span></td>
      <td>${escapeHtml(item.observation || item.question_text || "Observation")}</td>
      <td><span class="status-pill ${["high", "critical"].includes(item.severity) ? "danger" : item.severity === "medium" ? "warning" : ""}">${formattedRoleLabel(item.severity || "medium")}</span></td>
      <td>${formattedRoleLabel(item.compliance_result || "needs_follow_up")}</td>
      <td>${peopleName(item.responsible_person_id)}</td>
      <td>${formatDate(item.target_completion_date)}</td>
      <td class="actions-cell"><div class="table-actions">${canManageAssessments() ? `<button type="button" onclick="openAssessmentFindingModal('${escapeAttribute(item.id)}')">Edit</button><button type="button" onclick="openAssessmentCorrectiveActionModal('', '${escapeAttribute(item.id)}')">Action</button>` : ""}</div></td>
    </tr>
  `, 7, "No assessment findings found.");
}

function renderAssessmentCorrectiveActions() {
  if (!elements.assessmentActionsTable) return;
  const records = canViewAssessments() ? state.assessmentCorrectiveActions : [];
  elements.assessmentActionsTable.innerHTML = renderRows(records, (item) => `
    <tr>
      <td><strong>${escapeHtml(item.action_title || "Corrective Action")}</strong><span class="muted-action">${escapeHtml(assessmentTitle(item.assessment_id))}</span></td>
      <td>${escapeHtml(item.corrective_action || item.correction || "No details")}</td>
      <td>${peopleName(item.assigned_to)}</td>
      <td>${formatDate(item.due_date)}</td>
      <td><span class="status-pill ${item.action_status === "overdue" ? "danger" : item.action_status === "open" ? "warning" : ""}">${formattedRoleLabel(item.action_status || "open")}</span></td>
      <td class="actions-cell"><div class="table-actions">${canManageAssessments() ? `<button type="button" onclick="openAssessmentCorrectiveActionModal('${escapeAttribute(item.id)}')">Edit</button>` : ""}</div></td>
    </tr>
  `, 6, "No assessment corrective actions found.");
}

function renderAssessmentReports() {
  if (!elements.assessmentReportsTable) return;
  const records = canViewAssessments() ? state.assessmentReports : [];
  elements.assessmentReportsTable.innerHTML = renderRows(records, (item) => `
    <tr>
      <td><strong>${escapeHtml(item.report_title || "Assessment Report")}</strong><span class="muted-action">${escapeHtml(item.report_reference_no || "No reference")}</span></td>
      <td>${escapeHtml(assessmentTitle(item.assessment_id))}</td>
      <td><span class="status-pill ${item.report_status === "approved" ? "" : "warning"}">${formattedRoleLabel(item.report_status || "draft")}</span></td>
      <td>${formatDateTime(item.generated_at || item.created_at)}</td>
      <td class="actions-cell"><div class="table-actions"><button class="pdf-action" type="button" onclick="printAssessmentReport('${escapeAttribute(item.assessment_id)}')">Print PDF</button>${canManageAssessments() ? `<button type="button" onclick="openAssessmentReportModal('${escapeAttribute(item.id)}')">Edit</button>` : ""}</div></td>
    </tr>
  `, 5, "No assessment reports generated yet.");
}

function openAssessmentModal(id = null) {
  const item = id ? state.assessments.find((record) => record.id === id) : {};
  const template = state.assessmentTemplates.find((record) => record.id === item?.template_id);
  openModal({ title: id ? "Edit Assessment" : "Create Assessment", mode: "assessments", editingId: id, fields: [
    inputField("assessment_reference_no", "Reference No.", "text", item?.assessment_reference_no || nextAssessmentReference(), false),
    inputField("assessment_title", "Assessment Title", "text", item?.assessment_title || "Business Assessment", true),
    selectField("assessment_type_id", "Assessment Type", assessmentTypeOptions(), item?.assessment_type_id, false),
    selectField("template_id", "Template", assessmentTemplateOptions(), item?.template_id, false),
    selectField("branch_name", "Branch", branchOptions(), item?.branch_name, false),
    selectField("department_id", "Department", departmentOptions(), item?.department_id, false),
    selectField("workspace_id", "Workspace / Product Line", productLineOptions(), item?.workspace_id || item?.product_line_id, false),
    selectField("sop_id", "Related SOP", sopOptions(), item?.sop_id, false),
    inputField("assessed_area_name", "Area / Process", "text", item?.assessed_area_name, false),
    inputField("assessed_business_name", "External Business / Supplier", "text", item?.assessed_business_name, false),
    inputField("assessed_address", "Address", "text", item?.assessed_address, false),
    inputField("contact_person", "Contact Person", "text", item?.contact_person, false),
    inputField("contact_number", "Contact Number", "text", item?.contact_number, false),
    inputField("assessment_date", "Assessment Date", "date", item?.assessment_date, false),
    inputField("assessment_start_time", "Start Time", "time", item?.assessment_start_time, false),
    inputField("assessment_end_time", "End Time", "time", item?.assessment_end_time, false),
    selectField("evaluator_type", "Evaluator Type", optionSet(["internal", "external", "third_party", "consultant", "regulatory", "other"]), item?.evaluator_type || "internal", true),
    inputField("evaluator_organization", "Evaluator Organization", "text", item?.evaluator_organization || template?.default_evaluator_organization, false),
    inputField("evaluator_representative", "Evaluator Representative", "text", item?.evaluator_representative, false),
    textareaField("purpose", "Purpose", item?.purpose, false), textareaField("scope", "Scope", item?.scope, false),
    textareaField("reference_guidelines", "Reference Guidelines", item?.reference_guidelines || template?.default_reference_guidelines, false),
    selectField("assessment_status", "Status", optionSet(["draft", "scheduled", "in_progress", "completed", "reviewed", "approved", "archived"]), item?.assessment_status || "draft", true),
    inputField("overall_score", "Overall Score", "number", item?.overall_score, false, { min: 0, max: 100, step: "0.01" }),
    inputField("overall_rating", "Overall Rating", "text", item?.overall_rating, false),
    textareaField("executive_summary", "Executive Summary", item?.executive_summary, false),
    textareaField("general_findings", "General Findings", item?.general_findings, false),
    textareaField("strengths", "Strengths", item?.strengths, false),
    textareaField("opportunities_for_improvement", "Opportunities for Improvement", item?.opportunities_for_improvement, false),
    textareaField("confidentiality_note", "Confidentiality Note", item?.confidentiality_note || template?.default_confidentiality_note, false),
    selectField("prepared_by", "Prepared By", peopleOptions(), item?.prepared_by, false),
    selectField("reviewed_by", "Reviewed By", peopleOptions(), item?.reviewed_by, false),
    selectField("approved_by", "Approved By", peopleOptions(), item?.approved_by, false)
  ]});
}

function openAssessmentTemplateModal(id = null) {
  const item = id ? state.assessmentTemplates.find((record) => record.id === id) : {};
  openModal({ title: id ? "Edit Assessment Template" : "Create Assessment Template", mode: "assessment_templates", editingId: id, fields: [
    inputField("template_name", "Template Name", "text", item?.template_name, true),
    selectField("assessment_type_id", "Assessment Type", assessmentTypeOptions(), item?.assessment_type_id, false),
    textareaField("description", "Description", item?.description, false),
    inputField("industry", "Industry", "text", item?.industry, false),
    selectField("business_type", "Business Type", [{ value: "", label: "Any business type" }, ...businessTypeOptions()], item?.business_type, false),
    selectField("scoring_method", "Scoring Method", optionSet(["custom", "percentage", "numeric", "pass_fail", "star_1_5"]), item?.scoring_method || "custom", true),
    inputField("default_evaluator_organization", "Default Evaluator Organization", "text", item?.default_evaluator_organization, false),
    textareaField("default_reference_guidelines", "Default Reference Guidelines", item?.default_reference_guidelines, false),
    textareaField("default_confidentiality_note", "Default Confidentiality Note", item?.default_confidentiality_note, false),
    checkboxField("is_active", "Active Template", item?.is_active !== false)
  ]});
}

function openAssessmentTemplateSectionModal(id = null, templateId = "") {
  const item = id ? state.assessmentTemplateSections.find((record) => record.id === id) : {};
  openModal({ title: id ? "Edit Template Section" : "Add Template Section", mode: "assessment_template_sections", editingId: id, fields: [selectField("template_id", "Template", assessmentTemplateOptions(), item?.template_id || templateId, true), inputField("section_title", "Section Title", "text", item?.section_title, true), textareaField("section_description", "Description", item?.section_description, false), inputField("sort_order", "Sort Order", "number", item?.sort_order ?? 0, true), checkboxField("is_required", "Required", item?.is_required !== false)] });
}

function openAssessmentSectionModal(id = null, assessmentId = "") {
  const item = id ? state.assessmentSections.find((record) => record.id === id) : {};
  openModal({ title: id ? "Edit Assessment Section" : "Add Assessment Section", mode: "assessment_sections", editingId: id, fields: [selectField("assessment_id", "Assessment", assessmentOptions(), item?.assessment_id || assessmentId, true), inputField("section_title", "Section Title", "text", item?.section_title, true), textareaField("section_description", "Description", item?.section_description, false), inputField("sort_order", "Sort Order", "number", item?.sort_order ?? 0, true), inputField("section_score", "Score", "number", item?.section_score, false, { min: 0, max: 100, step: "0.01" }), inputField("section_rating", "Rating", "text", item?.section_rating, false), textareaField("section_summary", "Summary", item?.section_summary, false)] });
}

function openAssessmentFindingModal(id = null, assessmentId = "") {
  const item = id ? state.assessmentFindings.find((record) => record.id === id) : {};
  openModal({ title: id ? "Edit Assessment Finding" : "Add Assessment Finding", mode: "assessment_findings", editingId: id, fields: [
    selectField("assessment_id", "Assessment", assessmentOptions(), item?.assessment_id || assessmentId, true), selectField("section_id", "Section", assessmentSectionOptions(item?.assessment_id || assessmentId), item?.section_id, false), textareaField("question_text", "Question / Criterion", item?.question_text, false), textareaField("expected_standard", "Expected Standard", item?.expected_standard, false), textareaField("observation", "Observation", item?.observation, true), textareaField("evidence_summary", "Evidence Summary", item?.evidence_summary, false), inputField("rating", "Rating", "text", item?.rating, false), inputField("score", "Score", "number", item?.score, false, { min: 0, max: 100, step: "0.01" }), selectField("compliance_result", "Compliance Result", optionSet(["compliant", "not_compliant", "partially_compliant", "not_applicable", "needs_follow_up"]), item?.compliance_result || "needs_follow_up", true), selectField("severity", "Severity", optionSet(["low", "medium", "high", "critical"]), item?.severity || "medium", true), selectField("finding_type", "Finding Type", optionSet(["strength", "observation", "minor_issue", "major_issue", "critical_issue", "opportunity_for_improvement"]), item?.finding_type || "observation", true), textareaField("recommendation", "Recommendation", item?.recommendation, false), checkboxField("requires_corrective_action", "Requires Corrective Action", Boolean(item?.requires_corrective_action)), selectField("responsible_person_id", "Responsible Person", peopleOptions(), item?.responsible_person_id, false), inputField("target_completion_date", "Target Completion Date", "date", item?.target_completion_date, false), selectField("finding_status", "Finding Status", optionSet(["open", "in_progress", "corrected", "verified", "closed", "waived"]), item?.finding_status || "open", true)
  ]});
}

function openAssessmentCorrectiveActionModal(id = null, findingId = "") {
  const finding = state.assessmentFindings.find((record) => record.id === findingId);
  const item = id ? state.assessmentCorrectiveActions.find((record) => record.id === id) : {};
  openModal({ title: id ? "Edit Corrective Action" : "Add Corrective Action", mode: "assessment_corrective_actions", editingId: id, fields: [selectField("assessment_id", "Assessment", assessmentOptions(), item?.assessment_id || finding?.assessment_id, true), selectField("finding_id", "Finding", assessmentFindingOptions(), item?.finding_id || findingId, false), inputField("action_title", "Action Title", "text", item?.action_title || finding?.recommendation || "Corrective Action", true), textareaField("root_cause", "Root Cause", item?.root_cause, false), textareaField("correction", "Correction", item?.correction, false), textareaField("corrective_action", "Corrective Action", item?.corrective_action || finding?.recommendation, false), textareaField("preventive_action", "Preventive Action", item?.preventive_action, false), selectField("assigned_to", "Assigned To", peopleOptions(), item?.assigned_to || finding?.responsible_person_id, false), inputField("due_date", "Due Date", "date", item?.due_date || finding?.target_completion_date, false), selectField("verified_by", "Verified By", peopleOptions(), item?.verified_by, false), textareaField("verification_result", "Verification Result", item?.verification_result, false), selectField("action_status", "Action Status", optionSet(["open", "assigned", "in_progress", "completed", "verified", "closed", "overdue"]), item?.action_status || "open", true), textareaField("remarks", "Remarks", item?.remarks, false)] });
}

function openAssessmentReportModal(id = null, assessmentId = "") {
  const assessment = state.assessments.find((record) => record.id === assessmentId);
  const item = id ? state.assessmentReports.find((record) => record.id === id) : {};
  openModal({ title: id ? "Edit Assessment Report" : "Generate Assessment Report", mode: "assessment_reports", editingId: id, fields: [selectField("assessment_id", "Assessment", assessmentOptions(), item?.assessment_id || assessmentId, true), inputField("report_title", "Report Title", "text", item?.report_title || `${assessment?.assessment_title || "Assessment"} Report`, true), inputField("report_reference_no", "Report Reference No.", "text", item?.report_reference_no || nextAssessmentReportReference(), false), selectField("report_status", "Report Status", optionSet(["draft", "generated", "under_review", "approved", "archived"]), item?.report_status || "generated", true), selectField("reviewed_by", "Reviewed By", peopleOptions(), item?.reviewed_by, false), selectField("approved_by", "Approved By", peopleOptions(), item?.approved_by, false), inputField("pdf_url", "PDF URL", "url", item?.pdf_url, false)] });
}

function openAssessmentRatingScaleModal(id = null, templateId = "") {
  const item = id ? state.assessmentRatingScales.find((record) => record.id === id) : {};
  openModal({ title: id ? "Edit Rating Scale" : "Add Rating Scale", mode: "assessment_rating_scales", editingId: id, fields: [selectField("template_id", "Template", assessmentTemplateOptions(), item?.template_id || templateId, true), inputField("rating_value", "Rating Value", "text", item?.rating_value, true), inputField("rating_label", "Rating Label", "text", item?.rating_label, true), textareaField("rating_description", "Description", item?.rating_description, false), inputField("min_score", "Min Score", "number", item?.min_score, false, { min: 0, max: 100, step: "0.01" }), inputField("max_score", "Max Score", "number", item?.max_score, false, { min: 0, max: 100, step: "0.01" }), inputField("sort_order", "Sort Order", "number", item?.sort_order ?? 0, true)] });
}

function printAssessmentReport(assessmentId) {
  const assessment = state.assessments.find((item) => item.id === assessmentId);
  if (!assessment) return showToast("Assessment record was not found.", "error");
  const findings = state.assessmentFindings.filter((item) => item.assessment_id === assessment.id);
  const actions = state.assessmentCorrectiveActions.filter((item) => item.assessment_id === assessment.id);
  const sectionRows = state.assessmentSections.filter((item) => item.assessment_id === assessment.id).map((item) => [item.section_title, item.section_rating || "", item.section_score ?? "", item.section_summary || ""]);
  const findingRows = findings.map((item) => [assessmentSectionTitle(item.section_id) || "General", item.observation || item.question_text || "Observation", formattedRoleLabel(item.compliance_result), formattedRoleLabel(item.severity), item.recommendation || ""]);
  const actionRows = actions.map((item) => [item.action_title || "Action", peopleNameRaw(item.assigned_to), formatDate(item.due_date), formattedRoleLabel(item.action_status)]);
  elements.printArea.innerHTML = `<div class="sop-summary-print assessment-print"><section class="sop-summary-document"><h1>${escapeHtml(assessment.assessment_title || "Assessment Report")}</h1><table class="document-control-table"><tbody><tr><th>Reference</th><td>${escapeHtml(assessment.assessment_reference_no || "Not assigned")}</td><th>Status</th><td>${formattedRoleLabel(assessment.assessment_status || "draft")}</td></tr><tr><th>Type</th><td>${escapeHtml(assessmentTypeName(assessment.assessment_type_id) || "Custom")}</td><th>Date</th><td>${formatDate(assessment.assessment_date)}</td></tr><tr><th>Scope</th><td>${escapeHtml(assessmentScopeLabel(assessment))}</td><th>Score</th><td>${escapeHtml(assessment.overall_score ?? "Not scored")}</td></tr></tbody></table><section class="monitoring-report-section"><h2>Purpose and Scope</h2><p>${escapeHtml(assessment.purpose || "No purpose recorded.")}</p><p>${escapeHtml(assessment.scope || "No scope recorded.")}</p></section><section class="monitoring-report-section"><h2>Reference Guidelines</h2><p>${escapeHtml(assessment.reference_guidelines || "No reference guidelines recorded.")}</p></section><section class="monitoring-report-section"><h2>Section Summary</h2>${assessmentPrintTable(["Section", "Rating", "Score", "Summary"], sectionRows, "No sections recorded.")}</section><section class="monitoring-report-section"><h2>Findings</h2>${assessmentPrintTable(["Section", "Observation", "Result", "Severity", "Recommendation"], findingRows, "No findings recorded.")}</section><section class="monitoring-report-section"><h2>Corrective Actions</h2>${assessmentPrintTable(["Action", "Assigned To", "Due", "Status"], actionRows, "No corrective actions recorded.")}</section><section class="monitoring-report-section"><h2>Summary</h2><p>${escapeHtml(assessment.executive_summary || assessment.general_findings || "No summary recorded.")}</p><p>${escapeHtml(assessment.confidentiality_note || "Assessment findings are intended for review, accountability, and continuous improvement.")}</p></section><table class="signature-table"><tbody><tr><td>Prepared By<br><strong>${peopleNameRaw(assessment.prepared_by)}</strong></td><td>Reviewed By<br><strong>${peopleNameRaw(assessment.reviewed_by)}</strong></td><td>Approved By<br><strong>${peopleNameRaw(assessment.approved_by)}</strong></td></tr></tbody></table></section></div>`;
  window.setTimeout(() => window.print(), 150);
}

function assessmentPrintTable(headers, rows, emptyMessage) {
  if (!rows.length) return `<p>${escapeHtml(emptyMessage)}</p>`;
  return `<table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell ?? "")}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function exportAssessmentsCsv() {
  downloadCsv("assessment-audit-records.csv", state.assessments.map((item) => ({ Reference: item.assessment_reference_no, Title: item.assessment_title, Type: assessmentTypeName(item.assessment_type_id), Scope: assessmentScopeLabel(item), Date: item.assessment_date, Status: formattedRoleLabel(item.assessment_status), Score: item.overall_score, Rating: item.overall_rating })));
}

function optionSet(values) { return values.map((value) => ({ value, label: formattedRoleLabel(value) })); }
function assessmentTypeOptions() { return state.assessmentTypes.map((item) => ({ value: item.id, label: item.type_name })); }
function assessmentTemplateOptions() { return state.assessmentTemplates.filter((item) => item.is_active !== false).map((item) => ({ value: item.id, label: item.template_name })); }
function assessmentOptions() { return state.assessments.map((item) => ({ value: item.id, label: `${item.assessment_reference_no || "Assessment"} - ${item.assessment_title || "Untitled"}` })); }
function assessmentSectionOptions(assessmentId = "") { return state.assessmentSections.filter((item) => !assessmentId || item.assessment_id === assessmentId).map((item) => ({ value: item.id, label: item.section_title })); }
function assessmentFindingOptions() { return state.assessmentFindings.map((item) => ({ value: item.id, label: `${assessmentTitle(item.assessment_id)} - ${item.observation || item.question_text || "Finding"}` })); }
function branchOptions() { const branches = Array.isArray(state.companySettings?.branches) ? state.companySettings.branches : []; return textOptions([...branches.map((branch) => typeof branch === "string" ? branch : branch?.name || branch?.branch_name), ...state.assessments.map((item) => item.branch_name)].filter(Boolean)); }
function assessmentTypeName(id) { return state.assessmentTypes.find((item) => item.id === id)?.type_name || ""; }
function assessmentTitle(id) { return state.assessments.find((item) => item.id === id)?.assessment_title || "Assessment"; }
function assessmentSectionTitle(id) { return state.assessmentSections.find((item) => item.id === id)?.section_title || ""; }
function assessmentScopeLabel(item) { return item.assessed_area_name || departmentNameRaw(item.department_id) || productLineNameRaw(item.workspace_id || item.product_line_id) || item.assessed_business_name || item.branch_name || "General"; }
function nextAssessmentReference() { return `ASM-${new Date().getFullYear()}-${String(state.assessments.length + 1).padStart(4, "0")}`; }
function nextAssessmentReportReference() { return `ASR-${new Date().getFullYear()}-${String(state.assessmentReports.length + 1).padStart(4, "0")}`; }

window.openAssessmentModal = openAssessmentModal;
window.openAssessmentTemplateModal = openAssessmentTemplateModal;
window.openAssessmentTemplateSectionModal = openAssessmentTemplateSectionModal;
window.openAssessmentSectionModal = openAssessmentSectionModal;
window.openAssessmentFindingModal = openAssessmentFindingModal;
window.openAssessmentCorrectiveActionModal = openAssessmentCorrectiveActionModal;
window.openAssessmentReportModal = openAssessmentReportModal;
window.openAssessmentRatingScaleModal = openAssessmentRatingScaleModal;
window.printAssessmentReport = printAssessmentReport;
window.exportAssessmentsCsv = exportAssessmentsCsv;




async function ensureAssessmentSectionsFromTemplate(assessment) {
  if (!assessment?.id || !assessment.template_id) return;
  const existing = state.assessmentSections.some((section) => section.assessment_id === assessment.id);
  if (existing) return;
  const templateSections = state.assessmentTemplateSections
    .filter((section) => section.template_id === assessment.template_id)
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
  if (!templateSections.length) return;
  try {
    await db.from("assessment_sections").insert(templateSections.map((section) => ({
      assessment_id: assessment.id,
      section_title: section.section_title,
      section_description: section.section_description || null,
      sort_order: section.sort_order || 0
    })));
  } catch (error) {
    console.warn("Assessment section copy skipped:", error.message);
  }
}

async function notifyAssessmentStakeholders(assessment, title, message) {
  const recipientIds = uniqueLabels([assessment.generated_by, assessment.created_by, state.session?.user?.id].filter(Boolean));
  await Promise.all(recipientIds.map((recipientUserId) => createNotification({
    recipientUserId,
    title,
    message,
    type: "assessment",
    relatedTable: "assessments",
    relatedRecordId: assessment.id
  })));
}

// Assessment & Audit prompt completion: generic rating engine and CSA-ready reporting.
function normalizeAssessmentRatingMethod(value) {
  const method = String(value || "custom").toLowerCase();
  if (["star", "stars", "star_1_5"].includes(method)) return "stars";
  if (["passfail", "pass_fail", "pass-fail"].includes(method)) return "pass_fail";
  if (["percent", "percentage"].includes(method)) return "percentage";
  if (["number", "numeric"].includes(method)) return "numeric";
  return "custom";
}

function assessmentTemplateForAssessment(assessment = {}) {
  return state.assessmentTemplates.find((template) => template.id === assessment.template_id) || {};
}

function assessmentForChildRecord(record = {}) {
  return state.assessments.find((assessment) => assessment.id === record.assessment_id) || {};
}

function assessmentRatingMethod(record = {}) {
  const template = record.template_id
    ? state.assessmentTemplates.find((item) => item.id === record.template_id)
    : assessmentTemplateForAssessment(assessmentForChildRecord(record));
  return normalizeAssessmentRatingMethod(record.rating_method || record.scoring_method || template?.rating_method || template?.scoring_method || "custom");
}

function assessmentRatingScaleLabel(value, templateId = "") {
  const match = state.assessmentRatingScales.find((scale) => {
    return (!templateId || scale.template_id === templateId) && [scale.id, scale.rating_value, scale.rating_label].includes(value);
  });
  return match?.rating_label || value || "";
}

function assessmentRatingDisplay(record = {}, scope = "overall") {
  const method = assessmentRatingMethod(record);
  const template = record.template_id ? state.assessmentTemplates.find((item) => item.id === record.template_id) : assessmentTemplateForAssessment(assessmentForChildRecord(record));
  const prefix = scope === "overall" ? "overall_" : "";
  const percentage = record[`${prefix}percentage_value`] ?? record.overall_score ?? record.section_score ?? record.score;
  const star = record[`${prefix}star_value`] ?? record.star_value;
  const numeric = record[`${prefix}numeric_value`] ?? record.numeric_value ?? record.score_value;
  const passFail = record[`${prefix}pass_fail_value`] ?? record.pass_fail_value;
  const custom = record[`${prefix}custom_scale_id`] ?? record.custom_scale_id ?? record.overall_rating ?? record.section_rating ?? record.rating;
  if (method === "percentage") return percentage !== null && percentage !== undefined ? `${Number(percentage).toFixed(Number(percentage) % 1 ? 2 : 0)}%` : "Not rated";
  if (method === "stars") {
    const max = Number(record.star_max || template?.star_max || 5);
    const filled = Math.max(0, Math.min(max, Math.round(Number(star || 0))));
    return filled ? `${"★".repeat(filled)}${"☆".repeat(Math.max(0, max - filled))} ${filled}/${max}` : "Not rated";
  }
  if (method === "pass_fail") return passFail ? formattedRoleLabel(passFail) : "Not rated";
  if (method === "numeric") {
    const max = record.numeric_max ?? template?.numeric_max;
    return numeric !== null && numeric !== undefined ? `${numeric}${max !== null && max !== undefined ? ` / ${max}` : ""}` : "Not rated";
  }
  return assessmentRatingScaleLabel(custom, record.template_id || template?.id) || "Not rated";
}

function assessmentRatingChip(record = {}, scope = "overall") {
  const method = assessmentRatingMethod(record);
  const text = assessmentRatingDisplay(record, scope);
  const pass = record.overall_pass_fail_value || record.pass_fail_value;
  const compliance = record.compliance_level || record.overall_compliance_level || record.compliance_result;
  const danger = pass === "fail" || compliance === "not_compliant" || ["high", "critical"].includes(record.severity);
  const warning = !danger && (pass === "conditional" || ["partially_compliant", "needs_follow_up"].includes(compliance) || record.severity === "medium");
  return `<span class="rating-chip ${method} ${danger ? "danger" : warning ? "warning" : ""}">${escapeHtml(text)}</span>`;
}

function assessmentDashboardMetrics(records, actions, findings) {
  const methods = uniqueLabels(records.map((item) => assessmentRatingMethod(item)).filter(Boolean));
  const percentRecords = records.filter((item) => assessmentRatingMethod(item) === "percentage" && item.overall_percentage_value !== null && item.overall_percentage_value !== undefined);
  const starRecords = records.filter((item) => assessmentRatingMethod(item) === "stars" && item.overall_star_value !== null && item.overall_star_value !== undefined);
  const average = methods.length === 1 && methods[0] === "percentage" && percentRecords.length
    ? `${Math.round(percentRecords.reduce((sum, item) => sum + Number(item.overall_percentage_value || 0), 0) / percentRecords.length)}%`
    : methods.length === 1 && methods[0] === "stars" && starRecords.length
      ? `${(starRecords.reduce((sum, item) => sum + Number(item.overall_star_value || 0), 0) / starRecords.length).toFixed(1)}★`
      : records.length ? "Mixed" : "None";
  const failed = records.filter((item) => {
    const threshold = Number(item.passing_threshold || assessmentTemplateForAssessment(item)?.passing_threshold || 0);
    return item.overall_pass_fail_value === "fail" || item.compliance_level === "not_compliant" || (assessmentRatingMethod(item) === "percentage" && threshold && Number(item.overall_percentage_value || 0) < threshold);
  }).length;
  return [
    ["Total", records.length],
    ["Scheduled", records.filter((item) => item.assessment_status === "scheduled").length],
    ["In Progress", records.filter((item) => item.assessment_status === "in_progress").length],
    ["Completed", records.filter((item) => ["completed", "reviewed", "approved"].includes(item.assessment_status)).length],
    ["Attention", failed + findings.filter((item) => ["open", "in_progress"].includes(item.finding_status) && ["high", "critical"].includes(item.severity)).length],
    ["Open Actions", actions.filter((item) => !["verified", "closed"].includes(item.action_status)).length],
    ["Average", average]
  ];
}

function ratingMethodOptions() {
  return [
    { value: "custom", label: "Custom Scale" },
    { value: "percentage", label: "Percentage" },
    { value: "stars", label: "Stars" },
    { value: "pass_fail", label: "Pass / Fail" },
    { value: "numeric", label: "Numeric" }
  ];
}

function passFailOptions() {
  return optionSet(["pass", "fail", "conditional", "not_applicable"]);
}

function customRatingOptions(templateId = "") {
  if (!templateId) return [];
  return state.assessmentRatingScales
    .filter((scale) => scale.template_id === templateId && scale.is_active !== false)
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .map((scale) => ({ value: scale.id, label: scale.rating_label || scale.rating_value }));
}

function assessmentTemplateRatingMethod(templateId = "") {
  const template = state.assessmentTemplates.find((item) => item.id === templateId);
  return normalizeAssessmentRatingMethod(template?.rating_method || template?.scoring_method || "custom");
}

function isCsaAssessmentTypeId(typeId = "") {
  const name = assessmentTypeName(typeId).toLowerCase();
  return name.includes("csa business consultancy") || name.includes("csa consultancy");
}

function ensureAssessmentRatingFields(form, method = "stars") {
  if (!form || form.elements.rating_method) return;
  const grid = form.querySelector(".form-grid") || form;
  const wrapper = document.createElement("div");
  wrapper.className = "assessment-injected-rating-fields";
  wrapper.innerHTML = assessmentRatingFields({ rating_method: method }, "overall", form.elements.template_id?.value || "");
  grid.appendChild(wrapper);
}

function assessmentRatingFields(item = {}, scope = "overall", templateId = "") {
  const method = assessmentRatingMethod({ ...item, template_id: templateId || item.template_id });
  const prefix = scope === "overall" ? "overall_" : "";
  return [
    selectField("rating_method", "Rating Method", ratingMethodOptions(), item.rating_method || method, true),
    `<div class="rating-method-field" data-rating-method-field="percentage">${inputField(`${prefix}percentage_value`, "Percentage Rating", "number", item[`${prefix}percentage_value`] ?? item.overall_score ?? item.section_score ?? item.score, false, { min: 0, max: 100, step: "0.01" })}</div>`,
    `<div class="rating-method-field" data-rating-method-field="stars">${assessmentStarPicker(`${prefix}star_value`, "Star Rating", item[`${prefix}star_value`] ?? item.star_value, item.star_max)}</div>`,
    `<div class="rating-method-field" data-rating-method-field="pass_fail">${selectField(`${prefix}pass_fail_value`, "Pass / Fail Rating", passFailOptions(), item[`${prefix}pass_fail_value`] ?? item.pass_fail_value, false)}</div>`,
    `<div class="rating-method-field" data-rating-method-field="numeric">${inputField(`${prefix}numeric_value`, "Numeric Rating", "number", item[`${prefix}numeric_value`] ?? item.numeric_value ?? item.score_value, false, { step: "0.01" })}</div>`,
    `<div class="rating-method-field" data-rating-method-field="custom" data-assessment-custom-rating-field data-rating-scope="${escapeAttribute(scope)}">${assessmentCustomRatingControl(scope, item, templateId || item.template_id)}</div>`
  ].join("");
}

function assessmentCustomRatingControl(scope = "overall", item = {}, templateId = "") {
  const prefix = scope === "overall" ? "overall_" : "";
  const name = `${prefix}custom_scale_id`;
  const options = customRatingOptions(templateId);
  if (options.length) {
    return selectField(name, "Custom Rating", options, item[`${prefix}custom_scale_id`] ?? item.custom_scale_id, false);
  }
  const message = templateId ? "No custom ratings configured for this template" : "Select a template first";
  return `<label>Custom Rating
    <select name="${escapeAttribute(name)}" disabled>
      <option value="">${escapeHtml(message)}</option>
    </select>
    <span class="field-hint">Create rating scale rows under the selected template to use Custom Scale.</span>
  </label>`;
}

function assessmentStarPicker(name, label, value = "", max = 5) {
  const starMax = Math.max(1, Math.min(10, Number(max || 5)));
  const current = Number(value || 0);
  const buttons = Array.from({ length: starMax }, (_, index) => {
    const rating = index + 1;
    return `<button class="star-rating-button ${rating <= current ? "is-selected" : ""}" type="button" data-star-value="${rating}" aria-label="${rating} star${rating === 1 ? "" : "s"}">★</button>`;
  }).join("");
  return `<label class="star-rating-label">${escapeHtml(label)}
    <input type="hidden" name="${escapeAttribute(name)}" value="${escapeAttribute(value ?? "")}">
    <span class="star-rating-control" data-star-rating-control data-star-input="${escapeAttribute(name)}">
      ${buttons}
      <button class="star-rating-clear" type="button" data-star-value="" aria-label="Clear star rating">Clear</button>
    </span>
  </label>`;
}

function setupAssessmentRatingControls(form) {
  if (!form) return;
  const csaSelected = state.modalMode === "assessments" && isCsaAssessmentTypeId(form.elements.assessment_type_id?.value);
  if (csaSelected) {
    ensureAssessmentRatingFields(form, "stars");
    if (form.elements.rating_method) form.elements.rating_method.value = "stars";
    if (form.elements.assessment_source) form.elements.assessment_source.value = "consultant";
    if (form.elements.evaluator_type) form.elements.evaluator_type.value = "consultant";
    if (form.elements.evaluator_organization && !form.elements.evaluator_organization.value) {
      form.elements.evaluator_organization.value = "CSA Business Consultancy";
    }
  }
  const methodInput = form.elements.rating_method || form.elements.scoring_method;
  if (!methodInput && state.modalMode !== "assessment_templates") return;
  if (state.modalMode === "assessments" && form.elements.template_id && !form.elements.rating_method?.value) {
    form.elements.rating_method.value = assessmentTemplateRatingMethod(form.elements.template_id.value);
  }
  if (state.modalMode !== "assessment_templates" && form.elements.assessment_id) {
    const assessment = state.assessments.find((item) => item.id === form.elements.assessment_id.value);
    if (assessment && form.elements.rating_method && !form.elements.rating_method.value) {
      form.elements.rating_method.value = assessmentRatingMethod(assessment);
    }
  }
  refreshAssessmentCustomRatingFields(form);
  const sync = () => {
    const method = normalizeAssessmentRatingMethod((form.elements.rating_method || form.elements.scoring_method)?.value);
    form.querySelectorAll("[data-rating-method-field]").forEach((field) => {
      field.hidden = field.dataset.ratingMethodField !== method;
    });
  };
  form.querySelectorAll("[data-star-rating-control]").forEach((control) => {
    if (control.dataset.bound === "true") return;
    control.dataset.bound = "true";
    const input = form.elements[control.dataset.starInput];
    const paint = (value) => {
      const selected = Number(value || 0);
      control.querySelectorAll(".star-rating-button").forEach((button) => {
        button.classList.toggle("is-selected", Number(button.dataset.starValue || 0) <= selected);
      });
    };
    const preview = (value) => {
      const hovered = Number(value || 0);
      control.querySelectorAll(".star-rating-button").forEach((button) => {
        button.classList.toggle("is-preview", hovered > 0 && Number(button.dataset.starValue || 0) <= hovered);
      });
    };
    control.addEventListener("click", (event) => {
      const button = event.target.closest("[data-star-value]");
      if (!button || !input) return;
      input.value = button.dataset.starValue || "";
      paint(input.value);
    });
    control.addEventListener("pointerover", (event) => {
      const button = event.target.closest(".star-rating-button");
      if (button) preview(button.dataset.starValue);
    });
    control.addEventListener("pointerleave", () => preview(""));
    paint(input?.value);
  });
  methodInput?.addEventListener("change", sync);
  sync();
}

function refreshAssessmentCustomRatingFields(form) {
  form.querySelectorAll("[data-assessment-custom-rating-field]").forEach((field) => {
    const scope = field.dataset.ratingScope || "overall";
    let templateId = form.elements.template_id?.value || "";
    if (!templateId && form.elements.assessment_id?.value) {
      templateId = state.assessments.find((item) => item.id === form.elements.assessment_id.value)?.template_id || "";
    }
    field.innerHTML = assessmentCustomRatingControl(scope, {}, templateId);
  });
}

function applyAssessmentRatingPayload(payload, scope = "overall") {
  const method = normalizeAssessmentRatingMethod(payload.rating_method || payload.scoring_method || payload.method);
  const prefix = scope === "overall" ? "overall_" : "";
  payload.rating_method = method;
  if (scope === "overall") payload.scoring_method = payload.scoring_method || method;
  if (method === "percentage") {
    payload.overall_score = payload.overall_percentage_value ?? payload.overall_score ?? payload.percentage_value ?? null;
    payload.score = payload.percentage_value ?? payload.score ?? null;
  } else if (method === "numeric") {
    payload.overall_score = payload.overall_numeric_value ?? payload.overall_score ?? null;
    payload.score = payload.numeric_value ?? payload.score ?? null;
  } else if (method === "stars") {
    payload.overall_rating = payload.overall_star_value ? `${payload.overall_star_value} stars` : payload.overall_rating || null;
    payload.rating = payload.star_value ? `${payload.star_value} stars` : payload.rating || null;
  } else if (method === "pass_fail") {
    payload.overall_rating = payload.overall_pass_fail_value || payload.overall_rating || null;
    payload.rating = payload.pass_fail_value || payload.rating || null;
  } else {
    payload.overall_rating = payload.overall_custom_scale_id || payload.overall_rating || payload.rating || null;
    payload.rating = payload.custom_scale_id || payload.rating || null;
  }
  if (scope === "section") {
    payload.section_score = method === "percentage" ? payload.percentage_value ?? payload.section_score ?? null : method === "numeric" ? payload.numeric_value ?? payload.section_score ?? null : payload.section_score || null;
    payload.section_rating = payload.custom_scale_id || payload.pass_fail_value || payload.star_value || payload.rating || payload.section_rating || null;
  }
  if (scope === "finding") {
    payload.rating = payload.custom_scale_id || payload.pass_fail_value || payload.star_value || payload.percentage_value || payload.numeric_value || payload.rating || null;
  }
  Object.keys(payload).forEach((key) => {
    if (key.startsWith(prefix) && payload[key] === "") payload[key] = null;
  });
}

function renderAssessmentDashboardSection() {
  const cards = elements.assessmentDashboardCards;
  const table = elements.recentAssessmentsDashboardTable;
  if (!cards && !table) return;
  const records = canViewAssessments() ? state.assessments : [];
  const actions = canViewAssessments() ? state.assessmentCorrectiveActions : [];
  const findings = canViewAssessments() ? state.assessmentFindings : [];
  const data = assessmentDashboardMetrics(records, actions, findings);
  if (cards) cards.innerHTML = data.map(([label, value]) => `<article class="summary-card ${["Attention", "Open Actions"].includes(label) ? "alert" : ""}"><span>${label}</span><strong>${value}</strong></article>`).join("");
  if (table) {
    const latest = [...records].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)).slice(0, 5);
    table.innerHTML = renderRows(latest, (item) => `
      <tr>
        <td><strong>${escapeHtml(item.assessment_title || "Untitled Assessment")}</strong><span class="muted-action">${escapeHtml(item.assessment_reference_no || assessmentTypeName(item.assessment_type_id) || "No reference")}</span></td>
        <td>${escapeHtml(assessmentScopeLabel(item))}</td>
        <td><span class="status-pill ${item.assessment_status === "draft" ? "warning" : ""}">${formattedRoleLabel(item.assessment_status || "draft")}</span></td>
        <td>${assessmentRatingChip(item)}</td>
        <td>${formatDate(item.assessment_date || item.created_at)}</td>
      </tr>
    `, 5, canUseAssessmentTables() ? "No assessments yet." : "Run the assessment SQL migration first.");
  }
}

function renderAssessments() {
  if (!elements.assessmentTable) return;
  const records = canViewAssessments() ? state.assessments : [];
  elements.assessmentTable.innerHTML = renderRows(records, (item) => `
    <tr>
      <td><strong>${escapeHtml(item.assessment_title || "Untitled Assessment")}</strong><span class="muted-action">${escapeHtml(item.assessment_reference_no || "No reference")}</span></td>
      <td>${escapeHtml(assessmentTypeName(item.assessment_type_id) || "Custom")}</td>
      <td>${escapeHtml(assessmentScopeLabel(item))}</td>
      <td>${formatDate(item.assessment_date)}</td>
      <td><span class="status-pill ${item.assessment_status === "draft" ? "warning" : ""}">${formattedRoleLabel(item.assessment_status || "draft")}</span></td>
      <td>${assessmentRatingChip(item)}</td>
      <td class="actions-cell"><div class="table-actions"><button type="button" onclick="printAssessmentReport('${escapeAttribute(item.id)}')">Print</button>${canManageAssessments() ? `<button type="button" onclick="openAssessmentModal('${escapeAttribute(item.id)}')">Edit</button><button type="button" onclick="openAssessmentSectionModal('', '${escapeAttribute(item.id)}')">Section</button><button type="button" onclick="openAssessmentReportModal('', '${escapeAttribute(item.id)}')">Report</button>${canDeleteRecords() ? `<button class="delete-action" type="button" onclick="deleteRecord('assessments', '${escapeAttribute(item.id)}')">Delete</button>` : ""}` : ""}</div></td>
    </tr>
  `, 7, canUseAssessmentTables() ? "No assessment records found." : "Run the assessment SQL migration first.");
}

function renderAssessmentTemplates() {
  if (!elements.assessmentTemplatesTable) return;
  const records = canViewAssessments() ? state.assessmentTemplates : [];
  elements.assessmentTemplatesTable.innerHTML = renderRows(records, (item) => `
    <tr>
      <td><strong>${escapeHtml(item.template_name || "Untitled Template")}</strong><span class="muted-action">${escapeHtml(item.description || "Reusable criteria")}</span></td>
      <td>${escapeHtml(assessmentTypeName(item.assessment_type_id) || "Custom")}</td>
      <td>${formattedRoleLabel(assessmentRatingMethod(item))}</td>
      <td>${state.assessmentTemplateSections.filter((section) => section.template_id === item.id).length}</td>
      <td>${state.assessmentRatingScales.filter((scale) => scale.template_id === item.id).length}</td>
      <td><span class="status-pill ${item.is_active === false ? "danger" : ""}">${item.is_active === false ? "Inactive" : "Active"}</span></td>
      <td class="actions-cell"><div class="table-actions">${canManageAssessments() ? `<button type="button" onclick="openAssessmentTemplateModal('${escapeAttribute(item.id)}')">Edit</button><button type="button" onclick="openAssessmentTemplateSectionModal('', '${escapeAttribute(item.id)}')">Section</button><button type="button" onclick="openAssessmentRatingScaleModal('', '${escapeAttribute(item.id)}')">Rating</button>` : ""}</div></td>
    </tr>
  `, 7, "No assessment templates found.");
}

function openAssessmentModal(id = null) {
  const item = id ? state.assessments.find((record) => record.id === id) : {};
  const template = state.assessmentTemplates.find((record) => record.id === item?.template_id) || {};
  const method = assessmentRatingMethod(item || template);
  openModal({ title: id ? "Edit Assessment" : "Create Assessment", mode: "assessments", editingId: id, fields: [
    inputField("assessment_reference_no", "Reference No.", "text", item?.assessment_reference_no || nextAssessmentReference(), false),
    inputField("assessment_title", "Assessment Title", "text", item?.assessment_title || "Business Assessment", true),
    selectField("assessment_type_id", "Assessment Type", assessmentTypeOptions(), item?.assessment_type_id, false),
    selectField("template_id", "Template", assessmentTemplateOptions(), item?.template_id, false),
    assessmentRatingFields({ ...item, rating_method: item?.rating_method || method }, "overall", item?.template_id),
    selectField("assessment_source", "Assessment Source", optionSet(["internal", "external", "third_party", "consultant", "regulatory", "other"]), item?.assessment_source || item?.evaluator_type || "internal", true),
    selectField("branch_name", "Branch", branchOptions(), item?.branch_name, false),
    selectField("department_id", "Department", departmentOptions(), item?.department_id, false),
    selectField("workspace_id", "Workspace / Business Unit", productLineOptions(), item?.workspace_id || item?.product_line_id, false),
    selectField("sop_id", "Related SOP", sopOptions(), item?.sop_id, false),
    inputField("assessed_area_name", "Area / Process", "text", item?.assessed_area_name, false),
    inputField("assessed_company_name", "Assessed Company / Client", "text", item?.assessed_company_name || item?.assessed_business_name, false),
    inputField("assessed_location", "Location / Address", "text", item?.assessed_location || item?.assessed_address, false),
    inputField("contact_person", "Client Contact Person", "text", item?.contact_person, false),
    inputField("contact_number", "Client Contact Number", "text", item?.contact_number, false),
    inputField("assessment_date", "Assessment Date", "date", item?.assessment_date, false),
    inputField("start_time", "Start Time", "time", item?.start_time || item?.assessment_start_time, false),
    inputField("end_time", "End Time", "time", item?.end_time || item?.assessment_end_time, false),
    inputField("evaluator_organization", "Evaluator Organization", "text", item?.evaluator_organization || template.default_evaluator_organization, false),
    inputField("evaluator_representative", "Evaluator Representative", "text", item?.evaluator_representative, false),
    inputField("evaluator_position", "Evaluator Position", "text", item?.evaluator_position, false),
    inputField("evaluator_email", "Evaluator Email", "email", item?.evaluator_email, false),
    inputField("evaluator_contact_number", "Evaluator Contact No.", "text", item?.evaluator_contact_number, false),
    inputField("evaluator_logo", "Evaluator Logo URL", "url", item?.evaluator_logo || template.default_evaluator_logo, false),
    inputField("evaluator_signature", "Evaluator Signature URL", "url", item?.evaluator_signature, false),
    textareaField("purpose", "Purpose", item?.purpose, false),
    textareaField("scope", "Scope", item?.scope, false),
    textareaField("reference_guidelines", "Reference Guidelines", item?.reference_guidelines || template.default_reference_guidelines, false),
    selectField("assessment_status", "Status", optionSet(["draft", "scheduled", "in_progress", "completed", "reviewed", "approved", "archived"]), item?.assessment_status || "draft", true),
    inputField("compliance_level", "Compliance Level", "text", item?.compliance_level || item?.overall_compliance_level, false),
    textareaField("executive_summary", "Executive Summary", item?.executive_summary, false),
    textareaField("findings_summary", "Findings Summary", item?.findings_summary || item?.general_findings, false),
    textareaField("strengths", "Strengths", item?.strengths, false),
    textareaField("opportunities_for_improvement", "Opportunities for Improvement", item?.opportunities_for_improvement, false),
    textareaField("confidentiality_note", "Confidentiality Note", item?.confidentiality_note || template.default_confidentiality_note, false),
    selectField("prepared_by", "Prepared By", peopleOptions(), item?.prepared_by, false),
    selectField("reviewed_by", "Reviewed By", peopleOptions(), item?.reviewed_by, false),
    selectField("approved_by", "Approved By", peopleOptions(), item?.approved_by, false)
  ]});
}

function openAssessmentTemplateModal(id = null) {
  const item = id ? state.assessmentTemplates.find((record) => record.id === id) : {};
  openModal({ title: id ? "Edit Assessment Template" : "Create Assessment Template", mode: "assessment_templates", editingId: id, fields: [
    inputField("template_name", "Template Name", "text", item?.template_name, true),
    selectField("assessment_type_id", "Assessment Type", assessmentTypeOptions(), item?.assessment_type_id, false),
    textareaField("description", "Description", item?.description, false),
    inputField("industry", "Industry", "text", item?.industry, false),
    selectField("business_type", "Business Type", [{ value: "", label: "Any business type" }, ...businessTypeOptions()], item?.business_type, false),
    selectField("rating_method", "Rating Method", ratingMethodOptions(), assessmentRatingMethod(item), true),
    inputField("star_max", "Max Stars", "number", item?.star_max || 5, false, { min: 1, step: 1 }),
    inputField("numeric_min", "Numeric Min", "number", item?.numeric_min, false, { step: "0.01" }),
    inputField("numeric_max", "Numeric Max", "number", item?.numeric_max, false, { step: "0.01" }),
    inputField("passing_threshold", "Passing Threshold", "number", item?.passing_threshold, false, { step: "0.01" }),
    inputField("default_evaluator_organization", "Default Evaluator Organization", "text", item?.default_evaluator_organization, false),
    inputField("default_evaluator_logo", "Default Evaluator Logo URL", "url", item?.default_evaluator_logo, false),
    textareaField("default_reference_guidelines", "Default Reference Guidelines", item?.default_reference_guidelines, false),
    textareaField("default_confidentiality_note", "Default Confidentiality Note", item?.default_confidentiality_note, false),
    checkboxField("allow_not_applicable", "Allow Not Applicable", item?.allow_not_applicable !== false),
    checkboxField("is_active", "Active Template", item?.is_active !== false)
  ]});
}

function openAssessmentSectionModal(id = null, assessmentId = "") {
  const item = id ? state.assessmentSections.find((record) => record.id === id) : {};
  const assessment = state.assessments.find((record) => record.id === (item?.assessment_id || assessmentId)) || {};
  openModal({ title: id ? "Edit Assessment Section" : "Add Assessment Section", mode: "assessment_sections", editingId: id, fields: [
    selectField("assessment_id", "Assessment", assessmentOptions(), item?.assessment_id || assessmentId, true),
    inputField("section_title", "Section Title", "text", item?.section_title, true),
    textareaField("section_description", "Description", item?.section_description, false),
    inputField("sort_order", "Sort Order", "number", item?.sort_order ?? 0, true),
    assessmentRatingFields({ ...item, template_id: assessment.template_id, rating_method: item?.rating_method || assessmentRatingMethod(assessment) }, "section", assessment.template_id),
    textareaField("section_summary", "Summary", item?.section_summary, false)
  ]});
}

function openAssessmentFindingModal(id = null, assessmentId = "") {
  const item = id ? state.assessmentFindings.find((record) => record.id === id) : {};
  const assessment = state.assessments.find((record) => record.id === (item?.assessment_id || assessmentId)) || {};
  openModal({ title: id ? "Edit Assessment Finding" : "Add Assessment Finding", mode: "assessment_findings", editingId: id, fields: [
    selectField("assessment_id", "Assessment", assessmentOptions(), item?.assessment_id || assessmentId, true),
    selectField("section_id", "Section", assessmentSectionOptions(item?.assessment_id || assessmentId), item?.section_id, false),
    textareaField("question_text", "Question / Criterion", item?.question_text, false),
    textareaField("expected_standard", "Expected Standard", item?.expected_standard, false),
    textareaField("observation", "Observation", item?.observation, true),
    textareaField("evidence_summary", "Evidence Summary", item?.evidence_summary, false),
    assessmentRatingFields({ ...item, template_id: assessment.template_id, rating_method: item?.rating_method || assessmentRatingMethod(assessment) }, "finding", assessment.template_id),
    selectField("compliance_result", "Compliance Result", optionSet(["compliant", "not_compliant", "partially_compliant", "not_applicable", "needs_follow_up"]), item?.compliance_result || "needs_follow_up", true),
    selectField("severity", "Severity", optionSet(["low", "medium", "high", "critical"]), item?.severity || "medium", true),
    selectField("finding_type", "Finding Type", optionSet(["strength", "observation", "minor_issue", "major_issue", "critical_issue", "opportunity_for_improvement"]), item?.finding_type || "observation", true),
    textareaField("recommendation", "Recommendation", item?.recommendation, false),
    checkboxField("requires_corrective_action", "Requires Corrective Action", Boolean(item?.requires_corrective_action)),
    selectField("responsible_person_id", "Responsible Person", peopleOptions(), item?.responsible_person_id, false),
    inputField("target_completion_date", "Target Completion Date", "date", item?.target_completion_date, false),
    selectField("finding_status", "Finding Status", optionSet(["open", "in_progress", "corrected", "verified", "closed", "waived"]), item?.finding_status || "open", true)
  ]});
}

function openAssessmentRatingScaleModal(id = null, templateId = "") {
  const item = id ? state.assessmentRatingScales.find((record) => record.id === id) : {};
  openModal({ title: id ? "Edit Rating Scale" : "Add Rating Scale", mode: "assessment_rating_scales", editingId: id, fields: [
    selectField("template_id", "Template", assessmentTemplateOptions(), item?.template_id || templateId, true),
    inputField("rating_value", "Rating Value", "text", item?.rating_value, true),
    inputField("rating_label", "Rating Label", "text", item?.rating_label, true),
    textareaField("rating_description", "Description", item?.rating_description, false),
    inputField("score_value", "Score Value", "number", item?.score_value, false, { step: "0.01" }),
    inputField("min_score", "Min Score", "number", item?.min_score, false, { step: "0.01" }),
    inputField("max_score", "Max Score", "number", item?.max_score, false, { step: "0.01" }),
    inputField("passing_threshold", "Passing Threshold", "number", item?.passing_threshold, false, { step: "0.01" }),
    inputField("icon", "Icon / Symbol", "text", item?.icon, false),
    inputField("color", "Color", "text", item?.color, false),
    inputField("sort_order", "Sort Order", "number", item?.sort_order ?? 0, true),
    checkboxField("is_passing", "Passing Rating", Boolean(item?.is_passing)),
    checkboxField("is_active", "Active", item?.is_active !== false)
  ]});
}

function renderAssessmentFindings() {
  if (!elements.assessmentFindingsTable) return;
  const records = canViewAssessments() ? state.assessmentFindings : [];
  elements.assessmentFindingsTable.innerHTML = renderRows(records, (item) => `
    <tr>
      <td><strong>${escapeHtml(assessmentTitle(item.assessment_id))}</strong><span class="muted-action">${escapeHtml(assessmentSectionTitle(item.section_id) || "General")}</span></td>
      <td>${escapeHtml(item.observation || item.question_text || "Observation")}<span class="muted-action">${assessmentRatingDisplay(item, "finding")}</span></td>
      <td><span class="status-pill ${["high", "critical"].includes(item.severity) ? "danger" : item.severity === "medium" ? "warning" : ""}">${formattedRoleLabel(item.severity || "medium")}</span></td>
      <td>${formattedRoleLabel(item.compliance_result || "needs_follow_up")}</td>
      <td>${peopleName(item.responsible_person_id)}</td>
      <td>${formatDate(item.target_completion_date)}</td>
      <td class="actions-cell"><div class="table-actions">${canManageAssessments() ? `<button type="button" onclick="openAssessmentFindingModal('${escapeAttribute(item.id)}')">Edit</button><button type="button" onclick="openAssessmentCorrectiveActionModal('', '${escapeAttribute(item.id)}')">Action</button>` : ""}</div></td>
    </tr>
  `, 7, "No assessment findings found.");
}

function printAssessmentReport(assessmentId) {
  const assessment = state.assessments.find((item) => item.id === assessmentId);
  if (!assessment) return showToast("Assessment record was not found.", "error");
  const findings = state.assessmentFindings.filter((item) => item.assessment_id === assessment.id);
  const actions = state.assessmentCorrectiveActions.filter((item) => item.assessment_id === assessment.id);
  const sections = state.assessmentSections.filter((item) => item.assessment_id === assessment.id);
  const logo = assessment.evaluator_logo ? `<img class="assessment-evaluator-logo" src="${escapeAttribute(assessment.evaluator_logo)}" alt="Evaluator logo">` : "";
  const signature = assessment.evaluator_signature ? `<img class="assessment-signature" src="${escapeAttribute(assessment.evaluator_signature)}" alt="Evaluator signature">` : "";
  const sectionRows = sections.map((item) => [item.section_title, assessmentRatingDisplay({ ...item, assessment_id: assessment.id, template_id: assessment.template_id }, "section"), item.section_summary || ""]);
  const findingRows = findings.map((item) => [assessmentSectionTitle(item.section_id) || "General", item.observation || item.question_text || "Observation", assessmentRatingDisplay({ ...item, assessment_id: assessment.id, template_id: assessment.template_id }, "finding"), formattedRoleLabel(item.compliance_result), formattedRoleLabel(item.severity), item.recommendation || ""]);
  const actionRows = actions.map((item) => [item.action_title || "Action", peopleNameRaw(item.assigned_to), formatDate(item.due_date), formattedRoleLabel(item.action_status)]);
  elements.printArea.innerHTML = `<div class="sop-summary-print assessment-print"><section class="sop-summary-document"><p class="print-pdf-hint">Use your browser print dialog and choose Save as PDF.</p><header class="assessment-csa-header">${logo}<div><p class="eyebrow">Assessment Conducted By</p><h1>${escapeHtml(assessment.evaluator_organization || "Assessment Team")}</h1><p>${escapeHtml([assessment.evaluator_representative, assessment.evaluator_position].filter(Boolean).join(" - ") || "Evaluator")}</p><p>${escapeHtml([assessment.evaluator_email, assessment.evaluator_contact_number].filter(Boolean).join(" | "))}</p></div></header><h1>${escapeHtml(assessment.assessment_title || "Assessment Report")}</h1><table class="document-control-table"><tbody><tr><th>Reference</th><td>${escapeHtml(assessment.assessment_reference_no || "Not assigned")}</td><th>Status</th><td>${formattedRoleLabel(assessment.assessment_status || "draft")}</td></tr><tr><th>Type</th><td>${escapeHtml(assessmentTypeName(assessment.assessment_type_id) || "Custom")}</td><th>Date</th><td>${formatDate(assessment.assessment_date)}</td></tr><tr><th>Client / Scope</th><td>${escapeHtml(assessmentScopeLabel(assessment))}</td><th>Rating</th><td>${escapeHtml(assessmentRatingDisplay(assessment))}</td></tr><tr><th>Location</th><td>${escapeHtml(assessment.assessed_location || assessment.assessed_address || "Not recorded")}</td><th>Method</th><td>${formattedRoleLabel(assessmentRatingMethod(assessment))}</td></tr></tbody></table><section class="monitoring-report-section"><h2>Purpose and Scope</h2><p>${escapeHtml(assessment.purpose || "No purpose recorded.")}</p><p>${escapeHtml(assessment.scope || "No scope recorded.")}</p></section><section class="monitoring-report-section"><h2>Reference Guidelines</h2><p>${escapeHtml(assessment.reference_guidelines || "No reference guidelines recorded.")}</p></section><section class="monitoring-report-section"><h2>Section Summary</h2>${assessmentPrintTable(["Section", "Rating", "Summary"], sectionRows, "No sections recorded.")}</section><section class="monitoring-report-section"><h2>Findings</h2>${assessmentPrintTable(["Section", "Observation", "Rating", "Result", "Severity", "Recommendation"], findingRows, "No findings recorded.")}</section><section class="monitoring-report-section"><h2>Corrective Actions</h2>${assessmentPrintTable(["Action", "Assigned To", "Due", "Status"], actionRows, "No corrective actions recorded.")}</section><section class="monitoring-report-section"><h2>Summary</h2><p>${escapeHtml(assessment.executive_summary || assessment.findings_summary || assessment.general_findings || "No summary recorded.")}</p><p>${escapeHtml(assessment.confidentiality_note || "Assessment findings are intended for review, accountability, and continuous improvement.")}</p></section><table class="signature-table"><tbody><tr><td>Evaluator<br><strong>${escapeHtml(assessment.evaluator_representative || "")}</strong>${signature}</td><td>Reviewed By<br><strong>${peopleNameRaw(assessment.reviewed_by)}</strong></td><td>Approved By<br><strong>${peopleNameRaw(assessment.approved_by)}</strong></td></tr></tbody></table></section></div>`;
  window.setTimeout(() => window.print(), 150);
}

function exportAssessmentsCsv() {
  downloadCsv("assessment-audit-records.csv", state.assessments.map((item) => ({
    Reference: item.assessment_reference_no,
    Title: item.assessment_title,
    Type: assessmentTypeName(item.assessment_type_id),
    Scope: assessmentScopeLabel(item),
    Date: item.assessment_date,
    Status: formattedRoleLabel(item.assessment_status),
    Method: formattedRoleLabel(assessmentRatingMethod(item)),
    Rating: assessmentRatingDisplay(item),
    Evaluator: item.evaluator_organization
  })));
}

window.openAssessmentModal = openAssessmentModal;
window.openAssessmentTemplateModal = openAssessmentTemplateModal;
window.openAssessmentSectionModal = openAssessmentSectionModal;
window.openAssessmentFindingModal = openAssessmentFindingModal;
window.openAssessmentRatingScaleModal = openAssessmentRatingScaleModal;
window.printAssessmentReport = printAssessmentReport;
window.exportAssessmentsCsv = exportAssessmentsCsv;
