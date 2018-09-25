import { h } from './hyperappv2'
import { Canvas, Fill, Scale } from './canvas'

const WIDTH = 1500
const HEIGHT = 1500

const mod = (x, n) => {
    let y = x
    while (y < 0) {
        y += n
    }
    return y % n
}

const modx = x => mod(x, WIDTH)
const mody = x => mod(x, HEIGHT)

const Space = (props, children) => (
    <Canvas>
        <Fill color="#000" />
        <Scale width={WIDTH} height={HEIGHT}>
            {children}
        </Scale>
    </Canvas>
)

export { Space, modx, mody }
