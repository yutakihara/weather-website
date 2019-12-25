const request = require('request');

const forecast = (latitude, longitude, callback) => {

    const url = `https://api.darksky.net/forecast/cc79717211f25226823905390bb183f0/${latitude},${longitude}?units=si`;

    request({ url, json: true }, (error, { body }) => {
        // console.log(response.body.currently);
        if (error) {
            callback('Unable to connect to weather service!', undefined);
        }
        else if (body.error) {
            callback('Unable to find location.', undefined);
        }
        else {
            const curr = body.currently;
            callback(undefined, `${body.daily.data[0].summary} It is currently ${curr.temperature} degrees out and ${curr.precipIntensity}% chance of rain.`);
        }
    });
}

module.exports = forecast;