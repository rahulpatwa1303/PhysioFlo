import { test, expect, Browser, Page } from '@playwright/test';
import { PhysioFlowTestHelper, TEST_USERS, TEST_PATIENT } from './single-user-flow.spec';

test.describe('Multi-User Data Isolation Tests', () => {
  let browser1: Browser;
  let browser2: Browser;
  let page1: Page;
  let page2: Page;
  let helper1: PhysioFlowTestHelper;
  let helper2: PhysioFlowTestHelper;

  test.beforeAll(async ({ browser }) => {
    // Create separate browser contexts for each user to simulate different users
    const context1 = await browser.newContext({
      storageState: undefined // Ensure clean state
    });
    const context2 = await browser.newContext({
      storageState: undefined // Ensure clean state  
    });

    page1 = await context1.newPage();
    page2 = await context2.newPage();
    
    helper1 = new PhysioFlowTestHelper(page1);
    helper2 = new PhysioFlowTestHelper(page2);
  });

  test.afterAll(async () => {
    await page1?.close();
    await page2?.close();
  });

  test('User A cannot see User B data', async () => {
    const user1 = TEST_USERS.doctor1;
    const user2 = TEST_USERS.doctor2;
    
    // User 1 creates data
    await test.step('User 1 - Login and Create Data', async () => {
      await helper1.login(user1.email, '123456');
      
      // Create patient for User 1
      const patient1Name = await helper1.createPatient({
        firstName: 'User1',
        lastName: 'Patient',
        phone: '+91 1111111111',
        address: 'User 1 Address'
      });
      
      // Create visit for User 1
      await helper1.createVisit(patient1Name);
      
      // Update User 1 profile
      await helper1.updateProfile({
        name: user1.name,
        specialization: user1.specialization
      });
    });

    // User 2 creates data
    await test.step('User 2 - Login and Create Data', async () => {
      await helper2.login(user2.email, '123456');
      
      // Create patient for User 2
      const patient2Name = await helper2.createPatient({
        firstName: 'User2',
        lastName: 'Patient', 
        phone: '+91 2222222222',
        address: 'User 2 Address'
      });
      
      // Create visit for User 2
      await helper2.createVisit(patient2Name);
      
      // Update User 2 profile
      await helper2.updateProfile({
        name: user2.name,
        specialization: user2.specialization
      });
    });

    // Verify User 1 cannot see User 2's data
    await test.step('Verify User 1 Data Isolation', async () => {
      // User 1 should only see their own patient
      await helper1.navigateToPage('patients');
      await expect(page1.locator('text=User1 Patient')).toBeVisible();
      await expect(page1.locator('text=User2 Patient')).not.toBeVisible();
      
      // User 1 should only see their own visits
      await helper1.navigateToPage('visits');
      await expect(page1.locator('text=User1 Patient')).toBeVisible();
      await expect(page1.locator('text=User2 Patient')).not.toBeVisible();
      
      // User 1 should only see their own payments
      await helper1.navigateToPage('payments');
      await expect(page1.locator('text=User1 Patient')).toBeVisible();
      await expect(page1.locator('text=User2 Patient')).not.toBeVisible();
      
      // Check dashboard shows only User 1's data
      await helper1.navigateToPage('dashboard');
      const user1PatientCount = await helper1.getPatientCount();
      expect(user1PatientCount).toBe(1);
    });

    // Verify User 2 cannot see User 1's data
    await test.step('Verify User 2 Data Isolation', async () => {
      // User 2 should only see their own patient
      await helper2.navigateToPage('patients');
      await expect(page2.locator('text=User2 Patient')).toBeVisible();
      await expect(page2.locator('text=User1 Patient')).not.toBeVisible();
      
      // User 2 should only see their own visits
      await helper2.navigateToPage('visits');
      await expect(page2.locator('text=User2 Patient')).toBeVisible();
      await expect(page2.locator('text=User1 Patient')).not.toBeVisible();
      
      // User 2 should only see their own payments
      await helper2.navigateToPage('payments');
      await expect(page2.locator('text=User2 Patient')).toBeVisible();
      await expect(page2.locator('text=User1 Patient')).not.toBeVisible();
      
      // Check dashboard shows only User 2's data
      await helper2.navigateToPage('dashboard');
      const user2PatientCount = await helper2.getPatientCount();
      expect(user2PatientCount).toBe(1);
    });
  });

  test('Concurrent User Actions', async () => {
    const user1 = TEST_USERS.doctor1;
    const user2 = TEST_USERS.doctor2;

    await test.step('Concurrent Login', async () => {
      // Both users login simultaneously
      await Promise.all([
        helper1.login(user1.email, '123456'),
        helper2.login(user2.email, '123456')
      ]);
    });

    await test.step('Concurrent Data Creation', async () => {
      // Both users create patients simultaneously
      const [patient1Name, patient2Name] = await Promise.all([
        helper1.createPatient({
          firstName: 'Concurrent1',
          lastName: 'Patient',
          phone: '+91 3333333333',
          address: 'Concurrent 1 Address'
        }),
        helper2.createPatient({
          firstName: 'Concurrent2', 
          lastName: 'Patient',
          phone: '+91 4444444444',
          address: 'Concurrent 2 Address'
        })
      ]);

      // Both users create visits simultaneously
      await Promise.all([
        helper1.createVisit(patient1Name),
        helper2.createVisit(patient2Name)
      ]);
    });

    await test.step('Verify No Cross-Contamination', async () => {
      // Each user should only see their own concurrent data
      await helper1.navigateToPage('patients');
      await expect(page1.locator('text=Concurrent1 Patient')).toBeVisible();
      await expect(page1.locator('text=Concurrent2 Patient')).not.toBeVisible();

      await helper2.navigateToPage('patients');
      await expect(page2.locator('text=Concurrent2 Patient')).toBeVisible();
      await expect(page2.locator('text=Concurrent1 Patient')).not.toBeVisible();
    });
  });

  test('Session Management and Security', async () => {
    const user1 = TEST_USERS.doctor1;
    const user2 = TEST_USERS.doctor2;

    await test.step('Test Session Isolation', async () => {
      // User 1 logs in
      await helper1.login(user1.email, '123456');
      await helper1.createPatient({
        firstName: 'Session1',
        lastName: 'Test',
        phone: '+91 5555555555',
        address: 'Session 1 Address'
      });

      // User 2 logs in on different browser
      await helper2.login(user2.email, '123456');
      
      // User 2 should not see User 1's session data
      await helper2.navigateToPage('patients');
      await expect(page2.locator('text=Session1 Test')).not.toBeVisible();
    });

    await test.step('Test Logout Security', async () => {
      // User 1 logs out
      await helper1.logout();
      
      // Try to access protected page - should redirect to login
      await page1.goto('/patients');
      await page1.waitForURL('**/login', { timeout: 5000 });
      
      // User 2 should still be logged in and functional
      await helper2.navigateToPage('dashboard');
      await expect(page2.locator('h2')).toContainText('Dashboard');
    });
  });

  test('Database Transaction Isolation', async () => {
    const user1 = TEST_USERS.doctor1;
    const user2 = TEST_USERS.doctor2;

    await Promise.all([
      helper1.login(user1.email, '123456'),
      helper2.login(user2.email, '123456')
    ]);

    await test.step('Test Rapid Create/Delete Operations', async () => {
      // User 1 creates multiple patients rapidly
      const user1Patients = await Promise.all([
        helper1.createPatient({
          firstName: 'Rapid1A',
          lastName: 'Patient',
          phone: '+91 6666666666',
          address: 'Rapid 1A Address'
        }),
        helper1.createPatient({
          firstName: 'Rapid1B', 
          lastName: 'Patient',
          phone: '+91 7777777777',
          address: 'Rapid 1B Address'
        })
      ]);

      // User 2 creates patients simultaneously
      const user2Patients = await Promise.all([
        helper2.createPatient({
          firstName: 'Rapid2A',
          lastName: 'Patient', 
          phone: '+91 8888888888',
          address: 'Rapid 2A Address'
        }),
        helper2.createPatient({
          firstName: 'Rapid2B',
          lastName: 'Patient',
          phone: '+91 9999999999', 
          address: 'Rapid 2B Address'
        })
      ]);

      // Verify each user only sees their own patients
      await helper1.navigateToPage('patients');
      for (const patient of user1Patients) {
        await expect(page1.locator(`text=${patient}`)).toBeVisible();
      }
      for (const patient of user2Patients) {
        await expect(page1.locator(`text=${patient}`)).not.toBeVisible();
      }
    });
  });
});
