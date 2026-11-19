// December itineraries. A stop's first transfer day is counted in the same calendar as the beach stay.
export const naturePresets = {
  patagonia: {
    name:'Patagonien · Argentinien und Chile', route:[['calafate',2],['chalten',3],['natales',4]],
    arrival:'Via Buenos Aires nach El Calafate. Weiterfahrt aus Chile über Punta Arenas und Santiago.',
    highlights:'Perito Moreno, der Fitz Roy und Torres del Paine. Längere Grenzetappe zwischen El Chaltén und Puerto Natales.',
    season:'Australsommer mit langen Tagen. Starke Winde und wechselhaftes Wanderwetter einplanen.',
  },
  chile: {
    name:'Patagonien · Chilenische Seite', route:[['arenas',2],['natales',7]],
    arrival:'Via Santiago nach Punta Arenas. Rückfahrt dorthin oder saisonaler Anschluss in Puerto Natales prüfen.',
    highlights:'Magellanstraße, Torres del Paine und Lago Grey mit nur einem Unterkunftswechsel innerhalb der Etappe.',
    season:'Dezember eignet sich für Wanderungen. Exponierte Wege und Bootsfahrten hängen vom Wind ab.',
  },
  argentina: {
    name:'Patagonien · Gletscher und Fitz Roy', route:[['calafate',4],['chalten',5]],
    arrival:'Via Buenos Aires nach El Calafate. Für den Weiterflug zurück über El Calafate und Buenos Aires.',
    highlights:'Perito-Moreno-Gletscher, Fitz-Roy-Wanderungen und mehr Wetterpuffer ohne Grenzübertritt.',
    season:'Lange Tage im Dezember. Der Fitz Roy kann tagelang in Wolken liegen.',
  },
  tierra: {
    name:'Patagonien & Feuerland', route:[['calafate',4],['ushuaia',5]],
    arrival:'Via Buenos Aires nach El Calafate. Zwischen El Calafate und Ushuaia saisonale Flüge oder Umstieg prüfen.',
    highlights:'Gletscher, Beagle-Kanal und Tierra-del-Fuego-Nationalpark. Mehr Flugaufwand auf der Natur-Etappe.',
    season:'Dezember ist vergleichsweise mild. Wind, niedrige Temperaturen und Regen bleiben möglich.',
  },
  nz: {
    name:'Neuseeland · Südinsel und Fjorde', route:[['christchurch',2],['queenstown',4],['teanau',3]],
    arrival:'Langstrecke nach Christchurch. Vom Süden weiter über Queenstown und Auckland.',
    highlights:'Alpenpanoramen, Seen am Wakatipu und Fiordland. Eine Strandetappe auf Fidschi oder den Cookinseln passt geografisch dazu.',
    season:'Frühsommer mit langen Tagen. Fiordland bleibt regenreich. Für Alpine Routen Bedingungen prüfen.',
  },
  costarica: {
    name:'Costa Rica · Nebelwald und Vulkane', route:[['arenal',4],['monteverde',4]],
    arrival:'Flug nach San José, danach Straße nach La Fortuna. Anschließend gut an die Pazifikküste anschließbar.',
    highlights:'Hängebrücken, Thermalquellen, Vulkanpfade und Tierbeobachtung. Guanacaste ist auf dem Landweg erreichbar.',
    season:'Dezember ist ein Übergangsmonat. Im Nebelwald kann es auch dann regnen.',
  },
  canada: {
    name:'Kanada · Rockies im Winter', route:[['banffwinter',6],['canmore',3]],
    arrival:'Flug nach Calgary und kurzer Straßentransfer in die Rockies. Weiterflug ab Calgary.',
    highlights:'Winterwanderungen, gefrorene Seen und Wellness. Hawaii bietet eine warme Anschlussoption. Kalifornien eignet sich für Küste und Spaziergänge.',
    season:'Dezember bedeutet Winter. Für sichere Winterwege lokale Empfehlungen und Sperrungen beachten. Hochgebirgstouren können ausfallen.',
  },
};

export const naturePlaces = {
  arenas:{name:'Punta Arenas',country:'Chile',lat:-53.16,lon:-70.91,night:165,arrival:225,food:90,flights:2300,airport:'Punta Arenas',region:'patagonia',experiences:['Magellanstraße','Reserva Nacional Magallanes','Pinguin-Ausflug bei geeignetem Wetter']},
  ushuaia:{name:'Ushuaia',country:'Argentinien',lat:-54.80,lon:-68.30,night:205,arrival:310,food:95,flights:2550,airport:'Ushuaia',region:'patagonia',experiences:['Tierra-del-Fuego-Nationalpark','Beagle-Kanal','Laguna Esmeralda bei geeigneten Bedingungen']},
  christchurch:{name:'Christchurch',country:'Neuseeland',lat:-43.53,lon:172.63,night:175,arrival:200,food:110,flights:3900,airport:'Christchurch',region:'nz',experiences:['Port Hills Wanderung','Botanischer Garten','Tagesausflug zur Banks Peninsula']},
  queenstown:{name:'Queenstown',country:'Neuseeland',lat:-45.03,lon:168.66,night:240,arrival:290,food:125,flights:3900,airport:'Queenstown',region:'nz',experiences:['Wanderung am Lake Wakatipu','Glenorchy','Bootsfahrt auf dem See']},
  teanau:{name:'Te Anau',country:'Neuseeland',lat:-45.42,lon:167.72,night:195,arrival:125,food:105,flights:3900,airport:'Queenstown',region:'nz',experiences:['Kepler Track als Tageswanderung','Milford Sound per Boot','Lake Te Anau']},
  arenal:{name:'La Fortuna / Arenal',country:'Costa Rica',lat:10.47,lon:-84.65,night:175,arrival:220,food:90,flights:2200,airport:'San José',region:'costarica',experiences:['Vulkanpfade am Arenal','Thermalquellen','Hängebrücken und Tierbeobachtung']},
  monteverde:{name:'Monteverde',country:'Costa Rica',lat:10.31,lon:-84.82,night:165,arrival:165,food:85,flights:2200,airport:'San José oder Liberia',region:'costarica',experiences:['Geführte Nebelwaldwanderung','Santa Elena Reserve','Kaffee- und Kakaotour']},
  banffwinter:{name:'Banff im Winter',country:'Kanada',lat:51.18,lon:-115.57,night:230,arrival:225,food:125,flights:2200,airport:'Calgary',region:'canada',experiences:['Geführte Winterwanderung am Johnston Canyon','Lake Louise am Ufer','Wellness in Banff']},
  canmore:{name:'Canmore',country:'Kanada',lat:51.09,lon:-115.36,night:190,arrival:100,food:115,flights:2200,airport:'Calgary',region:'canada',experiences:['Winterspaziergang am Bow River','Schneeschuhwanderung mit Guide','Nordic Centre bei passenden Bedingungen']},
};
