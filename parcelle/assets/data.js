// Illustrative zone rules, sample parcels and market assumptions (editable in the app).
// Zone values follow the public examples of Moroccan zoning plans (Loi 12-90); they must be checked
// against the official Plan d'Aménagement / note de renseignement before any decision.

export const UNIT_TYPES = [
  { id: "s", area: 40, minShare: 0, maxShare: 0.3 },   // studio
  { id: "t2", area: 65, minShare: 0, maxShare: 0.6 },  // 2 pièces
  { id: "t3", area: 90, minShare: 0.2, maxShare: 0.7 }, // 3 pièces
  { id: "t4", area: 120, minShare: 0, maxShare: 0.25 }, // 4 pièces
];

export const ZONES = {
  "A1-AUC": { city: "casa", cos: 4.2, emprise: 70, levels: 7, hmax: 28, street: 5, rear: 4, side: 0, rdcH: 4.5, floorH: 3.2, commerce: true, parkRes: 1, parkCom: 2 },
  "B5-AUC": { city: "casa", cos: 3.0, emprise: 65, levels: 5, hmax: 21, street: 4, rear: 4, side: 0, rdcH: 4.5, floorH: 3.2, commerce: true, parkRes: 1, parkCom: 2 },
  "B5M-AUC": { city: "casa", cos: 2.6, emprise: 60, levels: 4, hmax: 17.5, street: 3, rear: 4, side: 0, rdcH: 4.5, floorH: 3.2, commerce: true, parkRes: 1, parkCom: 2 },
  "SAG-AUM": { city: "marrakech", cos: 2.4, emprise: 70, levels: 5, hmax: 19.5, street: 0, rear: 4, side: 0, rdcH: 4.5, floorH: 3.0, commerce: true, parkRes: 1, parkCom: 2 },
};

export const MARKETS = {
  casa: { price: { s: 20500, t2: 19000, t3: 18000, t4: 17500 }, commerce: 32000, parking: 130000, build: 6200, basement: 4200 },
  marrakech: { price: { s: 16500, t2: 15000, t3: 14000, t4: 13500 }, commerce: 26000, parking: 100000, build: 5600, basement: 3900 },
};

// rectangle of w x d metres centred on (lat, lon); ring order SW, SE, NE, NW; streetEdge = index of the street side
function rect(lat, lon, w, d) {
  const dLat = d / 2 / 110540, dLon = w / 2 / (111320 * Math.cos(lat * Math.PI / 180));
  return [[lon - dLon, lat - dLat], [lon + dLon, lat - dLat], [lon + dLon, lat + dLat], [lon - dLon, lat + dLat]];
}

export const SAMPLES = {
  zerktouni: { name: "Bd Zerktouni", place: "Casablanca", zone: "A1-AUC", land: 16000, ring: rect(33.58833, -7.63444, 20, 26), street: 2 },
  gauthier: { name: "Gauthier", place: "Casablanca", zone: "B5-AUC", land: 15000, ring: rect(33.59052, -7.62864, 24, 25), street: 0 },
  maarif: { name: "Maârif", place: "Casablanca", zone: "B5M-AUC", land: 13000, ring: rect(33.57946, -7.63952, 16, 25), street: 3 },
  gueliz: { name: "Guéliz", place: "Marrakech", zone: "SAG-AUM", land: 11000, ring: rect(31.63595, -8.01102, 18, 25), street: 1 },
};

// technical assumptions shared by all zones (editable)
export const TECH = {
  core: 28,          // m² per level for stairs, lift and landing (not sellable)
  eff: 0.9,          // net / gross of the floor plate outside the core
  effCom: 0.95,      // same for shops
  space: 25,         // m² of basement per parking space, ramps included
  basementUse: 0.9,  // share of the parcel usable for each basement level
  basementMax: 3,
  premium: 0.8,      // % price gain per floor above the ground floor
  rdcDiscount: 8,    // % price discount for flats on the ground floor
  fees: 12,          // % of construction: studies, permits, insurance, financing
  marketing: 3,      // % of revenue
  sellParking: true, // parking spaces sold separately
  parkingPerUnit: 1.2, // most spaces the market buys per flat
};
