import { activities, destinations, hotels, interests, places, trips } from './catalog.js';
import { allowedPlaces, blankPlan, calendar, compareFavorites, estimate, euro, labels, makeAdventure, makeStop, rank, readPlan, routes, starterRoute } from './model.js';
import { routeMap } from './map.js';
import { naturePresets } from './nature.js';

const storageKey = 'honeymoon-studio-2028';
const app = document.querySelector('#workspace');
const views = { profil:'Kennenlernen', natur:'Natur-Etappe', ideen:'Reiseideen', vergleich:'Vergleich', route:'Reiseplan', budget:'Budget', varianten:'Varianten', speichern:'Speichern' };
const status = document.querySelector('#status');
let plan = blankPlan();
let storageWarning = '';
try {
  const saved = localStorage.getItem(storageKey);
  if (saved) plan = readPlan(saved);
} catch {
  storageWarning = 'Die gespeicherte Planung konnte nicht geladen werden. Eine Sicherungsdatei lässt sich unter „Speichern“ importieren.';
}

const escape = (value = '') => String(value).replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const selected = (value, expected) => value === expected ? ' selected' : '';
const options = (items,value) => items.map(item => `<option${selected(item,value)}>${escape(item)}</option>`).join('');
const dateFormat = new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'});
const active = () => plan.trips[plan.active];
const current = () => Object.hasOwn(views,location.hash.slice(1)) ? location.hash.slice(1) : 'start';

function persist(message) {
  try {
    localStorage.setItem(storageKey,JSON.stringify(plan));
    storageWarning = '';
    status.textContent = message || 'Planung gespeichert.';
  } catch {
    storageWarning = 'Der Browser konnte die Planung nicht speichern. Exportiert sie als Datei, um sie zu sichern.';
    status.textContent = storageWarning;
  }
  const notice = document.querySelector('#storage-warning');
  if (notice) {
    notice.textContent = storageWarning;
    notice.hidden = !storageWarning;
  }
}

function chipGroup(name, label, choices, checked) {
  return `<fieldset><legend>${label}</legend><div class="chips">${choices.map(item =>
    `<label class="chip"><input type="checkbox" name="${name}" value="${item}"${checked.includes(item) ? ' checked' : ''}><span>${item}</span></label>`).join('')}</div></fieldset>`;
}

function profile(entry) {
  const p = entry.profile;
  return `<form class="panel" id="profile-form">
    ${chipGroup('interests','Wonach steht euch der Sinn?',interests,p.interests)}
    ${chipGroup('activities','Was macht ihr gern unterwegs?',activities,p.activities)}
    <div class="two">
      <label class="field">Hotelstandard<select name="hotel">${options(hotels,p.hotel)}</select></label>
      <label class="field">Zielbudget für zwei in € (0 = offen)<input required type="number" name="budget" min="0" max="100000" step="1" value="${p.budget}"></label>
      <label class="field">Reisetempo<select name="pace">${options(['Entspannt','Ausgewogen','Aktiv'],p.pace)}</select></label>
      <label class="field">Gewünschte Unterkunftswechsel<input required type="number" name="changes" min="0" max="8" step="1" value="${p.changes}"></label>
      <label class="field">Das möchten wir unbedingt erleben<textarea name="must" maxlength="500" rows="2">${escape(p.must)}</textarea></label>
      <label class="field">Das möchten wir vermeiden<textarea name="avoid" maxlength="500" rows="2">${escape(p.avoid)}</textarea></label>
    </div>
    <button class="button" type="submit">${plan.active === 'grand' ? 'Natur-Etappe planen' : 'Passende Reiseideen ansehen'} <span class="arrow" aria-hidden="true"></span></button>
  </form>`;
}

