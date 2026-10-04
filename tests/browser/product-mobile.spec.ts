import { test, expect, type Page } from '@playwright/test';

if (!process.env.TURSO_DATABASE_URL?.startsWith('file:') || !process.env.TURSO_DATABASE_URL.includes('/.audit/')) {
  throw new Error('Product tests require the isolated audit database.');
}

const photo = {
  name: 'ipm.png', mimeType: 'image/png',
  buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aYJ8AAAAASUVORK5CYII=', 'base64'),
};
const image = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100';

async function openAdmin(page: Page) {
  await page.goto('/admin');
  await page.getByPlaceholder('Enter administrator password...').fill(process.env.ADMIN_PASSWORD!);
  await page.getByRole('button', { name: /unlock|access|sign in|login/i }).click();
  await expect(page.getByRole('button', { name: 'Manage Products' })).toBeVisible();
  await expect(page.getByText('Loading products…', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'ESP32-WROOM-32D Development Board', exact: true })).toBeVisible();
}

for (const width of [360, 768]) {
test(`mobile add form stays clear of the catalogue while scrolling at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 800 });
  await openAdmin(page);
  await page.locator('input[type="file"]').first().setInputFiles(photo);
  await page.getByPlaceholder('e.g. ESP32-WROOM-32D Development Board').fill('AUDIT MOBILE IPM');
  const form = page.locator('form').filter({ has: page.getByPlaceholder('e.g. ESP32-WROOM-32D Development Board') });
  await form.locator('input[type="number"]').first().fill('450');
  const search = page.getByPlaceholder('Search component name, category...');
  await search.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `.audit/mobile-product-scroll-${width}.png`, fullPage: false });
  const formBounds = await form.boundingBox();
  const searchBounds = await search.boundingBox();
  expect(formBounds).not.toBeNull();
  expect(searchBounds).not.toBeNull();
  expect(formBounds!.y + formBounds!.height, 'The catalogue must stay below the add-product form').toBeLessThan(searchBounds!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  for (const label of ['Component Name *', 'Price (৳) *', 'Compare Price (৳)', 'Stock Quantity', 'Category', 'Technical Description']) {
    const field = form.getByLabel(label, { exact: true });
    await field.click({ trial: true, timeout: 5000 });
  }
  await form.getByRole('button', { name: 'Publish Product to Catalog' }).click({ trial: true, timeout: 5000 });
});
}

for (const scenario of ['unconfigured', 'service failure', 'network failure'] as const) {
test(`mobile admin publishes and reloads a product with AI ${scenario}`, async ({ page, request }) => {
  await page.setViewportSize({ width: scenario === 'network failure' ? 768 : 360, height: 800 });
  expect((await request.get('/api/ai/describe-product')).status()).toBe(401);
  let aiCalls = 0;
  if (scenario !== 'unconfigured') {
    await page.route('**/api/ai/describe-product', async route => {
      if (route.request().method() === 'GET') return route.fulfill({ json: { available: true } });
      aiCalls++;
      if (scenario === 'network failure') return route.abort('failed');
      return route.fulfill({ status: 503, json: { error: 'AI service not configured' } });
    });
  } else {
    page.on('request', req => { if (req.url().endsWith('/api/ai/describe-product') && req.method() === 'POST') aiCalls++; });
  }
  let uploads = 0;
  await page.route('**/api/upload', async route => {
    uploads++;
    expect(route.request().headers()['content-type']).toContain('multipart/form-data');
    expect(route.request().postDataBuffer()?.includes(Buffer.from([0xff, 0xd8]))).toBe(true);
    await route.fulfill({ json: { url: image, publicUrl: image } });
  });
  await openAdmin(page);
  if (scenario === 'unconfigured') {
    const capability = await page.request.get('/api/ai/describe-product');
    expect(capability.ok()).toBe(true);
    expect(await capability.json()).toEqual({ available: false });
    expect(capability.headers()['cache-control']).toContain('no-store');
  }
  await page.getByLabel('Primary Photo', { exact: false }).setInputFiles(photo);
  const name = `AUDIT MOBILE IPM ${scenario}`;
  await page.getByLabel('Component Name', { exact: false }).fill(name);
  await page.getByLabel('Price (৳) *', { exact: true }).fill('450');
  await page.getByLabel('Stock Quantity').fill('2');
  await page.getByLabel('Technical Description').fill('Manually entered IPM specification');
  if (scenario !== 'unconfigured') {
    await page.getByRole('button', { name: 'Fill details with AI (optional)' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'AI সহায়তা এখন পাওয়া যাচ্ছে না।' })).toBeVisible();
    expect(aiCalls).toBe(1);
  } else {
    await expect(page.getByRole('button', { name: /AI|Re-analyze/ })).toHaveCount(0);
    expect(aiCalls).toBe(0);
  }
  await expect(page.locator('main [role="alert"]')).toHaveCount(0);
  await expect(page.getByLabel('Component Name', { exact: false })).toHaveValue(name);
  await expect(page.getByLabel('Technical Description')).toHaveValue('Manually entered IPM specification');
  await page.getByRole('button', { name: 'Publish Product to Catalog' }).click();
  await expect(page.getByText('Product added successfully!', { exact: true })).toBeVisible();
  expect(uploads).toBe(1);
  const products = await (await page.request.get('/api/products')).json();
  const saved = products.find((product: { name: string }) => product.name === name);
  expect(saved).toMatchObject({ price: 450, stock: 2, description: 'Manually entered IPM specification', imageUrl: image });
  try {
    await page.reload();
    await page.getByPlaceholder('Search component name, category...').fill(name);
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    await page.goto(`/product/${saved.slug}`);
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  } finally {
    expect((await page.request.delete(`/api/products?id=${saved.id}`)).ok()).toBe(true);
  }
});
}

test('optional AI suggestions preserve details already entered by the admin', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/ai/describe-product', route => route.fulfill({
    json: route.request().method() === 'GET' ? { available: true } : {
      title: 'AI title', description: 'Suggested component specifications', category: 'Components', specs: { Voltage: '5V' },
    },
  }));
  await openAdmin(page);
  await page.getByLabel('Primary Photo', { exact: false }).setInputFiles(photo);
  await page.getByLabel('Component Name', { exact: false }).fill('Manual IPM name');
  await page.getByRole('button', { name: 'Fill details with AI (optional)' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'AI suggestions added' })).toBeVisible();
  await expect(page.getByLabel('Component Name', { exact: false })).toHaveValue('Manual IPM name');
  await expect(page.getByLabel('Technical Description')).toHaveValue('Suggested component specifications');
});

test('mobile IPM product publishes when both prices are 3000', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.route('**/api/upload', route => route.fulfill({ json: { url: image, publicUrl: image } }));
  await openAdmin(page);
  await page.getByLabel('Primary Photo', { exact: false }).setInputFiles(photo);
  const name = 'AUDIT IPM (Intelligent Power Module)';
  await page.getByLabel('Component Name', { exact: false }).fill(name);
  await page.getByLabel('Price (৳) *', { exact: true }).fill('3000');
  await page.getByLabel('Compare Price (৳)', { exact: true }).fill('3000');
  await page.getByLabel('Stock Quantity').fill('10');
  await Promise.all([
    page.waitForResponse(response => response.url().endsWith('/api/products') && response.request().method() === 'POST'),
    page.getByRole('button', { name: 'Publish Product to Catalog' }).click(),
  ]);
  const saved = (await (await page.request.get('/api/products')).json()).find((p: { name: string }) => p.name === name);
  try {
    await expect(page.getByText('Product added successfully!', { exact: true })).toBeInViewport();
    expect(saved).toMatchObject({ price: 3000, comparePrice: null, stock: 10, imageUrl: image });
    await page.reload();
    await page.getByPlaceholder('Search component name, category...').fill(name);
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    await page.goto(`/product/${saved.slug}`);
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    await expect(page.locator('main del')).toHaveCount(0);
  } finally {
    if (saved) expect((await page.request.delete(`/api/products?id=${saved.id}`)).ok()).toBe(true);
  }
});

test('mobile publish failures are visible beside the button and retain entered details', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.route('**/api/upload', route => route.fulfill({ status: 503, json: { error: 'Photo storage is temporarily unavailable. Please try again.' } }));
  await openAdmin(page);
  await page.getByLabel('Primary Photo', { exact: false }).setInputFiles(photo);
  await page.getByLabel('Component Name', { exact: false }).fill('IPM (Intelligent Power Module)');
  await page.getByLabel('Price (৳) *', { exact: true }).fill('3000');
  const button = page.getByRole('button', { name: 'Publish Product to Catalog' });
  await button.click();
  const alert = page.locator('main [role="alert"]');
  await expect(alert).toHaveText(/Photo storage is temporarily unavailable/);
  await expect(alert).toBeInViewport();
  await expect(page.getByLabel('Component Name', { exact: false })).toHaveValue('IPM (Intelligent Power Module)');
  await expect(page.getByLabel('Price (৳) *', { exact: true })).toHaveValue('3000');
  await expect(page.getByAltText('Preview', { exact: true })).toHaveCount(1);
  const bounds = await alert.boundingBox();
  const buttonBounds = await button.boundingBox();
  expect(buttonBounds!.y - (bounds!.y + bounds!.height)).toBeLessThan(100);
});

test('an invalid compare price is explained before uploading the photo', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  let uploads = 0;
  await page.route('**/api/upload', route => { uploads++; return route.fulfill({ json: { url: image, publicUrl: image } }); });
  await openAdmin(page);
  await page.getByLabel('Primary Photo', { exact: false }).setInputFiles(photo);
  await page.getByLabel('Component Name', { exact: false }).fill('IPM');
  await page.getByLabel('Price (৳) *', { exact: true }).fill('3000');
  await page.getByLabel('Compare Price (৳)', { exact: true }).fill('2500');
  await page.getByRole('button', { name: 'Publish Product to Catalog' }).click();
  await expect(page.locator('main [role="alert"]')).toHaveText(/compare price/i);
  await expect(page.locator('main [role="alert"]')).toBeInViewport();
  expect(uploads).toBe(0);
});
