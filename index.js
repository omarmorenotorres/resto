const express = require ('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const PORT = process.env.PORT || 3000;

const app = express();

//require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRouter);

app.listen(PORT, () =>{
    console.log(`Server running! on port ${PORT}`);
});