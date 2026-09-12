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
  await expect(page.locator('#ml .item')).toHaveCount(1);
  await page.locator('#ml .item button').click();
  await expect(page.locator('#ml .item')).toHaveCount(0);
  await page.locator('#mn').fill('Terreau');
  await page.locator('#mq').fill('2');
  await page.locator('#mp').fill('15');
  await page.getByRole('button', { name: 'Ajouter', exact: true }).nth(0).click();
  await page.locator('#th').fill('2');
  await page.locator('#tn').selectOption({ index: 0 });
  await page.locator('#tc').waitFor({ state: 'attached' });
  await page.getByRole('button', { name: 'Ajouter', exact: true }).nth(1).click();
  await expect(page.locator('#tl .item')).toHaveCount(1);
  await page.locator('#tl .item button').click();
  await expect(page.locator('#tl .item')).toHaveCount(0);
  await page.locator('#th').fill('2');
  await page.getByRole('button', { name: 'Ajouter', exact: true }).nth(1).click();
  await page.locator('#wl').fill('2');
  await page.locator('#ww').fill('1.5');
  await page.locator('#wh').fill('0.5');
  await page.locator('#wmode').selectOption('dimensions');
  await page.getByRole('button', { name: 'Calculer le volume' }).click();
  await expect(page.locator('#wvol')).toHaveText('1.50 m³');
  await page.getByRole('button', { name: 'Ajouter au chiffrage' }).click();
  await expect(page.locator('#wlst .item')).toHaveCount(1);
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
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#quote')).toBeVisible();
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

test('final user acceptance: work catalogue, controls and visual layout', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await openFresh(page);

  // Real user-facing home controls and visual anchors.
  await expect(page.locator('.home-copy .avenir')).toContainText('Parce que le Monde a Besoin d’un Avenir');
  await expect(page.locator('.home-copy .eco-title')).toContainText('Pensez Éco Logique');
  await expect(page.locator('.home img')).toBeVisible();
  await expect(page.locator('.home-links button')).toHaveCount(2);
  await page.screenshot({ path: 'test-results/accueil-final.png', fullPage: true });

  // Every professional work family and every available sub-branch must be selectable.
  await go(page, 'pro');
  const professions = await page.locator('#metier option').allTextContents();
  expect(professions.length).toBeGreaterThan(20);
  for (const profession of professions) {
    await page.locator('#metier').selectOption({ label: profession });
    const subbranches = await page.locator('#prest option').allTextContents();
    expect(subbranches.length, `Sous-branches absentes pour ${profession}`).toBeGreaterThan(0);
    for (const sub of subbranches) {
      await page.locator('#prest').selectOption({ label: sub });
      await expect(page.locator('#prest')).toHaveValue(await page.locator('#prest').inputValue());
    }
  }

  // Complete the practical PRO flow with travel, other cost, material, machine and every waste family.
  await page.locator('#entreprise').fill('Recette EcoPro');
  await page.locator('#client').fill('Client recette');
  await page.locator('#qty').fill('25');
  await page.locator('#hours').fill('4');
  await page.locator('#rate').fill('25');
  await page.locator('#travel').fill('30');
  await page.locator('#other').fill('20');
  await page.locator('#margin').fill('35');
  await page.locator('#vat').fill('20');
  await page.locator('#mn').fill('Fourniture test');
  await page.locator('#mq').fill('3');
  await page.locator('#mp').fill('12');
  await page.getByRole('button', { name: 'Ajouter', exact: true }).nth(0).click();
  await expect(page.locator('#ml .item')).toHaveCount(1);

  await page.locator('#tn').selectOption({ index: 0 });
  await page.locator('#th').fill('2');
  await page.getByRole('button', { name: 'Ajouter', exact: true }).nth(1).click();
  await expect(page.locator('#tl .item')).toHaveCount(1);

  const wasteTypes = await page.locator('#wt option').evaluateAll(opts => opts.map(o => o.value));
  expect(wasteTypes.length).toBeGreaterThanOrEqual(10);
  for (const type of wasteTypes) {
    await page.locator('#wt').selectOption(type);
    await page.locator('#wmode').selectOption('dimensions');
    await page.locator('#wl').fill('2');
    await page.locator('#ww').fill('1');
    await page.locator('#wh').fill('0.5');
    await page.getByRole('button', { name: 'Calculer le volume' }).click();
    await expect(page.locator('#wvol')).toHaveText('1.00 m³');
    await page.getByRole('button', { name: 'Ajouter au chiffrage' }).click();
  }
  await expect(page.locator('#wlst .item')).toHaveCount(wasteTypes.length);

  await page.locator('#sort').check();
  await page.locator('#reuse').check();
  await page.locator('#grind').check();
  await page.locator('#opt').check();
  await page.getByRole('button', { name: 'Calculer le prix' }).click();
  await expect(page.locator('#res')).toBeVisible();
  await expect(page.locator('#cost')).not.toHaveText('');
  await expect(page.locator('#me')).not.toHaveText('');
  await expect(page.locator('#mr')).not.toHaveText('');
  await expect(page.locator('#ht')).not.toHaveText('');
  await expect(page.locator('#ttc')).not.toHaveText('');
  await page.screenshot({ path: 'test-results/pro-result-final.png', fullPage: true });

  // Devis flow and print layout.
  await page.getByRole('button', { name: 'Préparer le devis' }).click();
  await expect(page.locator('#devis')).toBeVisible();
  await expect(page.locator('#quote')).toContainText('DEVIS');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#quote')).toBeVisible();
  await page.screenshot({ path: 'test-results/devis-print-final.png', fullPage: true });
  await page.emulateMedia({ media: 'screen' });

  // Particulier: principal controls and a second real estimate.
  await go(page, 'particulier');
  await page.locator('#pf').selectOption({ index: 0 });
  expect(await page.locator('#ps option').count()).toBeGreaterThan(0);
  await page.locator('#pq').fill('30');
  await page.locator('#pd').selectOption('Moyenne');
  await page.getByRole('button', { name: "Obtenir l'estimation" }).click();
  await expect(page.locator('#pr')).toBeVisible();

  // Partners and ecology remain reachable from the real navigation.
  await go(page, 'eco');
  await expect(page.locator('#eco')).toBeVisible();
  await expect(page.locator('#partnerNav')).toBeVisible();
  await page.locator('#partnerNav').click();
  await expect(page.locator('#partnersPage')).toBeVisible();

  expect(errors).toEqual([]);
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
