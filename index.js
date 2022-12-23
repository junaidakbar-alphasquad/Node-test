
import { join } from 'path'
import express, { json, urlencoded, static as Static } from 'express'
import { fileURLToPath } from 'url';
import router from './routes/index.js'
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import logger from './middleware/logger.js'
import { createRequire } from "module";
import verifytoken from './middleware/verifytoken.js';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken')
const app = express()
//init middleware
app.use(logger)
app.use(json())
// app.use(cors())
app.use(urlencoded({ extended: false }))
app.post('/login', async (req, res) => {
    let { email } = req.body
    
    const user = await prisma.user.findMany({
        where: { email, status:true},
    })
    // res.json(req.body)
    if (user[0]) {
        jwt.sign({ user }, 'secretkey', { expiresIn: '1h' }, (err, token) => {
            if (err) {
                return res.json(err)
            }
           return res.json({token,user})
        })
    }else{
        res.json({email,msg:`No Active User Found`})
    }
})

// app.use(Static(join(__dirname, 'public')))    
//all routes
app.use('/api', verifytoken, router)
const PORT = process.env.PORT || 5000 
app.listen(PORT, () => console.log('port', PORT))