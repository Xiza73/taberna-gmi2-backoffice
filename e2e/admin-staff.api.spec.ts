import { test, expect, type APIRequestContext } from '@playwright/test';

const API_BASE = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

let apiContext: APIRequestContext;
let authToken: string;
let createdStaffId: string;

test.describe.serial('Admin Staff API', () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: API_BASE,
    });

    const loginRes = await apiContext.post('/staff/auth/login', {
      data: {
        email: process.env.STAFF_EMAIL || 'admin@gmi2.com',
        password: process.env.STAFF_PASSWORD || 'Admin123!',
      },
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginBody = await loginRes.json();
    authToken = loginBody.data.accessToken;

    apiContext = await playwright.request.newContext({
      baseURL: API_BASE,
      extraHTTPHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  // ── POST /admin/staff ──

  test('should create staff with default role', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    const res = await apiContext.post('/admin/staff', {
      data: {
        name: 'E2E Test Staff',
        email: uniqueEmail,
        password: 'Password123!',
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.name).toBe('E2E Test Staff');
    expect(body.data.email).toBe(uniqueEmail);
    expect(body.data.role).toBe('user');
    expect(body.data.isActive).toBe(true);
    expect(body.data).not.toHaveProperty('password');

    createdStaffId = body.data.id;
  });

  test('should create staff with admin role', async () => {
    const uniqueEmail = `admin-${Date.now()}@example.com`;

    const res = await apiContext.post('/admin/staff', {
      data: {
        name: 'E2E Admin Staff',
        email: uniqueEmail,
        password: 'Password123!',
        role: 'admin',
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.data.role).toBe('admin');
  });

  test('should reject duplicate email', async () => {
    const res = await apiContext.post('/admin/staff', {
      data: {
        name: 'Duplicate',
        email: process.env.STAFF_EMAIL || 'admin@gmi2.com',
        password: 'Password123!',
      },
    });

    expect(res.status()).toBe(409);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('should reject invalid payload', async () => {
    const res = await apiContext.post('/admin/staff', {
      data: { name: '' },
    });

    expect(res.status()).toBe(400);
  });

  test('should reject invalid role enum', async () => {
    const res = await apiContext.post('/admin/staff', {
      data: {
        name: 'Test',
        email: `invalid-role-${Date.now()}@example.com`,
        password: 'Password123!',
        role: 'superuser',
      },
    });

    expect(res.status()).toBe(400);
  });

  // ── GET /admin/staff ──

  test('should list staff members', async () => {
    const res = await apiContext.get('/admin/staff');

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('items');
    expect(body.data).toHaveProperty('total');
    expect(Array.isArray(body.data.items)).toBe(true);
  });

  test('should filter staff by role', async () => {
    const res = await apiContext.get('/admin/staff?role=admin');

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    for (const item of body.data.items) {
      expect(item.role).toBe('admin');
    }
  });

  test('should filter staff by isActive', async () => {
    const res = await apiContext.get('/admin/staff?isActive=true');

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    for (const item of body.data.items) {
      expect(item.isActive).toBe(true);
    }
  });

  test('should search staff by name', async () => {
    const res = await apiContext.get('/admin/staff?search=E2E');

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.total).toBeGreaterThanOrEqual(1);
  });

  test('should paginate staff', async () => {
    const res = await apiContext.get('/admin/staff?page=1&limit=2');

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.items.length).toBeLessThanOrEqual(2);
  });

  // ── GET /admin/staff/:id ──

  test('should get staff by id', async () => {
    const res = await apiContext.get(`/admin/staff/${createdStaffId}`);

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.id).toBe(createdStaffId);
    expect(body.data.name).toBe('E2E Test Staff');
  });

  test('should return 404 for non-existent id', async () => {
    const res = await apiContext.get(
      '/admin/staff/00000000-0000-0000-0000-000000000000',
    );

    expect(res.status()).toBe(404);
  });

  test('should return 400 for invalid UUID', async () => {
    const res = await apiContext.get('/admin/staff/not-a-uuid');

    expect(res.status()).toBe(400);
  });

  // ── PATCH /admin/staff/:id ──

  test('should update staff name', async () => {
    const res = await apiContext.patch(`/admin/staff/${createdStaffId}`, {
      data: { name: 'Updated Name' },
    });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.name).toBe('Updated Name');
  });

  test('should update staff isActive to false', async () => {
    const res = await apiContext.patch(`/admin/staff/${createdStaffId}`, {
      data: { isActive: false },
    });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.isActive).toBe(false);
  });

  test('should update staff isActive to true', async () => {
    const res = await apiContext.patch(`/admin/staff/${createdStaffId}`, {
      data: { isActive: true },
    });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.isActive).toBe(true);
  });

  // ── PATCH /admin/staff/:id/role ──

  test('should change staff role', async () => {
    const res = await apiContext.patch(`/admin/staff/${createdStaffId}/role`, {
      data: { role: 'admin' },
    });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.role).toBe('admin');
  });

  test('should reject invalid role on change', async () => {
    const res = await apiContext.patch(`/admin/staff/${createdStaffId}/role`, {
      data: { role: 'invalid' },
    });

    expect(res.status()).toBe(400);
  });

  // ── PATCH /admin/staff/:id/suspend ──

  test('should suspend staff member', async () => {
    const res = await apiContext.patch(
      `/admin/staff/${createdStaffId}/suspend`,
    );

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.success).toBe(true);

    // Verify suspended
    const getRes = await apiContext.get(`/admin/staff/${createdStaffId}`);
    const getBody = await getRes.json();
    expect(getBody.data.isActive).toBe(false);
  });

  // ── PATCH /admin/staff/:id/activate ──

  test('should activate staff member', async () => {
    const res = await apiContext.patch(
      `/admin/staff/${createdStaffId}/activate`,
    );

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.success).toBe(true);

    // Verify activated
    const getRes = await apiContext.get(`/admin/staff/${createdStaffId}`);
    const getBody = await getRes.json();
    expect(getBody.data.isActive).toBe(true);
  });

  // ── Guard tests ──

  test('should reject unauthenticated requests', async ({ playwright }) => {
    const noAuthCtx = await playwright.request.newContext({
      baseURL: API_BASE,
    });

    const res = await noAuthCtx.get('/admin/staff');
    expect(res.status()).toBe(401);

    await noAuthCtx.dispose();
  });
});
