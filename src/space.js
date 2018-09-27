import { SPACE_WIDTH, SPACE_HEIGHT } from './const'

const mod = (x, n) => {
    let y = x
    while (y < 0) {
        y += n
    }
    return y % n
}

//the smallest diff between a and b in a cyclic range
const moddiff = (a, b, n) => mod(a - b + n / 2, n) - n / 2

export const toroid = (x, y) => [mod(x, SPACE_WIDTH), mod(y, SPACE_HEIGHT)]
//calculate distance vector between two points A and B,
//taking into account the modulo-nature of the space.
export const dist = (ax, ay, bx, by) => [
    moddiff(ax, bx, SPACE_WIDTH),
    moddiff(ay, by, SPACE_HEIGHT),
]
