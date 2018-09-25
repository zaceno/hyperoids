import { h } from './hyperappv2'
import { Part, Path, Ellipse } from './canvas'
import { modx, mody } from './space'

const VELOCITY = 2.5
const LIFETIME = 250

const Init = () => ({
    active: false,
    x: 0,
    y: 0,
    angle: 0,
})

const OnFrame = (state, { ship, dt, key }) => {
    const news = {}
    if (!state.active && key === ' ') {
        news.active = true
        news.x = ship.x
        news.y = ship.y
        news.angle = ship.angle
        news.lifetime = 0
    }
    if (state.active && state.lifetime < LIFETIME) {
        news.x = modx(state.x + VELOCITY * dt * Math.sin(state.angle))
        news.y = mody(state.y - VELOCITY * dt * Math.cos(state.angle))
        news.lifetime = state.lifetime + dt
    }
    if (state.lifetime >= LIFETIME) {
        news.active = false
    }
    return { ...state, ...news }
}

const Shot = ({ state }) =>
    state.active && (
        <Part x={state.x} y={state.y}>
            <Path stroke="#00f" fill="#99f" width={2}>
                <Ellipse x={0} y={0} rx={4} ry={25} rot={state.angle} />
            </Path>
        </Part>
    )

export { Init, OnFrame, Shot }