function nature(entry) {
  const draft = entry.adventure ?? makeAdventure('patagonia');
  const preset = naturePresets[draft.preset];
  return `<form class="panel" id="nature-form">
    <div class="two">
      <label class="field">Wanderregion und Route<select name="preset" id="nature-preset">${Object.entries(naturePresets).map(([id,item]) =>
        `<option value="${id}"${selected(id,draft.preset)}>${item.name}</option>`).join('')}</select></label>
      <label class="field">Tage für die gesamte Reise<input name="target" type="number" min="20" max="25" required value="${draft.target}"></label>
    </div>
    <p><strong>An- und Weiterreise</strong> · ${preset.arrival}</p>
    <p><strong>Highlights</strong> · ${preset.highlights}</p>
    <p><strong>Dezemberbedingungen</strong> · ${preset.season}</p>
    <p class="muted">Legt die Nächte pro Ort fest. Mit 0 entfernt ihr einen Stopp. Aktivitäten wählt ihr einzeln aus.</p>
    <div class="two">${preset.route.map(([id]) => {
      const stop = draft.stops.find(item => item.place === id);
      return `<section class="stop"><h3>${places[id].name}</h3>
      <label class="field">Nächte in ${places[id].name}<input type="number" name="nights-${id}" min="0" max="15" required value="${stop?.nights ?? 0}"></label>
      ${chipGroup(`activities-${id}`,`Aktivitäten in ${places[id].name}`,places[id].experiences,stop?.activities ?? [])}</section>`;
    }).join('')}</div>
    <p id="nature-preview" class="notice" aria-live="polite">${naturePreview(entry,draft)}</p>
    <button class="button" type="submit">Weiter zur Strand-Etappe <span class="arrow" aria-hidden="true"></span></button>
  </form>`;
}

function natureFrom(form) {
  const data = new FormData(form);
  const preset = data.get('preset');
  const stops = naturePresets[preset].route.map(([place]) => ({
    place,nights:Number(data.get(`nights-${place}`)),activities:data.getAll(`activities-${place}`),
  })).filter(stop => stop.nights > 0);
  if (!stops.length || stops.reduce((sum,stop) => sum + stop.nights,0) > 15) return null;
  return {preset,target:Number(data.get('target')),stops};
}

function naturePreview(entry,draft) {
  if (!draft) return 'Plant mindestens eine und höchstens 15 Nächte in der Natur. So bleibt Zeit für Strand und Transfers.';
  const natureDays = calendar('grand',{...entry,stops:draft.stops}).length - 2;
  const total = estimate('grand',{...entry,stops:draft.stops}).total;
  return `${natureDays} Tage bis zum Ende der Natur-Etappe, einschließlich Anreise. ${draft.target - natureDays} Tage bleiben für den Wechsel, den Strandaufenthalt und die Rückreise zusammen. Vorläufige Schätzung für Natur-Etappe mit Fluganteil: ${euro(total)} für zwei.`;
}

function variants(entry) {
  const list = plan.variants[plan.active];
  return `<section class="panel">
    ${entry.stops.length ? `<form id="variant-form"><label class="field">Name der Reisevariante<input name="name" maxlength="80" required value="Reise ${list.length+1}"></label>
      <button class="button" type="submit">Aktuellen Plan als Variante speichern</button></form>` : '<p>Erstellt eine Route, um sie mit Datum, Stopps und Budget als Variante zu speichern.</p>'}
    <p><button class="button secondary" data-action="new-variant">Neue Beratung starten</button></p>
  </section>
  <div class="comparison-grid">${list.map(({name,trip},index) => `<article class="panel" aria-labelledby="variant-${index}">
    <h3 id="variant-${index}">${escape(name)}</h3>
    <p>${calendar(plan.active,trip).length} Tage · ${trip.stops.length} Stopps</p>
    <p>${trip.stops.map(stop => places[stop.place].base ?? places[stop.place].name).join(' → ')}</p>
    <p class="money">${euro(estimate(plan.active,trip).total)}</p>
    <p class="muted">Schätzung für zwei inklusive Reserve · 2028</p>
    <div class="actions"><button class="button" data-action="open-variant" data-index="${index}">Variante laden</button>
      <button class="button secondary" data-action="remove-variant" data-index="${index}">Löschen</button></div>
  </article>`).join('')}</div>`;
}

