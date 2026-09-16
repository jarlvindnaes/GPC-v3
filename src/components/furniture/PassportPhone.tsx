import { HtmlPhoneCanvas } from "../Native3DModels";
import { DppPhoneScreen } from "../dpp/DppPhoneScreen";
export function PassportPhone() {
  return (
    <div style={{ width: "100vw", height: "100dvh" }}>
      <HtmlPhoneCanvas isPlaying={true} noChrome={true} rotation={[0.05, 0.35, 0]}>
        <DppPhoneScreen />
      </HtmlPhoneCanvas>
    </div>
  );
}
