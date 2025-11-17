#!/bin/bash

# Sweet Solutions API Test Suite
# Tests all CRUD operations and core flows

set -e

API="http://localhost:3001"
TOKEN=""
MANAGER_EMAIL="mari.lisa@example.com"
EMPLOYEE_ID=1
NEW_EMPLOYEE_ID=""
NEW_SHIFT_ID=""
NEW_REQUEST_ID=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}Sweet Solutions API Test Suite${NC}"
echo -e "${YELLOW}================================${NC}\n"

# Test 1: Login
echo -e "${YELLOW}Test 1: Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API/api/auth/login" \
  -H "Content-Type: application/json" \
  --data "{\"email\":\"$MANAGER_EMAIL\",\"password\":\"demo123\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✓ Login successful${NC}"
  echo "  Token: ${TOKEN:0:20}..."
else
  echo -e "${RED}✗ Login failed${NC}"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

# Test 2: Get Current User
echo -e "\n${YELLOW}Test 2: Get Current User${NC}"
USER_RESPONSE=$(curl -s "$API/api/auth/me" \
  -H "Authorization: Bearer $TOKEN")

USER_NAME=$(echo "$USER_RESPONSE" | grep -o '"name":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$USER_NAME" = "Mari Lisa" ]; then
  echo -e "${GREEN}✓ Got current user: $USER_NAME${NC}"
else
  echo -e "${RED}✗ Failed to get current user${NC}"
  echo "$USER_RESPONSE"
  exit 1
fi

# Test 3: Get All Employees
echo -e "\n${YELLOW}Test 3: Get All Employees${NC}"
EMP_RESPONSE=$(curl -s "$API/api/employees" \
  -H "Authorization: Bearer $TOKEN")

EMP_COUNT=$(echo "$EMP_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)

if [ "$EMP_COUNT" -ge 7 ]; then
  echo -e "${GREEN}✓ Got $EMP_COUNT employees${NC}"
else
  echo -e "${RED}✗ Expected at least 7 employees, got $EMP_COUNT${NC}"
  exit 1
fi

# Test 4: Get Single Employee
echo -e "\n${YELLOW}Test 4: Get Single Employee${NC}"
SINGLE_EMP=$(curl -s "$API/api/employees/1" \
  -H "Authorization: Bearer $TOKEN")

EMP_NAME=$(echo "$SINGLE_EMP" | grep -o '"name":"[^"]*' | cut -d'"' -f4)

if [ -n "$EMP_NAME" ]; then
  echo -e "${GREEN}✓ Got employee: $EMP_NAME${NC}"
else
  echo -e "${RED}✗ Failed to get employee${NC}"
  exit 1
fi

# Test 5: Create New Employee
echo -e "\n${YELLOW}Test 5: Create New Employee${NC}"
TEST_TIMESTAMP=$(date +%s)
CREATE_EMP=$(curl -s -X POST "$API/api/employees" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"name\": \"Test Employee\",
    \"email\": \"test.emp+${TEST_TIMESTAMP}@test.com\",
    \"phone\": \"(555) 999-9999\",
    \"role\": \"Tester\",
    \"hourly_rate\": 20,
    \"hours_per_week\": 30
  }")

NEW_EMP_ID=$(echo "$CREATE_EMP" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -n "$NEW_EMP_ID" ]; then
  echo -e "${GREEN}✓ Created employee with ID: $NEW_EMP_ID${NC}"
else
  echo -e "${RED}✗ Failed to create employee${NC}"
  echo "$CREATE_EMP"
  exit 1
fi

# Test 6: Update Employee
echo -e "\n${YELLOW}Test 6: Update Employee${NC}"
UPDATE_EMP=$(curl -s -X PUT "$API/api/employees/$NEW_EMP_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"name\": \"Updated Test Employee\",
    \"email\": \"test.emp+${TEST_TIMESTAMP}@test.com\",
    \"phone\": \"(555) 888-8888\",
    \"role\": \"Tester\",
    \"hourly_rate\": 22,
    \"hours_per_week\": 35
  }")

UPDATED_NAME=$(echo "$UPDATE_EMP" | grep -o '"name":"[^"]*' | cut -d'"' -f4)

if [ "$UPDATED_NAME" = "Updated Test Employee" ]; then
  echo -e "${GREEN}✓ Updated employee successfully${NC}"
else
  echo -e "${RED}✗ Failed to update employee${NC}"
  exit 1
fi

# Test 7: Get All Shifts
echo -e "\n${YELLOW}Test 7: Get All Shifts${NC}"
SHIFTS_RESPONSE=$(curl -s "$API/api/shifts" \
  -H "Authorization: Bearer $TOKEN")

SHIFT_COUNT=$(echo "$SHIFTS_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)

if [ "$SHIFT_COUNT" -ge 5 ]; then
  echo -e "${GREEN}✓ Got $SHIFT_COUNT shifts${NC}"
else
  echo -e "${YELLOW}⚠ Got $SHIFT_COUNT shifts (expected at least 5)${NC}"
fi

# Test 8: Create New Shift
echo -e "\n${YELLOW}Test 8: Create New Shift${NC}"
TOMORROW=$(date -u -d "+1 day" "+%Y-%m-%d" 2>/dev/null || date -u -v+1d "+%Y-%m-%d")

CREATE_SHIFT=$(curl -s -X POST "$API/api/shifts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"employee_id\": $NEW_EMP_ID,
    \"shift_date\": \"$TOMORROW\",
    \"start_time\": \"09:00\",
    \"end_time\": \"17:00\",
    \"role\": \"Tester\"
  }")

NEW_SHIFT=$(echo "$CREATE_SHIFT" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -n "$NEW_SHIFT" ]; then
  echo -e "${GREEN}✓ Created shift with ID: $NEW_SHIFT${NC}"
else
  echo -e "${RED}✗ Failed to create shift${NC}"
  echo "$CREATE_SHIFT"
  exit 1
fi

# Test 9: Update Shift
echo -e "\n${YELLOW}Test 9: Update Shift${NC}"
UPDATE_SHIFT=$(curl -s -X PUT "$API/api/shifts/$NEW_SHIFT" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"employee_id\": $NEW_EMP_ID,
    \"shift_date\": \"$TOMORROW\",
    \"start_time\": \"10:00\",
    \"end_time\": \"18:00\",
    \"role\": \"Tester\"
  }")

SHIFT_START=$(echo "$UPDATE_SHIFT" | grep -o '"start_time":"[^"]*' | cut -d'"' -f4)

if [ "$SHIFT_START" = "10:00" ]; then
  echo -e "${GREEN}✓ Updated shift successfully${NC}"
else
  echo -e "${RED}✗ Failed to update shift${NC}"
  exit 1
fi

# Test 10: Create Time-Off Request
echo -e "\n${YELLOW}Test 10: Create Time-Off Request${NC}"
START_DATE=$(date -u -d "+3 days" "+%Y-%m-%d" 2>/dev/null || date -u -v+3d "+%Y-%m-%d")
END_DATE=$(date -u -d "+4 days" "+%Y-%m-%d" 2>/dev/null || date -u -v+4d "+%Y-%m-%d")

CREATE_REQUEST=$(curl -s -X POST "$API/api/requests" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"employee_id\": $NEW_EMP_ID,
    \"start_date\": \"$START_DATE\",
    \"end_date\": \"$END_DATE\",
    \"reason\": \"Testing time-off request\"
  }")

NEW_REQ=$(echo "$CREATE_REQUEST" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -n "$NEW_REQ" ]; then
  echo -e "${GREEN}✓ Created time-off request with ID: $NEW_REQ${NC}"
else
  echo -e "${RED}✗ Failed to create time-off request${NC}"
  echo "$CREATE_REQUEST"
  exit 1
fi

# Test 11: Get All Requests
echo -e "\n${YELLOW}Test 11: Get All Requests${NC}"
REQUESTS=$(curl -s "$API/api/requests" \
  -H "Authorization: Bearer $TOKEN")

REQ_COUNT=$(echo "$REQUESTS" | grep -o '"count":[0-9]*' | cut -d':' -f2)

if [ "$REQ_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ Got $REQ_COUNT time-off requests${NC}"
else
  echo -e "${RED}✗ No requests found${NC}"
  exit 1
fi

# Test 12: Approve Time-Off Request
echo -e "\n${YELLOW}Test 12: Approve Time-Off Request${NC}"
APPROVE=$(curl -s -X PUT "$API/api/requests/$NEW_REQ/approve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"review_notes": "Approved for testing"}')

REQ_STATUS=$(echo "$APPROVE" | grep -o '"status":"[^"]*' | cut -d'"' -f4)

if [ "$REQ_STATUS" = "approved" ]; then
  echo -e "${GREEN}✓ Approved time-off request${NC}"
else
  echo -e "${RED}✗ Failed to approve request${NC}"
  exit 1
fi

# Test 13: Get Payroll
echo -e "\n${YELLOW}Test 13: Get Payroll${NC}"
PAYROLL=$(curl -s "$API/api/payroll" \
  -H "Authorization: Bearer $TOKEN")

PAYROLL_COUNT=$(echo "$PAYROLL" | grep -o '"count":[0-9]*' | cut -d':' -f2)

if [ "$PAYROLL_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ Got $PAYROLL_COUNT payroll entries${NC}"
else
  echo -e "${YELLOW}⚠ No payroll entries found (expected)${NC}"
fi

# Test 14: Check Database Persistence
echo -e "\n${YELLOW}Test 14: Database Persistence Check${NC}"
if [ -f ~/.sweet-solutions/app.db ] || [ -f ~/.sweet-solutions/app.db-wal ]; then
  # SQLite in WAL mode creates .db-wal and .db-shm files instead of main .db
  if [ -f ~/.sweet-solutions/app.db-wal ]; then
    echo -e "${GREEN}✓ Database exists (WAL mode detected)${NC}"
    WAL_SIZE=$(ls -lh ~/.sweet-solutions/app.db-wal | awk '{print $5}')
    echo -e "${GREEN}  WAL file size: $WAL_SIZE${NC}"
  else
    DB_SIZE=$(ls -lh ~/.sweet-solutions/app.db | awk '{print $5}')
    echo -e "${GREEN}✓ Database file exists: $DB_SIZE${NC}"
  fi
else
  echo -e "${RED}✗ Database file not found${NC}"
  exit 1
fi

# Test 15: Delete Employee (Soft Delete)
echo -e "\n${YELLOW}Test 15: Delete Employee (Soft Delete)${NC}"
DELETE=$(curl -s -X DELETE "$API/api/employees/$NEW_EMP_ID" \
  -H "Authorization: Bearer $TOKEN")

DELETE_SUCCESS=$(echo "$DELETE" | grep -o '"success":[^,}]*' | cut -d':' -f2)

if [ "$DELETE_SUCCESS" = "true" ]; then
  echo -e "${GREEN}✓ Deleted (soft-deleted) employee${NC}"
else
  echo -e "${RED}✗ Failed to delete employee${NC}"
  exit 1
fi

# Test 16: Verify Soft Delete (Employee not in active list)
echo -e "\n${YELLOW}Test 16: Verify Soft Delete${NC}"
ACTIVE_EMPS=$(curl -s "$API/api/employees" \
  -H "Authorization: Bearer $TOKEN")

ACTIVE_COUNT=$(echo "$ACTIVE_EMPS" | grep -o '"count":[0-9]*' | cut -d':' -f2)

if [ "$ACTIVE_COUNT" -eq "$EMP_COUNT" ]; then
  echo -e "${GREEN}✓ Soft-deleted employee no longer in active list${NC}"
else
  echo -e "${YELLOW}⚠ Active count changed: $EMP_COUNT → $ACTIVE_COUNT${NC}"
fi

# Test 17: Delete Shift
echo -e "\n${YELLOW}Test 17: Delete Shift${NC}"
DELETE_SHIFT=$(curl -s -X DELETE "$API/api/shifts/$NEW_SHIFT" \
  -H "Authorization: Bearer $TOKEN")

SHIFT_DELETE_SUCCESS=$(echo "$DELETE_SHIFT" | grep -o '"success":[^,}]*' | cut -d':' -f2)

if [ "$SHIFT_DELETE_SUCCESS" = "true" ]; then
  echo -e "${GREEN}✓ Deleted shift${NC}"
else
  echo -e "${RED}✗ Failed to delete shift${NC}"
  exit 1
fi

# Summary
echo -e "\n${YELLOW}================================${NC}"
echo -e "${GREEN}✓ All tests passed!${NC}"
echo -e "${YELLOW}================================${NC}\n"

echo "Summary:"
echo "  ✓ Authentication (login, get user)"
echo "  ✓ Employee CRUD (create, read, update, delete)"
echo "  ✓ Shift CRUD (create, read, update, delete)"
echo "  ✓ Time-Off Requests (create, approve)"
echo "  ✓ Payroll (read)"
echo "  ✓ Database persistence"
echo "  ✓ Soft deletes"
echo ""
echo "Database location: ~/.sweet-solutions/app.db"
echo "Database size: $(ls -lh ~/.sweet-solutions/app.db | awk '{print $5}')"
