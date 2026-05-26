const SUPABASE_URL = "https://rlauwxqifqpyyiuzxdoe.supabase.co";
const SUPABASE_KEY = "sb_publishable_fQCecVQkPBTRBtWCM5zRYA_iiFt-gDK";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const state = {
  session: null,
  personnel: [],
  plans: [],
  planItems: [],
  actions: [],
  selectedPlanId: null,
  modalMode: null,
  editingId: null
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monitoringTemplates = [
  {
    id: "preventive-maintenance",
    category: "Preventive Maintenance Record",
    objective: "Ensure production equipment is inspected, cleaned, lubricated, calibrated, and maintained as scheduled.",
    target_standard: "Equipment serviced every Sunday afternoon; all units functional with no unresolved safety or sanitation issue.",
    frequency: "Every Sunday afternoon",
    expected_output: "Completed maintenance record showing date, equipment serviced, activity done, remarks, and verification.",
    remarks: "Based on the Monitoring Records Summary preventive maintenance module."
  },
  {
    id: "temperature-monitoring",
    category: "Daily Temperature Monitoring Record",
    objective: "Monitor walk-in freezer temperature for raw materials at defined daily intervals.",
    target_standard: "Temperature maintained within -18 C to -21 C during 6:00 AM, 12:00 PM, and 6:00 PM checks.",
    frequency: "Daily: 6:00 AM, 12:00 PM, 6:00 PM",
    expected_output: "Temperature log with readings, remarks, and verifier for each monitoring date.",
    remarks: "Location: Walk-in freezer for raw materials."
  },
  {
    id: "raw-meat-receiving",
    category: "Receiving of Raw Imported Meat",
    objective: "Verify raw imported meat deliveries before acceptance into production storage.",
    target_standard: "Batches pass receiving inspection with acceptable condition, temperature, documentation, and no non-conformance.",
    frequency: "Every receiving activity",
    expected_output: "Receiving record showing date, supplier or batch details, inspection result, remarks, and verification.",
    remarks: "Use for raw material receiving checks."
  },
  {
    id: "manufacturing-operations",
    category: "Manufacturing Operations Monitoring",
    objective: "Confirm production operations follow GMP, sanitation, and process-flow requirements.",
    target_standard: "Workers wear hairnets, gloves, clean aprons/PPE; process flow is followed; corrective action logged when needed.",
    frequency: "Daily random spot check",
    expected_output: "Operations monitoring record with observations, corrective action if any, and verifier.",
    remarks: "Covers Longganisa and Bagnet production checks."
  },
  {
    id: "personnel-hygiene",
    category: "Personnel Hygiene Monitoring",
    objective: "Verify food handlers meet hygiene and illness-control requirements before and during operations.",
    target_standard: "100% compliance for uniform, nails, hairnet, PPE, temperature, and cough/illness screening.",
    frequency: "Daily",
    expected_output: "Personnel hygiene record with compliance result, remarks, and verification.",
    remarks: "Use for FH1-FH8 or equivalent personnel group."
  },
  {
    id: "cleaning-sanitation",
    category: "Cleaning and Sanitation Record",
    objective: "Document cleaning and sanitation activities for production areas, equipment, utensils, floors, vats, and facility areas.",
    target_standard: "Daily cleaning and scheduled general cleaning completed using approved detergent, chlorine solution, or degreaser.",
    frequency: "Daily and scheduled general cleaning",
    expected_output: "Cleaning record with area covered, cleaning agents used, remarks, and verifier.",
    remarks: "Covers production area and full facility sanitation."
  }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
  loginView: $("#loginView"),
  appShell: $("#appShell"),
  loginForm: $("#loginForm"),
  registerForm: $("#registerForm"),
  logoutBtn: $("#logoutBtn"),
  refreshBtn: $("#refreshBtn"),
  pageTitle: $("#pageTitle"),
  menuToggle: $("#menuToggle"),
  mobileNav: $("#mobileNav"),
  loadingOverlay: $("#loadingOverlay"),
  toast: $("#toast"),
  modalBackdrop: $("#modalBackdrop"),
  modalTitle: $("#modalTitle"),
  modalForm: $("#modalForm"),
  closeModalBtn: $("#closeModalBtn"),
  personnelTable: $("#personnelTable"),
  plansTable: $("#plansTable"),
  actionsTable: $("#actionsTable"),
  planDetailsPanel: $("#planDetailsPanel")
};

document.addEventListener("DOMContentLoaded", init);

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

function bindStaticEvents() {
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.registerForm.addEventListener("submit", handleRegister);
  $("#showRegister").addEventListener("click", () => switchAuth("register"));
  $("#showLogin").addEventListener("click", () => switchAuth("login"));
  $$("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => togglePassword(button));
  });
  elements.logoutBtn.addEventListener("click", handleLogout);
  elements.refreshBtn.addEventListener("click", loadAllData);
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
  $("#addActionBtn").addEventListener("click", () => openActionModal());

  $$(".nav-link").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
}

