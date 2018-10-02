import css from './style.css'
import { h, app } from './lib/hyperapp/hyperappv2'
import KeySub from './lib/hyperapp/subs/key'
import FrameSub from './lib/hyperapp/subs/frame'
import { Space, Shot, Ship, Rock } from './components'
import { SPACE_HEIGHT, SPACE_WIDTH } from './const'
import { bounceObjects, step, blastTargets } from './physics'
import { make as makeRock } from './rock'
import { step as stepShot } from './shot'
import {
    make as makeShip,
    rotateLeft,
    rotateRight,
    shoot,
    accelerate,
} from './ship'

const KeyDown = (state, key) => {
    const news = { ...state }
    if (key === 'ArrowLeft' && !state.rotatingRight) {
        news.rotatingLeft = true
        news.rotatingRight = false
    } else if (key === 'ArrowRight') {
        news.rotatingRight = true
        news.rotatingLeft = false
    } else if (key === 'ArrowUp') {
        news.accelerating = true
    } else if (key === ' ') {
        news.shooting = true
    }
    return news
}
const KeyUp = (state, key) => {
    const news = { ...state }
    if (key === 'ArrowLeft') news.rotatingLeft = false
    else if (key === 'ArrowRight') news.rotatingRight = false
    else if (key === 'ArrowUp') news.accelerating = false
    else if (key === ' ') news.shooting = false
    return news
}

const Tick = (state, time) => {
    const dt = time - state.time

    let key = state.key
    let ship = state.ship
    let shot = state.shot
    let rocks = state.rocks
    let accelerating = false
    let shotsSinceHit = state.shotsSinceHit
    let score = state.score

    if (state.rotatingLeft) ship = rotateLeft(ship, dt)
    if (state.rotatingRight) ship = rotateRight(ship, dt)
    if (state.accelerating) ship = accelerate(ship, dt)
    ship = step(ship, dt)

    rocks = state.rocks.map(rock => step(rock, dt))
    ;[ship, ...rocks] = bounceObjects([ship, ...rocks])

    if (!!shot) shot = stepShot(shot, dt)
    if (!!shot && !shot.spent) {
        let [nshot, nrocks] = blastTargets(shot, shot.angle, rocks)
        rocks = nrocks
        if (!nshot) {
            shot.spent = true
            score += !shotsSinceHit ? 100 : Math.round(100 / shotsSinceHit)
            shotsSinceHit = 0
        }
    }
    if (!shot && state.shooting) {
        shot = shoot(ship)
        shotsSinceHit += 1
    }

    return {
        ...state,
        score,
        shotsSinceHit,
        key,
        time,
        ship,
        shot,
        rocks,
    }
}

document.body.innerHTML = ''
app({
    init: _ => ({
        score: 0,
        shotsSinceHit: 0,
        accelerating: false,
        shooting: false,
        rotatingLeft: false,
        rotatingRight: false,
        time: performance.now(),
        ship: makeShip(),
        shot: null,
        rocks: [makeRock(), makeRock(), makeRock()],
    }),

    subscriptions: state => [
        KeySub({ up: KeyUp, down: KeyDown }),
        FrameSub({ action: Tick }),
    ],

    view: state => (
        <main>
            <p class={css.score}>Score: {state.score}</p>
            <Space width={SPACE_WIDTH} height={SPACE_HEIGHT}>
                {state.rocks.map(rock => (
                    <Rock x={rock.x} y={rock.y} r={rock.r} />
                ))}
                {state.shot &&
                    !state.shot.spent && (
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
