require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');
const tinyHelper = require('./tinyHelper');

const youtubeApi = 'https://www.googleapis.com/youtube/v3/';
const getUserInfoApi = 'https://www.googleapis.com/oauth2/v1/userinfo';

exports.getUserInfo = (token) => {
  const queryString = tinyHelper.getQueryString({
    access_token: token,
  });
  const url = getUserInfoApi + queryString;
  return fetch(url)
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      if (result.error) {
        return null;
      }
      return result;
    })
    .catch((err) => {
      return null;
    });
};

exports.getChannelInfo = (ids, appKey) => {
  let idParam = '';
  idParam = encodeURIComponent(ids.toString());
  const queryString = tinyHelper.getQueryString({
    part: 'statistics,snippet',
    id: idParam,
    key: appKey,
  });

  // console.log(youtubeApi + 'channels' + queryString);
  return fetch(youtubeApi + 'channels' + queryString, {
    method: 'GET',
  })
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    if (res.error) {
      return null;
    }
    return res.items[0];
  })
  .catch((err) => {
    return null;
  });
};

exports.getYoutubeChannelId = (url) => {
  let $;
  return fetch(url, {
    method: 'GET',
  })
  .then((result) => {
    return result.text();
  })
  .then((result) => {
    $ = cheerio.load(result);
    const metas = $('meta[itemprop=channelId]');
    return metas[0].attribs.content;
  })
  .catch((err) => {
    return null;
  });
};
