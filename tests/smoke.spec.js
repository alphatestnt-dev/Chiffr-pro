const { test, expect } = require('@playwright/test');

const url = 'http://127.0.0.1:4173/index.html';

async function openFresh(page) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await expect(page.locator('#accueil')).toBeVisible();
  await expect(page.locator('.home')).toBeVisible();
}

async function go(page, id) {
  await page.locator(`nav button[data-p="${id}"]`).click();
  await expect(page.locator(`#${id}`)).toBeVisible();
}

test('fresh user loads without blank screen', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url, { waitUntil: 'networkidle' });
  await expect(page.locator('#accueil')).toBeVisible();
  await expect(page.locator('.home-links button').nth(0)).toBeVisible();
  expect(errors).toEqual([]);
});

test('navigation and key pages', async ({ page }) => {
  await openFresh(page);
  for (const id of ['pro','particulier','eco','devis','historique','aides','param']) await go(page, id);
  await expect(page.locator('#partnerNav')).toBeVisible();
  await page.locator('#partnerNav').click();
  await expect(page.locator('#partnersPage')).toBeVisible();
});

test('professional project, metrics, waste and price calculation', async ({ page }) => {
  await openFresh(page);
  await page.locator('.home-links button').nth(0).click();
  await page.locator('#entreprise').fill('Test EcoPro');
  await page.locator('#client').fill('Client Test');
  await page.locator('#hours').fill('3');
  await page.locator('#rate').fill('20');
  await page.locator('#margin').fill('30');
  await page.locator('#mn').fill('Terreau');
  await page.locator('#mq').fill('2');
  await page.locator('#mp').fill('15');
  await page.getByRole('button', { name: 'Ajouter', exact: true }).nth(0).click();
  await page.locator('#th').fill('2');
  await page.locator('#tn').selectOption({ index: 0 });
  await page.locator('#tc').waitFor({ state: 'attached' });
  await page.getByRole('button', { name: 'Ajouter', exact: true }).nth(1).click();
  await page.locator('#wl').fill('2');
  await page.locator('#ww').fill('1.5');
  await page.locator('#wh').fill('0.5');
  await page.locator('#wmode').selectOption('dimensions');
  await page.getByRole('button', { name: 'Calculer le volume' }).click();
  await expect(page.locator('#wvol')).toHaveText('1.00 m³');
  await page.getByRole('button', { name: 'Ajouter au chiffrage' }).click();
  await page.getByRole('button', { name: 'Calculer le prix' }).click();
  await expect(page.locator('#res')).toBeVisible();
  await expect(page.locator('#ht')).not.toHaveText('');
  await expect(page.locator('#ttc')).not.toHaveText('');
});

test('direct waste volume and quote/history', async ({ page }) => {
  await openFresh(page);
  await page.locator('nav button[data-p="pro"]').click();
  await page.locator('#wmode').selectOption('volume');
  await page.locator('#wv').fill('3.25');
  await page.getByRole('button', { name: 'Calculer le volume' }).click();
  await expect(page.locator('#wvol')).toHaveText('3.25 m³');
  await page.getByRole('button', { name: 'Ajouter au chiffrage' }).click();
  await page.getByRole('button', { name: 'Sauvegarder' }).click();
  await go(page, 'historique');
  await expect(page.locator('#hist .item')).toHaveCount(1);
  await page.locator('#hist .item').getByRole('button', { name: 'Ouvrir' }).click();
  await expect(page.locator('#pro')).toBeVisible();
  await page.getByRole('button', { name: 'Préparer le devis' }).click();
  await expect(page.locator('#quote')).toContainText('DEVIS');
});

test('particular estimation, waste and comparison', async ({ page }) => {
  await openFresh(page);
  await go(page, 'particulier');
  await page.locator('#pq').fill('20');
  await page.locator('#pd').selectOption('Difficile');
  await page.getByRole('button', { name: "Obtenir l'estimation" }).click();
  await expect(page.locator('#pr')).toBeVisible();
  await page.locator('#pwl').fill('2');
  await page.locator('#pww').fill('1');
  await page.locator('#pwh').fill('0.5');
  await page.getByRole('button', { name: 'Calculer' }).click();
  await expect(page.locator('#pvol')).toHaveText('1.00 m³');
  await page.locator('#cn').fill('Entreprise A');
  await page.locator('#cp').fill('1200');
  await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
  await expect(page.locator('#cl .item')).toHaveCount(1);
});

test('reload keeps app usable and PWA registers', async ({ page }) => {
  await openFresh(page);
  await page.locator('nav button[data-p="eco"]').click();
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('#accueil')).toBeVisible();
  await expect(page.locator('.home')).toBeVisible();
  const registration = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return null;
    const reg = await navigator.serviceWorker.ready;
    return !!reg && !!reg.active;
  });
  expect(registration).toBeTruthy();
});
