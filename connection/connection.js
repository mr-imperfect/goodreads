const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect=function(done){
    const dbname='greads'
    const url="mongodb+srv://vishnu:vishnu@1830@cluster0.koxhf.mongodb.net/dbname?retryWrites=true&w=majority"
    

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        
        state.db=data.db(dbname)
        done()
    })
  
}

module.exports.get=function(){
    return state.db
}