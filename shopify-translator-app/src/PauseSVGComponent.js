import React from "react";

function PauseSVGComponent({ stroke }) {
  return (
    <svg
      width="14"
      height="22"
      viewBox="0 0 14 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.20001 0.200012V21.8M11.8 0.200012V21.8"
        stroke={stroke}
        stroke-width="3"
      />
    </svg>
  );
}

export default PauseSVGComponent;
