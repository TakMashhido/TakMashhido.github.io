// Reproducible arbiter-PUF simulation used by the blog post "How a PUF works".
// Run: node tools/puf-sim.mjs  → writes src/data/puf-sim.json
// Model: additive delay model, r = sgn(w · Φ(c) + noise), Φ_i = Π_{j>=i} (1 - 2 c_j).
import { writeFileSync } from 'node:fs';

let seed = 20261103;
const rand = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const gauss = () => Math.sqrt(-2 * Math.log(Math.max(rand(), 1e-12))) * Math.cos(2 * Math.PI * rand());

const N = 64;            // stages
const CHIPS = 40;        // simulated chips
const BITS = 128;        // response bits per fingerprint (one bit per challenge)
const READS = 10;        // repeated reads per chip for reliability
const NOISE = 0.08;      // noise std as a fraction of the weight-vector norm (per evaluation)

const newChip = () => Array.from({ length: N + 1 }, gauss);
const challenge = () => Array.from({ length: N }, () => (rand() < 0.5 ? 0 : 1));
const phi = (c) => { const f = new Array(N + 1).fill(1); for (let i = N - 1; i >= 0; i--) f[i] = f[i + 1] * (1 - 2 * c[i]); return f; };
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const norm = (w) => Math.sqrt(dot(w, w));
const evalBit = (w, f, noisy) => (dot(w, f) + (noisy ? gauss() * NOISE * norm(w) : 0) > 0 ? 1 : 0);
const hd = (a, b) => a.reduce((s, x, i) => s + (x !== b[i] ? 1 : 0), 0) / a.length;

// ---------- Fingerprints ----------
const chips = Array.from({ length: CHIPS }, newChip);
const feats = Array.from({ length: BITS }, () => phi(challenge()));
const golden = chips.map((w) => feats.map((f) => evalBit(w, f, false)));

const intra = [];
chips.forEach((w, k) => { for (let r = 0; r < READS; r++) intra.push(hd(golden[k], feats.map((f) => evalBit(w, f, true)))); });
const inter = [];
for (let a = 0; a < CHIPS; a++) for (let b = a + 1; b < CHIPS; b++) inter.push(hd(golden[a], golden[b]));
const uniformity = golden.map((r) => r.reduce((s, x) => s + x, 0) / BITS);
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;

const BIN = 0.025;
const hist = (xs) => { const h = new Array(Math.round(1 / BIN)).fill(0); xs.forEach((x) => h[Math.min(h.length - 1, Math.floor(x / BIN))]++); return h.map((c) => c / xs.length); };

// ---------- Modelling attack: logistic regression on Φ ----------
function train(X, y, epochs = 120, lr = 0.05) {
  const w = new Array(N + 1).fill(0), m = new Array(N + 1).fill(0), v = new Array(N + 1).fill(0);
  let t = 0; const B = 64;
  for (let e = 0; e < epochs; e++) {
    for (let s = 0; s < X.length; s += B) {
      const g = new Array(N + 1).fill(0); const end = Math.min(X.length, s + B);
      for (let i = s; i < end; i++) { const p = 1 / (1 + Math.exp(-dot(w, X[i]))); const err = p - y[i]; for (let j = 0; j <= N; j++) g[j] += err * X[i][j]; }
      t++;
      for (let j = 0; j <= N; j++) { const gj = g[j] / (end - s); m[j] = 0.9 * m[j] + 0.1 * gj; v[j] = 0.999 * v[j] + 0.001 * gj * gj; w[j] -= (lr * (m[j] / (1 - 0.9 ** t))) / (Math.sqrt(v[j] / (1 - 0.999 ** t)) + 1e-8); }
    }
  }
  return w;
}
const accuracy = (w, X, y) => mean(X.map((x, i) => ((dot(w, x) > 0 ? 1 : 0) === y[i] ? 1 : 0)));

const victim = newChip();
const xorVictim = Array.from({ length: 4 }, newChip);
const xorEval = (f) => xorVictim.reduce((s, w) => s ^ evalBit(w, f, false), 0);
const TEST = Array.from({ length: 3000 }, () => phi(challenge()));
const yTestA = TEST.map((f) => evalBit(victim, f, false));
const yTestX = TEST.map(xorEval);
const sizes = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
const attack = sizes.map((n) => {
  const X = Array.from({ length: n }, () => phi(challenge()));
  const wa = train(X, X.map((f) => evalBit(victim, f, false)));
  const wx = train(X, X.map(xorEval));
  return { crps: n, arbiter: +accuracy(wa, TEST, yTestA).toFixed(4), xor4: +accuracy(wx, TEST, yTestX).toFixed(4) };
});

const out = {
  params: { stages: N, chips: CHIPS, bits: BITS, reads: READS, noise: NOISE, bin: BIN },
  metrics: {
    uniqueness: +mean(inter).toFixed(4),
    reliability: +(1 - mean(intra)).toFixed(4),
    uniformity: +mean(uniformity).toFixed(4),
    intraMax: +Math.max(...intra).toFixed(4),
    interMin: +Math.min(...inter).toFixed(4),
  },
  hist: { intra: hist(intra).map((x) => +x.toFixed(4)), inter: hist(inter).map((x) => +x.toFixed(4)) },
  attack,
};
writeFileSync(new URL('../src/data/puf-sim.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(out.metrics, attack);
