import { activities, beachCombinations, destinations, hotels, interests, places, transfer, trips } from './catalog.js';

export const labels = { flights:'Flüge', lodging:'Unterkünfte', transfers:'Transfers', activities:'Aktivitäten', food:'Verpflegung', reserve:'Reserve' };
export const defaults = { flights:100, lodging:100, transfers:100, activities:100, food:100, reserve:12 };
export const routes = Object.keys(trips);
export const euro = value => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);

export function blankPlan() {
  return {
    version: 1,
    active: 'mini',
    trips: Object.fromEntries(routes.map(key => [key, {
      profile: { interests:[], activities:[], hotel:'Boutique', budget:trips[key].budget, pace:'Ausgewogen', changes:key === 'mini' ? 1 : 3, must:'', avoid:'' },
      rejected:[], favorites:[], stops:[], start:trips[key].start, rates:{...defaults},
    }])),
  };
}

const integer = (value,min,max) => Number.isInteger(value) && value >= min && value <= max;
const strings = (value, allowed) => Array.isArray(value) && value.length <= allowed.length &&
  new Set(value).size === value.length && value.every(item => allowed.includes(item));
const short = value => typeof value === 'string' && value.length <= 500;
export const allowedPlaces = key => Object.keys(places).filter(id => !places[id].trip ? key === 'grand' : places[id].trip === key);

export function readPlan(raw) {
  const data = JSON.parse(raw);
  if (data?.version !== 1 || !routes.includes(data.active)) throw new Error('Unbekanntes Dateiformat.');
  const clean = blankPlan();
  clean.active = data.active;
  for (const key of routes) {
    const entry = data.trips?.[key];
    const profile = entry?.profile;
    const ideas = destinations.filter(idea => idea.trip === key).map(idea => idea.id);
    const date = /^2028-\d{2}-\d{2}$/.test(entry?.start) ? new Date(entry.start + 'T12:00:00Z') : null;
    if (!profile || !strings(profile.interests,interests) || !strings(profile.activities,activities) ||
      !hotels.includes(profile.hotel) || !integer(profile.budget,0,100000) || !integer(profile.changes,0,8) ||
      !['Entspannt','Ausgewogen','Aktiv'].includes(profile.pace) || !short(profile.must) || !short(profile.avoid) ||
      !strings(entry.rejected,ideas) || !strings(entry.favorites,ideas) || entry.favorites.some(id => entry.rejected.includes(id)) ||
      !date || Number.isNaN(+date) || date.toISOString().slice(0,10) !== entry.start ||
      !Object.entries(defaults).every(([label]) => integer(entry.rates?.[label],0,label === 'reserve' ? 100 : 300)) ||
      !Array.isArray(entry.stops) || entry.stops.length > 9 || !entry.stops.every(stop =>
        allowedPlaces(key).includes(stop?.place) && integer(stop.nights,1,30) &&
        Array.isArray(stop.activities) && stop.activities.length <= 12 && stop.activities.every(short))) {
      throw new Error('Die Datei enthält ungültige Planungsdaten.');
    }
    clean.trips[key] = {
      profile: { interests:profile.interests,activities:profile.activities,hotel:profile.hotel,budget:profile.budget,
        pace:profile.pace,changes:profile.changes,must:profile.must,avoid:profile.avoid },
      rejected:entry.rejected,favorites:entry.favorites,start:entry.start,
      stops:entry.stops.map(({place,nights,activities}) => ({place,nights,activities})),
      rates:Object.fromEntries(Object.keys(defaults).map(label => [label,entry.rates[label]])),
    };
  }
  return clean;
}

export const makeStop = (place,nights) => ({place,nights,activities:[...places[place].experiences]});

export function patagoniaRoute(profile, beachStops = 1) {
  const includeChalten = profile.changes >= 2 + beachStops;
  return includeChalten
    ? [makeStop('calafate',2),makeStop('chalten',3),makeStop('natales',4)]
    : [makeStop('calafate',5),makeStop('natales',4)];
}

export function starterRoute(key, idea, profile) {
  if (key === 'mini') return [makeStop(idea, trips.mini.days - (places[idea].effort >= 2 ? 3 : 1))];
  const beaches = beachCombinations[idea] ?? [idea];
  const nights = places[beaches[0]].effort === 3 ? 7 : 8;
  return [...patagoniaRoute(profile,beaches.length),...beaches.map(place => makeStop(place,nights/beaches.length))];
}

