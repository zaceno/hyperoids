import { h } from './hyperappv2'

const wrapCoord = (full, coord = 0) => (coord < 0 ? full + coord : coord)
const relCoord = (full, coord = 0) =>
    Math.abs(coord) <= 1 ? full * coord : coord
const wrapRelCoord = (full, coord) => wrapCoord(full, relCoord(full, coord))

const cvc = draw => h('', { draw })
const draw = (ch, ctx, w, h) =>
    ch
        .filter(c => !!c.props)
        .map(c => c.props.draw)
        .forEach(draw => draw(ctx, w, h))

const transform = (children, f) =>
    cvc((ctx, width, height) => {
        ctx.save()
        const [w, h] = f ? f(ctx, width, height) : [width, height]
        draw(children, ctx, w, h)
        ctx.restore()
    })
const Transform = (props, children) => transform(children, props.f)
const Rotate = (props, children) =>
    transform(children, (ctx, width, height) => {
        ctx.rotate(props.angle || 0)
        return [width, height]
    })

const Part = (props, children) =>
    transform(children, (ctx, width, height) => {
        ctx.translate(
            wrapRelCoord(width, props.x),
            wrapRelCoord(height, props.y)
        )
        return [relCoord(width, props.width), relCoord(height, props.height)]
    })

const Scale = (props, children) =>
    transform(children, (ctx, width, height) => {
        if (!props.width && !props.height) {
            return [width, height]
        } else if (props.width && !props.height) {
            let s = width / props.width
            ctx.scale(s, s)
            return [props.width, height / s]
        } else if (!props.width && props.height) {
            let s = height / props.height
            ctx.scale(s, s)
            return [width / s, props.height]
        } else {
            let sx = width / props.width
            let sy = height / props.height
            ctx.scale(sx, sy)
            return [props.width, props.height]
        }
    })

const Fill = props =>
    cvc((ctx, width, height) => {
        ctx.save()
        ctx.fillStyle = props.color || '#000'
        ctx.fillRect(0, 0, width, height)
        ctx.restore()
    })

const Path = (props, children) =>
    cvc((ctx, width, height) => {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        draw(children, ctx, width, height)
        if (props.closed) ctx.closePath()
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        if (props.width) ctx.lineWidth = props.width
        if (props.cap) ctx.lineCap = props.cap
        if (props.join) ctx.lineJoin = props.join
        if (props.fill) {
            ctx.fillStyle = props.fill
            ctx.fill()
        }
        if (props.stroke) {
            ctx.strokeStyle = props.stroke
            ctx.stroke()
        }
        ctx.restore()
    })

const Move = ({ x = 0, y = 0 }) => cvc(ctx => ctx.moveTo(x, y))
const Line = ({ x = 0, y = 0 }) => cvc(ctx => ctx.lineTo(x, y))
const Arc = ({ x = 0, y = 0, radius = 0, start = 0, end = 0, anti = false }) =>
    cvc(ctx => ctx.arc(x, y, radius, start, end, anti))
const Bezier = ({ ax = 0, ay = 0, bx = 0, by = 0, x = 0, y = 0 }) =>
    cvc(ctx => ctx.bezierTo(ax, ay, bx, by, x, y))
const Ellipse = ({
    x = 0,
    y = 0,
    rx = 0,
    ry = 0,
    rot = 0,
    start = 0,
    end = Math.PI * 2,
    anti = 0,
}) => cvc(ctx => ctx.ellipse(x, y, rx, ry, rot, start, end, anti))

const Canvas = (props, children) => {
    const redraw = el => {
        let { width, height } = props
        if (!width || !height) {
            const rect = el.getBoundingClientRect()
            el.width = rect.width
            el.height = rect.height
            width = rect.width
            height = rect.height
        }
        const ctx = el.getContext('2d')
        draw(children, ctx, width, height)
    }
    return h('canvas', { key: 'thecanvas', onCreate: redraw, onUpdate: redraw })
}

export {
    Canvas,
    Transform,
    Part,
    Rotate,
    Scale,
    Fill,
    Path,
    Move,
    Line,
    Arc,
    Bezier,
    Ellipse,
}
