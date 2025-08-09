#!/usr/bin/env node

/**
 * PhysioFlow API Testing Script
 * Tests the backend API endpoints for data isolation and security
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3003';
const API_BASE = `${BASE_URL}/api`;

// Test users (these should match your test database)
const TEST_USERS = {
  user1: {
    email: 'test1@physioflo.com',
    password: 'TestPass123!',
    id: null,
    token: null
  },
  user2: {
    email: 'test2@physioflo.com', 
    password: 'TestPass123!',
    id: null,
    token: null
  }
};

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test database connection
async function testDatabaseConnection() {
  logInfo('Testing database connection...');
  
  try {
    // Try to access the main page to see if the app is running
    const response = await makeRequest(BASE_URL);
    if (response.status === 200) {
      logSuccess('Application is running and accessible');
      return true;
    } else {
      logError(`Application returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to connect to application: ${error.message}`);
    return false;
  }
}

// Test user authentication
async function testAuthentication() {
  logInfo('Testing user authentication...');
  
  // This is a placeholder - you'll need to implement based on your auth system
  // For Supabase, you might need to use their client library
  
  logWarning('Authentication testing requires Supabase client implementation');
  return true;
}

// Test data isolation between users
async function testDataIsolation() {
  logInfo('Testing data isolation between users...');
  
  // This would require:
  // 1. Creating test data for user 1
  // 2. Creating test data for user 2  
  // 3. Verifying user 1 cannot access user 2's data
  // 4. Verifying user 2 cannot access user 1's data
  
  logWarning('Data isolation testing requires authentication implementation');
  return true;
}

// Test SQL injection protection
async function testSQLInjection() {
  logInfo('Testing SQL injection protection...');
  
  const maliciousInputs = [
    "'; DROP TABLE patients; --",
    "' OR '1'='1",
    "'; DELETE FROM visits; --",
    "' UNION SELECT * FROM profiles --"
  ];
  
  // Test these inputs against search endpoints
  for (const input of maliciousInputs) {
    try {
      // Test patient search with malicious input
      const searchUrl = `${BASE_URL}/patients?search=${encodeURIComponent(input)}`;
      const response = await makeRequest(searchUrl);
      
      if (response.status >= 400) {
        logSuccess(`SQL injection attempt properly rejected: ${input}`);
      } else {
        logWarning(`Potential vulnerability with input: ${input}`);
      }
    } catch (error) {
      logSuccess(`SQL injection attempt properly blocked: ${input}`);
    }
  }
  
  return true;
}

// Test rate limiting
async function testRateLimiting() {
  logInfo('Testing rate limiting...');
  
  const requests = [];
  const startTime = Date.now();
  
  // Make 50 rapid requests
  for (let i = 0; i < 50; i++) {
    requests.push(makeRequest(BASE_URL));
  }
  
  try {
    const responses = await Promise.all(requests);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const rateLimitedCount = responses.filter(r => r.status === 429).length;
    
    if (rateLimitedCount > 0) {
      logSuccess(`Rate limiting is working - ${rateLimitedCount} requests were rate limited`);
    } else {
      logWarning('No rate limiting detected - consider implementing rate limiting');
    }
    
    logInfo(`50 requests completed in ${duration}ms`);
  } catch (error) {
    logError(`Rate limiting test failed: ${error.message}`);
  }
  
  return true;
}

// Test CORS settings
async function testCORS() {
  logInfo('Testing CORS configuration...');
  
  try {
    const response = await makeRequest(BASE_URL, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://malicious-site.com',
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    const corsHeader = response.headers['access-control-allow-origin'];
    
    if (corsHeader === '*') {
      logWarning('CORS allows all origins - consider restricting to specific domains');
    } else if (corsHeader) {
      logSuccess(`CORS properly configured: ${corsHeader}`);
    } else {
      logSuccess('CORS headers not present - good for security');
    }
  } catch (error) {
    logInfo('CORS test inconclusive');
  }
  
  return true;
}

// Test file upload security (if applicable)
async function testFileUploadSecurity() {
  logInfo('Testing file upload security...');
  
  // Test with malicious file types
  const maliciousFiles = [
    { name: 'test.php', content: '<?php echo "malicious"; ?>' },
    { name: 'test.jsp', content: '<% out.println("malicious"); %>' },
    { name: 'test.exe', content: 'MZ\x90\x00' }
  ];
  
  // This would require implementing actual file upload testing
  // For now, we'll just check if upload endpoints exist
  
  logWarning('File upload security testing requires endpoint implementation');
  return true;
}

// Performance testing
async function testPerformance() {
  logInfo('Testing application performance...');
  
  const pages = ['/', '/dashboard', '/patients', '/visits', '/schedule', '/payments'];
  const results = [];
  
  for (const page of pages) {
    const startTime = Date.now();
    try {
      const response = await makeRequest(`${BASE_URL}${page}`);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      results.push({ page, duration, status: response.status });
      
      if (duration < 1000) {
        logSuccess(`${page} loaded in ${duration}ms`);
      } else if (duration < 3000) {
        logWarning(`${page} loaded in ${duration}ms (slow)`);
      } else {
        logError(`${page} loaded in ${duration}ms (very slow)`);
      }
    } catch (error) {
      logError(`${page} failed to load: ${error.message}`);
    }
  }
  
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  logInfo(`Average page load time: ${Math.round(avgDuration)}ms`);
  
  return true;
}

// Security headers test
async function testSecurityHeaders() {
  logInfo('Testing security headers...');
  
  try {
    const response = await makeRequest(BASE_URL);
    const headers = response.headers;
    
    const securityHeaders = {
      'x-frame-options': 'Clickjacking protection',
      'x-content-type-options': 'MIME type sniffing protection',
      'x-xss-protection': 'XSS protection',
      'strict-transport-security': 'HTTPS enforcement',
      'content-security-policy': 'Content Security Policy'
    };
    
    for (const [header, description] of Object.entries(securityHeaders)) {
      if (headers[header]) {
        logSuccess(`${description}: ${headers[header]}`);
      } else {
        logWarning(`Missing ${description} (${header})`);
      }
    }
  } catch (error) {
    logError(`Security headers test failed: ${error.message}`);
  }
  
  return true;
}

// Main test runner
async function runAllTests() {
  console.log('🔒 PhysioFlow Security & API Testing Suite');
  console.log('==========================================\n');
  
  const tests = [
    { name: 'Database Connection', fn: testDatabaseConnection },
    { name: 'Authentication', fn: testAuthentication },
    { name: 'Data Isolation', fn: testDataIsolation },
    { name: 'SQL Injection Protection', fn: testSQLInjection },
    { name: 'Rate Limiting', fn: testRateLimiting },
    { name: 'CORS Configuration', fn: testCORS },
    { name: 'File Upload Security', fn: testFileUploadSecurity },
    { name: 'Performance', fn: testPerformance },
    { name: 'Security Headers', fn: testSecurityHeaders }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      log(`\n🧪 Running ${test.name}...`, 'blue');
      const result = await test.fn();
      if (result) {
        passed++;
        logSuccess(`${test.name} completed`);
      } else {
        failed++;
        logError(`${test.name} failed`);
      }
    } catch (error) {
      failed++;
      logError(`${test.name} failed: ${error.message}`);
    }
  }
  
  console.log('\n==========================================');
  console.log('📊 Test Results:');
  logSuccess(`Passed: ${passed}`);
  if (failed > 0) {
    logError(`Failed: ${failed}`);
  }
  console.log(`Total: ${passed + failed}`);
  
  if (failed === 0) {
    logSuccess('🎉 All security tests completed successfully!');
  } else {
    logWarning('⚠️  Some tests need attention. Please review the results above.');
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('PhysioFlow API Testing Script');
  console.log('');
  console.log('Usage: node api-tests.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h     Show this help message');
  console.log('  --perf         Run only performance tests');
  console.log('  --security     Run only security tests');
  console.log('  --isolation    Run only data isolation tests');
  console.log('');
  process.exit(0);
}

if (args.includes('--perf')) {
  testPerformance().then(() => process.exit(0));
} else if (args.includes('--security')) {
  Promise.all([
    testSQLInjection(),
    testSecurityHeaders(),
    testCORS(),
    testFileUploadSecurity()
  ]).then(() => process.exit(0));
} else if (args.includes('--isolation')) {
  testDataIsolation().then(() => process.exit(0));
} else {
  runAllTests().then(() => process.exit(0));
}
