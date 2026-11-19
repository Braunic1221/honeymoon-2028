import { moreIdeas } from './catalog-more.js';

export const trips = {
  mini: { name: 'Mini-Moon', start: '2028-06-21', days: 9, duration: '7–10 Tage', budget: 5000 },
  grand: { name: 'Große Flitterwochen', start: '2028-12-12', days: 21, duration: 'ca. 21 Tage', budget: 14000 },
};

export const interests = ['Strand', 'Wandern', 'Natur', 'Abenteuer', 'Party', 'Städte', 'Kultur', 'Wellness', 'Romantik'];
export const activities = ['Tauchen', 'Schnorcheln', 'Bootsausflüge', 'Paragliding', 'Trekking', 'Wildlife', 'Wassersport'];
export const hotels = ['Boutique', 'Luxus', 'Resort', 'Außergewöhnlich', 'Preisbewusst'];

const ideas = [
  ['madeira','Madeira','Portugal','mini','Funchal',32.65,-16.91,950,180,90,80,3,1,
    ['Natur','Wandern','Romantik','Abenteuer','Kultur'],['Trekking','Bootsausflüge','Paragliding'],['Boutique','Außergewöhnlich'],
    'Levadas durch Lorbeerwald, Sonnenaufgang über den Wolken und Abende mit Blick aufs Meer.',
    'Von einer Basis erreicht ihr Bergwege, Altstadt und Vulkanpools.','Steile Wege und wechselhafte Bedingungen am Berg. Wenige Sandstrände.','Im Juni meist mild, an der Nordküste und auf Höhenlagen sind Wolken möglich.','Levada-Wanderung|Bootsausflug ab Funchal|Wellness und Altstadt'],
  ['dolomiten','Dolomiten','Italien','mini','Ortisei',46.57,11.67,620,235,100,85,3,1,
    ['Wandern','Natur','Wellness','Romantik','Abenteuer'],['Trekking','Paragliding'],['Luxus','Boutique','Außergewöhnlich'],
    'Ein Bergrefugium zwischen Almen, Kalkgipfeln und langen Spa-Nachmittagen.',
    'Viel Berglandschaft mit kurzen Wegen von einer festen Basis.','Hohe Wege können Schnee haben. Seilbahnen haben saisonale Öffnungszeiten.','Ende Juni beginnt die Bergsaison. Vor Ort Hütten, Seilbahnen und Schnee prüfen.','Seiser Alm|Panorama und Spa|Wanderung im Grödner Tal'],
  ['milos','Milos','Griechenland','mini','Adamas',36.73,24.45,1100,220,110,90,3,1,
    ['Strand','Romantik','Kultur'],['Schnorcheln','Bootsausflüge','Wassersport'],['Boutique','Luxus'],
    'Weiße Vulkanfelsen, kleine Fischerdörfer und versteckte Buchten für zwei.',
    'Bootstag und Strandzeit lassen sich aus einer Basis verbinden.','Die Anreise über Athen braucht Puffer. Wind kann Bootsausflüge verschieben.','Juni ist häufig warm und trocken. Wind und Fährbetrieb tagesaktuell prüfen.','Boot nach Kleftiko|Sarakiniko|Abend in Plaka'],
  ['azoren','São Miguel','Portugal','mini','Ponta Delgada',37.74,-25.67,1100,165,100,80,2,1,
    ['Wandern','Natur','Wellness','Abenteuer','Romantik'],['Wildlife','Trekking','Bootsausflüge'],['Boutique','Außergewöhnlich','Preisbewusst'],
    'Kraterseen und dampfende Thermalbecken mitten im Atlantik.',
    'Wandern, Thermalbäder und Walbeobachtung aus einer Basis.','Wechselnde Sicht und Atlantikregen. Strandurlaub ist wetterabhängig.','Im Juni oft mild, aber Regen und Nebel sind möglich.','Kraterseen Sete Cidades|Thermalbad in Furnas|Walbeobachtung'],
  ['hvar','Hvar','Kroatien','mini','Hvar Stadt',43.17,16.44,900,170,120,85,3,1,
    ['Party','Städte','Strand','Kultur','Romantik'],['Bootsausflüge','Wassersport','Schnorcheln'],['Boutique','Preisbewusst'],
    'Historische Gassen, kleine Inselbuchten und Abende am Hafen.',
    'Badebuchten, Kultur und Nachtleben liegen nah zusammen.','Viele Kiesstrände. Fähren ab Split brauchen Anschlussreserve.','Juni bringt meist sommerliches Wetter vor der Hauptsaison.','Pakleni-Inseln per Boot|Altstadt und Festung|Baden in einer Kiesbucht'],
  ['mauritius','Mauritius','Indischer Ozean','mini','Le Morne',-20.45,57.32,2250,240,140,100,2,2,
    ['Strand','Natur','Wellness','Romantik','Abenteuer'],['Schnorcheln','Wassersport','Trekking','Tauchen'],['Resort','Luxus'],
    'Eine Lagune unter dem Le Morne und Bergpfade im grünen Inselinneren.',
    'Riff, Wanderungen und Erholung in einer Unterkunft kombinierbar.','Lange Anreise für eine kurze Reise. Die Südostküste kann windig sein.','Juni liegt im milderen, trockeneren Südwinter. Die Westküste ist oft geschützter.','Lagune von Le Morne|Black River Gorges|Wellness im Resort'],
  ['bocas','Bocas del Toro','Panama','grand','Isla Colón',9.34,-82.24,3100,190,530,105,1,1,
    ['Strand','Natur','Abenteuer','Romantik'],['Schnorcheln','Bootsausflüge','Wildlife'],['Boutique','Außergewöhnlich'],
    'Karibische Inseln, Mangroven und kleine Unterkünfte am Wasser.',
    'Bootsausflüge zu mehreren Inseln funktionieren als Tagestrips von derselben Basis.','Inlandsflug oder längere Anreise ab Panama-Stadt. Regen und Wellengang können Bootspläne ändern.','Dezember bleibt an Panamas Karibikküste feucht. Wetterpuffer einplanen.','Boot zu den Zapatilla-Inseln|Schnorcheln bei ruhiger See|Mangroven und Strand'],
  ['belize','Belize Barrier Reef','Belize','grand','San Pedro',17.92,-87.96,3450,240,620,120,3,1,
    ['Strand','Natur','Abenteuer','Romantik'],['Tauchen','Schnorcheln','Bootsausflüge','Wildlife'],['Resort','Boutique'],
    'Ein türkisfarbenes Riff, kleine Cayes und lange Tage auf dem Wasser.',
    'Ab San Pedro sind mehrere Schnorchelgebiete als Tagesausflug erreichbar.','Mehrere Flugsegmente und Boot ab Belize City. Feiertage erhöhen die Nachfrage.','Im Dezember beginnt meist die trockenere Zeit. Kaltfronten können Wind und Wellen bringen.','Hol Chan mit Guide|Tagesausflug nach Caye Caulker|Entspannen am Riff'],
  ['rosario','Cartagena & Rosario-Inseln','Kolumbien','grand','Isla Grande',10.18,-75.73,2750,185,380,90,3,1,
    ['Strand','Kultur','Romantik','Städte'],['Schnorcheln','Bootsausflüge'],['Boutique','Außergewöhnlich','Preisbewusst'],
    'Koloniale Innenhöfe und eine autofreie Insel vor der Küste von Cartagena.',
    'Stadt und Insel mit kurzer Bootsetappe kombinierbar. Ein Ausflug reicht für Cartagena, wenn ihr wenige Wechsel wollt.','Bootstransfers sind bei Seegang unruhig und haben feste Abfahrtszeiten.','Im Dezember meist trockener. Passatwind und Feiertagsandrang einplanen.','Boot durch die Rosario-Inseln|Riff-Schnorcheln|Tagesausflug nach Cartagena'],
  ['guanacaste','Guanacaste','Costa Rica','grand','Playa Flamingo',10.44,-85.79,3200,260,530,120,3,1,
    ['Strand','Natur','Wellness','Abenteuer'],['Bootsausflüge','Wildlife','Wassersport'],['Resort','Luxus'],
    'Warmer Pazifik, goldene Strände und Tierbeobachtung im Trockenwald.',
    'Strand und Natur lassen sich von einer Basis aus verbinden.','Schnorcheln ist sichtabhängig. Für Inselhopping gibt es nur wenige Optionen.','Dezember ist am Nordpazifik meist der Übergang in die Trockenzeit.','Katamaran bei Sonnenuntergang|Wildlife im Trockenwald|Pazifikstrand'],
  ['curacao','Curaçao','Karibik','grand','Westpunt',12.37,-69.15,3350,210,480,100,2,1,
    ['Strand','Wellness','Kultur','Romantik'],['Tauchen','Schnorcheln','Bootsausflüge'],['Boutique','Resort'],
    'Geschützte Buchten und Riffe, die direkt vom Strand erreichbar sind.',
    'Kurze Fahrten zwischen Schnorchelplätzen. Klein Curaçao eignet sich als Tagesausflug.','Weihnachtswoche ist gefragt. Inselwechsel bedeuten zusätzliche Flüge.','Dezember liegt im feuchteren Abschnitt mit möglichen kurzen Schauern.','Schnorcheln in Playa Lagun|Boot nach Klein Curaçao|Willemstad'],
  ['palawan','Palawan','Philippinen','grand','El Nido',11.20,119.41,4900,205,910,100,2,3,
    ['Strand','Natur','Abenteuer','Romantik'],['Schnorcheln','Tauchen','Bootsausflüge'],['Boutique','Resort','Außergewöhnlich'],
    'Kalksteininseln, Lagunen und Strandtage an der Bacuit-Bucht.',
    'Von El Nido aus sind mehrere Inselgruppen als Tagestrips möglich.','Sehr langer Wechsel aus Patagonien mit mehreren Flugsegmenten und möglichem Datumswechsel.','Im Dezember oft trockener. Stürme und wetterbedingte Ausfälle bleiben möglich.','Bacuit-Lagunen per Boot|Schnorcheln bei ruhiger See|Nacpan Beach'],
];

