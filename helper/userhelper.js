var db=require('../connection/connection')
let objectid=require('mongodb').ObjectID
module.exports={
    dosignup:(userdetails)=>{
        return new Promise((resolve,reject)=>{
            db.get('greads').collection('user').insertOne(userdetails).then((response)=>{
                resolve(response)
            })
        })
    },
    
        dologin:(userdetails)=>{
            let response={}
            return new Promise(async(resolve,reject)=>{
              let user= await db.get('greads').collection('user').findOne({email:userdetails.email})

              if(user){
                    if(user.password===userdetails.password){
                        response.user=user,
                        response.status=true

                        resolve(response)
                    }else{
                        resolve(false)
                    }

              }else{
                  resolve(false)
              }
            })

        },
        addbook:(bookdetail)=>{
            return new Promise((resolve,reject)=>{

                db.get("greads").collection('books').insertOne(bookdetail).then((response)=>{
                    // console.log(response);
                    
                    resolve(response.ops[0])

                })





            })

        },
        getallbooks:()=>{
            return new Promise((resolve,reject)=>{
               let books= db.get('greads').collection('books').find().toArray()
               resolve(books)
            })
        },
        deletebook:(bookid)=>{
            return new Promise((resolve,reject)=>{
               
                db.get('greads').collection("books").removeOne({_id:objectid(bookid)}).then((response)=>{
                    resolve(response)
                })
            })
        },

        addcomment:(comment,bookid)=>{

            return new Promise((resolve,reject)=>{
                let bookdetails={
                comment,
                bookid:bookid
            }

            db.get('greads').collection('comments').insertOne(bookdetails).then((response)=>{
                resolve(JSON.stringify(response.ops[0].comment))
                
            })

            })
        },

        getcomments:(bookid)=>{
           return new Promise(async(resolve,reject)=>{
              let comment= await db.get('greads').collection('comments').find({bookid:bookid}).toArray()
                    resolve(comment)
                
           })
        },
        
        // getsearchedbooks:(bookname)=>{
        //     return new Promise(async(resolve,reject)=>{
        //         let books=await db.get('greads').collection('books').find({title:bookname}).toArray()
        //         resolve(books)
        //     })
        // },
        searchedbook:(bookdetails)=>{
            return new Promise((resolve,reject)=>{
                db.get('greads').collection('searchbooks').insertOne(bookdetails).then((response)=>{
                    resolve(response.ops[0])
                })
            })
        },
        getsearchedbook:()=>{
            return new Promise((resolve,reject)=>{
                let books=db.get('greads').collection('searchbooks').find().toArray()
                resolve(books)
            })
        },
        addrating:(rating,bookid)=>{
            return new Promise((resolve,reject)=>{
                let ratings={
                    rating:rating,
                    bookid

                }
                db.get('greads').collection('rating').insertOne(ratings).then((response)=>{
                    resolve(response.ops[0])
                })
            })
        },
        getrating:(id)=>{
            return new Promise((resolve,reject)=>{
                let ratings=db.get('greads').collection('rating').find({bookid:id}).toArray()

                resolve(ratings)
            })
        },

        deletecomment:(id)=>{
            return new Promise((resolve,reject)=>{
                db.get('greads').collection('comments').removeOne({_id:objectid(id)})
            })
        }

       }