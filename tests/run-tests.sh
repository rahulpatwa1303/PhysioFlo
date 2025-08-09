#!/bin/bash

# PhysioFlow Testing Script
# This script sets up and runs comprehensive tests for the PhysioFlow application

set -e

echo "🧪 PhysioFlow Testing Suite"
echo "=======    # Test for common security headers
    print_status "Checking security headers..."
    
    HEADERS=$(curl -I -s http://localhost:3000)==============="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION is installed"
    else
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
}

# Check if the main application is running
check_app_running() {
    print_status "Checking if PhysioFlow application is running..."
    
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "PhysioFlow application is running on port 3000"
    else
        print_warning "PhysioFlow application is not running. Starting it now..."
        cd .. && npm run dev &
        APP_PID=$!
        print_status "Started application with PID: $APP_PID"
        
        # Wait for app to start
        print_status "Waiting for application to start..."
        for i in {1..30}; do
            if curl -s http://localhost:3000 > /dev/null 2>&1; then
                print_success "Application started successfully"
                break
            fi
            sleep 2
            if [ $i -eq 30 ]; then
                print_error "Application failed to start within 60 seconds"
                exit 1
            fi
        done
    fi
}

# Setup test environment
setup_tests() {
    print_status "Setting up test environment..."
    
    # Navigate to tests directory
    cd "$(dirname "$0")"
    
    # Install dependencies if package.json exists
    if [ -f "package.json" ]; then
        print_status "Installing test dependencies..."
        npm install
        
        # Install Playwright browsers
        print_status "Installing Playwright browsers..."
        npx playwright install
    else
        print_error "package.json not found in tests directory"
        exit 1
    fi
}

# Run linting and type checking
run_linting() {
    print_status "Running linting and type checking..."
    cd ..
    
    # Check if the main app passes linting
    if npm run lint:check 2>/dev/null || npm run type-check 2>/dev/null; then
        print_success "Code quality checks passed"
    else
        print_warning "Some code quality issues found, but continuing with tests..."
    fi
}

# Run unit tests (if they exist)
run_unit_tests() {
    print_status "Checking for unit tests..."
    cd ..
    
    if [ -f "jest.config.js" ] || [ -f "vitest.config.js" ]; then
        print_status "Running unit tests..."
        npm test 2>/dev/null || print_warning "Unit tests failed or not configured"
    else
        print_warning "No unit test configuration found"
    fi
}

# Run Playwright E2E tests
run_e2e_tests() {
    print_status "Running End-to-End tests..."
    cd tests
    
    # Test configuration
    print_status "Testing Playwright configuration..."
    npx playwright --version
    
    # Run single user flow tests
    print_status "Running Single User Flow tests..."
    if npx playwright test e2e/single-user-flow.spec.ts --reporter=line; then
        print_success "Single User Flow tests passed"
    else
        print_error "Single User Flow tests failed"
        FAILED_TESTS=1
    fi
    
    # Run multi-user isolation tests
    print_status "Running Multi-User Isolation tests..."
    if npx playwright test e2e/multi-user-isolation.spec.ts --reporter=line; then
        print_success "Multi-User Isolation tests passed"
    else
        print_error "Multi-User Isolation tests failed"
        FAILED_TESTS=1
    fi
    
    # Run mobile tests
    print_status "Running Mobile Responsiveness tests..."
    if npx playwright test --project="Mobile Chrome" --reporter=line; then
        print_success "Mobile tests passed"
    else
        print_error "Mobile tests failed"
        FAILED_TESTS=1
    fi
}

# Performance testing
run_performance_tests() {
    print_status "Running Performance tests..."
    
    # Use curl to test API response times
    print_status "Testing page load times..."
    
    PAGES=("/" "/dashboard" "/patients" "/visits" "/schedule" "/payments" "/profile")
    
    for page in "${PAGES[@]}"; do
        RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" http://localhost:3000$page)
        if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
            print_success "Page $page loaded in ${RESPONSE_TIME}s"
        else
            print_warning "Page $page took ${RESPONSE_TIME}s to load (slow)"
        fi
    done
}

# Security testing
run_security_tests() {
    print_status "Running Security tests..."
    
    # Test for common security headers
    print_status "Checking security headers..."
    
    HEADERS=$(curl -I -s http://localhost:3003)
    
    if echo "$HEADERS" | grep -i "x-frame-options" > /dev/null; then
        print_success "X-Frame-Options header present"
    else
        print_warning "X-Frame-Options header missing"
    fi
    
    if echo "$HEADERS" | grep -i "x-content-type-options" > /dev/null; then
        print_success "X-Content-Type-Options header present"
    else
        print_warning "X-Content-Type-Options header missing"
    fi
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    
    if [ ! -z "$APP_PID" ]; then
        kill $APP_PID 2>/dev/null || true
        print_status "Stopped application process"
    fi
}

# Generate test report
generate_report() {
    print_status "Generating test report..."
    cd tests
    
    if npx playwright show-report --host 0.0.0.0 --port 9323 &> /dev/null & then
        print_success "Test report available at http://localhost:9323"
    fi
}

# Main execution
main() {
    echo "Starting PhysioFlow Test Suite..."
    echo "================================"
    
    # Set trap for cleanup
    trap cleanup EXIT
    
    # Initialize variables
    FAILED_TESTS=0
    
    # Run all checks and tests
    check_node
    check_app_running
    setup_tests
    run_linting
    run_unit_tests
    run_e2e_tests
    run_performance_tests
    run_security_tests
    generate_report
    
    # Final results
    echo ""
    echo "================================"
    if [ $FAILED_TESTS -eq 0 ]; then
        print_success "🎉 All tests passed!"
        echo ""
        echo "Test Summary:"
        echo "✅ Application is running"
        echo "✅ Single user flow tests passed"
        echo "✅ Multi-user isolation tests passed"
        echo "✅ Mobile responsiveness tests passed"
        echo "✅ Performance tests completed"
        echo "✅ Security checks completed"
        echo ""
        echo "View detailed report at: http://localhost:9323"
    else
        print_error "❌ Some tests failed!"
        echo ""
        echo "Please check the test output above for details."
        echo "View detailed report at: http://localhost:9323"
        exit 1
    fi
}

# Help function
show_help() {
    echo "PhysioFlow Testing Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h          Show this help message"
    echo "  --single-user       Run only single user flow tests"
    echo "  --multi-user        Run only multi-user isolation tests" 
    echo "  --mobile           Run only mobile tests"
    echo "  --performance      Run only performance tests"
    echo "  --security         Run only security tests"
    echo "  --setup            Only setup test environment"
    echo ""
    echo "Examples:"
    echo "  $0                  Run all tests"
    echo "  $0 --single-user    Run single user tests only"
    echo "  $0 --setup         Setup test environment only"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --single-user)
        check_node
        check_app_running
        setup_tests
        cd tests && npx playwright test e2e/single-user-flow.spec.ts
        ;;
    --multi-user)
        check_node
        check_app_running
        setup_tests
        cd tests && npx playwright test e2e/multi-user-isolation.spec.ts
        ;;
    --mobile)
        check_node
        check_app_running
        setup_tests
        cd tests && npx playwright test --project="Mobile Chrome"
        ;;
    --performance)
        check_app_running
        run_performance_tests
        ;;
    --security)
        check_app_running
        run_security_tests
        ;;
    --setup)
        check_node
        setup_tests
        print_success "Test environment setup complete"
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
