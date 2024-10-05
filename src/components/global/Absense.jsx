const Absense = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <rect width={32} height={32} x={4} y={4} fill="#C20E1A" rx={10} />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M26 14 14 26m0-12 12 12"
      />
    </g>
    <defs>
      <clipPath id="a">
        <rect width={32} height={32} x={4} y={4} fill="#fff" rx={10} />
      </clipPath>
    </defs>
  </svg>
)
export default Absense