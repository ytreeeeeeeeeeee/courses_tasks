import express from 'express';
import redis from 'redis';

const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || "localhost";

const app = express();
const client = redis.createClient({url: REDIS_URL});

(async () => {
    await client.connect();
})();


app.use(express.json());

app.post('/counter/:bookId/incr', async (req, res) => {
    const {bookId} = req.params;

    try {
        const cnt = await client.incr(bookId);

        res.status(201).json({count: cnt});
    }
    catch(e) {
        res.json({errmsg: e});
    }
});

app.get('/counter/:bookId', async (req, res) => {
    const {bookId} = req.params;
    
    try {
        const cnt = await client.get(bookId);

        res.json({count: cnt});
    }
    catch(e) {
        res.json({errmsg: e});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})