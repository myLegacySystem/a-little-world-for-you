import { content, photos } from '../../data/content';
import { Photo } from '../ui/Photo';
import { Reveal, SceneText } from '../ui/SceneText';
import { Scene, useSceneProgress } from './Scene';
import { ramp } from './ramp';

const { quote } = content;

// Stanzas share the first ~60% of the scene; the afterword gets the rest.
const START = 0.04;
const SPAN = 0.11;

/** The quote, stanza by stanza, then what it made me think of. */
export function QuoteScene() {
  return (
    <Scene id="quote" length={7} label="Quote">
      <QuoteStage />
    </Scene>
  );
}

function QuoteStage() {
  const p = useSceneProgress();
  const quoteEnd = START + SPAN * quote.stanzas.length;
  const thought = ramp(p, 0.62, 0.7) * (1 - ramp(p, 0.74, 0.8));

  return (
    <>
      <figure className="quote">
        <div className="stack stack--center">
          {quote.stanzas.map((lines, i) => {
            const from = START + SPAN * i;
            const last = i === quote.stanzas.length - 1;
            return (
              <blockquote
                key={i}
                className={`stanza ${i === quote.sparkleStanza ? 'stanza--sparkle' : ''} ${last ? 'stanza--last' : ''}`}
              >
                <SceneText lines={lines} from={from} to={from + 0.04} out={from + SPAN - 0.012} lineClassName="line--quote" />
                {i === quote.sparkleStanza && <Glints on={p >= from && p < from + SPAN} />}
              </blockquote>
            );
          })}
        </div>
        <Reveal as="figcaption" at={START + 0.03} out={quoteEnd} className="attribution">
          — {quote.author}, <cite>{quote.source}</cite> ({quote.year})
        </Reveal>
      </figure>

      <div className="layout layout--afterword">
        <Photo photo={photos.thought} visible={thought} className="photo--thought" />
        <div className="stack stack--center">
          <Reveal at={0.63} out={0.75} className="line line--medium">
            {quote.afterword.thought}
          </Reveal>
          <SceneText lines={quote.afterword.notBecause} from={0.76} to={0.81} out={0.87} lineClassName="line--medium" />
          <SceneText lines={quote.afterword.eyesSoul} from={0.88} to={0.94} lineClassName="line--medium" className="lines--heart" />
        </div>
      </div>
    </>
  );
}

/** Tiny lights around the "sparkle in her eyes" line, like stars on water. */
function Glints({ on }: { on: boolean }) {
  return (
    <div className={`glints ${on ? 'is-on' : ''}`} aria-hidden>
      {Array.from({ length: 14 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${20 + ((i * 53) % 70)}%`,
            animationDelay: `${(i * 0.37) % 3}s`,
          }}
        />
      ))}
    </div>
  );
}
