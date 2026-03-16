/* pharos-map.js — Carte interactive Pharos Energy · Projet Résurgence */
window.PharosMap = (function () {

  const TERRITORY = [
    // Delta du Nil + côte méditerranéenne (nord)
    [31.5, 29.0], [31.7, 29.8], [31.7, 30.8], [31.4, 31.5], [31.1, 32.3],
    // Sinaï
    [30.5, 32.6], [29.8, 32.5], [29.0, 32.7],
    // Vallée du Nil - côté est (descente vers le sud)
    [28.0, 32.5], [27.0, 32.0], [26.0, 32.0],
    [25.0, 32.3], [24.0, 32.8], [23.2, 33.0],
    // Extension SE (mer Rouge / Nubie)
    [22.3, 33.5], [22.0, 34.2], [22.2, 34.8],
    // Remontée côté ouest
    [22.8, 33.0], [23.5, 31.5], [24.5, 30.8],
    [25.5, 30.0], [26.5, 29.5], [27.5, 29.2], [28.5, 28.8],
    // Lobe NW (désert occidental)
    [29.5, 27.5], [30.0, 26.5], [30.5, 25.5],
    [31.0, 25.0], [31.3, 25.8], [31.5, 27.0], [31.5, 28.0],
    [31.5, 29.0],
  ];

  const DARK_TILE  = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
  const LIGHT_TILE = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
  const ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright" style="color:#545d72">OSM</a> &copy; <a href="https://carto.com/" style="color:#545d72">CARTO</a>';

  const SITES = [
    { lat: 29.34013, lon: 30.94513, label: 'NILDU', sub: 'Centrale · Médinet El-Fayoum', ref: 'NILDU-REF-001', status: 'En construction', color: '#1bbd8a' },
    { lat: 30.21796, lon: 31.25895, label: 'MEMPHIS', sub: 'Pile atomique · Le Caire', ref: 'MEMPHIS-PILE-001', status: 'En service', color: '#8b6fd4' }
  ];

  function makeIcon(color, active) {
    const size = active ? 28 : 20;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size*1.33)}" viewBox="0 0 24 32">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20S24 21 24 12C24 5.37 18.63 0 12 0z" fill="${color}" opacity="${active ? 1 : 0.55}"/>
      <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
      <circle cx="12" cy="12" r="2.5" fill="${color}"/>
    </svg>`;
    return L.divIcon({ html: svg, className: '', iconSize: [size, Math.round(size*1.33)], iconAnchor: [size/2, Math.round(size*1.33)], popupAnchor: [0, -Math.round(size*1.33)-2] });
  }

  function init(containerId, opts) {
    opts = Object.assign({ siteRef: null, zoom: 5, centerLat: 27.5, centerLon: 30.5, theme: document.documentElement.getAttribute('data-theme') || 'dark' }, opts);

    const map = L.map(containerId, { center: [opts.centerLat, opts.centerLon], zoom: opts.zoom, zoomControl: true, attributionControl: true, scrollWheelZoom: false });
    map.attributionControl.setPrefix('');

    const tileUrl = opts.theme === 'light' ? LIGHT_TILE : DARK_TILE;
    let tileLayer = L.tileLayer(tileUrl, { attribution: ATTR, maxZoom: 18 }).addTo(map);

    // Polygone territoire
    L.polygon(TERRITORY, { color: '#1bbd8a', weight: 1.8, opacity: 0.75, fillColor: '#1bbd8a', fillOpacity: 0.13 }).addTo(map);

    // Marqueurs
    SITES.forEach(site => {
      const active = opts.siteRef === site.ref;
      const marker = L.marker([site.lat, site.lon], { icon: makeIcon(site.color, active) }).addTo(map);
      marker.bindPopup(
        `<div style="font-family:'IBM Plex Mono',monospace;min-width:160px">
          <div style="font-weight:600;font-size:13px;color:${site.color};margin-bottom:2px">${site.label}</div>
          <div style="font-size:10px;color:#8b93a8;margin-bottom:5px">${site.ref}</div>
          <div style="font-size:11px;color:#c8ccd8">${site.sub}</div>
          <div style="margin-top:6px;font-size:10px;color:${site.color}">${site.status}</div>
        </div>`,
        { className: 'pharos-popup', closeButton: false }
      );
      if (active) setTimeout(() => marker.openPopup(), 400);
    });

    // Thème réactif
    map._pharosThemeLayer = tileLayer;
    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());

    return map;
  }

  function setTheme(map, theme) {
    if (!map) return;
    map.eachLayer(l => { if (l instanceof L.TileLayer) map.removeLayer(l); });
    L.tileLayer(theme === 'light' ? LIGHT_TILE : DARK_TILE, { attribution: ATTR, maxZoom: 18 }).addTo(map);
  }

  return { init, setTheme };
})();
