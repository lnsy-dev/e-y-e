/**
 * Draws a line on the final canvas.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 * @param {number} startX - The starting X coordinate.
 * @param {number} startY - The starting Y coordinate.
 * @param {number} endX - The ending X coordinate.
 * @param {number} endY - The ending Y coordinate.
 * @param {number} [lineWidth=1] - The width of the line.
 * @param {string} [strokeStyle='red'] - The color of the line.
 */
export function drawLine(eyeInstance, startX, startY, endX, endY, lineWidth = 1, strokeStyle = 'red') {
  const ctx = eyeInstance.final_canvas_context;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}
