import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blankPlan, calendar, compareFavorites, estimate, makeAdventure, rank, readPlan, starterRoute } from '../model.js';

test('matching responds to profile, exclusions, remembered choices and budget', () => {
  const p = blankPlan().trips.mini;
  p.profile.interests = ['Strand','Romantik'];
  p.profile.hotel = 'Luxus';
  p.profile.budget = 6500;
  p.profile.must = 'Kleftiko';
  p.profile.activities = ['Schnorcheln','Bootsausflüge'];
  assert.equal(rank('mini',p)[0].d.id,'milos');
  p.rejected.push('milos');
  p.favorites.push('hvar');
  assert.ok(rank('mini',p).every(({d}) => d.id !== 'milos' && d.id !== 'hvar'));
  p.profile.budget = 1;
  assert.ok(rank('mini',p).every(item => !item.budget));
  p.profile.avoid = 'Levada';
  assert.deepEqual(rank('mini',p).find(({d}) => d.id === 'madeira').avoid,['levada']);
});

test('December route crosses both countries, spans Christmas and budgets for the beach transfer', () => {
  const entry = blankPlan().trips.grand;
  entry.stops = starterRoute('grand','rosario',entry.profile);
  assert.deepEqual(entry.stops.map(stop => stop.place),['calafate','chalten','natales','rosario']);
  const days = calendar('grand',entry);
  assert.equal(days.length,21);
  assert.ok(days.some(day => day.date === '2028-12-25'));
  assert.ok(days.some(day => day.detail.includes('Grenzkontrolle')));
  const before = estimate('grand',entry);
  entry.rates.lodging = 200;
  const after = estimate('grand',entry);
  assert.equal(after.items.lodging,before.items.lodging*2);
  assert.ok(after.total > before.total);
  entry.profile.changes = 2;
  assert.equal(starterRoute('grand','rosario',entry.profile).length,3);
});

test('valid imports round trip and reject invalid dates, stops and rates', () => {
  const plan = blankPlan();
  plan.trips.mini.favorites = ['madeira'];
  plan.trips.mini.stops = starterRoute('mini','madeira',plan.trips.mini.profile);
  assert.deepEqual(readPlan(JSON.stringify(plan)),plan);
  for (const change of [
    copy => {copy.trips.mini.start = '2028-02-31';},
    copy => {copy.trips.mini.stops[0].place = 'unknown';},
    copy => {copy.trips.mini.rates.reserve = 999;},
    copy => {copy.trips.mini.rejected = ['madeira'];},
  ]) {
    const copy = structuredClone(plan);
    change(copy);
    assert.throws(() => readPlan(JSON.stringify(copy)));
  }
});

test('every catalog idea can be saved and compared for either trip', () => {
  const plan = blankPlan();
  for (const key of ['mini','grand']) {
    const entry = plan.trips[key];
    const candidates = rank(key,entry);
    entry.favorites = candidates.map(item => item.d.id);
    assert.ok(entry.favorites.length >= 20);
    assert.deepEqual(rank(key,entry),[]);
    const comparison = compareFavorites(key,entry);
    assert.equal(comparison.length,entry.favorites.length);
    assert.ok(comparison.every((item,i) => i === 0 || item.score <= comparison[i-1].score));
    assert.ok(comparison.every(item => item.total > 0 && item.days > 0));
  }
  assert.deepEqual(readPlan(JSON.stringify(plan)),plan);
});

test('each trip offers at least 20 distinct, individually rejectable ideas', () => {
  for (const key of ['mini','grand']) {
    const entry = blankPlan().trips[key];
    const seen = new Set();
    for (let next; (next = rank(key,entry)[0]);) {
      assert.ok(!seen.has(next.d.id));
      seen.add(next.d.id);
      entry.rejected.push(next.d.id);
    }
    assert.ok(seen.size >= 20);
  }
});

test('two-island starters keep both Patagonia countries and account for the local transfer', () => {
  const entry = blankPlan().trips.grand;
  for (const [idea,first,last,transfer] of [
    ['bonaire','bonaire','curacao','Regionalflug'],
    ['providencia','sanandres','providencia','Freigepäck'],
    ['caulker','belize','caulker','Wassertaxi'],
    ['cozumel','mujeres','cozumel','Playa del Carmen'],
  ]) {
    entry.stops = starterRoute('grand',idea,entry.profile);
    assert.deepEqual(entry.stops.map(stop => stop.place),['calafate','natales',first,last]);
    const days = calendar('grand',entry);
    assert.equal(days.length,21);
    assert.ok(days.some(day => day.detail.includes(transfer)));
    const original = estimate('grand',entry).total;
    entry.stops.at(-1).nights++;
    assert.ok(estimate('grand',entry).total > original);
  }
});

test('nature and beach share one calendar and budget, including regional alternatives', () => {
  const entry = blankPlan().trips.grand;
  for (const [preset,beach,target,last] of [
    ['patagonia','belize',23,'belize'],
    ['costarica','guanacaste',20,'guanacaste'],
    ['canada','halfmoon',22,'halfmoon'],
    ['nz','fiji',25,'fiji'],
  ]) {
    entry.adventure = makeAdventure(preset,target);
    entry.adventure.stops[0].activities = [];
    entry.stops = starterRoute('grand',beach,entry.profile,entry.adventure);
    assert.deepEqual(entry.stops[0],entry.adventure.stops[0]);
    assert.equal(entry.stops.at(-1).place,last);
    assert.equal(calendar('grand',entry).length,target);
    assert.ok(estimate('grand',entry).total > 4000);
    assert.notEqual(entry.stops[0].activities,entry.adventure.stops[0].activities);
  }
});

test('legacy data and independent named trip snapshots round-trip', () => {
  const legacy = blankPlan();
  delete legacy.variants;
  for (const entry of Object.values(legacy.trips)) delete entry.adventure;
  const plan = readPlan(JSON.stringify(legacy));
  const grand = plan.trips.grand;
  grand.adventure = makeAdventure('chile',24);
  grand.stops = starterRoute('grand','belize',grand.profile,grand.adventure);
  plan.variants.grand.push({name:'Chile und Belize',trip:structuredClone(grand)});
  const mini = plan.trips.mini;
  mini.stops = starterRoute('mini','madeira',mini.profile);
  plan.variants.mini.push({name:'Madeira',trip:structuredClone(mini)});
  grand.stops[0].nights += 2;
  grand.rates.lodging = 50;
  assert.deepEqual(readPlan(JSON.stringify(plan)),plan);
  assert.equal(plan.variants.grand[0].trip.rates.lodging,100);
  assert.notEqual(plan.variants.grand[0].trip.stops[0].nights,grand.stops[0].nights);
});
