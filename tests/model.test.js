import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blankPlan, calendar, compareFavorites, estimate, rank, readPlan, starterRoute } from '../model.js';

test('matching responds to profile, exclusions, remembered choices and budget', () => {
  const p = blankPlan().trips.mini;
  p.profile.interests = ['Strand','Romantik'];
  p.profile.hotel = 'Luxus';
  p.profile.budget = 6500;
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
    assert.ok(entry.favorites.length > 2);
    assert.deepEqual(rank(key,entry),[]);
    const comparison = compareFavorites(key,entry);
    assert.equal(comparison.length,entry.favorites.length);
    assert.ok(comparison.every((item,i) => i === 0 || item.score <= comparison[i-1].score));
    assert.ok(comparison.every(item => item.total > 0 && item.days > 0));
  }
  assert.deepEqual(readPlan(JSON.stringify(plan)),plan);
});
