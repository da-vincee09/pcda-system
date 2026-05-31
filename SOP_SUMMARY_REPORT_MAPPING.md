# SOP Summary Report Source Mapping

This document maps each SOP Summary Report field to its Supabase source. The report is generated live from source tables before printing; `sop_summary_reports` stores metadata and totals only.

| Report Field | Source Table | Source Column | Join Path | Fallback |
| --- | --- | --- | --- | --- |
| Company Name | `company_settings` | `company_name` | Current company settings row | `PDCA System` |
| System Name | `company_settings` | `system_name` | Current company settings row | Hidden when empty |
| Address | `company_settings` | `address` | Current company settings row | Hidden when empty |
| Contact / Email | `company_settings` | `contact_number`, `email` | Current company settings row | Hidden when empty |
| Logo | `company_settings` | `logo_url` | Current company settings row | Company name text |
| SOP Code / Title | `standard_operating_procedures` | `sop_code`, `title` | Selected `sop_id` | `No code` / `Untitled SOP` |
| SOP Version | `standard_operating_procedures` | `version` | Selected `sop_id` | `1.0` |
| Effective Date | `standard_operating_procedures` | `effective_date` | Selected `sop_id` | `Not set` |
| Review Date | `standard_operating_procedures` | `review_date` | Selected `sop_id` | Hidden when empty |
| SOP Owner | `people_profiles` | `complete_name` | `standard_operating_procedures.owner_person_id -> people_profiles.id` | `Not assigned` |
| Prepared By | `people_profiles` | `complete_name` | `sop_summary_reports.prepared_by -> people_profiles.id` or current generator form value | `Not assigned` |
| Reviewed By | `people_profiles` | `complete_name` | `sop_summary_reports.reviewed_by -> people_profiles.id` or current generator form value | `Not assigned` |
| Approved By | `people_profiles` | `complete_name` | `sop_summary_reports.approved_by` or `standard_operating_procedures.approved_by -> people_profiles.id` | `Not assigned` |
| Approval Status | `approval_requests`, `sop_summary_reports` | `approval_status`, `report_status` | `approval_requests.related_record_id -> sop_summary_reports.id` or SOP id | Current report status |
| Approval Date | `approval_requests`, `standard_operating_procedures` | `decided_at`, `approved_at` | Approval request or SOP approval | `Not yet approved` |
| Plan Title | `plans` | `plan_title` | `generated_tasks.plan_id -> plans.id`; fallback `standard_operating_procedures.plan_id` | `Plan: Not linked` |
| Plan Period | `plans` | `period_month`, `period_year` | Same as Plan Title | Hidden when not linked |
| Plan Item | `plan_items` | `category`, `objective` | `generated_tasks.plan_item_id -> plan_items.id`; fallback `standard_operating_procedures.plan_item_id` | `Plan Item: Not linked` |
| Target Standard | `plan_items` | `target_standard` | Same as Plan Item | Hidden when empty |
| Expected Output | `plan_items` | `expected_output` | Same as Plan Item | Hidden when empty |
| Workspace | `product_lines` | `product_name` | `generated_tasks.workspace_id` or `product_line_id -> product_lines.id` | `Workspace: Not linked` |
| Task Title | `generated_tasks` | `task_title` | Linked task from SOP/template/workspace/plan relationship | `Task: No title available` |
| Task Schedule | `generated_tasks` | `task_date`, `due_time` | Same task row | Hidden when empty |
| Assigned Personnel | `people_profiles` | `complete_name` | `generated_tasks.assigned_person_id -> people_profiles.id` | Hidden when empty |
| Task Status | `generated_tasks` | `task_status` | Same task row | Formatted current task status |
| Activity Done | `task_do_records` | `work_done` | `task_do_records.task_id -> generated_tasks.id` | `No DO record submitted` |
| DO Performed By | `people_profiles` | `complete_name` | `task_do_records.performed_by -> people_profiles.id` | Hidden when empty |
| DO Performed At | `task_do_records` | `performed_at` | Same DO row | Hidden when empty |
| DO Output / Remarks / Evidence | `task_do_records` | `output_result`, `remarks`, `evidence_url`, `evidence_note` | Same DO row | Hidden when empty |
| Result | `task_check_records` | `check_result` | `task_check_records.do_record_id -> task_do_records.id` or `task_id -> generated_tasks.id` | `Not yet checked` |
| Findings | `task_check_records` | `observation`, `remarks` | Same CHECK row | `No findings recorded` |
| Manager Instruction | `action_cases` | `non_compliance_note`, `manager_instruction`, `case_status`, `due_at`, `resolved_at` | `action_cases.check_record_id -> task_check_records.id` or `task_id -> generated_tasks.id` | `No manager instruction recorded` |
| Corrective Action | `action_cases` | `corrective_action` | Same Action Case row | `No corrective action recorded` |
| Preventive Action | `action_cases` | `preventive_action` | Same Action Case row | `No preventive action recorded` |
| Verified By | `people_profiles` | `complete_name` | `task_check_records.checked_by -> people_profiles.id` | `Not yet verified` |
| Checked At / Evidence / Correction Due | `task_check_records` | `checked_at`, `evidence_url`, `correction_due_at` | Same CHECK row | Hidden when empty |
| Total Monitoring Activities | `generated_tasks` | `id` count | Tasks linked to the selected SOP and period | `0` |
| Completed Activities | `task_do_records`, `generated_tasks` | `task_id`, `task_status` | Linked task IDs with DO record or completed/checked status | `0` |
| Checked Activities | `task_check_records` | `id` count | Linked CHECK rows in period | `0` |
| Passed / Failed Checks | `task_check_records` | `check_result` | Linked CHECK rows in period | `0` |
| Open / Closed Corrective Actions | `action_cases` | `case_status` | Linked ACTION rows | `0` |
| Compliance Percentage | Computed | Derived value | `(total - noncompliant) / total` | `0%` |