async function updateAuthView() {
  if (state.session) {
    elements.loginView.classList.add("is-hidden");
    elements.appShell.classList.remove("is-hidden");
    await loadAllData();
  } else {
    elements.loginView.classList.remove("is-hidden");
    elements.appShell.classList.add("is-hidden");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
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
  event.currentTarget.reset();
}

async function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  setLoading(true);

  const { error } = await db.auth.signUp({
    email: formData.get("email"),
    password: formData.get("password")
  });

  setLoading(false);
  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast("Registration submitted. Check email confirmation if enabled.", "success");
  event.currentTarget.reset();
  switchAuth("login");
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
      fetchTable("personnel", "created_at", true),
      fetchTable("plans", "created_at", true),
      fetchTable("plan_items", "created_at", true),
      fetchTable("action_taken", "created_at", true)
    ]);

    const [personnel, plans, planItems, actions] = results.map((result) => (
      result.status === "fulfilled" ? result.value : []
    ));

    state.personnel = personnel;
    state.plans = plans;
    state.planItems = planItems;
    state.actions = actions;

    const failedLoad = results.find((result) => result.status === "rejected");
    if (failedLoad) showToast(failedLoad.reason.message, "error");

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

  if (error) throw error;
  return data || [];
}

function renderAll() {
  renderDashboard();
  renderPersonnel();
  renderPlans();
  renderPlanDetails();
  renderActions();
}

function renderDashboard() {
  $("#totalPlans").textContent = state.plans.length;
  $("#totalPlanItems").textContent = state.planItems.length;
  $("#totalActions").textContent = state.actions.length;

  const today = startOfDay(new Date());
  const planItemsWithActions = new Set(state.actions.map((action) => action.plan_item_id).filter(Boolean));
  const completedItems = state.planItems.filter((item) => planItemsWithActions.has(item.id)).length;
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
  $("#recentNonCompliances").textContent = recentCount;

  $("#planningStatus").textContent = state.plans.length ? "Active" : "No Plans";
  $("#planningSubtext").textContent = state.plans.length
    ? `${state.plans.length} plan${state.plans.length === 1 ? "" : "s"} under control.`
    : "Create a plan to begin.";
  $("#planItemRing").style.setProperty("--progress", `${itemProgress}%`);
  $("#planItemPercent").textContent = `${itemProgress}%`;
  $("#planItemStatus").textContent = itemProgress === 100 ? "Completed" : itemProgress > 0 ? "In Progress" : "Not Started";
  $("#planItemSubtext").textContent = `${completedItems} of ${state.planItems.length} item${state.planItems.length === 1 ? "" : "s"} have action records.`;
  $("#actionStatus").textContent = state.actions.length ? "Documented" : "Waiting";
  $("#actionSubtext").textContent = state.actions.length
    ? `${state.actions.length} corrective/preventive record${state.actions.length === 1 ? "" : "s"} logged.`
    : "No non-compliance actions recorded.";

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
    "No action taken records yet."
  );

  renderMonitoringModules();
}

