import { Reveal } from '../components/Reveal';
import { TEXT } from '../content/text';
import { Scene } from './Scene';

/** My own words again — warmer, closer, in rose light. */
export function ResponseScene() {
  return (
    <Scene id="response" label={TEXT.LABEL_RESPONSE}>
      <div className="response">
        <div className="stack response__words">
          <Reveal text={TEXT.QUOTE_AFTER_01} at={0.14} out={0.36} className="t-large" />
          <div className="response__pair">
            <Reveal text={TEXT.QUOTE_AFTER_02} at={0.4} out={0.62} className="t-small" />
            <Reveal text={TEXT.QUOTE_AFTER_03} at={0.46} out={0.62} className="t-large" />
          </div>
          <div className="response__pair response__pair--last">
            <Reveal text={TEXT.QUOTE_AFTER_04} at={0.66} className="t-medium" />
            <Reveal text={TEXT.QUOTE_AFTER_05} at={0.74} className="t-display" />
          </div>
        </div>
      </div>
    </Scene>
  );
}
