
import crypto from 'crypto';
import axios from 'axios';
import qs from 'qs';
import Cookies from "js-cookie";
// import jwt from 'jsonwebtoken';
// import jwksClient from 'jwks-rsa';

const auth = {
    authorization_endpoint: `http://127.0.0.1:5556/dex/auth`,
    client_id: `example-app`,
    redirect_uri: `http://127.0.0.1:3000/callback`,
    scope: ["openid","email","offline_access"],
    code_verifier: "kjizgoojkpqefj",
    token_endpoint: 'http://127.0.0.1:5556/dex/token',
    userinfo_endpoint: "http://127.0.0.1:5556/dex/userinfo",
    jwks_uri: "http://127.0.0.1:5556/dex/keys",
    
    base64URLEncode: (str) => str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''),
    
    sha256: (buffer) => crypto.createHash('sha256').update(buffer).digest(),
    
    
    redirectURLGeneration: async () => {
        const code_verifier = auth.base64URLEncode(crypto.randomBytes(32));
        const code_challenge = auth.base64URLEncode(auth.sha256(code_verifier));
        const scopes = auth.scope.join('%20');
        const url = [
            `${auth.authorization_endpoint}?`,
            `client_id=${auth.client_id}&`,
            `scope=${scopes}&`,
            `response_type=code&`,
            `redirect_uri=${auth.redirect_uri}&`,
            `code_challenge=${code_challenge}&`,
            `code_challenge_method=S256`
        ].join('');
        const data = {
            code_verifier: code_verifier,
            url: url
        };
        return data;
    },
    
    
    codeGrant: async (code, code_verifier) => {
        try {
            await axios.post(auth.token_endpoint,
            qs.stringify({
                grant_type: 'authorization_code',
                client_id: auth.client_id,
                redirect_uri: auth.redirect_uri,
                code_verifier: code_verifier,
                code: code
            })).then( (data) => {
                Cookies.set("token",JSON.stringify(data.data),{path: ''});
                Cookies.remove(auth.code_verifier,data.code_verifier,{path: 'callback'});
            });
        } catch (error) {
            console.error(error);
        }
    },

    userInfo: async (token) => {
        try {
            const user = await axios.get(`${auth.userinfo_endpoint}`,{
                headers: {
                    'Authorization': `Bearer ${token.access_token}`
                }
            })
            .then((data) => {
                return {
                    email: data.data.email
                };
            });
            return user;
        } catch (error) {
            console.error(error);
        }
        return null;
    },
    // validation: async (token) => {
    //     const id_token = token.id_token;
    
    //     try {
    //         const header = JSON.parse(
    //             Buffer.from(
    //                 id_token
    //                 .split('.')[0], 'base64'
    //                 ).toString('utf-8'));
    //         const {publicKey, rsaPublicKey} = await jwksClient({
    //             jwksUri: auth.jwks_uri
    //         }).getSigningKey(header.kid);
        
    //         const key = publicKey || rsaPublicKey;
        
    //         jwt.verify(id_token,key);
    //         console.log("Token Valide");
    //         return true;
    
    //     } catch (error) {
    //         console.error(error);
    //         console.log("Token Invalid");
    //         return false;
    //     }
    
    // }

}

export default auth;
