export type PlaceKey = 'forest' | 'ocean' | 'city' | 'school' | 'home' | 'sky' | 'underground' | 'unknown' | 'office' | 'cafe' | 'hospital' | 'street';
export type WeatherKey = 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog' | 'storm';
export type PersonKey = 'self' | 'family' | 'lover' | 'friend' | 'stranger' | 'celebrity' | 'animal';
export type ObjectKey = 'water' | 'fire' | 'mirror' | 'key' | 'stairs' | 'clock' | 'flower' | 'door';
export type DreamEmotionKey = 'peace' | 'fear' | 'confusion' | 'joy' | 'sorrow' | 'anger' | 'surprise' | 'longing';

export type ScreenName =
  | 'intro'
  | 'sceneBuilder'
  | 'emotion'
  | 'analysis'
  | 'interpretation'
  | 'share'
  | 'gallery'
  | 'pattern';

export interface SymbolReading {
  symbol: ObjectKey | PlaceKey;
  meaning: string;
}

export interface InterpretationResult {
  title: string;
  keywords: string[];
  text: string;
  symbolReadings: SymbolReading[];
  fortune: string;
  personalInsight?: string;
}

export interface DreamScene {
  place: PlaceKey | null;
  weather: WeatherKey | null;
  characters: PersonKey[];
  objects: ObjectKey[];
}

export interface DreamEntry {
  id: string;
  date: string;
  scene: {
    place: PlaceKey;
    weather: WeatherKey;
    characters: PersonKey[];
    objects: ObjectKey[];
  };
  emotions: DreamEmotionKey[];
  vividness: 1 | 2 | 3 | 4 | 5;
  memo?: string;
  journalMemo?: string;
  interpretation: InterpretationResult;
  gradientType: DreamEmotionKey;
}

export interface SceneTab {
  key: 'place' | 'weather' | 'characters' | 'objects';
  label: string;
  icon: string;
}
