export default function ProgressCircle({ size=120, stroke=10, percent=75, label }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (percent / 100) * c
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
        <g transform={`translate(${size/2}, ${size/2})`}>
          <circle r={r} cx="0" cy="0" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none"></circle>
          <circle r={r} cx="0" cy="0" stroke="url(#g1)" strokeWidth={stroke} strokeDasharray={`${dash} ${c-dash}`} strokeLinecap="round" transform="rotate(-90)" fill="none" style={{ transition: 'stroke-dasharray 1s ease' }}></circle>
        </g>
      </svg>
      <div className="mt-2 text-center">
        <div className="text-2xl font-bold">{percent}%</div>
        {label && <div className="text-xs opacity-70">{label}</div>}
      </div>
    </div>
  )
}