function ideas(entry) {
  if (plan.active === 'grand' && !entry.adventure) return natureFirst();
  const remaining = rank(plan.active,entry);
  const [top] = remaining;
  const ownRoute = plan.active === 'grand' ? `<div class="actions">
    <a class="button secondary" href="#natur">Natur-Etappe ändern</a>
    ${!entry.stops.length ? '<button class="button secondary" data-action="custom-grand">Dezemberroute selbst zusammenstellen</button>' : ''}</div>
    <details class="panel"><summary>Strandziel direkt auswählen</summary>
      <form id="beach-form"><label class="field">Strandziel<select name="beach">
        ${destinations.filter(item => item.trip === 'grand').sort((a,b) => a.name.localeCompare(b.name,'de')).map(item => `<option value="${item.id}">${item.name}</option>`).join('')}
        </select></label><button class="button" type="submit">Gesamtroute für dieses Ziel erstellen</button></form>
    </details>` : '';
  const summary = entry.favorites.length ? `<section class="panel favorite-summary">
    <div><h3>Eure Favoriten · ${entry.favorites.length}</h3><p class="muted">${entry.favorites.map(id => places[id].name).join(' · ')}</p></div>
    <a class="button" href="#vergleich">Auswahl fertig – Favoriten vergleichen <span class="arrow" aria-hidden="true"></span></a>
  </section>` : '';
  if (!top) return `${summary}${ownRoute}<section class="panel"><p>Ihr habt alle Vorschläge bewertet.</p>${entry.rejected.length ? '<button class="button secondary" data-action="reset-rejections">Abgelehnte Ideen erneut zulassen</button>' : ''}</section>`;
  const {d,matches,must,avoid,hotel,budget,total,days,beachNights,itinerary} = top;
  const why = [
    matches.length ? `Passt zu ${matches.join(', ')}.` : 'Nach Reisezeit und Aufwand priorisiert.',
    hotel ? `${entry.profile.hotel} passt zum Unterkunftsangebot.` : '',
    entry.profile.budget ? (budget ? 'Im Zielbudget.' : 'Über eurem Zielbudget.') : '',
    must.length ? `Stichwörter aus euren Wünschen: ${must.join(', ')}.` : '',
    avoid.length ? `Möglicher Konflikt mit euren Angaben: ${avoid.join(', ')}.` : '',
    entry.rejected.length || entry.favorites.length ? 'Eure bisherigen Bewertungen fließen in die Reihenfolge ein.' : '',
  ].filter(Boolean).join(' ');
  return `${summary}${ownRoute}<article class="panel recommendation">
    <figure><img src="${d.image}" alt="Landschaftsinspiration für ${d.name}" width="500" height="500"><figcaption>KI-Illustration · ${d.country}</figcaption></figure>
    <div class="rec-copy"><span class="token">${plan.active === 'grand' ? 'Etappe 2 · Strand' : d.country}</span>
      <h3 tabindex="-1" id="idea-title">${d.name}</h3>
      <p class="muted">${remaining.length} ${remaining.length === 1 ? 'offene Idee' : 'offene Ideen'} einschließlich dieser</p>
      ${plan.active === 'grand' ? `<p><strong>Gesamtreise · ${days} Tage</strong> · ${beachNights} Strandnächte · ${itinerary.join(' → ')}</p>` : ''}
      <p>${d.description}</p><p><strong>Dafür spricht</strong> · ${d.pro}</p><p><strong>Gut zu wissen</strong> · ${d.con}</p>
      <p><strong>Reisezeit</strong> · ${d.weather}</p><p><strong>Aktivitäten</strong> · ${d.experiences.join(' · ')}</p>
      <p><strong>${euro(total)}</strong> · Geschätzte Gesamtreise für zwei, einschließlich Reserve (2028)</p>
      <p><strong>Warum für euch?</strong> ${escape(why)}</p>
      <div class="actions"><button class="button" data-action="like" data-id="${d.id}">♡ Gefällt uns</button><button class="button secondary" data-action="reject" data-id="${d.id}">Nicht unser Ding – nächste Idee</button></div>
    </div></article>`;
}

function natureFirst() {
  return '<section class="panel"><p>Legt zuerst fest, wo und wie lange ihr wandern möchtet. Daraus berechnet das Studio passende Strand-Etappen und das Gesamtbudget.</p><a class="button" href="#natur">Natur-Etappe planen</a></section>';
}

