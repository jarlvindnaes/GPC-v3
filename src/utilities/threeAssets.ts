// Shared loading for the site's three.js scenes. Several scenes on one page use the same files (the studio HDR,
// the Soft Lounge Chair, the Draco decoder): with three's file cache on, each URL is downloaded once per page and
// handed to every loader that asks (each scene still parses its own copy, so one scene's cleanup can't touch
// another's). The Draco decoder is one loader for the page, so its wasm is compiled once; it lives as long as
// the page, so scenes don't dispose it.
import * as Three from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { DRACO_DECODER_PATH } from "./draco";

Three.Cache.enabled = true;

let draco: DRACOLoader | null = null;

export function sharedDracoLoader(): DRACOLoader {
  if (!draco) draco = new DRACOLoader().setDecoderPath(DRACO_DECODER_PATH);
  return draco;
}
