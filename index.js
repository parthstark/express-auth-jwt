const express = require("express")
const path = require("path")
const jwt = require("jsonwebtoken");
const jwtPassword = "alpha-beta-gamma";
const port = 3000
const app = express()

app.use(express.json())

const loggingMiddleWare = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}
app.use(loggingMiddleWare)

const authMiddleWare = (req, res, next) => {
    const isAuthenticated = true;
    if (isAuthenticated) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

app.get('/', (req, res) => {
    const baseHtmlFile = path.join(__dirname, 'public', 'base.html');
    res.sendFile(baseHtmlFile)
})

app.get('/login-page', (req, res) => {
    const loginHtmlFile = path.join(__dirname, 'public', 'login.html');
    res.sendFile(loginHtmlFile);
})

let users = {}
app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    users[username] = password

    var token = jwt.sign({ username: username }, jwtPassword);
    return res.json({
        token: token,
    });
})

app.get('/secure-page', authMiddleWare, (req, res) => {
    const token = req.query.auth;
    try {
        const decoded = jwt.verify(token, jwtPassword);
        const username = decoded.username;
        res.send(`Welcome ${username} this is a secure page`)
    } catch (err) {
        return res.status(403).send(`not authorized`);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})