function renderMonitoringModules() {
  const container = $("#monitoringModulesList");
  if (!container) return;

  container.innerHTML = monitoringTemplates.map((template) => `
    <article class="module-template-card">
      <strong>${escapeHtml(template.category)}</strong>
      <span>${escapeHtml(template.frequency)}</span>
      <p>${escapeHtml(template.target_standard)}</p>
    </article>
  `).join("");
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

function renderPersonnel() {
  elements.personnelTable.innerHTML = renderRows(
    state.personnel,
    (person) => `
      <tr>
        <td><strong>${escapeHtml(person.full_name)}</strong></td>
        <td>${escapeHtml(person.position)}</td>
        <td>${escapeHtml(person.role)}</td>
        <td class="actions-cell">
          <div class="table-actions">
            <button type="button" onclick="openPersonnelModal('${person.id}')">Edit</button>
            <button class="delete-action" type="button" onclick="deleteRecord('personnel', '${person.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `,
    4,
    "No personnel records found."
  );
}

function renderPlans() {
  renderPlanPersonnelNotice();

  elements.plansTable.innerHTML = renderRows(
    state.plans,
    (plan) => `
      <tr class="${plan.id === state.selectedPlanId ? "selected-row" : ""}">
        <td><strong>${escapeHtml(plan.plan_title)}</strong></td>
        <td>${formatPeriod(plan.period_month, plan.period_year)}</td>
        <td>${personName(plan.created_by)}</td>
        <td>${personName(plan.approved_by)}</td>
        <td class="actions-cell">
          <div class="table-actions">
            <button type="button" onclick="selectPlan('${plan.id}')">View</button>
            <button type="button" onclick="openPlanModal('${plan.id}')">Edit</button>
            <button class="delete-action" type="button" onclick="deleteRecord('plans', '${plan.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `,
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
      <button class="ghost-btn" type="button" onclick="quickAddPersonnel()">Add Personnel</button>
    </div>
  `;
}

function renderPlanDetails() {
  const plan = state.plans.find((item) => item.id === state.selectedPlanId);
  if (!plan) {
    elements.planDetailsPanel.innerHTML = `
      <div class="empty-state">
        <h4>Select a plan</h4>
        <p>Plan item controls appear here after choosing a plan.</p>
      </div>
    `;
    return;
  }

  const items = state.planItems.filter((item) => item.plan_id === plan.id);
  elements.planDetailsPanel.innerHTML = `
    <div class="detail-title">
      <div>
        <p class="eyebrow">Plan Details</p>
        <h4>${escapeHtml(plan.plan_title)}</h4>
      </div>
      <button class="primary-btn" type="button" onclick="openPlanItemModal()">Add Item</button>
    </div>
    <ul class="meta-list">
      <li><span>Period</span><strong>${formatPeriod(plan.period_month, plan.period_year)}</strong></li>
      <li><span>Start</span><strong>${formatDate(plan.start_date)}</strong></li>
      <li><span>End</span><strong>${formatDate(plan.end_date)}</strong></li>
      <li><span>Created By</span><strong>${personName(plan.created_by)}</strong></li>
      <li><span>Approved By</span><strong>${personName(plan.approved_by)}</strong></li>
    </ul>
    <div>
      ${items.length ? items.map(renderPlanItemCard).join("") : '<div class="empty-state"><p>No plan items yet.</p></div>'}
    </div>
  `;
}

function renderPlanItemCard(item) {
  return `
    <article class="item-card">
      <div class="detail-title">
        <strong>${escapeHtml(item.category)}</strong>
        <div class="table-actions">
          <button type="button" onclick="openPlanItemModal('${item.id}')">Edit</button>
          <button class="delete-action" type="button" onclick="deleteRecord('plan_items', '${item.id}')">Delete</button>
        </div>
      </div>
      <p><strong>Objective:</strong> ${escapeHtml(item.objective)}</p>
      <p><strong>Target Standard:</strong> ${escapeHtml(item.target_standard)}</p>
      <p><strong>Responsible:</strong> ${personName(item.responsible_person)} | <strong>Frequency:</strong> ${escapeHtml(item.frequency)}</p>
      <p><strong>Expected Output:</strong> ${escapeHtml(item.expected_output)}</p>
      <p><strong>Due:</strong> ${formatDate(item.due_date)} | <strong>Remarks:</strong> ${escapeHtml(item.remarks)}</p>
    </article>
  `;
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
      "Date Checked": action.date_checked,
      "NOT COMPLIANT": action.not_compliant_observation,
      "CORRECTIVE ACTION": action.corrective_action,
      REMARKS: action.remarks,
      "PREVENTIVE ACTION": action.preventive_action
    };
  });
  downloadCsv("action-taken-records", rows);
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

  printHtmlReport("Plan Module", groups, "plan-print");
}

function printActionsReport() {
  const rows = state.actions.map((action) => {
    const item = state.planItems.find((record) => record.id === action.plan_item_id);
    const plan = item ? state.plans.find((record) => record.id === item.plan_id) : null;
    return [
      plan?.plan_title || "",
      item?.category || "",
      rawPersonName(action.checked_by),
      formatDate(action.date_checked),
      action.not_compliant_observation,
      action.corrective_action,
      action.remarks,
      action.preventive_action
    ];
  });
  printReport(
    "Action Taken Records",
    ["Plan", "Plan Item", "Checked By", "Date Checked", "NOT COMPLIANT", "CORRECTIVE ACTION", "REMARKS", "PREVENTIVE ACTION"],
    rows
  );
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
  printArea.innerHTML = `
    <h1>${escapeHtml(title)}</h1>
    <p>4K Enterprise Corporation | Generated ${escapeHtml(formatDateTime(new Date().toISOString()))}</p>
    ${bodyHtml}
  `;
  window.print();
}

function switchView(viewId) {
  $$(".view").forEach((view) => view.classList.toggle("is-active", view.id === viewId));
  $$(".nav-link").forEach((link) => link.classList.toggle("is-active", link.dataset.view === viewId));
  elements.mobileNav.classList.remove("is-open");

  const titleMap = {
    dashboardView: "Dashboard",
    personnelView: "Personnel Management",
    plansView: "Plan Module",
    actionsView: "Action Taken Module"
  };
  elements.pageTitle.textContent = titleMap[viewId] || "Dashboard";
}

function openPersonnelModal(id = null) {
  const person = id ? state.personnel.find((item) => item.id === id) : {};
  openModal({
    title: id ? "Edit Personnel" : "Add Personnel",
    mode: "personnel",
    editingId: id,
    fields: [
      inputField("full_name", "Full Name", "text", person?.full_name, true),
      inputField("position", "Position", "text", person?.position, true),
      inputField("role", "Role", "text", person?.role, true)
    ]
  });
}

function openPlanModal(id = null) {
  const plan = id ? state.plans.find((item) => item.id === id) : {};
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
      personnelPromptField(people.length),
      inputField("plan_title", "Plan Title", "text", plan?.plan_title, true),
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
  if (!state.selectedPlanId) {
    showToast("Select a plan before adding items.", "error");
    return;
  }

  const item = id ? state.planItems.find((record) => record.id === id) : {};
  const plan = state.plans.find((record) => record.id === state.selectedPlanId);
  const minDate = maxDateInputValue(toDateInputValue(new Date()), plan?.start_date);
  const maxDate = plan?.end_date || "";
  openModal({
    title: id ? "Edit Plan Item" : "Add Plan Item",
    mode: "plan_items",
    editingId: id,
    fields: [
      templatePickerField(),
      hiddenField("plan_id", state.selectedPlanId),
      inputField("category", "Category", "text", item?.category, true),
      textareaField("objective", "Objective", item?.objective, true),
      textareaField("target_standard", "Target Standard", item?.target_standard, true),
      selectField("responsible_person", "Responsible Person", personnelOptions(), item?.responsible_person, true),
      inputField("frequency", "Frequency", "text", item?.frequency, true),
      textareaField("expected_output", "Expected Output", item?.expected_output, true),
      inputField("start_date", "Start Date", "date", item?.start_date, true, { min: minDate, max: maxDate }),
      inputField("due_date", "Due Date", "date", item?.due_date, true, { min: item?.start_date || minDate, max: maxDate }),
      textareaField("remarks", "Remarks", item?.remarks, false)
    ]
  });
  bindDateGuards();
}

function openActionModal(id = null) {
  const action = id ? state.actions.find((record) => record.id === id) : {};
  const selectedItem = state.planItems.find((item) => item.id === action?.plan_item_id);
  openModal({
    title: id ? "Edit Action Taken" : "Add Action Taken",
    mode: "action_taken",
    editingId: id,
    fields: [
      actionPlanItemPromptField(),
      actionPlanFilterField(selectedItem?.plan_id || ""),
      planItemSelectField(action?.plan_item_id),
      selectField("checked_by", "Checked By", personnelOptions(), action?.checked_by, true),
      inputField("date_checked", "Date Checked", "date", action?.date_checked, true, { max: toDateInputValue(new Date()) }),
      textareaField("not_compliant_observation", "Not Compliant Observation", action?.not_compliant_observation, true),
      textareaField("corrective_action", "Corrective Action", action?.corrective_action, true),
      textareaField("remarks", "Remarks", action?.remarks, false),
      textareaField("preventive_action", "Preventive Action", action?.preventive_action, true)
    ]
  });
  filterActionPlanItems(selectedItem?.plan_id || "");
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
}

function closeModal() {
  elements.modalBackdrop.classList.add("is-hidden");
  elements.modalForm.reset();
  elements.modalForm.onsubmit = null;
  state.modalMode = null;
  state.editingId = null;
}

async function handleModalSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const payload = Object.fromEntries(formData.entries());

  Object.keys(payload).forEach((key) => {
    if (payload[key] === "") payload[key] = null;
  });

  if (payload.period_month) payload.period_month = Number(payload.period_month);
  if (payload.period_year) payload.period_year = Number(payload.period_year);

  const validationMessage = validateDates(state.modalMode, payload);
  if (validationMessage) {
    showToast(validationMessage, "error");
    return;
  }

  setLoading(true);
  try {
    const query = db.from(state.modalMode);
    const { error } = state.editingId
      ? await query.update(payload).eq("id", state.editingId)
      : await query.insert(payload);

    if (error) throw error;
    showToast("Record saved successfully.", "success");
    closeModal();
    await loadAllData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function deleteRecord(table, id) {
  const confirmed = window.confirm("Delete this record? This action cannot be undone.");
  if (!confirmed) return;

  setLoading(true);
  try {
    const { error } = await db.from(table).delete().eq("id", id);
    if (error) throw error;
    showToast("Record deleted.", "success");
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
        Choose a plan first, then select the specific plan item that needs action taken.
      </div>
    `;
  }

  return `
    <div class="form-note warning">
      <strong>No plan items available.</strong>
      Action Taken records attach to plan items, not directly to plans. Open a plan and add at least one plan item first.
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

function planItemSelectField(selectedItemId = "") {
  const disabled = state.planItems.length ? "" : "disabled";
  return `
    <label>
      Plan Item
      <select name="plan_item_id" id="actionPlanItemSelect" required ${disabled}>
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
  return `
    <label>
      Monitoring Record Template
      <select id="templatePicker" onchange="applyMonitoringTemplate(this.value)">
        <option value="">Start blank or choose a module</option>
        ${monitoringTemplates.map((template) => `
          <option value="${escapeAttribute(template.id)}">${escapeHtml(template.category)}</option>
        `).join("")}
      </select>
    </label>
  `;
}

function applyMonitoringTemplate(templateId) {
  const template = monitoringTemplates.find((item) => item.id === templateId);
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

function planItemOptions() {
  return state.planItems.map((item) => {
    const plan = state.plans.find((record) => record.id === item.plan_id);
    return {
      value: item.id,
      label: `${plan?.plan_title || "Plan"} - ${item.category || item.objective || "Item"}`
    };
  });
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
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatDateTime(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
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
window.openActionModal = openActionModal;
window.deleteRecord = deleteRecord;
window.selectPlan = selectPlan;
window.closeModal = closeModal;
window.applyMonitoringTemplate = applyMonitoringTemplate;
window.quickAddPersonnel = quickAddPersonnel;
window.filterActionPlanItems = filterActionPlanItems;
window.quickGoToPlans = quickGoToPlans;
window.exportPersonnelCsv = exportPersonnelCsv;
window.exportPlansCsv = exportPlansCsv;
window.exportActionsCsv = exportActionsCsv;
window.printPersonnelReport = printPersonnelReport;
window.printPlansReport = printPlansReport;
window.printActionsReport = printActionsReport;
