import { createRequire } from "module";
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken')
const verifytoken = (req, res, next) => {
    const token = req.headers['authorization']
    if (typeof token !== 'undefined') {
        
        jwt.verify(token, 'secretkey', (err, user) => {
            if (err) {
                
                return  res.sendStatus(403).send('Token Error')
            } else {
                req.body.authData=user
                next()
            }
        })
        
        // res.json(payload)
    } else {
        return res.sendStatus(403).send('token')
    }

}

export default verifytoken