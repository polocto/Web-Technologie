
import crypto from 'crypto';
import axios from 'axios';
import qs from 'querystring';
import Cookies from 'js-cookie';

const auth = {
    authorization_endpoint: `http://127.0.0.1:5556/dex/auth`,
    client_id: `example-app`,
    redirect_uri: `http://127.0.0.1:3000/callback`,
    scope: ["openid","email","offline_access"],
    code_verifier: "kjizgoojkpqefj",
    code_challenge: '',
    token_endpoint: 'http://127.0.0.1:5556/dex/token',
    
    base64URLEncode: (str) => str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''),
    
    sha256: (buffer) => crypto.createHash('sha256').update(buffer).digest(),
    
    
    redirectURLGeneration: () => {
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
        console.log(JSON.stringify(data));
        Cookies.set(auth.code_verifier,code_verifier,{path: 'callback'});
        return data;
    },
    
    
    codeGrant: async (code) => {
        try {
            const code_verifier = Cookies.get(auth.code_verifier);
            console.log(code_verifier);
            const {data} =  await axios.post(auth.token_endpoint,
            qs.stringify({
                grant_type: 'authorization_code',
                client_id: auth.client_id,
                redirect_uri: auth.redirect_uri,
                code_verifier: code_verifier,
                code: code
            }));
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    }

}

export default auth;