
// Visual style options
export const VIDEO_CATEGORIES = {
  "Hollywood Script": "Hollywood Script",
  "Educational": "Educational",
  "Marketing": "Marketing",
  "Tutorial": "Tutorial",
  "Travel": "Travel"
} as const;

export const TRANSITION_STYLES = {
  "fade": "Fade",
  "circleopen": "CircleOpen",
  "radial": "Radial", 
  "slideleft": "SlideLeft"
} as const;

export const SUBTITLE_COLORS = {
  "white": "White",
  "yellow": "Yellow",
  "black": "Black",
  "red": "Red",
  "blue": "Blue"
} as const;

export const IMAGE_MODELS = {
  "basic": {
    label: "Basic",
    value: "black-forest-labs/FLUX.1-schnell-free",
    description: "Free model for basic image generation"
  },
  "advanced": {
    label: "Advanced",
    value: "black-forest-labs/FLUX.1-schnell",
    description: "Premium model for higher quality image generation"
  }
} as const;

export const SUBTITLE_STYLES = {
  "Default": "Default",
  "Colour gradient": "Colour gradient",
  "Tilt animation": "Tilt animation",
  "Karaoke": "Karaoke"
} as const;

