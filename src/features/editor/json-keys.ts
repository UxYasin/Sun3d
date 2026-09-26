/**
 * Extra Fabric properties that must survive a canvas JSON round trip.
 *
 * Kept in its own module (no `fabric` import) so server-rendered components
 * can read it without dragging the canvas library into the server bundle.
 */
export const JSON_KEYS = [
  "name",
  "gradientAngle",
  "selectable",
  "hasControls",
  "linkData",
  "editable",
  "extensionType",
  "extension",
  "bevelEmbossConfig",
  "originalUnicodeText"
];
