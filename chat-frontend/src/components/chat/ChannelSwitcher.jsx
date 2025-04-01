const ChannelSwitcher = ({ changeChannel }) => {
    return (
        <div>
            <button onClick={() => changeChannel('general')}>General</button>
            <button onClick={() => changeChannel('random')}>Random</button>
        </div>
    )
}

export default ChannelSwitcher;