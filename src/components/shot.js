import { h } from '../lib/hyperapp/hyperappv2'
import { Part, Path, Ellipse } from '../lib/hyperapp/canvas'

export default ({ x, y, angle }) => (
    <Part x={x} y={y}>
        <Path stroke="#00f" fill="#99f" width={2}>
            <Ellipse x={0} y={0} rx={4} ry={25} rot={angle} />
        </Path>
    </Part>
)