export const destinations = [...ideas,...moreIdeas].map(([id,name,country,trip,base,lat,lon,flights,night,arrival,food,season,effort,tags,sports,styles,description,pro,con,weather,experiences]) => ({
  id,name,country,trip,base,lat,lon,flights,night,arrival,food,season,effort,tags,sports,styles,description,pro,con,weather,experiences:experiences.split('|'),image:`./media/${id}.webp`,
}));

export const places = Object.fromEntries(destinations.map(destination => [destination.id, destination]));
Object.assign(places, {
  calafate: { name:'El Calafate', country:'Argentinien', lat:-50.34, lon:-72.27, night:185, arrival:340, food:90, experiences:['Perito-Moreno-Gletscher','Laguna Nimez','Bootsfahrt am Gletscher'] },
  chalten: { name:'El Chaltén', country:'Argentinien', lat:-49.33, lon:-72.89, night:195, arrival:170, food:90, experiences:['Laguna Capri','Laguna de los Tres bei gutem Wetter','Wanderung zur Laguna Torre'] },
  natales: { name:'Puerto Natales', country:'Chile', lat:-51.73, lon:-72.50, night:220, arrival:240, food:100, experiences:['Torres del Paine als Tagesausflug','Lago Grey','Milodón-Höhle und Uferpromenade'] },
});

