import { Reveal } from '../components/Reveal';
import { TEXT } from '../content/text';
import { Scene } from './Scene';

/** A quiet literary moment in deep water, then my own words again. */
export function QuoteScene() {
  return (
    <Scene id="quote" label={TEXT.LABEL_QUOTE}>
      <div className="quote on-dark">
        <figure className="quote__figure">
          <div className="stack">
            {STANZAS.map((lines, i) => {
              const from = START + SPAN * i;
              return (
                <blockquote key={i} className={`quote__stanza ${i === STANZAS.length - 1 ? 'quote__stanza--last' : ''}`}>
                  {lines.map((line, j) => (
                    <Reveal key={j} text={line} at={from + j * 0.03} out={from + SPAN - 0.01} className="t-quote" />
                  ))}
                </blockquote>
              );
            })}
          </div>
          <Reveal
            as="figcaption"
            text={`— ${TEXT.QUOTE_AUTHOR}, *${TEXT.QUOTE_SOURCE}* (${TEXT.QUOTE_YEAR})`}
            at={START + 0.02}
            out={START + SPAN * STANZAS.length}
            className="t-label quote__credit"
          />
        </figure>

        <div className="stack quote__after">
          <Reveal text={TEXT.QUOTE_AFTER_01} at={0.54} out={0.66} className="t-large" />
          <div className="quote__pair">
            <Reveal text={TEXT.QUOTE_AFTER_02} at={0.68} out={0.8} className="t-medium" />
            <Reveal text={TEXT.QUOTE_AFTER_03} at={0.72} out={0.8} className="t-medium" />
          </div>
          <div className="quote__pair">
            <Reveal text={TEXT.QUOTE_AFTER_04} at={0.82} className="t-medium" />
            <Reveal text={TEXT.QUOTE_AFTER_05} at={0.87} className="t-large" />
          </div>
        </div>
      </div>
    </Scene>
  );
}

const STANZAS = [
  [TEXT.QUOTE_01, TEXT.QUOTE_02],
  [TEXT.QUOTE_03],
  [TEXT.QUOTE_04],
  [TEXT.QUOTE_05, TEXT.QUOTE_06],
  [TEXT.QUOTE_07],
];
// The second stanza ("the sparkle in her eyes") lines up with the glints on
// the water in three/timeline.ts.
const START = 0.04;
const SPAN = 0.09;
