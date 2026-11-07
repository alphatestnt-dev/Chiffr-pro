// Browser regression suite for the current integrated ChiffrecoPro interface.
const { test, expect } = require('@playwright/test');
const url='http://127.0.0.1:4173/index.html';
async function openFresh(page){
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>localStorage.clear());
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('#accueil')).toBeVisible();
 await expect(page.locator('#pro')).toHaveCount(1);
 await expect(page.locator('#factures-pro')).toHaveCount(1);
}
async function go(page,id){
 const nav=page.locator('nav[aria-label="Navigation principale"]');
 const b=nav.locator(`button[data-p="${id}"]`);
 await expect(b).toBeVisible();
 await b.click();
 await expect(page.locator(`#${id}`)).toBeVisible();
}
async function openPro(page){await go(page,'pro');await expect(page.locator('#priceReferenceApply')).toBeVisible()}

test('integrated home navigation and primary destinations',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await openFresh(page);
 await expect(page.locator('.home img')).toHaveAttribute('src','25885_proper.png');
 const nav=page.locator('nav[aria-label="Navigation principale"]');
 for(const id of ['accueil','pro','particulier','catalogue','devis','factures-pro','historique','eco','ecologie','aides','offre','param'])await expect(nav.locator(`button[data-p="${id}"]`)).toBeVisible();
 for(const id of ['pro','particulier','factures-pro','eco','aides','param','accueil'])await go(page,id);
 await page.evaluate(()=>window.go('catalogue'));await expect(page.locator('#catalogue')).toBeVisible();
 await page.evaluate(()=>window.go('devis'));await expect(page.locator('#devis')).toBeVisible();
 await page.evaluate(()=>window.go('historique'));await expect(page.locator('#historique')).toBeVisible();
 expect(errors).toEqual([]);
});
test('mobile and desktop layouts have no page-level horizontal overflow',async({page})=>{
 await openFresh(page);
 for(const size of [{width:1280,height:900},{width:390,height:844}]){
  await page.setViewportSize(size);
  for(const id of ['pro','particulier','catalogue','devis','factures-pro','factures-particulier','historique','eco','aides','param']){
   await page.evaluate(id=>window.go(id),id);await expect(page.locator(`#${id}`)).toBeVisible();
   const dims=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
   expect(dims.sw).toBeLessThanOrEqual(dims.cw+1);
  }
 }
});

test('professional materials, machines and waste are included and removable',async({page})=>{
 await openFresh(page);await openPro(page);
 await page.locator('#qty').fill('500');await page.locator('#unitPrice').fill('2');
 await page.locator('#hours').fill('0');
 await page.locator('#mn').fill('Terreau');await page.locator('#mq').fill('2');await page.locator('#mp').fill('15');
 await page.getByRole('button',{name:'Ajouter le matériau'}).click();
 await expect(page.locator('#mt')).toContainText('30');
 await page.locator('#tn').selectOption({label:'Débroussailleuse à bras / épareuse'});
 await page.locator('#th').fill('1');await expect(page.locator('#tc')).toHaveValue('25.60');
 await page.getByRole('button',{name:'Ajouter',exact:true}).first().click();
 await page.locator('#wv').fill('1');await expect(page.locator('#wvol')).toContainText('1.00 m³');
 await page.getByRole('button',{name:'Ajouter au chiffrage'}).click();
 await page.getByRole('button',{name:'Calculer le prix'}).click();
 await expect(page.locator('#ht')).toContainText('1 125,60');
 await page.locator('#ml button').click();
 await expect(page.locator('#ht')).toContainText('1 095,60');
 await page.locator('#tl button').click();
 await expect(page.locator('#ht')).toContainText('1 070,00');
 await page.locator('#wlst button').click();
 await expect(page.locator('#ht')).toContainText('1 000,00');
 await page.locator('#unitPrice').fill('0');await page.getByRole('button',{name:'Calculer le prix'}).click();
 await expect(page.locator('#res')).toHaveClass(/hide/);
 await expect(page.locator('#warn')).toContainText('Aucun prix ou coût positif');
});