export const beachCombinations = {
  bonaire: ['bonaire','curacao'],
  providencia: ['sanandres','providencia'],
  caulker: ['belize','caulker'],
  cozumel: ['mujeres','cozumel'],
};

const regional = {
  'calafate/chalten': ['Bus oder Mietwagen, rund 3 Std.',1,170],
  'calafate/natales': ['Grenzbus, rund 5–7 Std. mit Grenzkontrolle',1,240],
  'chalten/natales': ['Straße über El Calafate mit Grenzkontrolle, rund 8–10 Std.',1,340],
  'bonaire/curacao': ['Regionalflug zwischen Bonaire und Curaçao, Flughafentransfers einplanen',1,80,300],
  'providencia/sanandres': ['Kurzer Regionalflug zwischen San Andrés und Providencia, begrenztes Freigepäck',1,60,230],
  'belize/caulker': ['Zwischen San Pedro und Caye Caulker per Wassertaxi, rund 30 Min. auf dem Wasser',1,80,0],
  'cozumel/mujeres': ['Fähre über Cancún, Straße nach Playa del Carmen, zweite Fähre nach Cozumel',1,155,0],
};

const beachCorridors = {
  bocas:'über Panama-Stadt, ggf. Flughafenwechsel und Inlandsflug',
  belize:'über einen Mittelamerika-Hub nach Belize City, weiter per Wassertaxi',
  rosario:'via Bogotá nach Cartagena, weiter per Boot',
  guanacaste:'über einen Regionalhub nach Liberia oder San José, weiter auf der Straße',
  curacao:'über Panama-Stadt oder Bogotá nach Willemstad, weiter auf der Straße',
  palawan:'über einen Langstrecken-Hub und Manila nach El Nido',
  aruba:'über Bogotá oder Panama-Stadt nach Oranjestad, weiter auf der Straße',
  bonaire:'über einen Karibik-Hub, ggf. mit Regionalflug ab Curaçao',
  sanandres:'via Bogotá nach San Andrés',
  providencia:'via Bogotá und San Andrés, dann per Regionalflug',
  perleninseln:'nach Panama-Stadt, weiter per Fähre nach Contadora',
  bayahibe:'via Regionalhub nach Santo Domingo oder Punta Cana, weiter auf der Straße',
  tobago:'über Port of Spain, ggf. mit Regionalflug nach Tobago und Straßentransfer',
  barbados:'über einen Karibik- oder Nordamerika-Hub nach Bridgetown, weiter auf der Straße',
  roatan:'über einen Mittelamerika-Hub nach Roatán, weiter nach West Bay',
  caulker:'über einen Mittelamerika-Hub nach Belize City, weiter per Wassertaxi',
  mujeres:'via Regionalhub nach Cancún, weiter mit Transfer und Fähre',
  cozumel:'via Regionalhub nach Cancún, weiter über Playa del Carmen und per Fähre',
  moorea:'über einen geeigneten Langstrecken-Hub nach Tahiti, weiter mit der Fähre',
  osa:'via Regionalhub nach San José, weiter per Inlandsflug oder Straße und Boot',
};

