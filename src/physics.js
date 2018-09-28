import { add, sub, mul, dot, len2 } from './lib/vector'
import { toroid, dist } from './space'
import {
    BLAST_MASS_FACTOR,
    BLAST_MINIMIMUM_RADIUS,
    BLAST_VELOCITY,
    BLAST_RADIUS_FACTOR,
} from './const'
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

const separate = (a, b) => {
    while (didCollide(a, b)) {
        a = step(a, 10)
        b = step(b, 10)
    }
    return [a, b]
}

const bounce = (a, b) => {
    if (!didCollide(a, b)) return [a, b]
    const [avx, avy] = calcBounce(a, b)
    const [bvx, bvy] = calcBounce(b, a)
    return separate({ ...a, vx: avx, vy: avy }, { ...b, vx: bvx, vy: bvy })
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

/*
    In a "blast" a shot hits a target, and is evaporated
    The target breaks into two smaller pieces.

    The two pieces behave as if they had bounced against
    the target (so we can reuse the calcBounce) logic.

    The shot is destroyed marked as spent
    a separating motion. So we add two sideways vectors.
*/
/*


*/
const calcBlast = (shot, incidenceAngle, target) => {
    const tangent = incidenceAngle + Math.PI * 2
    const [svx, svy] = mul(BLAST_VELOCITY, Math.cos(tangent), Math.sin(tangent))
    const [bvx, bvy] = mul(0.5, ...calcBounce(target, shot))
    const [vx1, vy1] = add(bvx, bvy, svx, svy)
    const [vx2, vy2] = sub(bvx, bvy, svx, svy)
    const m = target.m * BLAST_MASS_FACTOR
    const r = target.r * BLAST_RADIUS_FACTOR
    return separate(
        { ...target, m, r, vx: vx1, vy: vy1 },
        { ...target, m, r, vx: vx2, vy: vy2 }
    )
}

const blastTargets = (shot, incidenceAngle, targets) => {
    var hit = false
    const newTargets = []
    targets.forEach(target => {
        if (didCollide(shot, target)) {
            if (target.r > BLAST_MINIMIMUM_RADIUS) {
                const [n1, n2] = calcBlast(shot, incidenceAngle, target)
                newTargets.push(n1)
                newTargets.push(n2)
            }
            hit = true
        } else {
            newTargets.push(target)
        }
    })
    shot = hit ? null : shot
    return [shot, newTargets]
}

export { step, bounceObjects, blastTargets }
