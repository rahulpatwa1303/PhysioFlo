import { test, expect, Page } from '@playwright/test';

// Test data for consistent testing
const TEST_USERS = {
  doctor1: {
    email: 'doctor1@test.com',
    password: 'TestPass123!',
    name: 'Dr. John Smith',
    specialization: 'Physiotherapist'
  },
  doctor2: {
    email: 'doctor2@test.com', 
    password: 'TestPass123!',
    name: 'Dr. Jane Doe',
    specialization: 'Sports Physiotherapist'
  }
};

const TEST_PATIENT = {
  firstName: 'Test',
  lastName: 'Patient',
  phone: '+91 9876543210',
  address: '123 Test Street, Test City'
};

const TEST_VISIT = {
  fee: '500',
  consultationType: 'In-Person',
  notes: 'Test consultation notes'
};

class PhysioFlowTestHelper {
  constructor(private page: Page) {}

  async login(email: string, otpCode: string = '123456') {
    await this.page.goto('/');
    
    // Wait for login form to appear
    await this.page.waitForSelector('input[placeholder="you@example.com"]');

    // Step 1: Fill email and send OTP
    await this.page.fill('input[placeholder="you@example.com"]', email);
    await this.page.click('button:has-text("Send OTP")');
    
    // Wait for OTP form to appear
    await this.page.waitForSelector('input[placeholder="Enter code"]');
    
    // Step 2: Fill OTP and verify
    await this.page.fill('input[placeholder="Enter code"]', otpCode);
    await this.page.click('button:has-text("Verify & Login")');
    
    // Wait for successful login (redirect to dashboard)
    await this.page.waitForURL('**/dashboard');
    await this.page.waitForSelector('h2'); // Wait for dashboard content
  }

  async logout() {
    // Look for logout button in menu or user profile dropdown
    const logoutButton = this.page.locator('text=Logout').or(
      this.page.locator('[data-testid="logout"]')
    );
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    } else {
      // Clear session by going to login page and clearing storage
      await this.page.goto('/');
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    }
  }

  async navigateToPage(pageName: string) {
    const navigationMap = {
      'dashboard': '/dashboard',
      'patients': '/patients', 
      'visits': '/visits',
      'schedule': '/schedule',
      'payments': '/payments',
      'profile': '/profile'
    };

    const url = navigationMap[pageName as keyof typeof navigationMap];
    if (!url) throw new Error(`Unknown page: ${pageName}`);

    await this.page.click(`a[href="${url}"]`);
    await this.page.waitForURL(`**${url}`, { timeout: 5000 });
  }

  async createPatient(patient = TEST_PATIENT) {
    await this.navigateToPage('patients');
    await this.page.click('text=Add Patient');
    
    // Fill patient form
    await this.page.fill('input[placeholder*="First"]', patient.firstName);
    await this.page.fill('input[placeholder*="Last"]', patient.lastName);
    await this.page.fill('input[placeholder*="Phone"]', patient.phone);
    await this.page.fill('input[placeholder*="Address"]', patient.address);
    
    await this.page.click('button:has-text("Save")');
    
    // Wait for success message and return to patients list
    await expect(this.page.locator('.ant-message')).toContainText('successfully');
    await this.page.waitForURL('**/patients');
    
    return `${patient.firstName} ${patient.lastName}`;
  }

  async createVisit(patientName: string, visit = TEST_VISIT) {
    await this.navigateToPage('visits');
    await this.page.click('text=Add Visit');
    
    // Select patient
    await this.page.click('.ant-select-selector');
    await this.page.click(`text=${patientName}`);
    
    // Fill visit details
    await this.page.fill('input[placeholder*="Fee"]', visit.fee);
    
    // Select date (today)
    await this.page.click('.ant-picker');
    await this.page.click('.ant-picker-today-btn');
    
    // Fill consultation type if dropdown exists
    const consultationSelect = this.page.locator('text=Consultation Type').locator('.ant-select');
    if (await consultationSelect.isVisible()) {
      await consultationSelect.click();
      await this.page.click(`text=${visit.consultationType}`);
    }
    
    // Fill notes if field exists
    const notesField = this.page.locator('textarea');
    if (await notesField.isVisible()) {
      await notesField.fill(visit.notes);
    }
    
    await this.page.click('button:has-text("Save")');
    
    // Wait for success and return to visits list
    await expect(this.page.locator('.ant-message')).toContainText('successfully');
    await this.page.waitForURL('**/visits');
  }

  async updateProfile(profile: any) {
    await this.navigateToPage('profile');
    await this.page.click('text=Edit Profile');
    
    // Fill profile fields
    if (profile.name) {
      await this.page.fill('input[placeholder*="Name"]', profile.name);
    }
    if (profile.specialization) {
      await this.page.fill('input[placeholder*="Specialization"]', profile.specialization);
    }
    if (profile.phone) {
      await this.page.fill('input[placeholder*="Phone"]', profile.phone);
    }
    
    await this.page.click('button:has-text("Save Changes")');
    await expect(this.page.locator('.ant-message')).toContainText('successfully');
  }

  async getPatientCount() {
    await this.navigateToPage('patients');
    const patientCards = this.page.locator('.patient-card').or(
      this.page.locator('.ant-table-tbody tr')
    );
    return await patientCards.count();
  }

  async getVisitCount() {
    await this.navigateToPage('visits');
    const visitCards = this.page.locator('[data-testid="visit-card"]').or(
      this.page.locator('.ant-table-tbody tr')
    );
    return await visitCards.count();
  }

  async checkDataIsolation(expectedPatientName: string) {
    // Check patients page
    await this.navigateToPage('patients');
    const patientsVisible = await this.page.locator(`text=${expectedPatientName}`).isVisible();
    
    // Check visits page  
    await this.navigateToPage('visits');
    const visitsVisible = await this.page.locator(`text=${expectedPatientName}`).isVisible();
    
    // Check dashboard
    await this.navigateToPage('dashboard');
    
    return { patientsVisible, visitsVisible };
  }
}

