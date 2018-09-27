import { add, sub, mul, dot, len2 } from './lib/vector'
import { toroid, dist } from './space'

/*
given the position vectors and radiuses of two
spherical objects a and b : are they collided?

*/
const didCollide = (a, b) =>
    len2(...dist(a.x, a.y, b.x, b.y)) < (a.r + b.r) * (a.r + b.r)

/*
    given a position vector, velocity vector and time interval
    calculate the new position vector
*/
const step = (o, dt) => {
    const [x, y] = toroid(...add(o.x, o.y, ...mul(dt, o.vx, o.vy)))
    return { ...o, x, y }
}

/*
Take two objects a and b with mass radius, position and velocity vectors
return their respective velocity vectors. Will be the same as
before if the two objects did not collide. If they did collide, 
the velocity vectors returned will be the ones after collision
*/
const calcBounce = (a, b) => {
    const M = (2 * b.m) / (a.m + b.m)
    const pdiff = dist(a.x, a.y, b.x, b.y)
    const C = dot(...sub(a.vx, a.vy, b.vx, b.vy), ...pdiff) / len2(...pdiff)
    return sub(a.vx, a.vy, ...mul(C * M, ...pdiff))
}

const bounce = (a, b) => {
    if (!didCollide(a, b)) return [a, b]
    const [avx, avy] = calcBounce(a, b)
    const [bvx, bvy] = calcBounce(b, a)
    let na = { ...a, vx: avx, vy: avy }
    let nb = { ...b, vx: bvx, vy: bvy }
    while (didCollide(na, nb)) {
        na = step(na, 10)
        nb = step(nb, 10)
    }
    return [na, nb]
}

const bounceObjects = list => {
    const newList = list.slice()
    newList.forEach((a, i) => {
        newList.slice(i + 1).forEach(b => {
            const [na, nb] = bounce(a, b)
            Object.assign(a, na)
            Object.assign(b, nb)
        })
    })
    return newList
}

export { step, bounceObjects }
