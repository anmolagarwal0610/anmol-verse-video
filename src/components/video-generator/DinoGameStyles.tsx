// CSS as a React fragment; keep inline for fast editing
import React from "react";

const DinoGameStyles = ({ primaryGradient }: { primaryGradient: string }) => (
  <style>{`
    .dino-game-container {
      position: relative;
      width: 100%;
      max-width: 480px;
      height: 180px;
      background: ${primaryGradient};
      overflow: hidden;
      border-radius: 16px;
      margin: 1.5rem auto 0 auto;
      box-shadow: 0 6px 32px 0 rgba(90,60,140,0.09), 0 1.5px 4px 0 rgba(80,80,140,0.06);
      border: 1.5px solid #ddd;
    }
    @media (max-width: 640px) {
      .dino-game-container {
        max-width: 99vw;
        height: 110px;
        min-height: 85px;
      }
      .dino-dino, .dino-obstacle {
        height: 26px !important;
        width: 26px !important;
      }
    }
    .dino-score {
      position: absolute;
      top: 10px;
      left: 18px;
      color: #fff;
      font-size: 17px;
      font-weight: bold;
      font-family: ui-monospace, monospace;
      text-shadow: 1px 1px 12px rgba(134,109,205,0.25);
      z-index: 10;
      letter-spacing: 0.5px;
    }
    .dino-dino {
      position: absolute;
      width: 40px;
      height: 44px;
      background-color: transparent !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      bottom: 0;
      left: 55px;
      transition: top 0.21s cubic-bezier(.31,1.23,.78,1.11);
      top: 130px;
      padding: 0;
      z-index: 2;
      outline: none;
    }
    .dino-dino.dino-jump {
      animation: dinoJumpAnim 0.5s cubic-bezier(.47,1.64,.41,.8);
    }
    @keyframes dinoJumpAnim {
      0% { top: 130px; }
      50% { top: 58px; }
      100% { top: 130px; }
    }
    .dino-obstacle {
      position: absolute;
      width: 22px;
      background: #fff;
      border-radius: 8px;
      border: 2px solid #9b87f5;
      box-shadow: 0 6px 14px 0 rgba(123,109,255,0.16);
      bottom: 0;
      left: 100%;
      animation: dinoObstacleAnim 1.7s linear infinite;
      z-index: 1;
    }
    .dino-obstacle.dino-stop {
      animation-play-state: paused;
    }
    @keyframes dinoObstacleAnim {
      0% { left: 100%; }
      100% { left: -30px; }
    }
    .dino-game-over {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: inherit;
      font-size: 17px;
      background: rgba(8,6,40,0.80);
      color: #fff;
      padding: 18px 24px 24px 24px;
      border-radius: 8px;
      box-shadow: 0 2px 32px 0 rgba(140,120,170,0.09);
      border: 1.5px solid #a391f6;
      min-width: 220px;
      text-align: center;
      z-index: 3;
    }
  `}</style>
);

export default DinoGameStyles;
