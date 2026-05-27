export async function mockOutOfStock(page) {
  await page.route('**/api/products/*', async (route) => {
    const original = await route.fetch();
    const json = await original.json();
    json.stock = 0;
    await route.fulfill({ response: original, json });
  });
}

export async function mockBackendTimeout(page) {
  await page.route('**/api/checkout', (route) => route.abort('timedout'));
}

export async function mockEmptyDepartment(page, slug) {
  await page.route(`**/api/department/${slug}`, (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ items: [] }) })
  );
}

export async function mockCheckoutSuccess(page, override = {}) {
  await page.route('**/api/checkout', (route) => {
    const body = Object.assign(
      {
        orderId: 'TEST-ORDER-0001',
        total: 49.99,
        currency: 'USD',
        payment: { method: 'card', masked: '**** **** **** 4242' },
      },
      override
    );
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
}
