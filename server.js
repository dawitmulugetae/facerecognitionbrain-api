import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import {handleRegister} from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleProfileGet } from './controllers/profile.js';
import { handleImage, handleApiCall } from './controllers/image.js';

const HOST = '20.1.206.97';
const PASSWD = 'postgres';
const DB = 'smart-brain';

const db = knex({
    client: 'pg',
    connection: {
    host : HOST,
    user : 'postgres',
    port: 5432,
    password : PASSWD,
    database : DB
}});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>  res.json('sucess'))
app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt))
app.post('/register', (req, res) => handleRegister(req, res, bcrypt, db))
app.get('/profile/:id', (req, res) => handleProfileGet(req, res, db))
app.post('/imageurl', (req, res) => handleApiCall(req, res))
app.put('/image', (req, res) => handleImage(req, res, db))

app.listen(3000, () => {
    console.log('app is running on port 3000')
})
