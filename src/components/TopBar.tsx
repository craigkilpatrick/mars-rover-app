interface TopBarProps {
  isConnected: boolean
}

const TopBar: React.FC<TopBarProps> = ({ isConnected }) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 h-12 z-50 flex items-center justify-between px-4 border-b backdrop-blur-md"
      style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(15,17,23,0.8)' }}
    >
      <span
        className="font-mono text-sm font-bold uppercase"
        style={{ color: '#06b6d4', letterSpacing: '0.3em' }}
      >
        MISSION CONTROL
      </span>

      <span className="font-mono text-xs font-medium">
        {isConnected ? (
          <span style={{ color: '#4ade80' }}>● CONNECTED</span>
        ) : (
          <span style={{ color: '#ef4444' }}>● DISCONNECTED</span>
        )}
      </span>
    </div>
  )
}

export default TopBar
