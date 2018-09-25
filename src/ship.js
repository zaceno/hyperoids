import { h } from './hyperappv2'
import { Part, Scale, Rotate, Path, Move, Ellipse, Line } from './canvas'
import { modx, mody } from './space'

const DIRECTION_ACCELERATION = 0.0004
const ROTATION_ACCELERATION = 0.008

const Init = () => ({
    angle: 0,
    x: 300,
    y: 200,
    vx: 0,
    vy: 0,
    accelerating: false,
})

const OnFrame = (state, { dt, key }) => {
    const news = {}
    if (key === 'ArrowLeft') {
        news.angle = state.angle - ROTATION_ACCELERATION * dt
    }
    if (key === 'ArrowRight') {
        news.angle = state.angle + ROTATION_ACCELERATION * dt
    }
    if (key === 'ArrowUp') {
        news.accelerating = true
        news.vx = state.vx + Math.sin(state.angle) * DIRECTION_ACCELERATION * dt
        news.vy = state.vy - Math.cos(state.angle) * DIRECTION_ACCELERATION * dt
    } else {
        news.accelerating = false
    }
    news.x = modx(state.x + state.vx * dt)
    news.y = mody(state.y + state.vy * dt)
    return { ...state, ...news }
}

const Ship = ({ state }) => (
    <Part x={state.x} y={state.y} width={80}>
        <Scale width={200}>
            <Rotate angle={state.angle}>
                <Path stroke="#f00" fill="#f77" width={2}>
                    <Move x={100} y={0} />
                    <Ellipse
                        x={0}
                        y={0}
                        rx={100}
                        ry={80}
                        start={Math.PI * -0.09}
                        end={Math.PI * 0.29}
                    />
                    <Ellipse
                        x={0}
                        y={90}
                        rx={70}
                        ry={50}
                        start={Math.PI * 1.8}
                        end={Math.PI * 1.2}
                        anti={true}
                    />
                    <Ellipse
                        x={0}
                        y={0}
                        rx={100}
                        ry={80}
                        start={Math.PI * 0.71}
                        end={Math.PI * 1.09}
                    />
                    <Ellipse
                        x={0}
                        y={-70}
                        rx={120}
                        ry={80}
                        start={Math.PI * 0.8}
                        end={Math.PI * 0.2}
                        anti={true}
                    />
                </Path>
                <Path fill="#fff" stroke="#777" width={2}>
                    <Move x={40} />
                    <Ellipse x={0} y={0} rx={40} ry={80} end={Math.PI * 2} />
                </Path>
                <Path fill="#000">
                    <Ellipse x={0} y={-15} rx={25} ry={35} end={Math.PI * 2} />
                </Path>
                {state.accelerating && (
                    <Path fill="#cfc" closed={true} stroke="#0a0" width={3}>
                        <Move x={-20} y={80} />
                        <Line x={20} y={80} />
                        <Line x={0} y={150} />
                    </Path>
                )}
            </Rotate>
        </Scale>
    </Part>
)

export { Ship, OnFrame, Init }
