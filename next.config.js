/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_API}${process.env.BACKEND_PORT}/api/:path*`, 
        // http://localhost:9090/api/auth/login => /api/auth/login
      },

      {
        source: "/:tagString",
        destination: `${process.env.Get_Synonyms_API_Prefix}/:tagString/json`,
      },
    ];
  },
  env: {
    REQUEST_TIMEOUT: 10000,
  },
};
