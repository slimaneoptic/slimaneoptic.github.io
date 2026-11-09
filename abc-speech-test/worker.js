// Runs Whisper in the browser. Audio stays on the device.
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2';

env.allowLocalModels = false;
env.useBrowserCache = true;

const MODELS = { tiny: 'onnx-community/whisper-tiny.en', base: 'onnx-community/whisper-base.en' };
const pipes = {};

async function load(key) {
  if (!pipes[key]) {
    const files = {};
    pipes[key] = pipeline('automatic-speech-recognition', MODELS[key], {
      dtype: 'q8',
      device: 'wasm',
      progress_callback: (p) => {
        if (p.status === 'progress' && p.total) {
          files[p.file] = [p.loaded, p.total];
          let done = 0, all = 0;
          Object.values(files).forEach((f) => { done += f[0]; all += f[1]; });
          self.postMessage({ type: 'progress', done, all });
        }
      },
    });
  }
  return pipes[key];
}

self.onmessage = async (e) => {
  const m = e.data;
  try {
    if (m.type === 'load') {
      const t0 = performance.now();
      await load(m.model);
      self.postMessage({ type: 'loaded', model: m.model, ms: Math.round(performance.now() - t0) });
    } else if (m.type === 'run') {
      const pipe = await load(m.model);
      const t0 = performance.now();
      const out = await pipe(m.audio, { max_new_tokens: 24, return_timestamps: false });
      self.postMessage({ type: 'result', id: m.id, text: String(out.text || ''), ms: Math.round(performance.now() - t0) });
    }
  } catch (err) {
    self.postMessage({ type: 'error', id: m.id, message: String((err && err.message) || err) });
  }
};
