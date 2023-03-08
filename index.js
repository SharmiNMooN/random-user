const express = require('express');
const app = express();

const indexRoute = require('./routes');
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extends: true}));


app.get('/', (request,response)=>{
    return response.send({
        message: "WELCOME TO RANDOM USER API",
    });
});


app.use("/",indexRoute);

app.listen(port, ()=> {
    console.log(`Server Is Running At http://localhost:${port}`);
});