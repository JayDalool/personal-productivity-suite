import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function loadCredentials() {
    const filePath = path.join(__dirname, '../../config/credentials.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

const credentials = loadCredentials();
const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

// Step 1 - Generate Auth URL
export function getAuthUrl() {
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
}

// Step 2 - Exchange Code for Token
export async function setAccessToken(code: string) {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    saveToken(tokens);
}

// Save token for later
function saveToken(tokens: any) {
    fs.writeFileSync(path.join(__dirname, '../../config/token.json'), JSON.stringify(tokens));
}

// Load saved token
function loadToken() {
    const tokenPath = path.join(__dirname, '../../config/token.json');
    if (fs.existsSync(tokenPath)) {
        const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
        oAuth2Client.setCredentials(tokens);
    }
}

export function getOAuthClient() {
    loadToken();
    return oAuth2Client;
}
