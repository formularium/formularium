import decode from "jwt-decode";

const AUTH_TOKEN_KEY = "authToken";

const crypto = require("crypto");

function toBase64UrlEncoded(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function generateCodeVerifier() {
  return toBase64UrlEncoded(crypto.randomBytes(32));
}

function createCodeChallenge(codeVerifier) {
  return toBase64UrlEncoded(
    crypto
      .createHash("sha256")
      .update(codeVerifier, "ascii")
      .digest("base64")
  );
}

var ClientOAuth2 = require("client-oauth2");
// TODO move to authorizatio code auth
var authServer = new ClientOAuth2({
  clientId: process.env.VUE_APP_CLIENT_ID,
  clientSecret: process.env.VUE_APP_CLIENT_SECRET,
  accessTokenUri: process.env.VUE_APP_ACCESS_TOKEN_URI,
  authorizationUri: process.env.VUE_APP_AUTHORIZATION_URI,
  redirectUri: process.env.VUE_APP_REDIRECT_URI,
  scopes: ["administrative-staff"]
});

export function loginURI() {
  let codeVerifier = generateCodeVerifier();
  let codeChallenge = createCodeChallenge(codeVerifier);
  setChallenge({ challenge: codeVerifier, verifier: codeVerifier });
  return authServer.code.getUri({
    state: "acab",
    query: {
      code_challenge: codeChallenge,
      code_challenge_method: "S256"
    }
  });
}

export async function loginCallback(uri) {
  console.log(getChallenge());
  await authServer.code
    .getToken(uri, { body: { code_verifier: getChallenge()["verifier"] } })
    .then(function(user) {
      //console.log(user)
      setAuthToken(user.accessToken);
    })
    .catch(function(error) {
      console.log(error);
    });
}

export function logout() {
  clearAuthToken();
}

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function setChallenge(token) {
  localStorage.setItem("oauthChallenge", JSON.stringify(token));
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getChallenge() {
  return JSON.parse(localStorage.getItem("oauthChallenge"));
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isLoggedIn() {
  let authToken = getAuthToken();
  return !!authToken && !isTokenExpired(authToken);
}

export function getUserInfo() {
  if (isLoggedIn()) {
    return decode(getAuthToken());
  }
}

function getTokenExpirationDate(encodedToken) {
  let token = decode(encodedToken);
  if (!token.exp) {
    return null;
  }

  let date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  let expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
