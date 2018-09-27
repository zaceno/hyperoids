import { mul, add } from './lib/vector'
import { make as makeShot } from './shot'

import {
    SHIP_INITIAL_X,
    SHIP_INITIAL_Y,
    SHIP_INITIAL_VX,
    SHIP_INITIAL_VY,
    SHIP_RADIUS,
    SHIP_MASS,
    SHIP_INITIAL_ANGLE,
    SHIP_ANGULAR_VELOCITY,
    SHIP_THRUST,
} from './const'

export const make = () => ({
    x: SHIP_INITIAL_X,
    y: SHIP_INITIAL_Y,
    vx: SHIP_INITIAL_VX,
    vy: SHIP_INITIAL_VY,
    r: SHIP_RADIUS,
    m: SHIP_MASS,
    angle: SHIP_INITIAL_ANGLE,
})

export const rotateLeft = (ship, dt) => ({
    ...ship,
    angle: ship.angle - SHIP_ANGULAR_VELOCITY * dt,
})

export const rotateRight = (ship, dt) => ({
    ...ship,
    angle: ship.angle + SHIP_ANGULAR_VELOCITY * dt,
})

export const accelerate = (ship, dt) => {
    const [vx, vy] = add(
        ship.vx,
        ship.vy,
        ...mul(SHIP_THRUST * dt, Math.sin(ship.angle), -Math.cos(ship.angle))
    )
    return { ...ship, vx, vy }
}

export const shoot = ship => makeShot(ship.x, ship.y, ship.angle)
