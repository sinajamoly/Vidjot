const express = require('express');

const app =express();

//index Route
app.get('/',(req, res)=>{
    res.send('Index');
});

app.get('/about', (req,res)=>{
    res.send('About')
});

app.get('/home', (req,res)=>{
    res.send('home')
});

const port = 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});

