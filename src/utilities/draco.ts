// Draco mesh decoder for every compressed 3D model on the site, served from our own public/draco/
// (copied from three's examples/jsm/libs/draco/gltf by `npm run draco:copy`) instead of Google's CDN,
// so the models load offline and from our own domain.
export const DRACO_DECODER_PATH = `${import.meta.env.BASE_URL}draco/`;
