const effect = (props, dispatch) => {
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
}
export default props => ({ effect, ...props })
