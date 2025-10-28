# GEMINI_FUNCTIONAL.md — MVP Interaction Sprint
### Objective
Make the Sweet Solutions frontend behave like a fully working MVP for demo purposes.
Focus on core flows, using mock or temporary data. No backend integration.

---

## 🧭 Prompt 1 — Authentication Mock
> Create a lightweight login system:
> - Use local state to simulate login/logout.  
> - When a user logs in, redirect them to the dashboard view.  
> - No real auth, just form input + mock validation.  
> - Store mock user info locally during the session.

---

## 🎯 Prompt 2 — Shift Management
> Implement "Add Shift" and "Remove Shift" buttons that manipulate mock data.  
> - Add Shift: opens a simple modal/form; upon submit, the new shift appears in “Current Shifts.”  
> - Remove Shift: deletes from the list.  
> - Keep everything client-side and reactive.

---

## 🗓️ Prompt 3 — Schedule View (Mock Data)
> Create a “Schedule” page that shows a basic weekly calendar or table.  
> - Populate it with mock employee shifts.  
> - Allow simple toggling between “Week” and “Day” view.  
> - Use temporary JSON data (in memory).

---

## 🪞 Prompt 4 — State Persistence (Optional)
> Add lightweight session persistence using localStorage or similar.  
> So that refresh retains mock login and schedule data.

---

### 🧁 Deliverable
A demo-ready frontend where navigation and buttons respond correctly,
data appears to change, and the user flow feels real — even though it’s mock.
No real backend or security needed.

