import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'postgres',
    database : 'small-brain'
}});


const app = express();

app.use(cors())
app.use(express.json());



app.get('/', (req, res) => {
    res.json('sucess')
})

app.post('/signin', (req, res) => {
    db.select('email','hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isHashValiid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isHashValiid) {
           return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
        }
        else {
            res.status(400).json('wrong credentials')
        }
    }).catch(err => {
        res.status(400).json('wrong credentials')
    })
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return  trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0].email,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0])
                    })
                    
                    })
                    .then(trx.commit)
                    .catch(trx.rollback)
                 }).catch(err => res.status(400).json('unable to register'))
    })
   



app.get('/profile/:id',(req, res) => {
    const { id } = req.params;
   db.select('*').from('users').where({
    id: id
   })
   .then(user => {
    if(user.length){
        res.json(user[0])
    }
    else {
        res.status(400).json("Not Found")
    }
    
   }).catch(err => res.json("Not Found"))
})

app.put('/image',(req, res) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment({
        entries: 1
    })
    .returning('entries')
    .then(count => {
        res.json(count[0].entries)
    }).catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
    console.log('app is running on port 3000')
})