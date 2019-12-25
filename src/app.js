const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// app.use is to customize a server
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App (現在の天気は？)',
        name: 'Yuta Kihara'
    }) // render is for loading .hbs file
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About page',
        name: 'Yuta Kihara'
    }) // render is for loading .hbs file
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Yuta Kihara',
        helpText: 'This is some helpful text.'
    }) // render is for loading .hbs file
});
// app.get is to set up a handler for an http GET request
// @param1: the path to set up the handler for.
// @param2: the function(process) to run when that path is visited 

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide a address term'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.render({ error });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    });

})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        });
    }

    console.log(req.query);
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Yuta Kihara',
        errorText: 'Help article not found.'
    });
})

// 404 pages
app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Yuta Kihara',
        errorText: 'Page not found'
    });
});



app.listen(3000, () => {
    console.log('Server is up on port 3000');
});

