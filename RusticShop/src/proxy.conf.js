const PROXY_CONFIG = [
  {
    context: ["/api"],
    target: "https://localhost:40443",
    secure: false,
  },
  {
    context: ["/gallery"],
    target: "https://localhost:40443",
    secure: false,
    pathRewrite: { "^/gallery": "" },
  },
];

module.exports = PROXY_CONFIG;
