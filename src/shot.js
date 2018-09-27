import { SHOT_VELOCITY, SHOT_LIFETIME, SHOT_RADIUS, SHOT_MASS } from './const'

import { step as physicsStep } from './physics'

export const make = (x, y, angle) => ({
    x,
    y,
    vx: SHOT_VELOCITY * Math.sin(angle),
    vy: -SHOT_VELOCITY * Math.cos(angle),
    angle,
    r: SHOT_RADIUS,
    m: SHOT_MASS,
    lifetime: 0,
})

export const step = (shot, dt) => {
    let lifetime = shot.lifetime + dt
    if (lifetime >= SHOT_LIFETIME) return null
    return { ...physicsStep(shot, dt), lifetime }
}
