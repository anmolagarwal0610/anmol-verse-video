
// Audio-related constants
export const AUDIO_LANGUAGES = {
  "English": "English",
  "Hindi": "Hindi"
} as const;

export interface VoiceOption {
  id: string;
  name: string;
  category: string;
  language: string;
  previewUrl: string;
  is_premium?: boolean; // Added is_premium as optional property
}

export const VOICE_OPTIONS: Record<string, VoiceOption> = {
  "iiidtqDt9FBdT1vfBluA": {
    id: "iiidtqDt9FBdT1vfBluA",
    name: "Bill L. Oxley",
    category: "Narration",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/user/Bi4YhYxPTDRSUfiEpED4qyJ0biq2/voices/iiidtqDt9FBdT1vfBluA/T36MtmAvwCajW33mBOpD.mp3"
  },
  "21m00Tcm4TlvDq8ikWAM": {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    category: "Narration",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/b4928a68-c03b-411f-8533-3d5c299fd451.mp3"
  },
  "c6bExSiHfx47LERqW2VK": {
    id: "c6bExSiHfx47LERqW2VK",
    name: "Rhea",
    category: "Late Night Storyteller",
    language: "Hindi",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/c6bExSiHfx47LERqW2VK/2r2vzsjZ9dJL3TenFARf.mp3"
  },
  "IvLWq57RKibBrqZGpQrC": {
    id: "IvLWq57RKibBrqZGpQrC",
    name: "Leo",
    category: "Energetic, Conversational",
    language: "Hindi",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/custom/voices/IvLWq57RKibBrqZGpQrC/Sv8CxRCqu5bIr5DgOp37.mp3"
  },
  "zgqefOY5FPQ3bB7OZTVR": {
    id: "zgqefOY5FPQ3bB7OZTVR",
    name: "Niraj",
    category: "Hindi Narrator",
    language: "Hindi",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/workspace/514d94e9241c48e8b7905375729c436f/voices/zgqefOY5FPQ3bB7OZTVR/6oNuCi9jEFU1AWW85Tru.mp3"
  },
  "9BWtsMINqrJLrRacOk9x": {
    id: "9BWtsMINqrJLrRacOk9x",
    name: "Aria",
    category: "Social Media",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/9BWtsMINqrJLrRacOk9x/405766b8-1f4e-4d3c-aba1-6f25333823ec.mp3"
  },
  "CwhRBWXzGAHq8TQ4Fs17": {
    id: "CwhRBWXzGAHq8TQ4Fs17",
    name: "Roger",
    category: "Social Media",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3"
  },
  "EXAVITQu4vr4xnSDxMaL": {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Sarah",
    category: "News",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3"
  },
  "JBFqnCBsd6RMkjVDRZzb": {
    id: "JBFqnCBsd6RMkjVDRZzb",
    name: "George",
    category: "Narration, British",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3"
  },
  "SAz9YHcvj6GT2YYXdXww": {
    id: "SAz9YHcvj6GT2YYXdXww",
    name: "River",
    category: "Social Media, American",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3"
  },
  "google_male": {
    id: "google_male",
    name: "Google - Male",
    category: "Text to Speech",
    language: "English",
    previewUrl: "https://storage.googleapis.com/kiratpur-ka-hero/Voices/english_male.mp3",
    is_premium: false
  },
  "google_female": {
    id: "google_female",
    name: "Google - Female",
    category: "Text to Speech",
    language: "English",
    previewUrl: "https://storage.googleapis.com/kiratpur-ka-hero/Voices/english_Female.mp3",
    is_premium: false
  },
  "google_male_hindi": {
    id: "google_male_hindi",
    name: "Google - Male (Hindi)",
    category: "Text to Speech",
    language: "Hindi",
    previewUrl: "https://storage.googleapis.com/kiratpur-ka-hero/Voices/Hindi_male.mp3",
    is_premium: false
  },
  "google_female_hindi": {
    id: "google_female_hindi",
    name: "Google - Female (Hindi)",
    category: "Text to Speech",
    language: "Hindi",
    previewUrl: "https://storage.googleapis.com/kiratpur-ka-hero/Voices/Hindi_Female.mp3",
    is_premium: false
  }
} as const;
