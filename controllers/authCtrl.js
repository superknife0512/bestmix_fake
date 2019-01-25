
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth:{
//         user: 'Superknife0511@gmail.com',
//         pass: 'Toan1234',
//     }
// })

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.getSignup =async (req, res, next)=>{
    try{
        const inviteCode = await bcrypt.hash('admin', 5);

        const msg = {
            to: 'superknife0511@gmail.com',
            from: 'bestmix@gmail.com',
            subject: 'Invite Code',
            text: 'Get this code and enter it into your invited code field',
            html: `<strong>${inviteCode}</strong>`,
          };
          await sgMail.send(msg, false, (err,result)=>{
              if(err){
                  throw err;
              } else {
                  console.log('Done');
              }
          });
    
        res.render('auth/signup',{
            title:'Sign up',
            path:'/sign-up',
            error: null,
            email: null,
            password: null,
        })
    } catch (err) {
        next(err)
    }

}

exports.postSignup= async (req,res,next)=>{
    let error = null;
        const email = req.body.email;
        const pass = req.body.password;
        const cfpass = req.body.confirmPassword;
        const inviteCode = req.body.inviteCode;
        try{

            const dupEmail = await User.findOne({email: email});
            const dupInviteCode = await User.findOne({inviteCode: inviteCode});
            const result = await bcrypt.compare('admin', inviteCode);
            const renderFunc = (msg)=>{
                res.render('auth/signup',{
                    path:'/login',
                    title: 'Login',
                    error: msg,
                    email,
                    password:pass,
                })
            }
    
            if(dupEmail){
                error = 'Your email has been existed';
                return renderFunc(error);
            }

            if(pass.length < 6){
                error = 'Your password must be 6 character long';
                return renderFunc(error);
            }
            if(!result || dupInviteCode){
                error='Your invite code is invalid! please try again';
                return renderFunc(error)
            }
            if(pass !== cfpass){
                error = 'You must enter the same password';
                return renderFunc(error);
            }
        
            const hassPass =await bcrypt.hash(pass, 15);
        
            const user = new User({
                email: email,
                password: hassPass,
                inviteCode: inviteCode,
            })
    
            await user.save();    
            res.redirect('/admin/login');
        } catch(err){
            next(err)
        }
}

exports.getLogin = (req, res, next)=>{
    res.render('auth/login',{
        title:'Login',
        path:'/login',
        error:null,
    })
}

exports.postLogin =async (req,res,next)=>{
    try{

        const email = req.body.email;
        const pass = req.body.password;
    
        const renderFunc = (msg,renderPath)=>{
            res.render(renderPath,{
                title:'Sign up',
                path:'/sign-up',
                error: msg,
            })    
        }
    
        //check if email exist
        const user = await User.findOne({email: email});
        if(!user){
            return renderFunc('your account doesnt exist yet', 'auth/login' );
        }
        const result = await bcrypt.compare(pass, user.password);
        if(!result){
            return renderFunc('Your password is not correct', 'auth/login');
        }
        //everything okey
        req.session.isLogin = true,
        req.session.user = user,
        res.redirect('/admin/pannel');
        
        
    } catch (err){
        next(err);
    }
}

exports.postLogout = (req,res,next)=>{
    req.session.destroy(err=>{
        if(err){
            throw err
        }
    })
    console.log('destroy session');
    res.redirect('/admin/login');
}

const renderFunc = (res, render, error = null, token = null)=>{
    res.render(render, {
        path: '/admin',
        title: 'reset password',
        error: error,
        token: token,
    })
}

exports.getForgot = (req,res,next)=>{
    renderFunc(res, 'auth/forgot');
}

exports.postForgot =async (req,res,next)=>{
    try{
        email = req.body.email;
        console.log(email);
        const acc = await User.findOne({email: email});
        if(!acc){
            return renderFunc(res,'auth/forgot', 'Your account doesnt exist yet');
        }
    
        const token =await crypto.randomBytes(35).toString('hex');
        const tokenExpire = Date.now() + 3600000;
        acc.token = token;
        acc.tokenExpire = tokenExpire;
        await acc.save();

        const msg = {
            to: email,
            from: 'bestmix@gmail.com',
            subject: 'Reset Password',
            html:  `<h2>Please click the link bellow to reset your password</h2><hr>
                    <a href="http://localhost:3000/admin/reset/${token}">Reset password</a>`
          };

          await sgMail.send(msg, false, (err,result)=>{
              if(err){
                  throw err;
              } else {
                  console.log('Done');
              }
          });



       

        res.redirect('/admin/login')

    } catch(err){
        next(err)
    }

}

exports.getResetPass =async (req,res,next)=>{
    try{

        const token = req.params.token;
    
        const account = await User.findOne({token: token, tokenExpire:{$gt: Date.now()}});
        if(!account){
            return renderFunc(res, 'auth/login', 'Your token is invalid');
        }
        res.render('auth/reset', {
            path: '/admin',
            title: 'reset password',
            error: null,
            token: token,
        })
    } catch (err){
        next(err)
    }
}

exports.postResetPass =async (req,res,next)=>{
    const cfPass = req.body.confirmPassword;
    const pass = req.body.password;
    const token = req.body.token
    try{

        //check pass and cf pass 
        const user = await User.findOne({token: token});
        if(pass.length < 6){
            return renderFunc(res, 'auth/reset', 'Your password has at least 6 characters long', token)
        }

        if(cfPass !== pass){
            return renderFunc(res, 'auth/reset', 'Your confirm password and password must be the same', token)
        }
        const hassPass = await bcrypt.hash(pass, 15);
        user.password = hassPass;
        user.token = undefined;
        user.tokenExpire = undefined;
        user.save();
        res.redirect('/admin/login');   

    } catch (err) {
        next(err);
    }
}