import express from 'express'
import router from './router'
import morgan from 'morgan'
import cors from 'cors'
import { protect } from './modules/auth'
import { createNewUser, signin } from './handlers/user'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res, next) => {
    // console.log('welcome to express')
    // res.status(200)
    // res.json({message: 'wassup guys'})
    setTimeout(() => {
        next(new Error('hello'))
    }, 1)
})

app.use('/api', protect, router)

app.post('/user', createNewUser)
app.post('/signin', signin)

app.use((err, req, res, next) => {
    if (err.type === 'auth') {
        res.status(400).json({message: 'Authorization Error, same name?'})
    } else if (err.type === 'input') {
        res.status(400).json({message: 'You made the wrong input dude'})
    } else {
        res.status(500).json({message: `Server handler error, ${err}`})
    }
})

export default app