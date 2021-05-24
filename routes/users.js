var express = require('express');
// const { Db } = require('mongodb');
const userhelper=require('../helper/userhelper')
const Fuse = require('fuse.js')
var router = express.Router();
function verifylogin(req,res,next){
  if(req.session.user){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup')
});

router.get('/home',(req,res)=>{
  // userhelper.getallbooks().then((response)=>{
    let books=req.session.search
    let user=req.session.user
  // console.log(books);
    if(user){
      res.render('index',{user,books})
    }else{
      res.redirect('/login')
    }
  // })
  
  
   
  // })

 
})

router.post('/',(req,res)=>{
// console.log(req.body);
userhelper.dosignup(req.body).then((resp)=>{
  // console.log(resp);
  res.redirect('/login')
})
})
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/home')
  }else{
    res.render('login')

  }
  
})
router.post('/login',(req,res)=>{
  userhelper.dologin(req.body).then((response)=>{
    // console.log(response.status);
    if(response.status && response.user){
      req.session.user=response.user
      // console.log(req.session.user);
      res.redirect('/home')
    }else{
      res.redirect('/')
    }
  })
})
router.get('/addbook',(req,res)=>{
  res.render('addbook',{user:req.session.user})


})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})

router.post('/addbook',(req,res)=>{
  
  // console.log(user);
  userhelper.addbook(req.body).then((response)=>{
let image=req.files.image
    if(image){
      image.mv('public/book-images/'+response._id+'.jpg')
    }
    res.redirect('/home')
  })
 
})
router.get('/deletebook/:id',(req,res)=>{
  let id=req.params.id
  console.log(id);
  userhelper.deletebook(id).then((response)=>{
    console.log(response);
    res.redirect('/searchbook')
  })
})
router.get('/comments',(req,res)=>{
    let user=req.session.user

    let comments=req.session.comments
// console.log(comments);
// console.log(comments);
  res.render('comments',{user,comments})
})

router.post('/home/:id',(req,res)=>{
  let id=req.params.id
  

  userhelper.addcomment(req.body,id).then((response)=>{
// console.log(response);
// req.session.comments=response
  })
  res.redirect('/home')

})

router.get('/home/:id',(req,res)=>{
  let id=req.params.id
  
  // console.log(id);
  userhelper.getcomments(id).then((response)=>{

// console.log(response);
let comments=[]
if(response.length==0){
  comments.push("")
  req.session.destroy()
}else{
     for(i=0;i<response.length;i++){
      
       comments.push(response[i])
       
       req.session.comments=comments
     }
    }
    // console.log(comments);
  res.redirect('/comments')
  
    

  })
})


router.post('/searchbook',(req,res)=>{
userhelper.getallbooks().then((response)=>{
  let book=[]

  for(i=0;i<response.length;i++){
    book.push(response[i])

  }
  const options = {
    keys: ['title', 'author','genre']

  }
  const fuse = new Fuse(book,options)

  const result = fuse.search(req.body.bookname)

// console.log(result.length);
let finalbooks=[]
for(i=0;i<result.length;i++){
  finalbooks.push(result[i])
}
req.session.search=finalbooks

// console.log(finalbooks);
res.redirect('/home')
})

 router.get('/searchbook',(req,res)=>{
    let user=req.session.user
    res.render('searchedbook',{user})
  
  

 })

})
router.post('/rated/:id',(req,res)=>{
  let id=req.params.id
  userhelper.addrating(req.body.rating,id).then((response)=>{
    // console.log(response);
  })
  res.redirect('/home')
})

router.get('/rated/:id',(req,res)=>{
  let id=req.params.id
  console.log(id);
  userhelper.getrating(id).then((response)=>{
    console.log(response);
  })
  // res.redirect('/home')


})



router.get('/comment/:id',(req,res)=>{
  console.log(req.params.id);
  let id=req.params.id
  userhelper.deletecomment(id)
  res.redirect('/home')
})


  
  
module.exports = router;

