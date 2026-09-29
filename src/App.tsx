import { MusicPlayer } from './components/audio/MusicPlayer';
import { World } from './components/effects/World';
import { BirthdayScene } from './components/scenes/BirthdayScene';
import { ColorScene } from './components/scenes/ColorScene';
import { IntroScene } from './components/scenes/IntroScene';
import { OceanScene } from './components/scenes/OceanScene';
import { PersonalScene } from './components/scenes/PersonalScene';
import { QuoteScene } from './components/scenes/QuoteScene';
import { SoulScene } from './components/scenes/SoulScene';
import { WishesScene } from './components/scenes/WishesScene';
import { ProgressIndicator } from './components/ui/ProgressIndicator';

/** One continuous journey. Order must match `sceneOrder` in lib/world.ts. */
export function App() {
  return (
    <>
      <World />
      <main className="journey">
        <IntroScene />
        <ColorScene />
        <OceanScene />
        <QuoteScene />
        <SoulScene />
        <WishesScene />
        <PersonalScene />
        <BirthdayScene />
      </main>
      <ProgressIndicator />
      <MusicPlayer />
    </>
  );
}