function comparison(entry) {
  if (plan.active === 'grand' && !entry.adventure) return natureFirst();
  const favorites = compareFavorites(plan.active,entry);
  if (!favorites.length) return '<section class="panel"><p>Wählt zuerst einen Favoriten für diese Reise.</p><a class="button" href="#ideen">Zu den Reiseideen</a></section>';
  const cheapest = Math.min(...favorites.map(item => item.total));
  return `<p class="notice">Die Reihenfolge folgt eurem Profil. Klima, Budget, Interessen, Hotelwunsch und Reiseaufwand fließen in die Bewertung ein. Die Preise sind Schätzungen für zwei Personen inklusive Reserve für 2028.${plan.active === 'grand' ? ' Jeder Vorschlag enthält die gewählte Natur-Etappe, den Strandaufenthalt und alle Transfers.' : ''}</p>
    <div class="comparison-grid">${favorites.map(({d,score,matches,hotel,must,avoid,total,budget,days,changes,beachNights,itinerary}) => `<article class="panel comparison-card" aria-labelledby="compare-${d.id}">
      <img src="${d.image}" alt="Landschaftsinspiration für ${d.name}" width="500" height="500" loading="lazy">
      <div class="comparison-copy">
        <p class="eyebrow">KI-ILLUSTRATION · ${d.country}</p><h3 id="compare-${d.id}">${d.name}</h3>
        ${favorites.length > 1 ? `<div class="actions">${score === favorites[0].score ? '<span class="token">Beste Profilpassung</span>' : ''}${total === cheapest ? '<span class="token">Niedrigste Schätzung</span>' : ''}</div>` : ''}
        <p class="money">${euro(total)}</p>
        <dl>
          <dt>Budget</dt><dd>${entry.profile.budget ? (budget ? 'Im Zielbudget' : `${euro(total-entry.profile.budget)} über Zielbudget`) : 'Zielbudget offen'}</dd>
          <dt>Profilpassung</dt><dd>${matches.length ? matches.join(', ') : 'Keine direkte Übereinstimmung mit euren ausgewählten Interessen'} · ${hotel ? 'Hotelwunsch passt' : 'Andere Hotelstile im Fokus'}${must.length ? ` · Wünsche: ${escape(must.join(', '))}` : ''}${avoid.length ? ` · Möglicher Konflikt: ${escape(avoid.join(', '))}` : ''}</dd>
          <dt>Reiseverlauf</dt><dd>${days} Tage insgesamt · ${plan.active === 'grand' ? `${beachNights} Strandnächte · ` : ''}${changes} Unterkunftswechsel · ${itinerary.join(' → ')}</dd>
          <dt>Reisezeit</dt><dd>${d.weather}</dd>
          <dt>Aktivitäten</dt><dd>${d.experiences.join(' · ')}</dd>
          <dt>Dafür spricht</dt><dd>${d.pro}</dd>
          <dt>Gut zu wissen</dt><dd>${d.con}</dd>
        </dl>
        <div class="actions"><button class="button" data-action="build" data-id="${d.id}">${entry.stops.length ? 'Route mit dieser Idee neu erstellen' : 'Route erstellen'}</button><button class="button secondary" data-action="unfavorite" data-id="${d.id}" aria-label="${d.name} aus Favoriten entfernen">Entfernen</button></div>
      </div></article>`).join('')}</div>
    <a class="button secondary" href="#ideen">Weitere Reiseideen ansehen</a>`;
}

function placeOptions(value) {
  return allowedPlaces(plan.active).map(id => `<option value="${id}"${selected(id,value)}>${places[id].base ?? places[id].name} · ${places[id].country}</option>`).join('');
}

function routeSummary(entry) {
  return `${calendar(plan.active,entry).length} Tage insgesamt · ${entry.stops.length - 1} Unterkunftswechsel · Ziel ${entry.adventure ? `${entry.adventure.target} Tage` : trips[plan.active].duration}`;
}

function timeline(entry) {
  return calendar(plan.active,entry).map(day => `<li><time datetime="${day.date}">${dateFormat.format(new Date(day.date+'T12:00:00Z'))}</time> · <strong>${escape(day.title)}</strong><br>${escape(day.detail)}</li>`).join('');
}

function durationNote(entry) {
  const days = calendar('grand',entry).length;
  if (days < 20 || days > 25) return `Die aktuelle Route dauert ${days} Tage. Passt Nächte oder Stopps an, um auf 20–25 Tage insgesamt zu kommen.`;
  return 'Die Gesamtdauer liegt im Rahmen von 20–25 Tagen, einschließlich Flügen und Transfers.';
}

