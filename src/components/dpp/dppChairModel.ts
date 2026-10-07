import type * as Three from "three";
import { slopeChair } from "./dppProductData";

// Soft Lounge Chair, split into one node per physical piece (Leather seat, Armrest left, Front leg
// right, Shell back, Connector bolt left top, ...), built from the product's AR model.
export const CHAIR_MODEL = `${import.meta.env.BASE_URL}models/soft-lounge-chair.glb`;

/** A piece's name as written in the model (GLTFLoader turns spaces in node names into underscores). */
export function pieceName(piece: Three.Object3D) {
  return piece.name.replace(/_/g, " ");
}

/** The purchasable part a model piece belongs to, from each part's `modelPieces` prefixes. */
export function partForPiece(piece: Three.Object3D): string | null {
  const name = pieceName(piece);
  const part = slopeChair.materialsAndComponents.purchasableParts.find((p) =>
    p.modelPieces?.some((prefix) => name.startsWith(prefix))
  );
  return part?.id ?? null;
}
