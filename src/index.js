import './style.css'
import { h, app } from './lib/hyperapp/hyperappv2'
import KeySub from './lib/hyperapp/subs/key'
import FrameSub from './lib/hyperapp/subs/frame'
import { Space, Shot, Ship, Rock } from './components'
import { SPACE_HEIGHT, SPACE_WIDTH } from './const'
import { bounceObjects, step } from './physics'
import { make as makeRock } from './rock'
import { step as stepShot } from './shot'
import {
    make as makeShip,
    rotateLeft,
    rotateRight,
    shoot,
    accelerate,
} from './ship'

const KeyDown = (S, K) => ({ ...S, key: K })
const KeyUp = (S, K) => (K === S.key ? { ...S, key: null } : S)

const Tick = (state, time) => {
    const dt = time - state.time

    let key = state.key
    let ship = state.ship
    let shot = state.shot
    let rocks = state.rocks
    let accelerating = false

    if (key === 'ArrowLeft') ship = rotateLeft(ship, dt)
    if (key === 'ArrowRight') ship = rotateRight(ship, dt)

    if (key === 'ArrowUp') {
        ship = accelerate(ship, dt)
        accelerating = true
    } else {
        accelerating = false
    }

    ship = step(ship, dt)

    if (!!shot) shot = stepShot(shot, dt)
    else if (key === ' ') shot = shoot(ship)

    rocks = state.rocks.map(rock => step(rock, dt))
    ;[ship, ...rocks] = bounceObjects([ship, ...rocks])

    return {
        key,
        accelerating,
        time,
        ship,
        shot,
        rocks,
    }
}

document.body.innerHTML = ''
app({
    init: _ => ({
        accelerating: false,
        time: performance.now(),
        ship: makeShip(),
        shot: null,
        rocks: [
            makeRock(),
            makeRock(),
            makeRock(),
            makeRock(),
            makeRock(),
            makeRock(),
            makeRock(),
            makeRock(),
        ],
    }),

    subscriptions: state => [
        KeySub({ up: KeyUp, down: KeyDown }),
        FrameSub({ action: Tick }),
    ],

    view: state => (
        <main>
            <Space width={SPACE_WIDTH} height={SPACE_HEIGHT}>
                {state.rocks.map(rock => (
                    <Rock x={rock.x} y={rock.y} r={rock.r} />
                ))}
                {state.shot && (
                    <Shot
                        x={state.shot.x}
                        y={state.shot.y}
                        angle={state.shot.angle}
                    />
                )}
                <Ship
                    x={state.ship.x}
                    y={state.ship.y}
                    angle={state.ship.angle}
                    accelerating={state.accelerating}
                />
            </Space>
        </main>
    ),
    container: document.body,
})
