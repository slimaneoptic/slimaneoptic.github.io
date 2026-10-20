// Gate probe: the smallest classic worker. It only says it ran.
postMessage({ type: 'alive', kind: 'classic', isolated: self.crossOriginIsolated === true });
