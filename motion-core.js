/* Distance-driven walking. Shared by the browser and regression tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.JimmyMotion = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function dimensions(viewportWidth, profile = {}, viewportHeight = 1000) {
    const desired = viewportWidth <= 540 ? profile.mobile || 152 : profile.desktop || 192;
    const factor=profile.duet?1+(profile.spacing||.58):1;
    const size = Math.max(profile.duet?36:72,Math.min(desired,(viewportWidth-16)/factor,viewportHeight-24));
    // Reserve room below the fine pair's blade line for the near half of an
    // oval. That line stays fixed during entry, exit and the following glide.
    const ground=profile.groundInset?Math.max(10,Math.min(10+size*profile.groundInset,viewportHeight-size-12)):10;
    return { width: size*factor, height: size,actorWidth:size,spacing:size*(factor-1), ground, stride: size * (profile.stride || .43), approachStride: size * (profile.approachStride || profile.stride || .43), speed: size * (profile.speed || .44), acceleration: profile.acceleration || 3.2, frames: profile.frames || 8,
      tempo: profile.tempo || 1, jumpTempo: profile.jumpTempo || profile.tempo || 1, spinTempo: profile.spinTempo || profile.tempo || 1,
      performanceSpeed: size * (profile.performanceSpeed || profile.speed || .44),
      duet:!!profile.duet,encore:!!profile.encore,softJump:!!profile.softJump,
      jumpHeight:profile.jumpHeight??.43,edgeLean:profile.edgeLean??2.4,arcDepth:profile.arcDepth??.14 };
  }
  function frameAtDistance(distance, stride, frames = 8) {
    return Math.floor(((Math.max(0, distance) / Math.max(1, stride)) % 1) * frames) % frames;
  }
  function walkStep({ x, target, velocity = 0, distance = 0 }, seconds, size) {
    const dt = clamp(seconds, 0, 0.05), remaining = Math.abs(target - x);
    const direction = Math.sign(target - x), acceleration = size.speed * (size.acceleration || 3.2);
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
  function jumpAtTime(milliseconds, height = 64) {
    const time = Math.max(0, milliseconds);
    if (time < 140) return { lift: 0, progress: 0, frame: 0, finished: false };
    if (time < 780) {
      const progress = (time - 140) / 640;
      return { lift: 4 * Math.max(0, height) * progress * (1 - progress), progress, frame: progress < .5 ? 1 : 2, finished: false };
    }
    return { lift: 0, progress: 1, frame: 3, finished: time >= 960 };
  }
  return { dimensions, clamp, frameAtDistance, walkStep, fallStep, jumpAtTime };
});

