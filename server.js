import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

const database = {
    users: [
        {
            id: "1234",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()

        },
        {
            id: "1235",
            name: "Sally",
            email: "sally@gmail.com",
            password: "secret",
            entries: 0,
            joined: new Date()
            
        }
    ],

}
app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    if(req.body.password === database.users[0].password && req.body.email === database.users[0].email) {
        res.json(database.users[0])
    }
    else {
        res.status(400).json('wrong username or email')
    }
})

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash)
    });
    database.users.push( {
        id: "1236",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id',(req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user)
        }
    })
    if(!found) {
        res.status(400).json('not found')
    }
})

app.put('/image',(req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries)
        }
    }) 
    if(!found) {
        res.status(404).json('not found')
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000')
})