function route(entry) {
  if (!entry.stops.length) return plan.active === 'grand' && !entry.adventure ? natureFirst() :
    '<section class="panel"><p>Sammelt unter Reiseideen Favoriten und erstellt im Vergleich eure Route.</p><a class="button" href="#ideen">Zu den Reiseideen</a></section>';
  const changes = entry.stops.length - 1;
  return `<div class="two">
    <section class="panel"><h3>Eure Stopps</h3><p class="muted" id="route-summary">${routeSummary(entry)}</p>
    ${changes > entry.profile.changes ? '<p class="notice">Diese Route hat mehr Unterkunftswechsel, als ihr im Profil angegeben habt.</p>' : ''}
    ${plan.active === 'grand' ? `<p class="notice" id="grand-duration" aria-live="polite">${durationNote(entry)}</p>` : ''}
    <label class="field">Abreisedatum<input data-change="start" type="date" min="2028-01-01" max="2028-12-31" value="${entry.start}" required></label>
    <div>${entry.stops.map((stop,i) => `<section class="stop">
      <div class="stop-head"><h3>${i+1}. ${places[stop.place].base ?? places[stop.place].name}</h3><div class="actions">
        <button class="button secondary" data-action="up" data-index="${i}" aria-label="Stopp ${i+1} nach oben"${i === 0 ? ' disabled' : ''}><span class="arrow up" aria-hidden="true"></span></button>
        <button class="button secondary" data-action="down" data-index="${i}" aria-label="Stopp ${i+1} nach unten"${i === changes ? ' disabled' : ''}><span class="arrow down" aria-hidden="true"></span></button>
        <button class="button secondary" data-action="remove" data-index="${i}" aria-label="Stopp ${i+1} entfernen">×</button>
      </div></div>
      <label class="field">Stopp ${i+1} austauschen<select data-change="place" data-index="${i}">${placeOptions(stop.place)}</select></label>
      <label class="field">Nächte an Stopp ${i+1}<input type="number" min="1" max="30" required value="${stop.nights}" data-change="nights" data-index="${i}"></label>
      <label class="field">Aktivitäten an Stopp ${i+1} · bis zu 12, eine pro Zeile<textarea rows="3" maxlength="6000" data-change="activities" data-index="${i}">${escape(stop.activities.join('\n'))}</textarea></label>
    </section>`).join('')}</div>
    <form id="stop-form">${plan.active === 'grand' ? '<p class="muted">Wählt weitere Natur- oder Strandstopps. Die Nächte und Reihenfolge könnt ihr anschließend ändern.</p>' : ''}<label class="field">Weiteren Ort auswählen<select name="place">${placeOptions()}</select></label><button class="button secondary" type="submit"${entry.stops.length >= 9 ? ' disabled' : ''}>Stopp hinzufügen</button></form></section>
    <section class="panel"><h3>Route auf der Karte</h3>${routeMap(entry.stops)}
    <p class="muted">Vereinfachte Geografie. Die Linien verbinden Stopps in Reise-Reihenfolge. Umstiege stehen im Tagesplan.</p>
    <h3>Tagesplan</h3><ol id="schedule" class="schedule">${timeline(entry)}</ol>
    <div class="actions"><a class="button" href="#budget">Zum Budget</a><a class="button secondary" href="#varianten">Als Variante speichern</a></div></section></div>`;
}

function budget() {
  return `<p class="notice">Planungsschätzungen für zwei Personen in Euro, Prognose für 2028. Flüge gehen ab Mitteleuropa aus. Eingaben sind Prozentwerte der Modellkosten, die Reserve bezieht sich auf die Zwischensumme.</p>
  <div class="budget-grid">${routes.map(key => `<section class="panel"><h3>${trips[key].name}</h3>
    ${plan.trips[key].stops.length ? '' : '<p class="muted">Erstellt zuerst eine Route, um Schätzwerte zu erhalten.</p>'}
    ${Object.entries(labels).map(([id,label]) => `<div class="two"><label class="field">${label} (%)<input required type="number" min="0" max="${id === 'reserve' ? 100 : 300}" step="1" value="${plan.trips[key].rates[id]}" data-rate="${id}" data-key="${key}"></label><output class="money" id="cost-${key}-${id}"></output></div>`).join('')}
    <p><strong>Reisesumme</strong><br><output class="money" id="total-${key}"></output></p><p id="target-${key}" class="muted"></p><button class="button secondary" data-action="show-variants" data-id="${key}">Varianten öffnen</button></section>`).join('')}</div>
    <div class="panel"><h3>Gesamt für beide Reisen</h3><output class="money" id="grand-total" aria-live="polite"></output></div>`;
}

