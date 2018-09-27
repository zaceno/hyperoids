const effect = (props, dispatch) => {
    const downHandler = ev => dispatch(props.down, ev.key)
    const upHandler = ev => dispatch(props.up, ev.key)
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
        window.removeEventListener('keydown', downHandler)
        window.removeEventListener('keyup', upHandler)
    }
}
export default props => ({ effect, ...props })
