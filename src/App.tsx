import { IntroGate } from './components/IntroGate';
import { MusicControl } from './components/MusicControl';
import { Thread } from './components/Thread';
import { BirthdayScene } from './scenes/BirthdayScene';
import { ColorScene } from './scenes/ColorScene';
import { DreamsScene } from './scenes/DreamsScene';
import { EyesScene } from './scenes/EyesScene';
import { FallScene } from './scenes/FallScene';
import { HeartScene } from './scenes/HeartScene';
import { MemoriesScene } from './scenes/MemoriesScene';
import { OpeningScene } from './scenes/OpeningScene';
import { PersonalScene } from './scenes/PersonalScene';
import { QuoteScene } from './scenes/QuoteScene';
import { ResponseScene } from './scenes/ResponseScene';
import { SoulScene } from './scenes/SoulScene';
import { World } from './three/World';

/** One continuous journey. Order must match SCENES in scenes/config.ts. */
export function App() {
  return (
    <>
      <World />
      <main className="journey">
        <OpeningScene />
        <ColorScene />
        <HeartScene />
        <MemoriesScene />
        <EyesScene />
        <FallScene />
        <QuoteScene />
        <ResponseScene />
        <SoulScene />
        <DreamsScene />
        <PersonalScene />
        <BirthdayScene />
      </main>
      <Thread />
      <MusicControl />
      <IntroGate />
    </>
  );
}
