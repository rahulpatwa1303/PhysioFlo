# PhysioFlow Testing Suite

This directory contains comprehensive testing for the PhysioFlow application, including UI testing, API testing, and security validation.

## 🧪 Test Types

### 1. End-to-End (E2E) UI Tests
- **Single User Flow Tests**: Complete workflow testing for a single doctor
- **Multi-User Isolation Tests**: Ensures data isolation between different users
- **Mobile Responsiveness Tests**: Tests on mobile devices and viewports
- **Accessibility Tests**: WCAG compliance and keyboard navigation
- **Performance Tests**: Page load times and navigation speed

### 2. API & Security Tests
- **Data Isolation**: Verifies users cannot access each other's data
- **SQL Injection Protection**: Tests against malicious SQL inputs
- **Authentication Security**: Session management and logout security
- **Rate Limiting**: Protection against abuse
- **Security Headers**: Proper HTTP security headers
- **CORS Configuration**: Cross-origin request policies

### 3. Performance Tests
- **Page Load Performance**: Measures loading times for all pages
- **Navigation Performance**: Tests transition speeds between pages
- **Database Query Performance**: Monitors query execution times
- **Mobile Performance**: Performance on mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PhysioFlow application running on port 3003
- Test users created in your Supabase database

### Setup
```bash
# Make the test script executable
chmod +x run-tests.sh

# Install dependencies and browsers
./run-tests.sh --setup
```

### Run All Tests
```bash
./run-tests.sh
```

### Run Specific Test Suites
```bash
# Single user flow only
./run-tests.sh --single-user

# Multi-user isolation only
./run-tests.sh --multi-user

# Mobile tests only
./run-tests.sh --mobile

# Performance tests only
./run-tests.sh --performance

# Security tests only
./run-tests.sh --security
```

### Run API/Security Tests
```bash
# All API tests
node api-tests.js

# Performance tests only
node api-tests.js --perf

# Security tests only
node api-tests.js --security

# Data isolation tests only
node api-tests.js --isolation
```

## 📋 Test Scenarios

### Single User Complete Flow
1. **Login Process**: Authentication and session creation
2. **Dashboard Navigation**: KPI display and navigation menu
3. **Patient Management**: Create, edit, search patients
4. **Visit Management**: Schedule, edit, filter visits
5. **Payment Tracking**: View payment status and amounts
6. **Profile Management**: Update doctor profile information
7. **Mobile Responsiveness**: All features work on mobile
8. **Search & Filters**: Test all search and filter functionality

### Multi-User Data Isolation
1. **Concurrent Login**: Two users login simultaneously
2. **Data Creation**: Each user creates patients and visits
3. **Data Isolation Verification**: 
   - User A cannot see User B's patients
   - User A cannot see User B's visits
   - User A cannot see User B's payments
   - Dashboard shows only own data
4. **Session Security**: Logout properly clears session
5. **Database Transaction Isolation**: Concurrent operations don't interfere

### Security Testing
1. **SQL Injection**: Test malicious inputs in search fields
2. **Authentication Bypass**: Verify protected routes are secured
3. **Session Management**: Proper session timeout and cleanup
4. **Data Access Control**: User cannot access other user's API endpoints
5. **File Upload Security**: Malicious file type detection
6. **Rate Limiting**: Protection against rapid requests
7. **Security Headers**: Proper HTTP security headers

## 🔧 Configuration

### Test Configuration
Edit `playwright.config.ts` to modify:
- Browser types to test
- Viewport sizes
- Test timeout settings
- Retry attempts
- Reporter configuration

### Test Data
Edit test files to modify:
- Test user credentials
- Sample patient data
- Visit information
- Performance thresholds

### Environment Variables
Set these for different environments:
```bash
BASE_URL=http://localhost:3003  # Application URL
TEST_USER_1=doctor1@test.com    # First test user
TEST_USER_2=doctor2@test.com    # Second test user
```

## 📊 Test Reports

### View HTML Report
After running tests:
```bash
npx playwright show-report
```

### Continuous Integration
For CI/CD pipelines:
```bash
# Headless mode with specific reporter
npx playwright test --reporter=junit

# Generate coverage reports
npx playwright test --reporter=html --reporter=json
```

## 🐛 Debugging Tests

### Debug Mode
```bash
# Run tests in headed mode (visible browser)
./run-tests.sh --headed

# Debug specific test
npx playwright test --debug single-user-flow.spec.ts
```

### Screenshots and Videos
Tests automatically capture:
- Screenshots on failure
- Videos for failed tests
- Traces for debugging

### Common Issues

1. **Application Not Running**
   - Ensure PhysioFlow is running on port 3003
   - Check `npm run dev` is working

2. **Authentication Failures**
   - Verify test users exist in Supabase
   - Check user credentials in test files

3. **Timeout Issues**
   - Increase timeout in playwright.config.ts
   - Check for slow database queries

4. **Mobile Test Failures**
   - Verify mobile-responsive CSS is working
   - Check touch targets are properly sized

## 📈 Performance Benchmarks

### Expected Performance Metrics
- **Page Load Time**: < 2 seconds
- **Navigation Time**: < 1 second
- **Search Response**: < 500ms
- **Mobile Performance**: Same as desktop

### Performance Alerts
Tests will fail if:
- Any page loads slower than 5 seconds
- Navigation takes longer than 2 seconds
- API responses exceed 3 seconds

## 🔐 Security Checklist

### Authentication Security
- [ ] Users cannot access other users' data
- [ ] Logout properly clears sessions
- [ ] Protected routes require authentication
- [ ] Session timeout works correctly

### Data Security
- [ ] SQL injection protection active
- [ ] Input validation on all forms
- [ ] Proper data sanitization
- [ ] Secure database queries

### Application Security
- [ ] Security headers present
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] File upload restrictions

## 📞 Support

For test-related issues:
1. Check the test logs for detailed error messages
2. Review the HTML report for visual test results
3. Verify application is running correctly
4. Ensure test data is properly configured

## 🔄 Maintenance

### Regular Tasks
- Update test data when application changes
- Review and update performance thresholds
- Add tests for new features
- Update browser versions in Playwright

### Test Data Cleanup
Some tests create data that should be cleaned up:
```bash
# Clean test database (implement based on your setup)
npm run clean-test-data
```
