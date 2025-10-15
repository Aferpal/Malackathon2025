import app from './server.js';
const PORT= 80;


app.listen(PORT, ()=>{
    console.log("running on port", PORT);
})