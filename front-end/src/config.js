


const config = {
    authorization_endpoint: `http://127.0.0.1:5556/dex/auth`,
    client_id: `example-app`,
    redirect_uri: `http://127.0.0.1:3000/callback`,
    scope: ["openid","email","offline_access"],
    token_endpoint: 'http://127.0.0.1:5556/dex/token',
    userinfo_endpoint: "http://127.0.0.1:5556/dex/userinfo",
}

export default config;