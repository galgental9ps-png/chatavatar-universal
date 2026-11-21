/* Distance-driven walking. Shared by the browser and regression tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.JimmyMotion = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function dimensions(viewportWidth) {
    const size = viewportWidth <= 540 ? 152 : 192;
    return { width: size, height: size, ground: 10, stride: size * 0.43, speed: size * 0.44 };
  }
  function frameAtDistance(distance, stride) {
    return Math.floor(((Math.max(0, distance) / Math.max(1, stride)) % 1) * 8) % 8;
  }
  function walkStep({ x, target, velocity = 0, distance = 0 }, seconds, size) {
    const dt = clamp(seconds, 0, 0.05), remaining = Math.abs(target - x);
    const direction = Math.sign(target - x), acceleration = size.speed * 3.2;
    if (remaining < 0.6) return { x: target, target, velocity: 0, distance, arrived: true };
    const desired = Math.min(size.speed, Math.sqrt(2 * acceleration * remaining));
    const velocityNext = velocity + clamp(desired - velocity, -acceleration * dt, acceleration * dt);
    const travel = Math.min(remaining, Math.max(0, velocityNext) * dt);
    return { x: x + direction * travel, target, velocity: velocityNext, distance: distance + travel, arrived: remaining - travel < 0.6 };
  }
  function fallStep({ y, velocity = 0 }, seconds, ground = 10) {
    const dt = clamp(seconds, 0, 0.05), nextVelocity = velocity + 1100 * dt;
    const nextY = Math.max(ground, y - nextVelocity * dt);
    return { y: nextY, velocity: nextY === ground ? 0 : nextVelocity, landed: nextY === ground };
  }
  return { dimensions, clamp, frameAtDistance, walkStep, fallStep };
});

