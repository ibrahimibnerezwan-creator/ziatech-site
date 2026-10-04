/** Decorative, original vector artwork; never used as a catalogue product image. */
export function BoardIllustration() {
  return (
    <svg viewBox="0 0 600 510" fill="none" className="board-illustration" aria-hidden="true">
      <defs>
        <linearGradient id="pcb" x1="192" y1="96" x2="411" y2="431" gradientUnits="userSpaceOnUse"><stop stopColor="#25554F" /><stop offset="1" stopColor="#113B36" /></linearGradient>
        <linearGradient id="metal" x1="226" y1="169" x2="393" y2="324" gradientUnits="userSpaceOnUse"><stop stopColor="#F3F4EF" /><stop offset=".26" stopColor="#B8C5BF" /><stop offset=".52" stopColor="#E3E8E1" /><stop offset="1" stopColor="#899F99" /></linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EFCC7C" /><stop offset=".5" stopColor="#AF8743" /><stop offset="1" stopColor="#E9C77F" /></linearGradient>
        <filter id="board-shadow" x="-60%" y="-40%" width="230%" height="220%"><feDropShadow dx="14" dy="26" stdDeviation="17" floodColor="#244940" floodOpacity=".22" /><feDropShadow dx="3" dy="5" stdDeviation="2" floodColor="#244940" floodOpacity=".15" /></filter>
        <pattern id="workbench-grid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" stroke="#ADC6BB" strokeOpacity=".25" strokeWidth=".8" /></pattern>
      </defs>
      <rect width="600" height="510" fill="url(#workbench-grid)" />
      <g stroke="#6C9585" strokeOpacity=".35" strokeWidth="1.2">
        <path d="M0 162h97l32 32h40M600 359h-90l-36-36h-26M104 510v-86l43-43M491 0v88l-35 35" />
        <circle cx="169" cy="194" r="4" /><circle cx="448" cy="323" r="4" /><circle cx="147" cy="381" r="4" /><circle cx="456" cy="123" r="4" />
      </g>
      <circle cx="303" cy="263" r="189" stroke="#7CA08E" strokeOpacity=".3" strokeDasharray="3 8" />
      <g transform="rotate(-27 300 259)" filter="url(#board-shadow)">
        <rect x="195" y="89" width="214" height="353" rx="12" fill="#092923" />
        <rect x="192" y="84" width="214" height="353" rx="12" fill="url(#pcb)" stroke="#618273" strokeWidth="2" />
        {[101, 420].flatMap(y => [207, 391].map(x => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="6" fill="#C8AF74" /><circle cx={x} cy={y} r="3.8" fill="#1A352F" /></g>))}
        <g stroke="#739179" strokeOpacity=".58" strokeWidth="1.5">
          <path d="M213 169h18v20h30M214 211h13v67h22M216 289h15v50h36M384 169h-15v27h-16M384 232h-15v49h-18M384 341h-20v38h-36M238 324v59h40M334 324v19h17v55M259 359v42h-34M323 361v44h49" />
          <path d="M249 185h-16v-27h-18M349 184h20v-32h15M275 340v20h25v35M288 322v22h20v-22" />
        </g>
        {Array.from({length: 16}, (_, i) => (
          <g key={i}>
            <rect x="190" y={128 + i * 17} width="10" height="11" rx="2" fill="#0A2420" />
            <rect x="179" y={131 + i * 17} width="19" height="5" rx="1" fill="url(#gold)" />
            <circle cx="208" cy={133.5 + i * 17} r="3.8" fill="#B89C60" /><circle cx="208" cy={133.5 + i * 17} r="1.7" fill="#122E29" />
            <rect x="398" y={128 + i * 17} width="10" height="11" rx="2" fill="#0A2420" />
            <rect x="400" y={131 + i * 17} width="19" height="5" rx="1" fill="url(#gold)" />
            <circle cx="391" cy={133.5 + i * 17} r="3.8" fill="#B89C60" /><circle cx="391" cy={133.5 + i * 17} r="1.7" fill="#122E29" />
          </g>
        ))}
        <rect x="238" y="105" width="123" height="199" rx="4" fill="#17352D" stroke="#7E9B79" />
        <path d="M255 149v-31h14v22h14v-22h14v22h14v-22h14v22h17v-22" stroke="#C5AE73" strokeWidth="4" />
        <rect x="238" y="158" width="123" height="144" rx="4" fill="#657971" />
        <rect x="234" y="154" width="130" height="144" rx="5" fill="url(#metal)" stroke="#EEF0E5" strokeWidth="1.5" />
        <path d="M240 162h118v128H240z" stroke="#80938B" strokeOpacity=".6" />
        <path d="M278 185h42l-40 37h40M278 203h40" stroke="#5E7970" strokeWidth="5" strokeLinejoin="round" />
        <g fill="#5D736A"><rect x="262" y="240" width="73" height="3" rx="1" /><rect x="271" y="249" width="54" height="2" rx="1" /><rect x="280" y="268" width="6" height="7" /><rect x="290" y="268" width="6" height="7" /><rect x="300" y="268" width="6" height="7" /><rect x="310" y="268" width="6" height="7" /></g>
        <rect x="278" y="320" width="40" height="38" rx="2" fill="#102721" stroke="#678276" />
        {Array.from({length: 6}, (_,i) => <g key={i} stroke="#BFC8B1" strokeWidth="2"><path d={`M274 ${324+i*6}h4M318 ${324+i*6}h5`} /></g>)}
        {[231, 350].map(x => <g key={x}><rect x={x} y="329" width="17" height="26" rx="2" fill="#0A241F" stroke="#577268" /><rect x={x+4} y="334" width="9" height="16" rx="2" fill="#CCD1BC" /></g>)}
        {[245, 331, 348].map((x,i) => <g key={x}><rect x={x} y={373+i*3} width="8" height="14" fill="#C7C6A9" /><rect x={x+1} y={376+i*3} width="6" height="8" fill="#A88D64" /></g>)}
        <rect x="271" y="392" width="55" height="45" rx="4" fill="#8A9B94" />
        <rect x="267" y="389" width="55" height="42" rx="4" fill="url(#metal)" stroke="#D7DFD2" />
        <rect x="273" y="416" width="43" height="14" rx="3" fill="#253B34" />
        <path d="M280 422h29" stroke="#A8B9AD" strokeWidth="3" />
        <rect x="353" y="398" width="9" height="5" rx="1" fill="#F37440" />
        <g fill="#C9D7C8" opacity=".7"><rect x="222" y="310" width="17" height="2" /><rect x="350" y="310" width="24" height="2" /><rect x="224" y="403" width="19" height="2" /></g>
      </g>
      <g transform="translate(464 209)" stroke="#2E5F50" strokeWidth="1.5"><path d="M0 12a20 20 0 0 1 28 0M5 18a13 13 0 0 1 18 0M10 24a6 6 0 0 1 8 0" strokeLinecap="round" /><circle cx="14" cy="30" r="2" fill="#2E5F50" stroke="none" /></g>
    </svg>
  )
}
