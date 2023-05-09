const express = require('express');
const session = require('express-session');
const axios = require('axios');
const qs = require('qs');
const credentials = require('../config/getty');


const AUTH_URL = 'https://api.gettyimages.com/v4/oauth2/token';


let token;

async function getBearerToken(req) {
  // If token exists in the session and hasn't expired yet, return it
  if (req.session.token && req.session.token.expiryDate > Date.now()) {
    return req.session.token.accessToken;
  } else {
    // If token doesn't exist in the session or has expired, generate a new one
    const { data } = await axios.post(AUTH_URL, qs.stringify({
      grant_type: 'password',
      username: credentials.username,
      password: credentials.password,
      client_id: credentials.apiKey,
      client_secret: credentials.apiSecret
    }),{
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    const accessToken = data.access_token;
    const expiryDate = Date.now() + data.expires_in * 1000;

    // Save the new token to the session
    req.session.token = { accessToken, expiryDate };
    //console.log(accessToken);
    return accessToken;
  }
}


module.exports = { getBearerToken };
