import { Reveal } from '../components/Reveal';
import { TEXT } from '../content/text';
import { Scene } from './Scene';

/**
 * A quiet pause in an almost-white world: someone else's words, remembered
 * one line at a time. The attribution stays small.
 */
export function QuoteScene() {
  return (
    <Scene id="quote" label={TEXT.LABEL_QUOTE}>
      <div className="quote">
        <figure className="quote__figure">
          <div className="stack">
            {STANZAS.map((lines, i) => {
              const from = START + SPAN * i;
              const last = i === STANZAS.length - 1;
              return (
                <blockquote key={i} className={`quote__stanza ${last ? 'quote__stanza--last' : ''}`}>
                  {lines.map((line, j) => (
                    <Reveal key={j} text={line} at={from + j * 0.04} out={last ? undefined : from + SPAN - 0.012} className="t-quote remembered" />
                  ))}
                </blockquote>
              );
            })}
          </div>
          <Reveal
            as="figcaption"
            text={`— ${TEXT.QUOTE_AUTHOR}\n*${TEXT.QUOTE_SOURCE}*`}
            at={START + SPAN * (STANZAS.length - 1)}
            className="t-label quote__credit"
          />
        </figure>
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
const START = 0.14;
const SPAN = 0.15;
