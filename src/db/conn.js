const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/demo",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true

}).then(()=>{
    console.log(`connnected`);
}).catch((e)=>{
    console.log(`no connection`);
})