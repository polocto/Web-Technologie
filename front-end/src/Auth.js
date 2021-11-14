import crypto from "crypto";
import axios from "axios";
import qs from "qs";
import config from "./config";

const base64URLEncode = (str) => str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest();

export function redirectURLGeneration(){
    const code_verifier = base64URLEncode(crypto.randomBytes(32));
    const code_challenge = base64URLEncode(sha256(code_verifier));
    const url = [
        `${config.authorization_endpoint}?`,
        `client_id=${config.client_id}&`,
        `scope=${config.scope.join("%20")}&`,
        `response_type=code&`,
        `redirect_uri=${config.redirect_uri}&`,
        `code_challenge=${code_challenge}&`,
        `code_challenge_method=S256`
    ].join('');

    const data = {
        code_verifier: code_verifier,
        url: url
    };

    return data;
}

export async function authorizationCodeGrant(code_verifier,code){
    console.log('Authorization Grant');
    try {
        const {data} = await axios.post(config.token_endpoint,
            qs.stringify({
                grant_type: "authorization_code",
                client_id: `${config.client_id}`,
                redirect_uri: `${config.redirect_uri}`,
                code_verifier: `${code_verifier}`,
                code: `${code}`
            }));
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function bearerAuthentication(access_token){
    try {
        const {data} = await axios.get(`${config.userinfo_endpoint}`,{
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}