export function calendar(key, entry) {
  if (!entry.stops.length) return [];
  const days = [];
  let previous;
  for (const stop of entry.stops) {
    const place = places[stop.place];
    const [leg,duration] = transfer(previous,stop.place,key);
    for (let day = 1; day <= duration; day++) {
      days.push({ title: day === duration ? `Ankunft · ${place.base ?? place.name}` : 'Unterwegs',
        detail: duration > 1 ? `Etappe ${day}/${duration} · ${leg}` : leg });
    }
    if (stop.nights === 1 && stop.activities.length) {
      days[days.length - 1].detail += ` · Optional nach Ankunft: ${stop.activities.join(' · ')}`;
    }
    for (let night = 1; night < stop.nights; night++) {
      const planned = night === stop.nights - 1 ? stop.activities.slice(night - 1) : stop.activities.slice(night - 1,night);
      days.push({title:place.base ?? place.name,detail:planned.join(' · ') || 'Freie Zeit und Wetterpuffer'});
    }
    previous = stop.place;
  }
  days.push({title:'Rückreise',detail:'Transfer zum Abflughafen, ggf. Umstieg und Ankunft am Folgetag.'});
  if (key === 'grand' || places[previous].effort === 2) days.push({title:'Ankunft zu Hause',detail:'Puffertag für die Langstrecke.'});
  return days.map((day,index) => {
    const date = new Date(entry.start + 'T12:00:00Z');
    date.setUTCDate(date.getUTCDate()+index);
    return {...day,date:date.toISOString().slice(0,10)};
  });
}

export function estimate(key,entry) {
  const base = {flights:0,lodging:0,transfers:0,activities:0,food:0};
  let previous;
  let extraFlights = 0;
  const factor = {Boutique:1,Luxus:1.55,Resort:1.25,Außergewöhnlich:1.15,Preisbewusst:.68}[entry.profile.hotel];
  for (const stop of entry.stops) {
    const d = places[stop.place];
    const [,,legCost,regionalFlight] = transfer(previous,stop.place,key);
    extraFlights += regionalFlight ?? (key === 'mini' && previous && previous !== stop.place ? 550 : 0);
    base.flights = Math.max(base.flights, d.flights ?? 2300);
    base.lodging += stop.nights * d.night * factor;
    base.transfers += legCost;
    base.activities += stop.activities.length * (key === 'grand' ? 125 : 105);
    base.food += stop.nights * d.food;
    previous = stop.place;
  }
  if (entry.stops.length) {
    base.transfers += key === 'grand' ? 160 : 75;
    base.flights += extraFlights;
  }
  const items = Object.fromEntries(Object.entries(base).map(([id,value]) => [id,Math.round(value * entry.rates[id]/100)]));
  const subtotal = Object.values(items).reduce((sum,value) => sum + value,0);
  items.reserve = Math.round(subtotal * entry.rates.reserve / 100);
  return {items,total:subtotal + items.reserve};
}

const normalize = value => value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
function evaluate(key,entry,candidates,withAffinity) {
  const p = entry.profile;
  return candidates.map(d => {
    const matches = [...p.interests.filter(tag => d.tags.includes(tag)),...p.activities.filter(tag => d.sports.includes(tag))];
    const text = normalize([d.name,d.country,...d.tags,...d.sports,...d.experiences,d.description,d.con].join(' '));
    const terms = value => [...new Set(normalize(value).split(/[^\p{L}]+/u))].filter(term => term.length >= 4 && text.includes(term));
    const must = terms(p.must);
    const avoid = terms(p.avoid);
    const hotel = d.styles.includes(p.hotel);
    const draft = {...entry,stops:starterRoute(key,d.id,p)};
    const total = estimate(key,draft).total;
    const budget = !p.budget || total <= p.budget;
    const affinity = (withAffinity ? [...entry.favorites,...entry.rejected] : []).reduce((sum,id) => {
      const overlap = d.tags.filter(tag => places[id].tags.includes(tag) && !p.interests.includes(tag)).length;
      return sum + overlap * (entry.favorites.includes(id) ? 2 : -1);
    },0);
    const score = 10 * d.season + 7 * matches.length + (hotel ? 8 : 0) + 5 * must.length - 12 * avoid.length +
      (budget ? 7 : -Math.min(18,(total-p.budget)/500)) - (p.pace === 'Entspannt' ? 10 : 5) * d.effort +
      (key === 'grand' && p.changes < 3 && d.effort > 1 ? -8 : 0) + Math.max(-10,Math.min(10,affinity));
    return {d,score,matches,hotel,must,avoid,total,budget,days:calendar(key,draft).length,changes:draft.stops.length - 1, itinerary:draft.stops.map(stop => places[stop.place].base ?? places[stop.place].name)};
  }).sort((a,b) => b.score - a.score || a.d.name.localeCompare(b.d.name,'de'));
}

export function rank(key,entry) {
  const candidates = destinations.filter(d => d.trip === key && !entry.rejected.includes(d.id) && !entry.favorites.includes(d.id));
  return evaluate(key,entry,candidates,true);
}

export function compareFavorites(key,entry) {
  const candidates = destinations.filter(d => d.trip === key && entry.favorites.includes(d.id));
  return evaluate(key,entry,candidates,false);
}
