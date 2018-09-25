import './style.css'
import { h, app } from './hyperappv2'
import { Space } from './space'
import { Ship, OnFrame as ShipOnFrame, Init as ShipInit } from './ship'
import { Shot, OnFrame as ShotOnFrame, Init as ShotInit } from './shot'

const effect = effect => props => ({ effect, ...props })
const KeyListener = effect((props, dispatch) => {
    const downHandler = ev => dispatch(props.down, ev.key)
    const upHandler = ev => dispatch(props.up, ev.key)
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
        window.removeEventListener('keydown', downHandler)
        window.removeEventListener('keyup', upHandler)
    }
})

const Frame = effect((props, dispatch) => {
    var frameId
    const onFrame = time => {
        dispatch(props.action, time)
        nextFrame()
    }
    const nextFrame = () => {
        frameId = requestAnimationFrame(onFrame)
    }
    nextFrame()
    return () => cancelAnimationFrame(frameId)
})

const KeyUp = (state, key) => {
    if (key !== state.key) return
    return { ...state, key: null }
}
const KeyDown = (state, key) => {
    return { ...state, key }
}

const OnFrame = (state, time) => {
    const dt = time - state.time
    return {
        ...state,
        time,
        dt,
        ship: ShipOnFrame(state.ship, { key: state.key, dt }),
        shot: ShotOnFrame(state.shot, {
            ship: state.ship,
            dt,
            key: state.key,
        }),
    }

    return { ...state, ...news }
}

document.body.innerHTML = ''
app({
    init: _ => ({
        key: null,
        time: performance.now(),
        dt: 0,
        ship: ShipInit(),
        shot: ShotInit(),
    }),

    subscriptions: state => [
        KeyListener({
            up: KeyUp,
            down: KeyDown,
        }),
        Frame({
            action: OnFrame,
        }),
    ],

    view: state => (
        <main>
            <Space>
                <Shot state={state.shot} />
                <Ship state={state.ship} />
            </Space>
        </main>
    ),
    container: document.body,
})
