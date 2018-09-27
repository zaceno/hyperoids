import { SPACE_WIDTH, SPACE_HEIGHT, ROCK_INITIAL_VELOCITY } from './const'
import { int as randint, num as randnum } from './lib/random'

export const make = () => {
    const x = randint(0, SPACE_WIDTH)
    const y = randint(0, SPACE_HEIGHT)
    const vx = randnum(-ROCK_INITIAL_VELOCITY, ROCK_INITIAL_VELOCITY)
    const vy = randnum(-ROCK_INITIAL_VELOCITY, ROCK_INITIAL_VELOCITY)
    const size = randint(1, 5)
    const r = size * 25
    const m = Math.pow(size, 3)
    return { x, y, vx, vy, r, m }
}
