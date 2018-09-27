import { h } from '../lib/hyperapp/hyperappv2'
import { Ellipse, Move, Path } from '../lib/hyperapp/canvas'

export default ({ x, y, r }) => (
    <Path fill="#0ff" stroke="#0cc" width={5}>
        <Move x={x + r} y={y} />
        <Ellipse x={x} y={y} rx={r} ry={r} />
    </Path>
)
