const serverUrl = new URL(process.env.PATH_PREFIX ?? "");

const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: serverUrl.protocol.substring(0, serverUrl.protocol.length - 1),
            hostname: serverUrl.hostname,
            port: serverUrl.port,
            pathname: '**'
        }]
    }
}

module.exports = nextConfig
