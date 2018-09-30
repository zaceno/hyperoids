import { h } from '../lib/hyperapp/hyperappv2'
import { Canvas, Fill, Scale } from '../lib/hyperapp/canvas'
import { gameCanvas } from '../style.css'
export default ({ width, height }, children) => (
    <Canvas class={gameCanvas}>
        <Fill color="#000" />
        <Scale width={width} height={height}>
            {children}
        </Scale>
    </Canvas>
)
