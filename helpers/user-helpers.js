var db = require('../config/connection')
const bcrypt = require('bcrypt')
const { response } = require('../app')
const maxAge =3*24*60*60
const jwt =require('jsonwebtoken')
const createToken=(id)=>{
    return jwt.sign({id},"mrjack",{
        expiresIn:maxAge,
    });
}

module.exports={
    addUser:async(user)=>{
        user.password = await bcrypt.hash(user.password, 10)
        return new Promise(async(resolve,reject)=>{
            db.query(`select * from users where email=$1`,[user.Email],(err,results)=>{
                if(err){
                    throw err
                }
                console.log(results.rows);
                if(results.rows.length>0){
                    console.log("email exist");
                    resolve("email exist")
                }
                else{
                    db.query(`insert INTO users(name,email,password,phone)
                    values($1,$2,$3,$4) RETURNING id,password` ,[user.Name,user.Email,user.password,user.phone],(err,results)=>{
                    if(err){
                        
                        console.log(err);
                        throw err
                    }
                    console.log(results.rows);
                    }
                    
                    );
                    console.log("inned");
                    
                    resolve("registered")
              
                }
            })

       

        })



    },
    dologin:(user)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            console.log(user);

            db.query(`select * from users where email=$1`,[user.Name],(err,results)=>{
                if(err){
                    console.log("haii");
                    console.log(err);
                    throw err
                }
                console.log(results.rows);
                users=results.rows[0]
                console.log(user.password);
                if(results.rows.length>0){
                    bcrypt.compare(user.password,users.password).then((status)=>{
                        console.log(status);
                        if(status){
                            console.log("logined")
                            response.user=users
                            response.status=true
                            resolve( response)
                        }else{
                            console.log("failed")
                            resolve({status:false})
                        }
                    })
                }
                else{
                    console.log("user didnt exits");
                    resolve({status:false})
                }
            })
            
            // }
        })
    },  
    findById:(id)=>{
        return new Promise((resolve,reject)=>{
            db.query(`select * from users where id=$1`,[id],(err,results)=>{
                if(err){
                    throw err;
                }
                console.log(results.rows);
                users=results.rows[0]
                resolve(users)
            })
        })
    },
    findByEmail:(id)=>{
        return new Promise((resolve,reject)=>{
            db.query(`select * from users where email=$1`,[id],(err,results)=>{
                if(err){
                    throw err;
                }
                console.log(results.rows);
                users=results.rows[0]
                resolve(users)
            })
        })
    },
    resetPassword:(pass,id)=>{
        return new Promise((resolve,reject)=>{
            db.query(`UPDATE "users" 
            SET "password" = $1
            WHERE "id" = $2`,[pass,id],(err,results)=>{
                if(err){
                    throw err;
                }
                console.log(results.rows);
                users=results.rows[0]
                resolve(users)
            })
        })
    }

}