test('zero labor and zero lines are omitted from quote and invoice; totals match',async({page})=>{
 await openFresh(page);await openPro(page);
 await page.locator('#client').fill('Client QA');
 await page.locator('#qty').fill('500');await page.locator('#unit').selectOption({label:'m²'});await page.locator('#unitPrice').fill('2');
 await page.locator('#hours').fill('0');await page.locator('#rate').fill('16');await page.locator('#margin').fill('0');await page.locator('#vat').fill('0');
 await page.getByRole('button',{name:'Calculer le prix'}).click();await expect(page.locator('#ht')).toContainText('1 000,00');
 await page.getByRole('button',{name:'📄 Préparer le devis'}).click();
 await expect(page.locator('#quote')).toContainText('500 m² × 2,00');
 await expect(page.locator('#quote')).not.toContainText('Main-d’œuvre');
 await expect(page.locator('#quote .line')).toHaveCount(3);
 await page.getByRole('button',{name:'Accepter le devis'}).click();
 await page.getByRole('button',{name:'Transformer en facture'}).click();
 await expect(page.locator('#factures-pro')).toBeVisible();
 await expect(page.locator('#ce-invoice-preview')).toContainText('FACTURE');
 await expect(page.locator('#ce-invoice-preview')).toContainText('1 000,00');
 await expect(page.locator('#ce-invoice-preview')).not.toContainText('Main-d’œuvre');
 await expect(page.locator('#ce-invoice-preview .line')).toHaveCount(3);
 await expect(page.locator('#invoiceProList .item')).toHaveCount(1);
 await page.evaluate(()=>{window.__cePrintCalled=false;window.print=()=>{window.__cePrintCalled=true}});
 await page.locator('#ce-invoice-preview [data-print]').click();
 expect(await page.evaluate(()=>window.__cePrintCalled)).toBeTruthy();
 await page.evaluate(()=>window.go('devis'));await page.getByRole('button',{name:'Transformer en facture'}).click();
 await expect(page.locator('#invoiceProList .item')).toHaveCount(1);
 await page.reload({waitUntil:'networkidle'});await go(page,'factures-pro');
 await expect(page.locator('#invoiceProList .item')).toHaveCount(1);
});

test('empty or negative-only chiffrage cannot create a zero-euro quote or invoice',async({page})=>{
 await openFresh(page);await openPro(page);
 await page.locator('#hours').fill('0');await page.locator('#rate').fill('0');await page.locator('#unitPrice').fill('0');
 await page.locator('#travel').fill('-10');await page.locator('#other').fill('-20');
 await page.getByRole('button',{name:'Calculer le prix'}).click();
 await expect(page.locator('#res')).toHaveClass(/hide/);
 await expect(page.locator('#warn')).toContainText('Aucun prix ou coût positif');
 page.once('dialog',d=>d.accept());
 await page.getByRole('button',{name:'📄 Préparer le devis'}).click();
 await expect(page.locator('#pro')).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('ce_quotes')||'[]').length)).toBe(0);
});

test('barometer is advisory and never changes the artisan hourly rate or total',async({page})=>{
 await openFresh(page);await openPro(page);
 await page.locator('#hours').fill('2');await page.locator('#rate').fill('30');
 await page.locator('#etat').selectOption({label:'Accès difficile'});
 await expect(page.locator('#ceBaroHours')).toContainText('2');
 await page.getByRole('button',{name:'Calculer le prix'}).click();
 await expect(page.locator('#ht')).toContainText('60,00');
 await expect(page.locator('#rate')).toHaveValue('30');
 await page.getByRole('button',{name:'📄 Préparer le devis'}).click();
 await expect(page.locator('#quote')).toContainText('2 h × 30,00');
 await expect(page.locator('#quote')).toContainText('60,00');
});