function updateTotals() {
  let sum = 0;
  for (const key of routes) {
    const entry = plan.trips[key];
    const {items,total} = estimate(key,entry);
    for (const [id,amount] of Object.entries(items)) document.getElementById(`cost-${key}-${id}`).textContent = euro(amount);
    document.getElementById(`total-${key}`).textContent = euro(total);
    document.getElementById(`target-${key}`).textContent = entry.profile.budget ?
      `Zielbudget ${euro(entry.profile.budget)}${total > entry.profile.budget ? ` · ${euro(total-entry.profile.budget)} darüber` : ''}` : 'Zielbudget offen';
    sum += total;
  }
  document.getElementById('grand-total').textContent = euro(sum);
}

function files() {
  return `<section class="panel"><h3>Euer Plan, immer griffbereit</h3>
    <p>Das Studio speichert automatisch in diesem Browser. Mit einer JSON-Datei könnt ihr euren Plan sichern oder auf einem anderen Gerät öffnen.</p>
    <div class="actions"><button class="button" data-action="export">Planung exportieren</button></div>
    <form id="import-form"><label class="field">Gespeicherte JSON-Datei auswählen<input required type="file" accept=".json,application/json" name="plan"></label>
      <button class="button secondary" type="submit">Importieren und aktuellen Plan ersetzen</button></form>
    <p id="file-message" role="status"></p>
  </section>`;
}

const intros = {
  profil:['Was passt zu euch?', 'Erzählt uns, wie ihr reisen möchtet. Eure Antworten gelten für die ausgewählte Reise.'],
  natur:['Etappe 1 · Wandern und Natur', 'Wählt eine Patagonien-Route oder eine Alternative. Insgesamt habt ihr 20–25 Tage für beide Etappen und alle Transfers.'],
  ideen:['Eure Reiseideen', 'Sammelt so viele Favoriten, wie ihr möchtet. Ihr entscheidet, wann ihr sie vergleicht.'],
  vergleich:['Eure Favoriten im Vergleich', 'Vergleicht eure Auswahl und wählt eine Idee als Basis für eure Route.'],
  route:['Euer Reiseverlauf', 'Gestaltet Stopps, Nächte und Aktivitäten nach eurem Rhythmus.'],
  budget:['Euer Reisebudget', 'Passt die Kalkulation für jede Reise an.'],
  varianten:['Eure Reisevarianten', 'Sichert konkrete Routen mit Budget und vergleicht eure gespeicherten Optionen.'],
  speichern:['Eure Planung sichern', 'Exportiert oder importiert eure gesamte Planung.'],
};

