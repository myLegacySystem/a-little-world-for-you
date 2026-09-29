import { playlist } from '../../data/playlist';
import { audioEngine } from './audioEngine';

export function Playlist({ current, playing }: { current: number; playing: boolean }) {
  return (
    <ol className="playlist">
      {playlist.map((song, i) => (
        <li key={song.id}>
          <button
            type="button"
            className={i === current ? 'is-current' : ''}
            aria-current={i === current}
            onClick={() => (i === current ? audioEngine.toggle() : audioEngine.select(i, true))}
          >
            <span className="playlist__num">{i === current && playing ? <Bars /> : String(i + 1).padStart(2, '0')}</span>
            <span className="playlist__title">{song.title}</span>
            {song.artist && <span className="playlist__artist">{song.artist}</span>}
          </button>
        </li>
      ))}
    </ol>
  );
}

export function Bars({ still = false }: { still?: boolean }) {
  return (
    <span className={`bars ${still ? 'bars--still' : ''}`} aria-hidden>
      <i />
      <i />
      <i />
    </span>
  );
}
