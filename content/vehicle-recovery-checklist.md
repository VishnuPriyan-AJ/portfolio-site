# Vehicle Recovery Console content checklist

The native React case study uses the following source mapping:

- `hero` → `src/content/vehicle-recovery.ts` hero metadata and `VehicleRecoveryCaseStudy`.
- `stats` → `vehicleRecoveryContent.stats`.
- `problem`, `competitive`, and `user` → `vehicleRecoveryContent.sections`.
- `flow`, `process`, `product`, `impact`, `reflection`, and `next` → encrypted `locked-payload.json` sections generated from the local source HTML.
- `score` → intentionally omitted; it is not part of the native case-study structure.
- Source CSS, standalone navigation, standalone header, standalone footer, and standalone fonts → not imported; the existing portfolio chrome and styles are reused.
