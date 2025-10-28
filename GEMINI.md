# GEMINI_FIXFLOW.md — MVP Functional Repair Sprint
### Objective
Enable working mock functionality for existing UI components in the Sweet Solutions frontend, using local mock data only.  
The system includes **Admin** and **User** login paths.  
Gemini must ask questions first before making any assumptions or edits.

---

## 🧭 Prompt 1 — Context Audit & Clarification
> Step 1: Review the existing codebase.  
> Identify what components already exist (e.g., login, dashboard, add/remove shift buttons, schedule view).  
> Detect what functionality is broken or missing.
>
> Step 2: Ask the user clarifying questions **before** doing any edits.  
> Specifically confirm:
> - What pages or components exist already (login, dashboard, schedule, etc.)?  
> - Which actions currently do nothing (e.g., add shift button, login form, logout link)?  
> - Where the admin vs. user dashboards should differ (if applicable)?  
> - Whether mock data should persist on refresh or reset each session?
>
> Do not modify or create files until these questions are answered by the user.

---

## ⚙️ Prompt 2 — Functionality Hookup
> After the user answers, connect the existing non-functional elements to mock logic.
> Requirements:
> - **Admin Login:** Logs into a version of the dashboard that can see all employees and manage shifts.  
> - **User Login:** Logs into a limited dashboard showing only their own shifts.  
> - **Add / Remove Shift:** Use in-memory data (arrays, objects) to add or remove shifts that reflect immediately in the UI.  
> - **Schedule View:** Populate with mock data for shifts, employees, and roles. Include Week/Day toggle if possible.  
> - Do not rebuild any existing component unless the user explicitly approves.

---

## 🔐 Prompt 3 — Add Logout Flow
> Add a Logout button (or equivalent) if missing.  
> Clicking it should clear mock login state and return to the login screen.  
> Ensure styling and placement fit the current layout.  
> If both Admin and User share the same login screen, handle routing logic to send them back appropriately.

---

## 🧩 Prompt 4 — QA & Verification Pass
> Verify the following flows function smoothly:
> 1. **Admin Login → Dashboard → Add/Remove Shifts → Logout**  
> 2. **User Login → Dashboard → View Schedule → Logout**  
> 3. Mock data changes appear immediately (no refresh needed).  
> 4. No visual or layout regressions occurred.
>
> If any issues remain, ask the user **before** attempting a fix.

---

### ⚠️ Rules
- Always **ask first** before changing or adding files.  
- Never rebuild UI components — connect or repair only.  
- All logic must be client-side mock state (no backend or APIs).  
- Keep all styling and layout consistent with the existing Refined Whimsy theme.

---

### ✅ Deliverable
A demo-ready MVP where both Admin and User can:
- Log in/out  
- View or manage shifts  - (addmin onnly, user should be able to request off though)
- See a basic mock schedule
- ask user for any other deliverables  or clarification if confused
All powered by mock logic and visually consistent with the existing Sweet Solutions design.