export function transfer(from, to, trip) {
  const key = [from, to].sort().join('/');
  if (!from) {
    if (to === 'calafate') return ['Langstrecke ab Mitteleuropa via Buenos Aires, ggf. Flughafenwechsel',2,places[to].arrival];
    if (to === 'natales') return ['Langstrecke via Santiago, Anschluss über Punta Arenas oder Puerto Natales',2,places[to].arrival];
    if (to === 'chalten') return ['Langstrecke via Buenos Aires, Inlandsflug nach El Calafate und rund 3 Std. Straße',2,places[to].arrival];
    return [`Anreise ab Mitteleuropa zur Basis ${places[to].base}, ggf. mit Umstieg und Fähre`,places[to].effort >= 2 ? 2 : 1,places[to].arrival];
  }
  if (regional[key]) return regional[key];
  if (places[to].trip === 'grand') {
    if (places[from].trip === 'grand') return [`Zum Abflughafen ab ${places[from].base}, Anschluss ${beachCorridors[to]}`,places[to].effort === 3 ? 3 : 2,places[to].arrival,550];
    const start = from === 'natales' ? 'Transfer nach Punta Arenas, Flug via Santiago' : 'Ab El Calafate über Buenos Aires mit Anschlussflug';
    return [`${start}, ${beachCorridors[to]}`,places[to].effort === 3 ? 3 : 2,places[to].arrival];
  }
  if (trip === 'grand') return ['Regional- und Inlandsflug über Santiago oder Buenos Aires, danach Straßentransfer',2,places[to].arrival];
  return ['Transfer zum Flughafen oder Hafen, weiter per Flug oder Fähre mit Umstieg',2,places[to].arrival];
}
