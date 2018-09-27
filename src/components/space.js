import { h } from '../lib/hyperapp/hyperappv2'
import { Canvas, Fill, Scale } from '../lib/hyperapp/canvas'

export default ({ width, height }, children) => (
    <Canvas>
        <Fill color="#000" />
        <Scale width={width} height={height}>
            {children}
        </Scale>
    </Canvas>
)
