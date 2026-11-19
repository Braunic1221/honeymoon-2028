import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('from first visit to preferences, ratings, editable route, budget and portable file', async ({page,isMobile}) => {
  const activate = locator => isMobile ? locator.tap() : locator.click();
  const errors = [];
  page.on('pageerror',error => errors.push(error.message));
  await page.goto('./');
  await expect(page.getByRole('heading',{name:/Die Welt wartet/})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width);
  await activate(page.getByRole('link',{name:'Beratung starten'}));
  await activate(page.getByText('Strand',{exact:true}));
  await activate(page.getByText('Schnorcheln',{exact:true}));
  await page.getByLabel('Hotelstandard').selectOption('Luxus');
  await page.getByLabel(/Zielbudget/).fill('6500');
  await activate(page.getByRole('button',{name:'Passende Reiseideen ansehen'}));
  const title = page.locator('#idea-title');
  const first = await title.innerText();
  await expect(page.locator('.recommendation img')).toHaveJSProperty('complete',true);
  expect(await page.locator('.recommendation img').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await activate(page.getByRole('button',{name:'Nicht unser Ding – nächste Idee'}));
  await expect(title).not.toHaveText(first);
  await page.reload();
  await expect(title).not.toHaveText(first);
  await activate(page.getByRole('button',{name:'Gefällt uns'}));
  await expect(page.getByText('Eure Favoriten · 1')).toBeVisible();
  await activate(page.getByRole('link',{name:/Auswahl fertig/}));
  await activate(page.getByRole('button',{name:'Route erstellen'}));
  await expect(page.getByRole('img',{name:/Weltkarte/})).toBeVisible();
  await page.getByLabel('Weiteren Ort auswählen').selectOption('azoren');
  await page.getByRole('button',{name:'Stopp hinzufügen'}).click();
  await page.getByRole('button',{name:'Stopp 2 nach oben'}).click();
  await expect(page.getByRole('heading',{name:'1. Ponta Delgada'})).toBeVisible();
  await page.getByLabel('Stopp 2 austauschen').selectOption('madeira');
  await page.getByLabel('Nächte an Stopp 2').fill('5');
  await page.getByLabel(/Aktivitäten an Stopp 2/).fill('Unser Bootstag');
  await page.getByText('Tagesplan',{exact:true}).click();
  await expect(page.locator('#schedule')).toContainText('Unser Bootstag');
  await page.getByRole('button',{name:'Stopp 1 entfernen'}).click();
  await expect(page.getByRole('heading',{name:'1. Funchal'})).toBeVisible();
  await page.getByRole('link',{name:'Zum Budget'}).click();
  const total = page.locator('#grand-total');
  const baseline = await total.innerText();
  const mini = page.locator('.budget-grid section').filter({hasText:'Mini-Moon'});
  await mini.getByLabel('Unterkünfte (%)').fill('170');
  await expect(total).not.toHaveText(baseline);
  const adjusted = await total.innerText();
  await page.reload();
  await expect(total).toHaveText(adjusted);
  await page.getByRole('link',{name:'Varianten',exact:true}).click();
  await page.getByLabel('Name der Reisevariante').fill('Mini-Moon auf Madeira');
  await page.getByRole('button',{name:'Aktuellen Plan als Variante speichern'}).click();
  await expect(page.getByRole('article',{name:'Mini-Moon auf Madeira'})).toContainText('Funchal');
  await page.getByRole('link',{name:'Speichern',exact:true}).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button',{name:'Planung exportieren'}).click();
  const download = await downloadPromise;
  const bytes = await readFile(await download.path());
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByLabel(/JSON-Datei auswählen/).setInputFiles({name:download.suggestedFilename(),mimeType:'application/json',buffer:bytes});
  await page.getByRole('button',{name:/Importieren und aktuellen Plan ersetzen/}).click();
  await expect(page.getByText('Planung erfolgreich importiert.')).toBeVisible();
  await page.goto('./#varianten');
  await expect(page.getByRole('article',{name:'Mini-Moon auf Madeira'})).toContainText('Funchal');
  await page.goto('./#profil');
  await expect(page.getByRole('checkbox',{name:'Strand',exact:true})).toBeChecked();
  await expect(page.getByLabel('Hotelstandard')).toHaveValue('Luxus');
  await page.goto('./#budget');
  await expect(total).toHaveText(adjusted);
  expect(errors).toEqual([]);
});

test('December suggestions create a separate Patagonia and beach itinerary',async ({page}) => {
  await page.goto('./');
  await page.locator('[data-trip="grand"]').click();
  await expect(page.getByRole('button',{name:'Große Flitterwochen'})).toHaveAttribute('aria-pressed','true');
  await page.getByText('Wildlife',{exact:true}).click();
  await page.getByRole('button',{name:'Natur-Etappe planen',exact:true}).click();
  await expect(page.getByLabel('Wanderregion und Route')).toHaveValue('patagonia');
  await page.getByRole('button',{name:'Weiter zur Strand-Etappe'}).click();
  await expect(page.getByRole('heading',{name:'Etappe 2 · Strand'})).toBeVisible();
  await page.getByRole('button',{name:'Gefällt uns'}).click();
  await page.getByRole('link',{name:/Auswahl fertig/}).click();
  await page.getByRole('button',{name:'Route erstellen'}).click();
  await expect(page.getByRole('heading',{name:'1. El Calafate'})).toBeVisible();
  await expect(page.getByRole('heading',{name:/Puerto Natales/})).toBeVisible();
  await expect(page.locator('time[datetime="2028-12-25"]')).toBeVisible();
  await page.getByRole('button',{name:'Mini-Moon',exact:true}).click();
  await expect(page.getByRole('link',{name:'Zu den Reiseideen'})).toBeVisible();
});

test('both trips can compare more than two favorites and resume collecting', async ({page,isMobile}) => {
  const activate = locator => isMobile ? locator.tap() : locator.click();
  await page.goto('./#ideen');
  for (const trip of ['Mini-Moon','Große Flitterwochen']) {
    await activate(page.getByRole('button',{name:trip,exact:true}));
    if (trip === 'Große Flitterwochen') {
      await activate(page.getByRole('link',{name:'Natur-Etappe planen',exact:true}));
      await activate(page.getByRole('button',{name:'Weiter zur Strand-Etappe'}));
    }
    const names = [];
    for (let i = 0; i < 3; i++) {
      names.push(await page.locator('#idea-title').innerText());
      await activate(page.getByRole('button',{name:'Gefällt uns'}));
    }
    expect(new Set(names).size).toBe(3);
    await expect(page.getByRole('heading',{name:'Eure Favoriten · 3'})).toBeVisible();
    await expect(page.locator('#idea-title')).toBeVisible();
    await activate(page.getByRole('link',{name:/Auswahl fertig/}));
    await page.reload();
    const cards = page.locator('.comparison-card');
    await expect(cards).toHaveCount(3);
    for (const name of names) {
      const card = page.getByRole('article',{name,exact:true});
      await expect(card).toContainText('Reisezeit');
      await expect(card).toContainText('€');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width);
    await activate(page.getByRole('link',{name:'Weitere Reiseideen ansehen'}));
  }
});

test('December catalog has more than 20 ideas and supports a custom two-island itinerary', async ({page,isMobile}) => {
  const activate = locator => isMobile ? locator.tap() : locator.click();
  await page.goto('./#ideen');
  await activate(page.getByRole('button',{name:'Große Flitterwochen',exact:true}));
  await activate(page.getByRole('link',{name:'Natur-Etappe planen',exact:true}));
  await activate(page.getByRole('button',{name:'Weiter zur Strand-Etappe'}));
  await expect(page.getByText(/24 offene Ideen/)).toBeVisible();
  await activate(page.getByRole('button',{name:'Nicht unser Ding – nächste Idee'}));
  await expect(page.getByText(/23 offene Ideen/)).toBeVisible();
  await activate(page.getByRole('button',{name:'Dezemberroute selbst zusammenstellen'}));
  await expect(page.getByRole('heading',{name:/El Calafate/})).toBeVisible();
  for (const place of ['sanandres','providencia']) {
    await page.getByLabel('Weiteren Ort auswählen').selectOption(place);
    await activate(page.getByRole('button',{name:'Stopp hinzufügen'}));
  }
  await expect(page.getByRole('heading',{name:'4. San Andrés'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'5. Providencia'})).toBeVisible();
  await expect(page.locator('#schedule')).toContainText('begrenztes Freigepäck');
  await page.reload();
  await expect(page.getByRole('heading',{name:'5. Providencia'})).toBeVisible();
});

test('builds and saves two December options, then reloads the first with its settings', async ({page,isMobile}) => {
  const activate = locator => isMobile ? locator.tap() : locator.click();
  await page.goto('./#profil');
  await activate(page.getByRole('button',{name:'Große Flitterwochen',exact:true}));
  await activate(page.getByRole('button',{name:'Natur-Etappe planen',exact:true}));
  await page.getByLabel('Tage für die gesamte Reise').fill('23');
  await page.getByLabel('Nächte in El Chaltén').fill('4');
  await activate(page.getByText('Bootsfahrt am Gletscher',{exact:true}));
  await activate(page.getByRole('button',{name:'Weiter zur Strand-Etappe'}));
  await activate(page.getByText('Strandziel direkt auswählen',{exact:true}));
  await page.getByRole('combobox',{name:'Strandziel',exact:true}).selectOption('belize');
  await activate(page.getByRole('button',{name:'Gesamtroute für dieses Ziel erstellen'}));
  await expect(page.locator('#route-summary')).toContainText('23 Tage insgesamt');
  await expect(page.getByLabel('Nächte an Stopp 2')).toHaveValue('4');
  await expect(page.getByLabel(/Aktivitäten an Stopp 1/)).not.toHaveValue(/Bootsfahrt am Gletscher/);
  await activate(page.getByRole('link',{name:'Als Variante speichern'}));
  await page.getByLabel('Name der Reisevariante').fill('Patagonien & Belize');
  await activate(page.getByRole('button',{name:'Aktuellen Plan als Variante speichern'}));
  const first = page.getByRole('article',{name:'Patagonien & Belize'});
  await expect(first).toContainText('23 Tage');
  await expect(first).toContainText('San Pedro');
  await expect(first).toContainText('€');
  await activate(page.getByRole('button',{name:'Neue Beratung starten'}));
  await activate(page.getByRole('button',{name:'Natur-Etappe planen',exact:true}));
  await page.getByLabel('Wanderregion und Route').selectOption('canada');
  await expect(page.getByText(/gefrorene Seen/)).toBeVisible();
  await activate(page.getByRole('button',{name:'Weiter zur Strand-Etappe'}));
  await activate(page.getByText('Strandziel direkt auswählen',{exact:true}));
  await page.getByRole('combobox',{name:'Strandziel',exact:true}).selectOption('halfmoon');
  await activate(page.getByRole('button',{name:'Gesamtroute für dieses Ziel erstellen'}));
  await expect(page.locator('#schedule')).toContainText('Calgary');
  await activate(page.getByRole('link',{name:'Als Variante speichern'}));
  await page.getByLabel('Name der Reisevariante').fill('Kanada & Kalifornien');
  await activate(page.getByRole('button',{name:'Aktuellen Plan als Variante speichern'}));
  await page.reload();
  await expect(page.getByRole('article',{name:'Kanada & Kalifornien'})).toContainText('Half Moon Bay');
  await activate(first.getByRole('button',{name:'Variante laden'}));
  await expect(page.locator('#route-summary')).toContainText('23 Tage insgesamt');
  await expect(page.getByRole('heading',{name:/San Pedro/})).toBeVisible();
});
