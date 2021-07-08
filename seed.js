const mongoose=require('mongoose');
const User=require('./script/user.js');
const History=require('./script/history.js');

mongoose.connect('mongodb://localhost:27017/record',{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>{
    console.log('CONNECTION OPEN...');
})
.catch(err=>{
    console.log('ERROR..');
    console.log(err);
})

const seedUser =[
    {
        username: 'khalid',
        password: 'qwerty12341875963',
        state: 'Texas'
    },
    {
        username: 'farid',
        password:'zxcvb78912354885',
        state: 'Florida',
        address1:'955 redway ln',
        zipcode:77062,

    },

]
const historySeed= [{ quantity:15,date:"07-15-2016",},{quantity:10, date:"07-15-2016",}, {quantity:10, date:"07-15-2016",},{quantity:10, date:"07-15-2016",}]

    History.insertMany(historySeed)
.then(res=>{
    console.log(res)
})
.catch(err=>{
    console.log(err)
})



const makeUser = async () =>{
    const user = new User (    {username: 'Hafsa', password: 'qwerty12341875963', state: 'Texas' });
    const tenGallons= await History.findOne({quantity:10})
    user.history.push(tenGallons);
    await user.save()
    console.log(user);
}
const find = async ()=>{
    const sample = await User.find({username:"Hafsa"}).populate('history');
    console.log(sample.history);
}
//makeUser();
find();
