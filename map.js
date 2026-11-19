import { places } from './catalog.js';

import { landPath } from './map-land.js';

export function routeMap(stops) {
  const points = stops.map(stop => places[stop.place]);
  const width = 760;
  const height = 380;
  const project = (lon,lat) => [((lon+180)/360*width).toFixed(2),((90-lat)/180*height).toFixed(2)];
  const coords = points.map(({lon,lat}) => project(lon,lat));
  const markers = coords.map(([x,y],i) => `<g><circle cx="${x}" cy="${y}" r="1.8"/><path class="line" d="M${x},${y} l${i%2 ? 18 : -18},${-12-12*(i%3)}"/><circle cx="${+x+(i%2 ? 18 : -18)}" cy="${+y-12-12*(i%3)}" r="8"/><text x="${+x+(i%2 ? 18 : -18)}" y="${+y-12-12*(i%3)}">${i+1}</text></g>`).join('');
  return `<svg class="map" viewBox="0 0 ${width} ${height}" role="img" aria-label="Weltkarte mit nummerierten Stopps"><path class="land" fill-rule="evenodd" d="${landPath}"/><polyline class="line" points="${coords.map(pair => pair.join(',')).join(' ')}"/>${markers}</svg>`;
}
