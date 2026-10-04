/** Original decorative prototype illustration, not a product photograph or wiring guide. */
export function PrototypeIllustration() {
  return <svg viewBox="0 0 1120 310" fill="none" aria-hidden="true" className="prototype-illustration">
    <defs>
      <linearGradient id="prototype-board" x1="80" y1="50" x2="370" y2="270" gradientUnits="userSpaceOnUse"><stop stopColor="#326C59" /><stop offset="1" stopColor="#153E34" /></linearGradient>
      <linearGradient id="prototype-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#F6F6EE" /><stop offset=".45" stopColor="#9BA3A0" /><stop offset=".7" stopColor="#E8EAE3" /><stop offset="1" stopColor="#A0AAA5" /></linearGradient>
      <filter id="prototype-shadow" x="-30%" y="-35%" width="180%" height="200%"><feDropShadow dx="8" dy="15" stdDeviation="10" floodColor="#494720" floodOpacity=".24" /></filter>
      <pattern id="breadboard-holes" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse"><rect x="5" y="5" width="4" height="4" rx=".7" fill="#848884" /><path d="M5 9V5h4" stroke="#666D65" strokeWidth=".7" /></pattern>
    </defs>
    <g strokeLinecap="round" strokeWidth="7">
      <path d="M315 165C390 165 370 28 467 28H771C860 28 842 140 957 140" stroke="#BD583F" />
      <path d="M319 182C401 182 398 292 480 292H856C935 292 860 158 957 158" stroke="#35393D" />
      <path d="M308 139C410 139 385 68 442 68H609V155" stroke="#517A91" />
    </g>
    <g transform="translate(92 51) rotate(-7 136 94)" filter="url(#prototype-shadow)">
      <rect x="0" y="5" width="264" height="194" rx="9" fill="#153B30" />
      <rect width="264" height="194" rx="9" fill="url(#prototype-board)" stroke="#719678" strokeWidth="2" />
      {[13,251].flatMap(x => [13,181].map(y => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="6" fill="#D3B967" /><circle cx={x} cy={y} r="3" fill="#224739" /></g>))}
      <g stroke="#65977B" strokeWidth="1.4" opacity=".7"><path d="M34 44h42l18 18h90M40 153h34l20-20h97M186 51h24v37h35M177 139h35v20h33M83 70v-38h53M84 130v30h58M28 108h60M166 84h66M166 95h48" /></g>
      <rect x="5" y="78" width="36" height="44" rx="3" fill="url(#prototype-metal)" stroke="#D0D9CC" /><rect x="1" y="84" width="14" height="32" rx="2" fill="#424B48" /><path d="M5 91v17" stroke="#B2B9B3" strokeWidth="3" />
      <rect x="98" y="51" width="85" height="87" rx="3" fill="#1F2525" stroke="#687A69" />
      {Array.from({length:8},(_,i)=><g key={i} stroke="#BEC1A8" strokeWidth="4"><path d={`M${106+i*10} 44v7M${106+i*10} 138v7M91 ${59+i*10}h7M183 ${59+i*10}h7`} /></g>)}
      <path d="M121 73h40l-39 40h39M119 93h44" stroke="#D6DFC6" strokeWidth="4" />
      <circle cx="106" cy="128" r="2" fill="#8C9B87" />
      {Array.from({length:14},(_,i)=><g key={i}><rect x={41+i*13} y="13" width="10" height="19" fill="#222923" /><rect x={44+i*13} y="17" width="4" height="10" fill="#B9A064" /><rect x={41+i*13} y="164" width="10" height="19" fill="#222923" /><rect x={44+i*13} y="168" width="4" height="10" fill="#B9A064" /></g>)}
      {[52,68,205,222].map((x,i)=><g key={x}><rect x={x} y={i<2?56:110} width="10" height="23" fill="#B9B79B" /><rect x={x+1} y={i<2?61:115} width="8" height="13" fill="#9D8353" /></g>)}
      <rect x="215" y="53" width="18" height="35" rx="4" fill="url(#prototype-metal)" /><circle cx="223" cy="145" r="5" fill="#E8CA53" />
    </g>
    <g transform="translate(462 88) rotate(4 170 80)" filter="url(#prototype-shadow)">
      <rect y="8" width="343" height="155" rx="8" fill="#B9BEB5" />
      <rect width="343" height="155" rx="8" fill="#EDEEE5" stroke="#FFFFF1" strokeWidth="2" />
      <rect x="15" y="29" width="312" height="42" fill="url(#breadboard-holes)" /><rect x="15" y="84" width="312" height="42" fill="url(#breadboard-holes)" />
      <path d="M14 15h314M14 139h314" stroke="#AB5250" strokeWidth="2" /><path d="M14 21h314M14 145h314" stroke="#54829A" strokeWidth="1.4" />
      <path d="M10 77h323" stroke="#C7CCC2" strokeWidth="6" />
      <g transform="translate(146 56)"><rect width="62" height="43" rx="3" fill="#2B3030" />{Array.from({length:6},(_,i)=><path key={i} d={`M${6+i*10} -8v8M${6+i*10} 43v8`} stroke="#ADB4AC" strokeWidth="3" />)}<path d="M26 14h14M26 20h14M26 26h9" stroke="#74817A" strokeWidth="1.5" /><circle cx="7" cy="7" r="2" fill="#88928A" /></g>
      <g transform="translate(53 46)"><path d="M0 9h52" stroke="#818A7D" strokeWidth="3" /><rect x="12" width="29" height="17" rx="5" fill="#CAB17B" /><path d="M19 1v15M25 1v15M33 1v15" stroke="#764C35" strokeWidth="3" /></g>
      <g transform="translate(260 56)"><path d="M0 7v49M16 7v36" stroke="#7A857C" strokeWidth="3" /><path d="M-3 10V0a11 11 0 0 1 22 0v10z" fill="#D3724E" stroke="#A0573F" /><path d="M1-1a6 6 0 0 1 5-6" stroke="#F7BB8D" strokeWidth="3" strokeLinecap="round" /></g>
    </g>
    <g transform="translate(927 101) rotate(9 43 44)" filter="url(#prototype-shadow)">
      <path d="M35 85v46M54 85v36" stroke="#969C8D" strokeWidth="5" />
      <circle cx="44" cy="43" r="44" fill="#282E2B" /><circle cx="44" cy="43" r="35" fill="#39423A" stroke="#7B8470" strokeWidth="2" />
      <path d="M20 43h48M44 19v48" stroke="#E7D37B" strokeWidth="3" /><circle cx="44" cy="43" r="12" fill="#252B25" stroke="#B5AB78" strokeWidth="2" />
    </g>
    <g stroke="#656334" opacity=".5"><path d="M38 102v98M29 151h18M1040 102v98M1031 151h18" /></g>
  </svg>
}
