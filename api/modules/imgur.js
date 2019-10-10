const request = require('request');

module.exports = {
  /**
   * upload
   * @param {String} base64
   * @returns {Promise}
   */
  upload(base64) {
    let options = {
      uri: 'https://api.imgur.com/3/image',
      method: 'POST',
      ecoding: 'utf8',
      json: true,
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`
      }
    };

    return new Promise((resolve, reject) => {
      let r = request(options, (err, res, body) => {
        if (err) return reject(err);
        return resolve(body);
      });

      let form = r.form();
      form.append('image', base64.split(',')[1]);
    });
  }
};