function render(focus = false) {
  const view = current();
  if (view === 'natur' && plan.active !== 'grand') { location.hash = 'profil'; return; }
  document.querySelector('#main').hidden = view !== 'start';
  document.querySelector('#studio').hidden = view === 'start';
  for (const link of document.querySelectorAll('[data-nav]')) {
    const match = link.dataset.nav === view || link.dataset.nav === 'profil' && ['natur','ideen','vergleich'].includes(view);
    if (match) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }
  if (view === 'start') return;
  const content = { profil:profile,natur:nature,ideen:ideas,vergleich:comparison,route,budget,varianten:variants,speichern:files };
  const steps = Object.entries(views).filter(([id]) => id !== 'natur' || plan.active === 'grand');
  const [title,description] = view === 'ideen' && plan.active === 'grand' ?
    ['Etappe 2 · Strand', 'Die Vorschläge berücksichtigen euren gewählten Naturteil. Tage und Kosten gelten für die gesamte Reise.'] : intros[view];
  app.innerHTML = `<nav class="step-bar" aria-label="Planungsschritte">${steps.map(([id,name]) =>
    `<a href="#${id}"${id === view ? ' aria-current="step"' : ''}>${id === 'ideen' && plan.active === 'grand' ? 'Strand-Etappe' : name}</a>`).join('')}</nav>
    <p class="eyebrow"><span></span> TAMARA &amp; MARVIN · ${steps.findIndex(([id]) => id === view)+1} VON ${steps.length}</p>
    <h2 tabindex="-1" id="view-title">${title}</h2><p class="muted">${description}</p>
    <p id="storage-warning" class="notice"${storageWarning ? '' : ' hidden'}>${escape(storageWarning)}</p>
    ${['budget','speichern'].includes(view) ? '' : `<div class="actions trip-picker" aria-label="Reise auswählen">${routes.map(key =>
      `<button class="button${plan.active === key ? '' : ' secondary'}" data-action="trip" data-id="${key}" aria-pressed="${plan.active === key}">${trips[key].name}</button>`).join('')}</div>`}
    ${content[view](active())}`;
  if (view === 'budget') updateTotals();
  if (focus) {
    document.querySelector('#view-title').focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}

function saveProfile(form) {
  const data = new FormData(form);
  active().profile = {
    interests: data.getAll('interests'), activities: data.getAll('activities'), hotel: data.get('hotel'),
    budget: Number(data.get('budget')), pace: data.get('pace'), changes: Number(data.get('changes')),
    must: data.get('must'), avoid: data.get('avoid'),
  };
  persist();
}

app.addEventListener('submit',async event => {
  event.preventDefault();
  const form = event.target;
  if (form.id === 'profile-form') {
    saveProfile(form);
    location.hash = plan.active === 'grand' ? 'natur' : 'ideen';
  } else if (form.id === 'nature-form') {
    const draft = natureFrom(form);
    if (!draft) {
      document.querySelector('#nature-preview').textContent = naturePreview(active(),draft);
      document.querySelector('#nature-preview').scrollIntoView({block:'nearest'});
      return;
    }
    active().adventure = draft;
    persist('Natur-Etappe gespeichert.');
    location.hash = 'ideen';
  } else if (form.id === 'beach-form') {
    buildRoute(active(),new FormData(form).get('beach'));
  } else if (form.id === 'variant-form') {
    const name = new FormData(form).get('name').trim();
    if (!name || !active().stops.length) return;
    plan.variants[plan.active].push({name,trip:structuredClone(active())});
    persist('Reisevariante gespeichert.');
    render();
    app.querySelector('#view-title').focus({preventScroll:true});
  } else if (form.id === 'stop-form' && active().stops.length < 9) {
    active().stops.push(makeStop(new FormData(form).get('place'),2));
    persist('Stopp hinzugefügt.');
    render();
    app.querySelector(`[data-change="place"][data-index="${active().stops.length-1}"]`).focus();
  } else if (form.id === 'import-form') {
    const message = document.querySelector('#file-message');
    try {
      const file = form.elements.plan.files[0];
      if (file.size > 5000000) throw new Error('Die Datei ist zu groß.');
      plan = readPlan(await file.text());
      persist('Planung importiert.');
      form.reset();
      message.textContent = 'Planung erfolgreich importiert.';
    } catch (error) {
      message.textContent = error instanceof SyntaxError ? 'Die Datei ist kein gültiges JSON.' : error.message;
    }
  }
});

app.addEventListener('input',event => {
  const input = event.target;
  if (input.closest('#profile-form') && input.form.checkValidity()) saveProfile(input.form);
  if (input.closest('#nature-form') && input.name !== 'preset' && input.form.checkValidity()) {
    const draft = natureFrom(input.form);
    document.querySelector('#nature-preview').textContent = naturePreview(active(),draft);
    if (draft) {
      active().adventure = draft;
      persist();
    }
  }
  if (input.dataset.rate && input.validity.valid) {
    plan.trips[input.dataset.key].rates[input.dataset.rate] = input.valueAsNumber;
    persist();
    updateTotals();
  }
});

app.addEventListener('change',event => {
  const input = event.target;
  if (input.id === 'nature-preset') {
    const target = input.form.elements.target;
    active().adventure = makeAdventure(input.value,target.validity.valid ? target.valueAsNumber : active().adventure?.target);
    persist();
    render();
    app.querySelector('#nature-preset').focus({preventScroll:true});
    return;
  }
  const {change,index} = input.dataset;
  if (!change) return;
  if (!input.validity.valid) {
    input.value = change === 'start' ? active().start : active().stops[index].nights;
    return;
  }
  const entry = active();
  const stop = entry.stops[index];
  if (change === 'start') entry.start = input.value;
  if (change === 'place') entry.stops[index] = makeStop(input.value,stop.nights);
  if (change === 'nights') stop.nights = input.valueAsNumber;
  if (change === 'activities') stop.activities = input.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean).slice(0,12).map(value => value.slice(0,500));
  persist();
  if (change === 'place') {
    render();
    app.querySelector(`[data-change="place"][data-index="${index}"]`).focus({preventScroll:true});
    return;
  }
  if (change === 'activities') input.value = stop.activities.join('\n');
  document.querySelector('#route-summary').textContent = routeSummary(entry);
  if (plan.active === 'grand') document.querySelector('#grand-duration').textContent = durationNote(entry);
  document.querySelector('#schedule').innerHTML = timeline(entry);
});