test('private estimate refuses zero and unsupported tariffs instead of displaying invented zero prices',async({page})=>{
 await openFresh(page);await go(page,'particulier');
 await page.locator('#pq').fill('0');await page.getByRole('button',{name:"Obtenir l'estimation"}).click();
 await expect(page.locator('#pr')).toHaveClass(/hide/);
 await expect(page.locator('#detail')).toContainText('supérieure à zéro');
 await page.locator('#pq').fill('500');await page.locator('#pf').selectOption({label:'Espaces verts'});
 await page.locator('#ps').selectOption({label:'Tonte'});await page.locator('#pu').selectOption({label:'m²'});
 await page.getByRole('button',{name:"Obtenir l'estimation"}).click();
 await expect(page.locator('#pr')).toBeVisible();await expect(page.locator('#range')).toContainText('45,00');
 await page.locator('#pf').selectOption({label:'Plomberie'});
 await page.getByRole('button',{name:"Obtenir l'estimation"}).click();
 await expect(page.locator('#pr')).toHaveClass(/hide/);
 await expect(page.locator('#detail')).toContainText('Aucune référence tarifaire');
});

test('landscape reference is optional and follows the area band',async({page})=>{
 await openFresh(page);await openPro(page);
 await page.locator('#metier').selectOption({label:'Espaces verts'});
 await page.locator('#prest').selectOption({label:'Tonte'});
 await page.locator('#qty').fill('500');await expect(page.locator('#priceReferenceApply')).toBeEnabled();
 await expect(page.locator('#unitPrice')).toHaveValue('0');
 await page.locator('#priceReferenceApply').click();await expect(page.locator('#unitPrice')).toHaveValue('0.09');
 await page.locator('#qty').fill('10000');await expect(page.locator('#priceReferenceInfo')).toContainText('0,07');
});

test('PWA reload and no uncaught browser errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await openFresh(page);await page.reload({waitUntil:'networkidle'});
 await expect(page.locator('#accueil')).toBeVisible();
 expect(errors).toEqual([]);
});

test('VAT and margin stay at zero by default and calculate correctly when entered',async({page})=>{
 await openFresh(page);await openPro(page);
 await expect(page.locator('#margin')).toHaveValue('0');
 await expect(page.locator('#vat')).toHaveValue('0');
 await page.locator('#qty').fill('1');await page.locator('#unitPrice').fill('100');
 await page.locator('#margin').fill('10');await page.locator('#vat').fill('20');
 await page.getByRole('button',{name:'Calculer le prix'}).click();
 await expect(page.locator('#ht')).toContainText('111,11');
 await expect(page.locator('#ttc')).toContainText('133,33');
 await page.getByRole('button',{name:'📄 Préparer le devis'}).click();
 await expect(page.locator('#quote')).toContainText('TVA 20%');
 await expect(page.locator('#quote')).toContainText('133,33');
});

test('hours entered with zero hourly rate are blocked instead of silently omitted',async({page})=>{
 await openFresh(page);await openPro(page);
 await page.locator('#hours').fill('3');await page.locator('#rate').fill('0');
 await page.getByRole('button',{name:'Calculer le prix'}).click();
 await expect(page.locator('#res')).toHaveClass(/hide/);
 await expect(page.locator('#warn')).toContainText('taux horaire est à zéro');
});

test('reset clears every hidden cost array and restores zero defaults',async({page})=>{
 await openFresh(page);await openPro(page);
 await page.locator('#mn').fill('Terreau');await page.locator('#mq').fill('1');await page.locator('#mp').fill('8');
 await page.getByRole('button',{name:'Ajouter le matériau'}).click();
 await page.locator('#tn').selectOption({label:'Débroussailleuse à bras / épareuse'});
 await page.locator('#th').fill('1');await page.getByRole('button',{name:'Ajouter',exact:true}).first().click();
 await page.locator('#wv').fill('1');await page.getByRole('button',{name:'Ajouter au chiffrage'}).click();
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Réinitialiser'}).click();
 await expect(page.locator('#ml')).toContainText('Aucun matériau ajouté');
 await expect(page.locator('#tl')).toContainText('Aucun outil');
 await expect(page.locator('#wlst')).toContainText('Aucune évacuation');
 await expect(page.locator('#hours')).toHaveValue('0');
 await expect(page.locator('#margin')).toHaveValue('0');
 await expect(page.locator('#vat')).toHaveValue('0');
 await page.getByRole('button',{name:'Calculer le prix'}).click();
 await expect(page.locator('#res')).toHaveClass(/hide/);
 await expect(page.locator('#warn')).toContainText('Aucun prix ou coût positif');
});
