require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const movieData = require('./movieData');
const API_TOKEN = process.env.API_TOKEN;


function bearAuthentication(req, res, next) {
    let token = req.get('Authorization') || ''
    token = token.split(' ')[1]
    if (!token || token !== API_TOKEN) {
        return res.status(401).json({ error: 'Authorization declined' })
    }
    next();
}

app.use(cors());
app.use(helmet());
app.use(morgan('common'));

app.get('/movie', bearAuthentication, (req, res) => {
    const { genre, country, avg_vote } = req.query;
    let responseArray = movieData;
    if (genre) {
        responseArray = responseArray.filter(movie => {
            return movie.genre.toLowerCase().includes(genre.toLowerCase())
        });
    }
    if (country) {
        responseArray = responseArray.filter(movie => {
            return movie.country.toLowerCase().includes(country.toLowerCase())
        });
    }
    if (avg_vote) {
        responseArray = responseArray.filter(movie => {
            return parseFloat(movie.avg_vote) >= parseFloat(avg_vote)
        });
    }
    res.json(responseArray);
});

app.listen(9000, () => {
    console.log('Server on 9000');
});




