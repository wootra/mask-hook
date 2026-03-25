import { expect, test } from '@playwright/test';

async function openSsnScreen(page: import('@playwright/test').Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('ssn-mask-input')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId('ssn-toggle-digits-btn')).toBeVisible({ timeout: 20_000 });
}

test('focus clears seeded value', async ({ page }) => {
  await openSsnScreen(page);

  const input = page.getByTestId('ssn-mask-input');
  await expect(input).toHaveValue(/6789$/);

  await input.click();
  await expect(input).toHaveValue('');
});

test('focus then blur without edits restores initial value', async ({ page }) => {
  await openSsnScreen(page);

  const input = page.getByTestId('ssn-mask-input');
  await input.click();
  await expect(input).toHaveValue('');

  await page.locator('body').click();
  await expect(input).toHaveValue(/6789$/);
  await expect(page.getByText('Initial value', { exact: true })).toBeVisible();
});

test('show digits button is disabled when value is incomplete and untouched', async ({ page }) => {
  await openSsnScreen(page);

  await expect(page.getByTestId('ssn-toggle-digits-btn')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.getByText('4/9', { exact: true })).toBeVisible();
});

test('show digits button is enabled when full value is entered', async ({ page }) => {
  await openSsnScreen(page);

  const input = page.getByTestId('ssn-mask-input');
  await input.click();
  await input.fill('123456789');

  await expect(page.getByTestId('ssn-toggle-digits-btn')).not.toHaveAttribute('aria-disabled');
  await expect(page.getByText('9/9', { exact: true })).toBeVisible();
});

test('show digits button is enabled after user edit', async ({ page }) => {
  await openSsnScreen(page);

  const input = page.getByTestId('ssn-mask-input');
  await input.click();
  await input.fill('1');

  await expect(page.getByTestId('ssn-toggle-digits-btn')).not.toHaveAttribute('aria-disabled');
  await expect(page.getByText('Modified', { exact: true })).toBeVisible();
});

test('returning from another tab restores seeded value', async ({ page }) => {
  await openSsnScreen(page);

  const input = page.getByTestId('ssn-mask-input');
  await input.click();
  await input.fill('123456789');
  await expect(page.getByText('9/9', { exact: true })).toBeVisible();

  await page.getByRole('tab', { name: /ein/i }).click();
  await expect(page.getByTestId('ein-mask-input')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('tab', { name: /ssn/i }).click();
  await expect(page.getByTestId('ssn-mask-input')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId('ssn-mask-input')).toHaveValue(/6789$/);
});
