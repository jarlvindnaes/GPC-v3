import * as Three from "three";

// Depth-of-field for the exploding chair on a transparent canvas.
//
// Runs AFTER the output (tone mapping + sRGB) pass, so blurred edges are mixed in display space and
// composite over the page like the sharp chair does (the empty background is 0,0,0,0, so colours are
// effectively premultiplied). Two things keep the silhouettes clean where a stock bokeh pass does not:
// - Empty background is never blurred by its own depth (that would smear chair colour into a halo).
//   Instead it borrows the blur of chair pixels whose blur disc reaches it, so out-of-focus parts
//   spread softly outward rather than ending in a hard cut-out edge.
// - A sample in front of the pixel only counts if its own blur disc reaches this pixel, so sharp
//   foreground parts never bleed onto blurred parts behind them.
const SAMPLES = 32;

export const ChairDofShader = {
  name: "ChairDofShader",
  uniforms: {
    tDiffuse: { value: null as Three.Texture | null },
    tDepth: { value: null as Three.Texture | null },
    focus: { value: 1 }, // distance from the camera beyond which things blur (world units)
    aperture: { value: 0 }, // blur (in canvas widths) per world unit away from the focus distance
    maxblur: { value: 0.004 }, // largest blur radius, in canvas widths
    aspect: { value: 1 },
    cameraNear: { value: 0.01 },
    cameraFar: { value: 1000 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  fragmentShader: /* glsl */ `
    #include <packing>
    #define SAMPLES ${SAMPLES}
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform float focus;
    uniform float aperture;
    uniform float maxblur;
    uniform float aspect;
    uniform float cameraNear;
    uniform float cameraFar;
    varying vec2 vUv;

    const float BG_DEPTH = 0.9999;
    const float FAR = 1e6;

    float distAt( vec2 uv, out bool bg ) {
      float d = texture2D( tDepth, uv ).x;
      bg = d >= BG_DEPTH;
      return bg ? FAR : -perspectiveDepthToViewZ( d, cameraNear, cameraFar );
    }

    // Only what lies beyond the focus distance blurs; everything nearer the camera stays sharp.
    float cocOf( float dist ) {
      return min( max( dist - focus, 0.0 ) * aperture, maxblur );
    }

    // Golden-angle spiral: evenly spread points over the unit disc.
    vec2 disc( int i ) {
      float fi = float( i ) + 0.5;
      float r = sqrt( fi / float( SAMPLES ) );
      float a = fi * 2.39996323;
      return vec2( cos( a ), sin( a ) ) * r;
    }

    void main() {
      vec2 toUv = vec2( 1.0, aspect ); // radii are in canvas widths; keep the disc round
      bool bg0;
      float dist0 = distAt( vUv, bg0 );
      float radius = bg0 ? 0.0 : cocOf( dist0 );

      if ( bg0 ) {
        // Borrow the blur of nearby chair pixels whose blur disc covers this pixel.
        for ( int i = 0; i < SAMPLES; i++ ) {
          vec2 o = disc( i ) * maxblur;
          bool bgS;
          float distS = distAt( vUv + o * toUv, bgS );
          if ( !bgS ) {
            float cs = cocOf( distS );
            if ( cs >= length( o ) ) radius = max( radius, cs );
          }
        }
      }

      vec4 center = texture2D( tDiffuse, vUv );
      if ( radius < 0.0004 ) {
        gl_FragColor = center;
        return;
      }

      vec4 col = vec4( 0.0 );
      float wsum = 0.0;
      for ( int i = 0; i < SAMPLES; i++ ) {
        vec2 o = disc( i ) * radius;
        vec2 uv = vUv + o * toUv;
        bool bgS;
        float distS = distAt( uv, bgS );
        float w = 1.0;
        if ( distS < dist0 ) {
          // In front of this pixel: only counts if its own blur reaches this far.
          w = clamp( cocOf( distS ) / max( length( o ), 1e-5 ), 0.0, 1.0 );
        }
        col += texture2D( tDiffuse, uv ) * w;
        wsum += w;
      }
      gl_FragColor = wsum > 0.0 ? col / wsum : center;
    }`,
};
