/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: ["23.227.193.122"],
        remotePatterns: [{
                protocol: "http",
                hostname: "23.227.193.122",
            },
            {
                protocol: "https",
                hostname: "cdn.example.com",
            },
        ],
    },
};

export default nextConfig;