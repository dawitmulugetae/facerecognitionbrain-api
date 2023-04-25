import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('This is root')
})

app.listen(3000, () => {
    console.log('app is running on port 3000')
})