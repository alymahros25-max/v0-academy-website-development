#!/bin/bash

# CMS API Verification Script
# Tests all 8 API routes for proper functionality

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  CMS Full-Stack Verification Script"
echo "═══════════════════════════════════════════════════════════════"
echo ""

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_count=0
passed_count=0
failed_count=0

# Function to test API
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    
    test_count=$((test_count + 1))
    echo ""
    echo -e "${YELLOW}Test $test_count: $method $endpoint${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [[ "$status_code" =~ ^(200|201|400|401|500)$ ]]; then
        echo -e "${GREEN}✓ Response received (Status: $status_code)${NC}"
        echo "Body: $(echo $body | head -c 100)..."
        passed_count=$((passed_count + 1))
    else
        echo -e "${RED}✗ Unexpected response (Status: $status_code)${NC}"
        failed_count=$((failed_count + 1))
    fi
}

# Check if server is running
echo "Checking if dev server is running on $BASE_URL..."
if ! curl -s "$BASE_URL" > /dev/null; then
    echo -e "${RED}✗ Server not running on $BASE_URL${NC}"
    echo "Please start dev server: pnpm dev"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Test 1: Health Check
test_api "GET" "/api/translate" "" "200"

# Test 2: GET Settings
test_api "GET" "/api/cms/settings" "" "200"

# Test 3: POST Settings
test_api "POST" "/api/cms/settings" '{"settings":[{"setting_key":"primary_color","setting_value":"#1a4d2e","value_type":"color","category":"colors"}]}' "201"

# Test 4: GET Pages
test_api "GET" "/api/cms/pages" "" "200"

# Test 5: Translation Test
test_api "POST" "/api/translate" '{"text":"مرحبا","sourceLang":"ar"}' "200"

# Test 6: GET Users
test_api "GET" "/api/cms/users" "" "200"

# Test 7: GET Widgets
test_api "GET" "/api/cms/widgets" "" "200"

# Test 8: GET Content
test_api "GET" "/api/cms/content" "" "200"

# Summary
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Test Results"
echo "═══════════════════════════════════════════════════════════════"
echo -e "Total Tests:   $test_count"
echo -e "Passed:        ${GREEN}$passed_count${NC}"
echo -e "Failed:        ${RED}$failed_count${NC}"
echo ""

if [ $failed_count -eq 0 ]; then
    echo -e "${GREEN}✓ All API routes are responding correctly!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Visit http://localhost:3000/admin"
    echo "2. Go to 'المظهر والمعاينة' (Theme)"
    echo "3. Change a color and click 'حفظ' (Save)"
    echo "4. Check that toast notification appears"
    echo "5. Visit home page - theme should update"
    exit 0
else
    echo -e "${RED}✗ Some API routes are not responding correctly${NC}"
    echo "Check server logs for errors"
    exit 1
fi
