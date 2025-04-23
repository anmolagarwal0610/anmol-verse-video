
// Monkey emoji, fully transparent box, smaller hit area
import React, { forwardRef } from "react";

interface DinoMonkeyProps {
  isJumping: boolean;
}
const MONKEY_EMOJI = "🐵";

// Use ref forwarding to pass down the ref
const DinoMonkey = forwardRef<HTMLDivElement, DinoMonkeyProps>(
  ({ isJumping }, ref) => (
    <div
      ref={ref}
      className={`dino-dino${isJumping ? " dino-jump" : ""}`}
      style={{
        // Transparent everything, nearly no box at all
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
        fontSize: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 44,
        padding: 0,
      }}
      tabIndex={-1}
    >
      <span
        role="img"
        aria-label="Monkey"
        style={{
          fontSize: 34,
          display: "inline-block",
          pointerEvents: "none",
        }}
      >
        {MONKEY_EMOJI}
      </span>
    </div>
  )
);

DinoMonkey.displayName = "DinoMonkey";
export default DinoMonkey;
