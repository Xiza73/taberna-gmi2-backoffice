import { test, expect } from '@playwright/test';

test.describe('Staff Auth UI', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar|login|entrar/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: /iniciar|login|entrar/i }).click();

    await expect(page.locator('text=/email|correo/i')).toBeVisible();
  });

  test('should redirect to login when unauthenticated', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/login/);
  });

  test('should login with valid credentials and redirect to dashboard', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.locator('input[type="email"]').fill(
      process.env.STAFF_EMAIL || 'admin@gmi2.com',
    );
    await page.locator('input[type="password"]').fill(
      process.env.STAFF_PASSWORD || 'Admin123!',
    );
    await page.getByRole('button', { name: /iniciar|login|entrar/i }).click();

    await page.waitForURL('/', { timeout: 10000 });
    await expect(page).toHaveURL('/');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[type="email"]').fill('wrong@example.com');
    await page.locator('input[type="password"]').fill('WrongPass123!');
    await page.getByRole('button', { name: /iniciar|login|entrar/i }).click();

    await expect(
      page.locator('text=/invalid|error|incorrecto|credenciales/i'),
    ).toBeVisible({ timeout: 5000 });
  });
});
