import express from 'express';
import db from './config/db'
import colors from 'colors';
import cors, {CorsOptions} from 'cors';
import morgan from 'morgan'
import productsRouter from './routes/products.routes'

//db connection
export async function connectDB() {
    try {
       await db.authenticate(); 
       db.sync()
       //console.log(colors.magenta('Success connection to data base'))
    } catch (error) {
        console.log(error)
        console.log(colors.red(`Error to connect with data base`))
    }
}
connectDB();

//express intance
const server = express();

//allow connections
const corsOptions: CorsOptions = {
    origin: function(origin, callback){
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('CORS error'))
        }
    }
}
server.use(cors(corsOptions))

//read forms's data
server.use(express.json())

//routing
server.use(morgan('dev'))
server.use('/api/products', productsRouter)

server.get('/api', (req, res) => {
    res.json({msg: 'From API'})
})

export default server;