function buildRoute(entry,idea) {
  if (entry.stops.length && !window.confirm('Bestehende Stopps und Aktivitäten dieser Reise durch die neue Route ersetzen?')) return;
  entry.stops = starterRoute(plan.active,idea,entry.profile,entry.adventure);
  persist('Route erstellt.');
  location.hash = 'route';
}

function keepOrReplaceDraft(entry) {
  const saved = plan.variants[plan.active].some(({trip}) => JSON.stringify(trip) === JSON.stringify(entry));
  return saved || !(entry.stops.length || entry.adventure || entry.favorites.length || entry.rejected.length) ||
    window.confirm('Die aktuelle Beratung hat noch Änderungen. Arbeitsplan ersetzen? Gespeicherte Varianten bleiben erhalten.');
}

document.addEventListener('click',event => {
  const card = event.target.closest('[data-trip]');
  if (card) {
    plan.active = card.dataset.trip;
    persist();
  }
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const {action,id,index} = button.dataset;
  const entry = active();
  const i = Number(index);
  if (action === 'export') {
    const url = URL.createObjectURL(new Blob([JSON.stringify(plan,null,2)],{type:'application/json'}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'honeymoon-studio-2028.json';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url),30000);
    document.querySelector('#file-message').textContent = 'Export gestartet.';
    return;
  }
  if (action === 'show-variants') {
    plan.active = id;
    persist();
    location.hash = 'varianten';
    return;
  }
  if (action === 'new-variant' || action === 'open-variant') {
    if (!keepOrReplaceDraft(entry)) return;
    if (action === 'open-variant') plan.trips[plan.active] = structuredClone(plan.variants[plan.active][i].trip);
    else plan.trips[plan.active] = {...blankPlan().trips[plan.active],profile:entry.profile,rates:entry.rates,start:entry.start};
    persist(action === 'open-variant' ? 'Reisevariante geladen.' : 'Neue Beratung gestartet.');
    location.hash = action === 'open-variant' ? 'route' : 'profil';
    return;
  }
  if (action === 'remove-variant') {
    if (!window.confirm('Diese gespeicherte Reisevariante löschen?')) return;
    plan.variants[plan.active].splice(i,1);
  }
  if (action === 'trip') {
    plan.active = id;
    if (id === 'mini' && current() === 'natur') {
      persist();
      location.hash = 'profil';
      return;
    }
  }
  if (action === 'like' && !entry.favorites.includes(id)) entry.favorites.push(id);
  if (action === 'reject') entry.rejected.push(id);
  if (action === 'reset-rejections') entry.rejected = [];
  if (action === 'unfavorite') entry.favorites = entry.favorites.filter(item => item !== id);
  if (action === 'custom-grand' && plan.active === 'grand' && entry.adventure && !entry.stops.length) {
    entry.stops = structuredClone(entry.adventure.stops);
    persist('Natur-Route erstellt. Ergänzt eure Strandstopps.');
    if (current() === 'route') render(true);
    else location.hash = 'route';
    return;
  }
  if (action === 'build') {
    buildRoute(entry,id);
    return;
  }
  if (action === 'remove') entry.stops.splice(i,1);
  if (action === 'up' || action === 'down') {
    const other = i + (action === 'up' ? -1 : 1);
    [entry.stops[i],entry.stops[other]] = [entry.stops[other],entry.stops[i]];
  }
  persist(action === 'reject' ? 'Idee abgelehnt.' : action === 'like' ? 'Zu euren Favoriten hinzugefügt.' : undefined);
  render();
  const next = action === 'trip' ? app.querySelector('[data-action="trip"][aria-pressed="true"]') :
    ['like','reject'].includes(action) ? app.querySelector('#idea-title') : null;
  (next ?? app.querySelector('#view-title')).focus({preventScroll:true});
});

window.addEventListener('hashchange',() => render(true));
render();
