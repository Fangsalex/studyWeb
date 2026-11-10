const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const UUID = process.env.UUID || "a1b2c3d4-e5f6-7777-8888-9999aaaabbbb";
const WS_PATH = process.env.WS_PATH || "/telemetry";
const CORE_PORT = 30001;

const config = {
  inbounds: [{
    port: CORE_PORT,
    listen: "127.0.0.1",
    protocol: "vless",
    settings: {
      clients: [{ id: UUID }],
      decryption: "none"
    },
    streamSettings: {
      network: "ws",
      wsSettings: { path: WS_PATH }
    }
  }],
  outbounds: [{
    protocol: "freedom"
  }]
};

fs.writeFileSync('config.json', JSON.stringify(config));

spawn('./sys-worker', ['-c', 'config.json'], { stdio: 'ignore' });

app.get('/', (req, res) => {
  res.status(200).json({ status: "active", uptime: process.uptime() });
});

app.use(WS_PATH, createProxyMiddleware({
  target: `http://127.0.0.1:${CORE_PORT}`,
  changeOrigin: true,
  ws: true,
  logLevel: 'silent'
}));

app.listen(PORT, () => {});
