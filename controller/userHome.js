const client=require('../config/connection');
const userHelpers = require('../helpers/user-helpers');
const maxAge =3*24*60*60
const jwt =require('jsonwebtoken')
const bcrypt = require('bcrypt')
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: 'favasmohd11@gmail.com',
      pass: 'razal123'
    }
  });
var error
const createToken=(id)=>{
    return jwt.sign({id},"mrjack",{
        expiresIn:maxAge,
    });
}

const JWT_SECRET='secret'

module.exports = {
  
  userLogin:async function(req,res){


      console.log("haii");
    
      res.render('users/login',)



},
userSignup:async function(req,res){

    await userHelpers.addUser(req.body).then((done)=>{
        console.log(done);


     
        res.redirect('/login')
    })
    // productHelper.dosignup(req.body).then((response)=>{
    //   console.log(response)
    //   req.session.loginerror=response
    //  res.redirect('/login')
  
    // })
    // res.send("account created")
    
  },
  userLoginCheck:(req,res)=>{
    console.log(req.body);
    userHelpers.dologin(req.body).then((response)=>{
      console.log(response)
      if(response.status){
      
        const token=createToken(response.user.id)
                            res.cookie("jwt",token,{
                                withCredintials:true,
                                httpOnly:false,
                                maxAge:maxAge*1000,
                            })
        console.log("innnnnnn");
        res.json({status:'success'})   
       }
      else{
        console.log("innn");
        res.json({status:"Invalid Username or password"})
      }

    })
    
  },
  userHomePage : function(req, res) {
    const token =req.cookies.jwt
    if(token){
        jwt.verify(token,"mrjack",async(err,decodedToken)=>{
            if(err||decodedToken.id=='admin'){
                res.redirect('/clear')
            
            }else{
                console.log(decodedToken.id);
                const user=await userHelpers.findById(decodedToken.id)
                console.log(user);
                if(user){
                    res.render('users/home',{layout:'layout1'} );
                }
                else {
                    res.redirect('/login')
                }
           
            }
        }) 
    }else{
        res.redirect('/login')
    }
   

},

clearCookie:(req,res)=>{
    console.log("hai");
    res.clearCookie("jwt");
    res.redirect('/login')
    res.end()

},
forget:(req,res)=>{
    res.render("users/forget-password",{layout:'layout2'})
},
forgot:(req,res)=>{
    const {email}=req.body;
    console.log(email);
    userHelpers.findByEmail(email).then((response)=>{
        if(response){
            const secret= JWT_SECRET + response.password
            const payload={
                email:response.email,
                id:response.id
            }
            const token=jwt.sign(payload,secret,{expiresIn:'15m'})
            const link = `http://localhost:3000/reset-password/${response.id}/${token}`

            console.log(link);
            var mailOptions = {
                from: 'favasmohd11@gmail.com',
                to: 'razalpa6@gmail.com',
                subject: 'Sending Email using Node.js',
                text: 'That was easy!'
              };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.send("password reset link has been sent  to your email")
        }
        else{
            res.send('user not registered')
            return;
        }
        
    })
  
},
reset:(req,res)=>{
    const{id,token}=req.params;
    userHelpers.findById(id).then((response)=>{
        if(response){
            const secret=JWT_SECRET+response.password
            try{
                const payload=jwt.verify(token,secret)
                res.render('users/reset-password',{layout:'layout2',email:response.email})
            }
            catch(error){
                console.log(error);
                res.send(error.message);
            }
        }
        else{
            res.send("invalid id")
        }
    })
},
reseted:(req,res)=>{
    const{id,token}=req.params;
    const {pass}=req.body
    userHelpers.findById(id).then(async(response)=>{
        if(response){
            const secret=JWT_SECRET+response.password
            try{
                const payload=jwt.verify(token,secret)
                passw = await bcrypt.hash(pass, 10)
                userHelpers.resetPassword(passw,id).then((response)=>{
                    console.log(response);
                    res.redirect('/login')
                })
                
            }
            catch(error){
                console.log(error);
                res.send(error.message);
            }
        }
        else{
            res.send("invalid id")
        }
    })
},
admin:(req,res)=>{
    res.render('admin/adminlogin',{error})
},
admincheck:(req,res)=>{
    console.log(req.body);
    const {email,password}=req.body;
    console.log(email,password);
    if(req.body.adminname==='admin@mail.com'&&req.body.adminpass==='pass'){ 
        console.log("haiiii");
        const token=createToken("admin");  
        res.cookie("jwt",token,{ 
            withCredintials:true, 
            httpOnly:false, 
            maxAge:maxAge*1000,
        })
       res.redirect('/admin/index')


    } 
   
        else{
            error="invalid username and password"
            res.redirect('/admin')
            setTimeout(() => {
              error=""
            }, 2000);
        
          }
   
},
adminindex:async(req,res)=>{
    
    const token =req.cookies.jwt
    if(token){ 
        jwt.verify(token,"mrjack",async(err,decodedToken)=>{
            if(err){
                res.json({status:false})
                next()
            }else{
                console.log(decodedToken);
                // const user=await User.findById(decodedToken.id)
                if(decodedToken.id=='admin') {
                    await userHelpers.allusers().then((response)=>{
                        console.log(response);
                        res.render('admin/adminusers',{layout:'layout3',users:response})
                    })
                }
                else {
                    res.redirect('/admin')
                }
                
            }
        }) 
    }else{
        res.redirect('/admin')
    
    }
 
},
deleteUsers:(req,res)=>{
    let userid = req.params.id
    userHelpers.deleteuser(userid).then((response)=>{
        res.send(response)
    })
}
  
}