test.describe('Single User Complete Flow Test', () => {
  let helper: PhysioFlowTestHelper;
  
  test.beforeEach(async ({ page }) => {
    helper = new PhysioFlowTestHelper(page);
  });

  test('Complete workflow - Login to Profile Management', async ({ page }) => {
    const user = TEST_USERS.doctor1;
    
    // Step 1: Login
    await test.step('User Login', async () => {
      await helper.login(user.email, '123456');
    });

    // Step 2: Check Dashboard
    await test.step('Dashboard Overview', async () => {
      await helper.navigateToPage('dashboard');
      await expect(page.locator('h2')).toContainText('Dashboard');
      
      // Check KPIs are visible
      await expect(page.locator('.ant-statistic')).toBeVisible();
    });

    // Step 3: Create Patient
    let patientName: string;
    await test.step('Create New Patient', async () => {
      patientName = await helper.createPatient();
      
      // Verify patient appears in list
      await expect(page.locator(`text=${patientName}`)).toBeVisible();
    });

    // Step 4: Create Visit
    await test.step('Create New Visit', async () => {
      await helper.createVisit(patientName);
      
      // Verify visit appears in list
      await expect(page.locator(`text=${patientName}`)).toBeVisible();
    });

    // Step 5: Check Schedule
    await test.step('Check Schedule View', async () => {
      await helper.navigateToPage('schedule');
      await expect(page.locator('.ant-calendar')).toBeVisible();
    });

    // Step 6: Check Payments
    await test.step('Check Payments Page', async () => {
      await helper.navigateToPage('payments');
      await expect(page.locator('h2')).toContainText('Payments');
      
      // Should see the visit we created
      await expect(page.locator(`text=${patientName}`)).toBeVisible();
    });

    // Step 7: Update Profile
    await test.step('Update Doctor Profile', async () => {
      await helper.updateProfile({
        name: user.name,
        specialization: user.specialization,
        phone: '+91 9876543210'
      });
      
      // Verify profile was updated
      await expect(page.locator(`text=${user.name}`)).toBeVisible();
    });

    // Step 8: Test Mobile Responsiveness
    await test.step('Test Mobile View', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test navigation menu on mobile
      await helper.navigateToPage('patients');
      await expect(page.locator('.ant-layout-sider')).toBeVisible();
      
      // Test patient cards on mobile
      await expect(page.locator('.patient-card').first()).toBeVisible();
    });

    // Step 9: Test Filters and Search
    await test.step('Test Search and Filters', async () => {
      await page.setViewportSize({ width: 1200, height: 800 });
      
      // Test patient search
      await helper.navigateToPage('patients');
      const searchInput = page.locator('input[placeholder*="Search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('Test');
        await expect(page.locator(`text=${patientName}`)).toBeVisible();
      }
      
      // Test visit filters
      await helper.navigateToPage('visits');
      const statusFilter = page.locator('.ant-select').first();
      if (await statusFilter.isVisible()) {
        await statusFilter.click();
        await page.click('text=Upcoming');
      }
    });
  });

  test('Error Handling and Edge Cases', async ({ page }) => {
    const user = TEST_USERS.doctor1;
    await helper.login(user.email, '123456');

    // Test empty states
    await test.step('Test Empty States', async () => {
      // If no patients, should show empty state
      const patientCount = await helper.getPatientCount();
      if (patientCount === 0) {
        await expect(page.locator('text=No patients found')).toBeVisible();
      }
    });

    // Test form validation
    await test.step('Test Form Validation', async () => {
      await helper.navigateToPage('patients');
      await page.click('text=Add Patient');
      
      // Try to save without required fields
      await page.click('button:has-text("Save")');
      
      // Should show validation errors
      await expect(page.locator('.ant-form-item-explain-error')).toBeVisible();
    });

    // Test navigation
    await test.step('Test Navigation Performance', async () => {
      const navigationStart = Date.now();
      await helper.navigateToPage('dashboard');
      await helper.navigateToPage('patients');
      await helper.navigateToPage('visits');
      const navigationEnd = Date.now();
      
      // Navigation should be reasonably fast (under 3 seconds total)
      expect(navigationEnd - navigationStart).toBeLessThan(3000);
    });
  });
});

export { PhysioFlowTestHelper, TEST_USERS, TEST_PATIENT, TEST_VISIT };
