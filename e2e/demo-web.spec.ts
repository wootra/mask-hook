import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 2, name: 'SSN Demo' })).toBeVisible();
});

test('focus clears seeded value', async ({ page }) => {
  const input = page.getByLabel('Masked input');
  await expect(input).toHaveValue(/6789$/);

  await input.click();
  await expect(input).toHaveValue('');
});

test('focus then blur without edits restores initial value', async ({ page }) => {
  const input = page.getByLabel('Masked input');

  await input.click();
  await expect(input).toHaveValue('');

  await page.getByRole('heading', { level: 2, name: 'SSN Demo' }).click();
  await expect(input).toHaveValue(/6789$/);
  await expect(page.getByText('Initial value', { exact: true })).toBeVisible();
});

test('show digits button disabled when incomplete and untouched', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Show digits' })).toBeDisabled();
  await expect(page.getByText('4/9', { exact: true })).toBeVisible();
});

test('show digits button enabled when full value entered', async ({ page }) => {
  const input = page.getByLabel('Masked input');
  const button = page.getByRole('button', { name: 'Show digits' });

  await input.click();
  await input.fill('123456789');

  await expect(button).toBeEnabled();
  await expect(page.getByText('9/9', { exact: true })).toBeVisible();
});

test('show digits button enabled after user changes value', async ({ page }) => {
  const input = page.getByLabel('Masked input');

  await input.click();
  await input.fill('1');

  await expect(page.getByRole('button', { name: 'Show digits' })).toBeEnabled();
  await expect(page.getByText('Modified', { exact: true })).toBeVisible();
});

test('switching tabs restores seeded value on return', async ({ page }) => {
  const input = page.getByLabel('Masked input');

  await input.click();
  await input.fill('123456789');
  await expect(page.getByText('9/9', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'EIN page' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'EIN Demo' })).toBeVisible();

  await page.getByRole('button', { name: 'SSN page' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'SSN Demo' })).toBeVisible();
  await expect(page.getByLabel('Masked input')).toHaveValue(/6789$/);
  await expect(page.getByText('Initial value', { exact: true })).toBeVisible();
});
