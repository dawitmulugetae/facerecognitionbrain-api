import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import {handleRegister} from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleProfileGet } from './controllers/profile.js';
import { handleImage, handleApiCall } from './controllers/image.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

const db = knex({
    client: 'pg',
    connection: {
    host : 'postgres://dawit:dTPV9zPWC3fwkdj9nJxGLPxY03WSAvmp@dpg-ch8h6f5gk4q7lmqeliu0-a/smart_brain_wqsf',
    user : 'dawit',
    password : 'dTPV9zPWC3fwkdj9nJxGLPxY03WSAvmp',
    database : 'smart_brain_wqsf'
}});

const app = express();

app.use(cors())
app.use(express.json());

app.get('/', (req, res) =>  res.json('sucess'))
app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt))
app.post('/register', (req, res) => handleRegister(req, res, bcrypt, db))
app.get('/profile/:id', (req, res) => handleProfileGet(req, res, db))
app.post('/imageurl', (req, res) => handleApiCall(req, res))
app.put('/image', handleImage(db))

app.listen(3000, () => {
    console.log('app is running on port 3000')
})
