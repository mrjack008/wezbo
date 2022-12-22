const {Client}=require('pg');

const client= new Client({
    host:"localhost",
    port:5432,
    user:'postgres',
    password:'12345',
    database:"wezbo"
})



client.on("end",()=>{
    console.log("Connection end");
})

module.exports=client; 