# Parcelle+

From a parcel to the most profitable compliant building program, in the browser. Prototype built for integration into a buildability platform (UrbanCheck).

- **Rules:** COS, ground coverage, height and floors, street / rear / side setbacks, parking (Loi 12-90 style zoning, editable).
- **Optimal program:** a mixed-integer model solved in the browser by HiGHS (WebAssembly): floors and plate sizes, unit mix per floor (studio, 2, 3, 4 rooms), shops or flats on the ground floor, basement parking levels. Objective: developer net margin.
- **Feasibility:** revenue, costs, margin vs. the usual "fill the COS" program, margin by number of floors, sensitivity (prices, costs, land), rule checks.
- **Map:** MapLibre GL + OpenFreeMap (no key): parcel, setbacks, allowed envelope and the optimal building in 3D; draw your own parcel.
- **Output:** printable feasibility note (PDF), CSV, shareable link (full state in the URL). French, English, Arabic (RTL).

## Files
| file | role |
|---|---|
| `index.html`, `app.html`, `methode.html` | landing, application, method |
| `assets/data.js` | zones, sample parcels, market prices, technical assumptions |
| `assets/geo.js` | local projection, areas, setbacks (half-plane clipping), plate scaling |
| `assets/optimizer.js` | MILP model (CPLEX LP text) + HiGHS solve + evaluation + study (best, usual, by floors, sensitivity) |
| `assets/app.js` | UI, map, results, exports |
| `assets/i18n.js` | FR / EN / AR text |

## Integrate
`optimizer.js` has no UI dependency: `study(params)` takes the parcel area, footprint, rules, unit types and prices and returns the optimal program, the usual program, the margin by number of floors and the sensitivity. Any platform that already computes a parcel's rules can call it.

No build step: serve the folder statically. Zone values in `data.js` are indicative and must be checked against the official zoning plan.
