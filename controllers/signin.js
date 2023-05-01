export const handleSignin = (req, res, db, bcrypt) => {
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
}