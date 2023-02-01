//####// Importing Packages //######################################################################################################################################################################################//
{
var express = require('express');
var app = express ();
var http = require ('http')
var cons = require('consolidate')
var https = require('https');
var fs = require('fs')
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var bodyParser = require('body-parser');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto')
var multer = require('multer')
}


//####// Glabal variable //#########################################################################################################################################################################################//
{
globalThis.count = 1
globalThis.mustReset = true
globalThis.mustResetScore = true
globalThis.previousMonth = 200
globalThis.search = false
globalThis.finaldate = 0
globalThis.monthdate = 0
globalThis.day_date = 0

}

//####// Multer Usage //#########################################################################################################################################################################################//

{
// defining the storage for images

const storage = multer.diskStorage({

  //destination for files
  destination: function(request, file, callback) {
    callback(null, './static/Uploads')
  },


  //add back the extension
  filename: function(request, file, callback){
    callback(null, Date.now() + file.originalname)
  },
});

//upload parameter for multer
var upload = multer({
  storage:storage,
  limits:{
    fieldSize: 1024*1024*3
  }
})
}


//####// Functions //###############################################################################################################################################################################################//
{

//#########// MongoDB functions //###################################################################################################################################################################################//
{
function insertJson(insert, collection) {
	// pre : insert is an object we want to add to the Json file
	//       collection is the name in String of the Json file we want to add insert to
	// post : insert is added to the Json file

	var phrase = JSON.stringify(insert, null , "\t");
    fs.appendFile("Data/" + collection + ".json", phrase , function (err) {
     if (err) throw err;
    });
}

function insertMongo(insert, collection) {
	// pre : insert is an object we want to add to the collection
	//       collection is the name in String of the collection we want to add insert to
	// post : insert is added to the collection

  dbo.collection(collection).insertOne(insert, function(err, res) {
	if (err) throw err;
  }); 	
}

function deleteMongo(insert, collection) {
  // pre : insert is an object we want to delete from the collection
  //       collection is the name in String of the collection we want to delete from
  // post : insert is deleted from the collection

  dbo.collection(collection).deleteOne(insert, function(err, obj) {
  if (err) throw err;
  });   
  
}
}

//#########// Authentication //######################################################################################################################################################################################//
{
function authenticationCheck(req, res) {
  // pre : we want to check if a user is authorized to enter the site
  // post : user is verified and a new session is started
  if (req.session.authentication != 'password'){
    res.redirect('/register')
    return false
  }
  return true
}

function userExist(user, existing) {
  //pre: user is a string
  //     existing is a collection in the database
  //post: Returns True if the user exists
  var user = user
  for (let i = 0; i < existing.length; i++ ) {
    if (existing[i].name == user) {
      return true
    }
  }
  return false
}

function password(user, existing) {
  //pre: user is a string
  //     existing is a collection from the database 
  //post: Returns the password associated with user
  for (let i = 0; i < existing.length; i++ ) {
    if (existing[i].name == user) {
      return existing[i].password
    }
  }
} 
}

//#########// Encrypting Data //#######################################################################################################################################################################################//

{
const algorithm = "aes-256-cbc"; 
const initVector = Buffer.from("1aa6d2239c11faedf58cf204f8b0858f", "hex");
const Securitykey = Buffer.from("e92d08f910078750f68c5fd3ed976b1b8cc915972daa72327c3d3e667533a802", "hex")



function encryptData(data){
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  let encryptedData = cipher.update(data, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData
}

function decryptData(data){
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  let decryptedData = decipher.update(data, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
  return decryptedData
}

function decryptTelephone(Data){
  for (let i = 0; i < Data.length; i++) {
    Data[i].telephone = decryptData(Data[i].telephone)
  }
  return Data
}

function decryptGsm(Data){
  for (let i = 0; i < Data.length; i++) {
    Data[i].gsm = decryptData(Data[i].gsm)
  }
  return Data
}

function decryptMail(Data){
  for (let i = 0; i < Data.length; i++) {
    Data[i].mail = decryptData(Data[i].mail)
  }
  return Data
}


}



//#########// Get Functions //#######################################################################################################################################################################################//
{
function getPrice(tool, result) {
  // pré: tool is a tool object
  //      result is a collection in the database
  //post: returns the price of the object
    for (let i = 0; i < result.length; i++ ) {
      if (result[i].name == tool) {
        return parseFloat(result[i].price)
      }
    } 
}

function getLocation(_id, inventory) {
  // pre : _id is the id of the data in the collection we want to find
  //       inventory is a collection in the database
  // post : the data in correspondance with id is returned
  for (let i = 0; i < inventory.length; i++ ) {
    if (inventory[i]._id == _id) {
      return inventory[i]
    }
  } 
}

function getTools(_id, locations) {

  for (let i = 0; i < locations.length; i++ ) {
    if (locations[i]._id == _id) {
      return locations[i].tool
    }
  } 

}
}

//#########// Sorting functions //###################################################################################################################################################################################//
{
function sortName(name) {
  // pre : name is a list of names we want to sort
  // post : the list of names is sorted alfabetically
  return name.sort((a, b) => (a.surname > b.surname) ? 1 : -1);
}

function sortOutil(outils) {
  // pre : outils is a list of tools we want to sort
  // post : outils is sorted alfabetically
  return outils.sort((a, b) => (a.name > b.name) ? 1 : -1);
}

function sortDate(date) {
  //pre : date is a list of dates we want tos sort
  //post : date is sorted by date
  return date.sort((a,b) => (a.date > b.date) ? -1 : 1)
}
}

//#########// ChartJS data functions //##############################################################################################################################################################################//
{

function oldRented(name, result){
  // pre : name is the name of a tool in the inventaire collection
  //       result is a list of objects from the collection database
  // post : return the number of tool(name) rented at the time
  for (let i = 0; i < result.length; i++ ) {
    if (result[i].name == name) {
      return result[i].rented
    }
  }
}

function dateExist(date, result) {
  // pre : date is a date 
  //       result is a collection in the database
  // post : true is returned if the date exists in the database, otherwise false is returned
  for (let i = 0; i < result.length; i++ ) {
    if (result[i].date == date) {
      return true
    }
  }
  return false
}

function oldPrice(data, result){
  // pre : data is the date we want data from
  //       result is a collection in the database
  // post : the price in correspondance with the data is returned from the collection
  for (let i = 0; i < result.length; i++ ) {
    if (result[i].date == data) {
      return result[i].price
    }
  }
}

function quadriPrice(result) {
  // pre : result is a collection in the database
  // post : the total revenue of the quadrimester is calculated and returned
  var total = 0
  var d = new Date()
  if (9 <= d.getMonth() && d.getMonth() <= 12 ){
    var monthq1 = ["09" + "/" + d.getFullYear(), "10" + "/" + d.getFullYear(), "11" + "/" + d.getFullYear(), "12" + "/" + d.getFullYear()]
    for (let i = 0; i < monthq1.length; i++){
      for (let j = 0; j < result.length; j++){
        if (monthq1[i] == result[j].date){
          total += parseFloat(result[j].price)
        }
      }
    }
  } else {
      var monthq2 = ["01" + "/" + d.getFullYear(), "02" + "/" + d.getFullYear(), "03" + "/" + d.getFullYear(), "04" + "/" + d.getFullYear(), "05" + "/" + d.getFullYear(), "06" + "/" + d.getFullYear()]
      for (let i = 0; i < monthq2.length; i++){
        for (let j = 0; j < result.length; j++){
          if (monthq2[i] == result[j].date){
            total += parseFloat(result[j].price)
        }
      }
    }
  }
  return total
}

function profitChange(date, result){
  // pre : montdate is the month and year currently
  //       result is a collection in the database
  // post : the change of profit between this month and last month is calculated and returned
  var actualMonth = date
  var d = new Date()
  if (d.getMonth()+1 == 1){
    var lastMonth = "12" + "/" + d.getFullYear()-1
  } else {
    month = d.getMonth()
    if (month <= 9) {
      month_str = "0" + month.toString()
    }else{
      month_str = month
    }
    var lastMonth = month_str + "/" + d.getFullYear()
  }
  if (oldPrice(lastMonth, result) == 0){
    return "100"
  }  else if(oldPrice(lastMonth, result) != 0) {
    return (( (oldPrice(actualMonth, result) - oldPrice(lastMonth, result)) / oldPrice(lastMonth, result))*100).toFixed(2).toString()
  }  
}

function dataChart(result) {
  var data_dic = {"09/": 0, "10/": 0, "11/": 0, "12/": 0, "01/": 0, "02/": 0, "03/": 0, "04/": 0, "05/": 0, "06/": 0}
  for (let i = 0; i < result.length;i++){
    var month = result[i].date.split("/")
    data_dic[month[0] + "/"] = result[i].price  
  }
  var data = []
  for (var key in data_dic){
    var value = data_dic[key];
    data.push(value)
  }
  return data
}

function maxScore(result) {
  // pre : result is a list of object from the member database
  // post : return, as an int, the index of the member with the maximum score
  var max = -1
  var winner_index = -1
  for (let index = 0; index < result.length; index++) {
    if (parseInt(result[index].score) > max) {
      max = parseInt(result[index].score)
      winner_index = index
    }    
  }
  return winner_index
}
}

//#########// Stats Home page //#####################################################################################################################################################################################//
{
function computeTime (rental, returned) {
  // pré: rental is the time when the rental was made (in miliseconds since 1970)
  //      returned is the time when the rental was brought back (in miliseconds since 1970)
  //post: Compute the number of days of rental (int)
  var result = (returned - rental) / 86400000
  if(result < 1){
    result = 1
  }
  return result.toFixed(2)
}

function computePrice (time, price) {
  // pré: time is a number of days (int)
  //      price is the total price per days of rental
  //post: Compute the total price of the rental
  return (((time * price)*2).toFixed())/2
}

function computeTotalPrice(tools, result){
  // pré: tools is a list of tool object
  //post: return the total price of the tools in the list
  var total = 0
  if (typeof tools == 'string') {
    tools = [tools]
  }
  for(let i = 0; i < tools.length; i++) {
    total += getPrice(tools[i], result)
  }
  return total
}
}

//#########// ToLowercaseList //#####################################################################################################################################################################################//
{
function toLowerCaseList(list){
  //pre: list is a list of string
  //post: return a list with the strings in lowercase
  if (typeof list == 'string') {
    list = [list]
  }
  result = []
  for(let i = 0; i < list.length; i++) {
      result.push(list[i].toLowerCase())
  }
  return result
    
}
}

//#########// Reset Database //######################################################################################################################################################################################//
{
function resetDatabase(date){
  // pre : date is today's date
  // post: reset the database if needs be
  if(globalThis.mustReset){
    if (date == "20/06") {
      dbo.collection("stats").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection stats deleted");
      });
      dbo.collection("locataires").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection locataires deleted");
      });
      console.log('resetted the database')
      globalThis.mustReset = false
    }

  } else if (date != "20/06") {
    globalThis.mustReset = true
  }

  if(globalThis.mustResetScore){
    date = date.split("/")
    if ((globalThis.previousMonth).toString() != date[1]) {
      globalThis.previousMonth = date[1]
      dbo.collection('members').find({}, { projection: { _id: 0, name : 1, score: 1} }).toArray(function(err, result) {
        if (err) throw err;
        for (let j = 0; j < result.length;j++ ){
          var newValue =  { $set: {name : result[j].name, score : 0 } }
          dbo.collection('members').updateOne({name : result[j].name}, newValue, function(err, res) {
            if (err) throw err;
          });
        }
      });
      console.log('resetted the database')
      globalThis.mustResetScore = false
    }

  } else {
    globalThis.mustResetScore = true
  }
}
}


}


//####// Formating the date //#######################################################################################################################################################################################//
{
function updateDate(){
  //pre : //
  //post : updates the dates global variables 
  var d = new Date();
  var month = d.getMonth()
  var day = d.getDate()

  month = month + 1
  if (month <= 9) {
    month_str = "0" + month.toString()
  }else{
    month_str = month
  }

  if (day <= 9) {
    day_str = "0" + day.toString()
  }else{
    day_str = day
  }

  globalThis.finaldate = day_str + "/" + month_str + "/" + d.getFullYear()
  globalThis.monthdate = month_str + "/" + d.getFullYear() 
  globalThis.day_date = day_str + "/" + month_str
}


function deformatSingle(string){
  if(string.split("")[0] == "0"){
    return string.split("")[1]
  }
  return string
}

function deformatList(List){
  var Formated = [0,0,0]
  for(let i = 0; i < List.length; i++){
    Formated[i] = deformatSingle(List[i])
  }
  return Formated
}
}

//####// Cookies //#################################################################################################################################################################################################//
{
app.engine("html",cons.hogan)
app.set('views', 'public')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "propre123",
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 1800000
  }
}));
}


//####// creation database //#######################################################################################################################################################################################//
{
MongoClient.connect('mongodb://localhost:27017', (err, db) => {
  dbo = db.db("database");
  if (err) throw err;
  });
}


//####// affichage des pages //#####################################################################################################################################################################################//
{
//#########// Registrer page //######################################################################################################################################################################################//
{
var wrongpassword = false
var notexist = false

app.get('/register', function(req, res, next){
  // renders the register page
  res.render('register.html')
});

app.post('/register', (req, res, next) => {
  // What : verifies if the name and password are in the db 
  // When : if the "s'authentifier" button is pressed 
  // Where : on the register page
  dbo.collection('members').find({}, { projection: { _id: 0, name: 1, password : 1} }).toArray(function(err, result) {
    if (err) throw err;
    var Existing = result
    var MDP = password(req.body.Username, result)
    try {
      MDP = decryptData(MDP)
    } catch {
    }  
    if (req.body.Username == "Admin" || userExist(req.body.Username, result) == true){
      if (req.body.Password == "Admin" || MDP == req.body.Password){
        req.session.authentication = 'password'
        res.redirect('/home')
      } else {
        var wrongpassword = true
        res.render('register.html' , {wrongpassword : wrongpassword , notexist : notexist})
      }

    }else {
      var notexist = true
      res.render('register.html' , {wrongpassword : wrongpassword , notexist : notexist})
    }
  });
});
}

//#########// Home page //###########################################################################################################################################################################################//
{
app.get('/home', function(req, res, next){
  // Renders the home page
  if(!authenticationCheck(req, res)){
    return;
  }
  updateDate()
  resetDatabase(globalThis.day_date)

  // Stat and chart Box
  dbo.collection('stats').find({}, {projection: {_id: 0, date : 1, price : 1}}).toArray(function(err, result){
      if(err) throw err;
      dbo.collection('members').find({}, {projection: {_id: 0, name : 1, score : 1, pdp : 1}}).toArray(function(err, mem){
        if(err) throw err;
      var idx_win = maxScore(mem)
      if (idx_win == -1){
        var winner = "Personne"
        var score = 0
        pdp = "caca.jpg"
      } else {
        winner = mem[idx_win].name
        score = mem[idx_win].score
        pdp = mem[idx_win].pdp
      }
      var month_total = oldPrice(globalThis.monthdate, result)
      var q_total = quadriPrice(result)
      var revenue_change = profitChange(globalThis.monthdate, result)
      if(revenue_change == "NaN"){
        revenue_change = 0
      }
      var chartData = dataChart(result)

      // Late Locations 
      dbo.collection('locations').find({}, {projection: {_id: 0, name: 1, member: 1, tool: 1, bail: 1, date: 1, comment: 1}}).toArray(function(err, loca){
        if(err) throw err;
        var today_split = globalThis.finaldate.split("/")
        today_split = deformatList(today_split)
        var late_locations = []
        for(let i = 0; i < loca.length; i++){
          var loca_date_tab = loca[i].date.split("/")
          loca_date_tab = deformatList(loca_date_tab)
          if(today_split[2] - loca_date_tab[2]> 0){
            if(loca_date_tab[1] == 12){
              if(today_split[0] > 14 - (31 - loca_date_tab[0])){
                late_locations.push(loca[i])
              }
            }
            else {
              late_locations.push(loca[i])
            }
            
          }
          else{
            if (loca_date_tab[1] - today_split[1] > 1 ){
              late_locations.push(loca[i])
            }
            else if (loca_date_tab[1] - today_split[1] == 1){
              if(loca_date_tab[1] == 2 && today_split[0] >= 14 - (28 - parseInt(loca_date_tab[0]))){
                late_locations.push(loca[i])
              }
              else if ((loca_date_tab[1] == 1 || loca_date_tab[1] == 3 || loca_date_tab[1] == 5 || loca_date_tab[1] == 7 || loca_date_tab[1] == 8 || loca_date_tab[1] == 10 || loca_date_tab == 12) && today_split[0] >= 14 - (31 - parseInt(loca_date_tab[0]))){
                late_locations.push(loca[i])
              }
              else if ((loca_date_tab[1] == 4 || loca_date_tab[1] == 6 || loca_date_tab[1] == 9 || loca_date_tab[1] == 11) && today_split[0] >= 14 - (31 - parseInt(loca_date_tab[0]))){
                late_locations.push(loca[i])
              }
            }
            else if (loca_date_tab[1] - today_split[1] == 0){
              if(today_split[0] >= parseInt(loca_date_tab[0]) +14){
                late_locations.push(loca[i])
              }
            }
          }
        }
  if(late_locations.length !=0 ){
    res.render('home.html', {month_total : month_total, q_total : q_total, revenue_change : revenue_change, data : chartData, name : winner, score : score, late_true: 1, late_locations : late_locations, pdp : pdp})
  }
  else{
    res.render('home.html', {month_total : month_total, q_total : q_total, revenue_change : revenue_change, data : chartData, name : winner, score : score, Alternate_message : 1, pdp : pdp})
  }
  });
  });
  });
});
}

//#########// Rental pages //######################################################################################################################################################################################//
{
  app.get('/rental_list', function(req, res, next){
    // Renders the "Toutes les locations" page
    if(!authenticationCheck(req, res)){
      return;
    }
    dbo.collection('locations').find({}, {projection: {_id: 0, name: 1, member: 1, tool: 1, bail: 1, date: 1, comment: 1}}).toArray(function(err, result){
        if(err) throw err;
        if (globalThis.search == true){
          rental_list = req.session.search
          globalThis.search = false
        } else{
          rental_list = sortName(result)
        }
    res.render('rental_list.html', {rental_list : rental_list}); 
    });
  });

  app.get('/rental_new', function(req, res, next){
    // Renders the "Nouvelle Location" page
    if(!authenticationCheck(req, res)){
      return;
    }
    updateDate()
    var add_selection = []
    for (let i = 0 ; i < globalThis.count; i++){
      add_selection.push({number : i})
    }
    dbo.collection('locataires').find({}, { projection: { _id: 1, surname : 1, firstname :1} }).toArray(function(err, result) {
          if (err) throw err;
    var listclients = sortName(result)
    dbo.collection('inventaire').find({}, { projection: { _id: 1, name : 1} }).toArray(function(err, result) {
          if (err) throw err;
    var tool_list = sortOutil(result)
    dbo.collection('members').find({}, { projection: { _id: 1, name : 1} }).toArray(function(err, result) {
          if (err) throw err;
    var listmembres = result
    dbo.collection('locations').find({}, {projection: {_id: 1, name: 1, member: 1, tool: 1, bail: 1, date: 1, comment: 1, returned : 1}}).toArray(function(err, result){
        if(err) throw err;
        if (globalThis.search == true){
            rental_list = req.session.search
            globalThis.search = false
          } else {
            rental_list = sortName(result)
          }
    res.render('rental_new.html', {listclients : listclients, rental_list : rental_list, listmembres : listmembres, tool_list : tool_list, add_selection : add_selection}); 
    });
    });
    });
    });
  });
  
  app.post('/nouvelle_location', (req, res, next) => {
    // What : Adds the new rental to the "location" database
    // When : if the "Ajouter" button is pressed 
    // Where : on the rental_new page
    var d = new Date()
    var newRental = {name : req.body.client, member : req.body.member, tool : req.body.tool, bail : req.body.caution, date : globalThis.finaldate, comment : req.body.commentaire, time : d.getTime() }
    insertMongo(newRental, 'locations')
    insertJson(newRental, 'locations')
    globalThis.count = 1
    dbo.collection('inventaire').find({}, { projection: { _id: 0, name : 1, rented : 1} }).toArray(function(err, result) {
      if (err) throw err;
      var  tools = req.body.tool
      if (typeof tools == 'string') {
      tools = [tools]
      }
      for (let i = 0; i < tools.length; i++){
        for (let j = 0; j < result.length;j++ ){
          if (tools[i] == result[j].name) {
            var oldRent = oldRented(tools[i], result)
            var newValue =  { $set: {name : tools[i], rented : parseInt(oldRent) + 1 } }
            result[j].rented = parseInt(oldRent) + 1
            dbo.collection('inventaire').updateOne({name : tools[i]}, newValue, function(err, res) {
              if (err) throw err;
            });
          }
        }
      }
    });
  
  
    dbo.collection('members').find({}, { projection: { _id: 0, name : 1, score: 1} }).toArray(function(err, result) {
      if (err) throw err;
      for (let j = 0; j < result.length;j++ ){
        if (req.body.member == result[j].name) {
          var newValue =  { $set: {name : req.body.member, score : parseInt(result[j].score) + 1 } }
          dbo.collection('members').updateOne({name : req.body.member}, newValue, function(err, res) {
            if (err) throw err;
          });
        }
      }
    res.redirect('/rental_new');
    });
  });
  
  app.post('/delete_rental', (req, res, next) => {
    // What : renders the rental_return page associated with the rental
    // When : if the "Retour" button is pressed 
    // Where : on the rental_new page
    if(!authenticationCheck(req, res)){
      return;
    }
    updateDate()
    var d = new Date()
    dbo.collection('locations').find({}, { projection: { _id: 1, name : 1, tool : 1, time : 1, date : 1} }).toArray(function(err, inventory) {
      if (err) throw err;
      var location = getLocation(Object.keys(req.body)[0], inventory)
    dbo.collection('inventaire').find({}, { projection: { _id: 0, name: 1, price : 1, rented : 1} }).toArray(function(err, result) {
      if (err) throw err;
      var price = computeTotalPrice(location.tool, result)
      var nb_days = computeTime(location.time, d.getTime())
      var total_price = computePrice(nb_days, price)
      var tools = location.tool
      if (typeof tools == 'string') {
      tools = [tools]
      }
    res.render('rental_return.html', {rental_date : location.date, return_date : globalThis.finaldate, price : total_price, name : location._id, tools : tools});
    });
    });
  });
  
  app.post('/real_price', (req, res, next) => {
    // What : Adds the amount paid for the rental to the "stats" database
    // When : if the "Valider le retour" button is pressed 
    // Where : on the rental_return page
    dbo.collection('stats').find({}, { projection: { _id: 0, price : 1, date : 1} }).toArray(function(err, result) {
      if (err) throw err;
      var addPrice = {price : req.body.Prix, date : globalThis.monthdate}
      if (dateExist(globalThis.monthdate, result) == true) {
        var oldvalue = oldPrice(globalThis.monthdate, result)
        var newPrice = parseFloat(oldvalue) + parseFloat(req.body.Prix)
        var newValue =  { $set: {date : globalThis.monthdate, price : newPrice } }
       
        dbo.collection('stats').updateOne({price : oldvalue}, newValue, function(err, res) {
          if (err) throw err;
        });
      } else{
        insertMongo(addPrice , 'stats')
      }
    dbo.collection('locations').find({}, { projection: { _id: 1, tool : 1} }).toArray(function(err, result) {
      if (err) throw err;
      var  tools = getTools(Object.keys(req.body)[1], result)
    dbo.collection('inventaire').find({}, { projection: { _id: 0, name : 1, rented : 1} }).toArray(function(err, result) {
      if (err) throw err;
      if (typeof tools == 'string') {
      tools = [tools]
      }
      for (let i = 0; i < tools.length; i++){
        for (let j = 0; j < result.length;j++ ){
          if (tools[i] == result[j].name) {
            var oldRent = oldRented(tools[i], result)
            var newValue =  { $set: {name : tools[i], rented : parseInt(oldRent) - 1 } }
            result[j].rented = parseInt(oldRent) - 1
            dbo.collection('inventaire').updateOne({name : tools[i]}, newValue, function(err, res) {
              if (err) throw err;
            });
          }
        }
      }
    });
    });
  

    var name = {"_id" : ObjectId(Object.keys(req.body)[1])}
    deleteMongo(name ,'locations')
    res.redirect('/home');
  });
});
  
  app.post('/add_tool', (req, res, next) => {
    // What : Adds a dropdown poll
    // When : if the "+" button is pressed 
    // Where : on the rental_new page
    globalThis.count += 1
    res.redirect('/rental_new');
  });
  
  app.post('/del_tool', (req, res, next) => {
    // What : Removes a dropdown poll
    // When : if the "_" button is pressed 
    // Where : on the  page
    if (globalThis.count > 1) {
      globalThis.count -= 1
    }
    res.redirect('/rental_new');
  });
  
  
}

//#########// Clientspages //########################################################################################################################################################################################//
{
app.get('/client', function(req, res, next){
  // Renders the "Informations Locataires" page
  if(!authenticationCheck(req, res)){
    return;
  }
  dbo.collection('locataires').find({}, {projection: {_id: 0, surname: 1, firstname: 1, telephone: 1, mail: 1, groupement : 1}}).toArray(function(err, result){
      if(err) throw err;
      result = decryptTelephone(result)
      result = decryptMail(result)
      if (globalThis.search == true){
        client_array = req.session.search
        globalThis.search = false
      } else{
        client_array = sortName(result)
      }
  res.render('client.html', {client_array : client_array})
  });
});

app.get('/client_new', function(req, res, next){
  // Renders the "Nouveau client" page
  if(!authenticationCheck(req, res)){
    return;
  }
  dbo.collection('locataires').find({}, {projection: {_id: 0, surname: 1, firstname: 1, telephone: 1, mail: 1, groupement : 1}}).toArray(function(err, result){
      if(err) throw err;
      result = decryptTelephone(result)
      result = decryptMail(result)
      if (globalThis.search == true){
        client_list = req.session.search
        globalThis.search = false
      } else{
        client_list = sortName(result)
      }
  res.render('client_new.html', {client_list : client_list})
  });  
});

app.post('/new_client', (req, res, next) => {
  // What : Adds the new client to the "locataires" database
  // When : if the "Ajouter" button is pressed 
  // Where : on the client_new page
  var newClient = {surname : req.body.Nom.toUpperCase(), firstname : req.body.Prenom, telephone : encryptData(req.body.GSM), mail : encryptData(req.body.Mail), groupement : req.body.Group}
  insertMongo(newClient, 'locataires')
  insertJson(newClient, 'locataires')
  res.redirect('/rental_new');
});

app.post('/delete_client', (req, res, next) => {
  // What : Removes the new client from the "locataires" database
  // When : if the "Supprimer" button is pressed 
  // Where : on the client_new page
  var deleteClient = {surname : Object.keys(req.body)[0]}
  deleteMongo(deleteClient, 'locataires')
  res.redirect('/client_new');
});
}

//#########// Inventory pages //######################################################################################################################################################################################//
{
app.get('/inventory_list', function(req, res, next){
  // Renders the "Liste d'outils" page
  if(!authenticationCheck(req, res)){
    return;
  }
  dbo.collection('inventaire').find({}, {projection: {_id: 0, name: 1, quantity: 1, price: 1, rented : 1}}).toArray(function(err, result){
      if(err) throw err;
      if (globalThis.search == true){
        tool_list = req.session.search
        globalThis.search = false
      } else{
        tool_list = sortOutil(result)
      }
  res.render('inventory_list.html', {tool_list : tool_list})
  });
});

app.get('/inventory_modify', function(req, res, next){
  // Renders the "Modifier" page
  if(!authenticationCheck(req, res)){
    return;
  }
  dbo.collection('inventaire').find({}, {projection: {_id: 0, name: 1, quantity: 1, price: 1, rented : 1}}).toArray(function(err, result){
      if(err) throw err;
      if (globalThis.search == true){
        inventory_list = req.session.search
        globalThis.search = false
      } else{
        inventory_list = sortOutil(result)
      }
  res.render('inventory_modify.html', {inventory_list : inventory_list})
  });
});

app.post('/inventory_modify', (req, res, next) => {
  // What : Adds the new tool to the "inventaire" database
  // When : if the "Ajouter" button is pressed 
  // Where : on the inventory_modify page
  var newTool = {name : req.body.Nom, quantity : req.body.Quantité, price : req.body.Prix, rented : '0'}
  insertMongo(newTool, 'inventaire')
  insertJson(newTool , 'inventaire')
  res.redirect('/inventory_modify')
});

app.post('/delete_tool', (req, res, next) => {
  // What : Removes the new tool from the "inventaire" database
  // When : if the "Supprimer" button is pressed 
  // Where : on the inventory_modify page
  var deleteTool = {name : Object.keys(req.body)[0]}
  deleteMongo(deleteTool, 'inventaire')
  res.redirect('/inventory_modify');
});
}


//#########// Rental pages //######################################################################################################################################################################################//
{
app.get('/rental_list', function(req, res, next){
  if(!authenticationCheck(req, res)){
    return;
  }
  dbo.collection('locations').find({}, {projection: {_id: 0, name: 1, member: 1, tool: 1, bail: 1, date: 1, comment: 1}}).toArray(function(err, result){
      if(err) throw err;
      if (globalThis.search == true){
        rental_list = req.session.search
        globalThis.search = false
      } else{
        rental_list = sortName(result)
      }
  res.render('rental_list.html', {rental_list : rental_list}); 
  });
});

app.post('/nouvelle_location', (req, res, next) => {
  var newRental = {name : req.body.client, member : req.body.member, tool : req.body.tool, bail : req.body.caution, date : globalThis.finaldate, comment : req.body.commentaire, time : d.getTime() }
  insertMongo(newRental, 'locations')
  insertJson(newRental, 'locations')
  globalThis.count = 1
  dbo.collection('inventaire').find({}, { projection: { _id: 0, name : 1, rented : 1} }).toArray(function(err, result) {
    if (err) throw err;
    var  tools = req.body.tool
    if (typeof tools == 'string') {
    tools = [tools]
    }
    for (let i = 0; i < tools.length; i++){
      for (let j = 0; j < result.length;j++ ){
        if (tools[i] == result[j].name) {
          var oldRent = oldRented(tools[i], result)
          var newValue =  { $set: {name : tools[i], rented : parseInt(oldRent) + 1 } }
          result[j].rented = parseInt(oldRent) + 1
          dbo.collection('inventaire').updateOne({name : tools[i]}, newValue, function(err, res) {
            if (err) throw err;
          });
        }
      }
    }
  });


  dbo.collection('members').find({}, { projection: { _id: 0, name : 1, score: 1} }).toArray(function(err, result) {
    if (err) throw err;
    for (let j = 0; j < result.length;j++ ){
      if (req.body.member == result[j].name) {
        var newValue =  { $set: {name : req.body.member, score : parseInt(result[j].score) + 1 } }
        dbo.collection('members').updateOne({name : req.body.member}, newValue, function(err, res) {
          if (err) throw err;
        });
      }
    }
  res.redirect('/rental_new');
  });
});

app.post('/delete_rental', (req, res, next) => {
  if(!authenticationCheck(req, res)){
    return;
  }
  dbo.collection('locations').find({}, { projection: { _id: 1, name : 1, tool : 1, time : 1, date : 1} }).toArray(function(err, inventory) {
    if (err) throw err;
    var location = getLocation(Object.keys(req.body)[0], inventory)
  dbo.collection('inventaire').find({}, { projection: { _id: 0, name: 1, price : 1, rented : 1} }).toArray(function(err, result) {
    if (err) throw err;
    var price = computeTotalPrice(location.tool, result)
    var nb_days = computeTime(location.time, d.getTime())
    var total_price = computePrice(nb_days, price)
    var tools = location.tool
    if (typeof tools == 'string') {
    tools = [tools]
    }
  res.render('rental_return.html', {rental_date : location.date, return_date : globalThis.finaldate, price : total_price, name : location._id, tools : tools});
  });
  });
});

app.post('/real_price', (req, res, next) => {
  dbo.collection('stats').find({}, { projection: { _id: 0, price : 1, date : 1} }).toArray(function(err, result) {
    if (err) throw err;
    var addPrice = {price : req.body.Prix, date : globalThis.monthdate}
    if (dateExist(globalThis.monthdate, result) == true) {
      var oldvalue = oldPrice(globalThis.monthdate, result)
      var newPrice = parseFloat(oldvalue) + parseFloat(req.body.Prix)
      var newValue =  { $set: {date : globalThis.monthdate, price : newPrice } }
     
      dbo.collection('stats').updateOne({price : oldvalue}, newValue, function(err, res) {
        if (err) throw err;
      });
    } else{
      insertMongo(addPrice , 'stats')
    }
  dbo.collection('locations').find({}, { projection: { _id: 1, tool : 1} }).toArray(function(err, result) {
    if (err) throw err;
    var  tools = getTools(Object.keys(req.body)[1], result)
  dbo.collection('inventaire').find({}, { projection: { _id: 0, name : 1, rented : 1} }).toArray(function(err, result) {
    if (err) throw err;
    if (typeof tools == 'string') {
    tools = [tools]
    }
    for (let i = 0; i < tools.length; i++){
      for (let j = 0; j < result.length;j++ ){
        if (tools[i] == result[j].name) {
          var oldRent = oldRented(tools[i], result)
          var newValue =  { $set: {name : tools[i], rented : parseInt(oldRent) - 1 } }
          result[j].rented = parseInt(oldRent) - 1
          dbo.collection('inventaire').updateOne({name : tools[i]}, newValue, function(err, res) {
            if (err) throw err;
          });
        }
      }
    }
  });
  });


    var name = {"_id" : ObjectId(Object.keys(req.body)[1])}
    deleteMongo(name ,'locations')
    res.redirect('/home');
  });
});

app.post('/add_tool', (req, res, next) => {
  globalThis.count += 1
  res.redirect('/rental_new');
});

app.post('/del_tool', (req, res, next) => {
  if (globalThis.count > 1) {
    globalThis.count -= 1
  }
  res.redirect('/rental_new');
});

app.get('/rental_new', function(req, res, next){
  if(!authenticationCheck(req, res)){
    return;
  }
  var add_selection = []
  for (let i = 0 ; i < globalThis.count; i++){
    add_selection.push({number : i})
  }
  dbo.collection('locataires').find({}, { projection: { _id: 1, surname : 1, firstname :1} }).toArray(function(err, result) {
        if (err) throw err;
  var listclients = sortName(result)
  dbo.collection('inventaire').find({}, { projection: { _id: 1, name : 1} }).toArray(function(err, result) {
        if (err) throw err;
  var tool_list = sortOutil(result)
  dbo.collection('members').find({}, { projection: { _id: 1, name : 1} }).toArray(function(err, result) {
        if (err) throw err;
  var listmembres = result
  dbo.collection('locations').find({}, {projection: {_id: 1, name: 1, member: 1, tool: 1, bail: 1, date: 1, comment: 1, returned : 1}}).toArray(function(err, result){
      if(err) throw err;
      if (globalThis.search == true){
          rental_list = req.session.search
          globalThis.search = false
        } else {
          rental_list = sortName(result)
        }
  res.render('rental_new.html', {listclients : listclients, rental_list : rental_list, listmembres : listmembres, tool_list : tool_list, add_selection : add_selection}); 
  });
  });
  });
  });
});
}

//#########// Tool Member page //######################################################################################################################################################################################//
{

app.get('/tool_members', (req, res, next) => {
  // Renders the "Membres" page
  if(!authenticationCheck(req, res)){
    return;
  }
  dbo.collection('members').find({}, { projection: { _id: 1, name : 1} }).toArray(function(err, result) {
        if (err) throw err;
  res.render('tool_members.html', {listmembres : result});
  });
});


app.post('/tool_members', upload.single('pdp'), (req, res, next) => {
  // What : Adds the new member to the "members" database
  // When : if the "Ajouter" button is pressed 
  // Where : on the tool_members page
  var newMember = {name : req.body.name, password : encryptData(req.body.password), gsm : encryptData(req.body.GSM), mail : encryptData(req.body.Mail), poste : req.body.Poste, pdp: req.file.filename, score : 0}
  insertMongo(newMember, 'members')
  insertJson(newMember, 'members')
  res.redirect('/tool_members');
});

app.post('/delete_members', (req, res, next) => {
  // What : Removes the member from the "members" database
  // When : if the "Supprimer" button is pressed 
  // Where : on the tool_members page


  //deleting the profile picture  
  dbo.collection('members').find({}, { projection: { _id: 1, name : 1, pdp : 1} }).toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i].name == Object.keys(req.body)[0]){
        console.log('deleting the member' + result[i].name)
        fs.unlinkSync('./static/uploads/' + result[i].pdp)
        console.log('./static/uploads/' + result[i].pdp + '  ,image deleted')
      }
    }
  });

  //deleting the member from the db
  var deleteMember = {name : Object.keys(req.body)[0]}
  deleteMongo(deleteMember, 'members')
  res.redirect('/tool_members');
});

}

//#########// Credit page //######################################################################################################################################################################################//
{

  app.get('/credits', (req, res, next) => {
    // Renders the "credits" page
    if(!authenticationCheck(req, res)){
      return;
    }
    res.render('credits.html');
  });
  
}

//#########// info page //######################################################################################################################################################################################//
{

  app.get('/info_members', (req, res, next) => {
    // Renders the "credits" page
    if(!authenticationCheck(req, res)){
      return;
    }
    dbo.collection('members').find({}, { projection: { _id: 1, name : 1, gsm : 1, mail : 1, score : 1, poste : 1, pdp: 1} }).toArray(function(err, result) {
      if (err) throw err;
      result = decryptGsm(result)
      result = decryptMail(result)
    res.render('info_members.html', {members_list : result});
  });
  });
  
}

//#########// EE page //######################################################################################################################################################################################//
{

  app.get('/EE', (req, res, next) => {
    // Renders the "credits" page
    if(!authenticationCheck(req, res)){
      return;
    }
    res.render('EE.html');
  });
  
}

}


//########// Research bar //########################################################################################################################################################################################//
{

//########// Searching data //######################################################################################################################################################################################//
{
function isWholeInData(search_string, Data, i, collection){
  //pré: search_string is a String
  //     Data is a collection of Object out of the database
  //     i is an index of Data
  //post: return true if a part of search_string is in data
  if (collection == "inventaire" && Data[i].name.toLowerCase() == search_string){
      return true
    }
  else if (collection == "locations" && (Data[i].name.toLowerCase() == search_string || Data[i].member.toLowerCase() == search_string || toLowerCaseList(Data[i].tool) == search_string || Data[i].bail.toLowerCase() == search_string || Data[i].date.toLowerCase() == search_string)){
    return true
  }
  else if (collection == "locataires" && (Data[i].surname.toLowerCase() == search_string || Data[i].firstname.toLowerCase() == search_string || Data[i].mail.toLowerCase() == search_string || Data[i].telephone.toLowerCase() == search_string || Data[i].groupement.toLowerCase() == search_string)){
    return true
  } 
  return false
}

function isWholeInTool(search_string, Data, i, collection) {
  //pré: search_strin is a String
  //     Data is a collection of Object out of the database
  //     i is an index of Data
  //post: return true if search_string is in Data[i].tool
  data_lowerCase = toLowerCaseList(Data[i].tool)
  for (let j = 0; j < data_lowerCase.length; j++) {
    if (data_lowerCase[j] == search_string){
      return true
    }
  }
  return false
}
function isWholeInName(search_string, Data, i, collection) {
  //pré: search_strin is a String
  //     Data is a collection of Object out of the database
  //     i is an index of Data
  //post: return true if search_string is in Data[i].name
  data_lowerCase = toLowerCaseList(Data[i].name)
  for (let j = 0; j < data_lowerCase.length; j++) {
    if (data_lowerCase[j] == search_string){
      return true
    }
  }
  return false
}

function isPartInData(search_tab, Data, i, j, collection){
  //pré: search_tab is the splitted representation of a String
  //     Data is a collection of Object out of the database
  //     i is an index of Data
  //     j is an index of search_string
  //post: return true if a part of search_string is in data
  if (collection == "inventaire" && Data[i].name.toLowerCase() == search_tab[j]){
      return true
    }
  else if (collection == "locations" && (Data[i].name.toLowerCase() == search_tab[j] || Data[i].member.toLowerCase() == search_tab[j] || toLowerCaseList(Data[i].tool)  == search_tab[j] || Data[i].bail.toLowerCase() == search_tab[j] || Data[i].date.toLowerCase() == search_tab[j])){
    return true
  }
  else if (collection == "locataires" && (Data[i].surname.toLowerCase() == search_tab[j] || Data[i].firstname.toLowerCase() == search_tab[j] || Data[i].mail.toLowerCase() == search_tab[j] || Data[i].telephone.toLowerCase() == search_tab[j] || Data[i].groupement.toLowerCase() == search_tab[j])){
    return true
  } 
  return false 
}

function isPartOfName(search_tab, Data, i,j){
  //pré: search_tab is the splitted representation of a String
  //     Data is a collection of Object out of the database
  //     i is an index of Data
  //     j is an index of search_string
  //post: return true if search_tab[j] is in Data[i].name
  data_array = Data[i].name.toLowerCase().split(" ")
  for(let idx = 0; idx < data_array.length; idx++){
    if(search_tab[j] == data_array[idx]){
      return true
    }
  }
  return false
}

function isPartOfTool(search_tab, Data, i,j){
  //pré: search_tab is the splitted representation of a String
  //     Data is a collection of Object out of the database
  //     i is an index of Data
  //     j is an index of search_string
  //post: return true if search_tab[j] is in Data[i].tool
  data_lowerCase = toLowerCaseList(Data[i].tool)
  data_array = []
  for (let i = 0; i < data_lowerCase.length; i++) {
    data_array.push(data_lowerCase[i].split(" "))    
  }
  for(let idx = 0; idx < data_array.length; idx++){
    for (let word = 0; word < data_array[idx].length ; word++) {
      if(search_tab[j] == data_array[idx][word]){
        return true
      }
    }
  }
  return false
}

function isPartOfBail(search_tab, Data, i,j){
  //pré: search_tab is the splitted representation of a String
  //     Data is a collection of Object out of the database
  //     i is an index of Data
  //     j is an index of search_string
  //post: return true if search_tab[j] is in Data[i].by
  data_array = Data[i].bail.toLowerCase().split(" ")
  for(let idx = 0; idx < data_array.length; idx++){
    if(search_tab[j] == data_array[idx]){
      return true
    }
  }
  return false
}

function isPartOfDate(search_tab, Data, i,j){
  //pré: search_tab is the splitted representation of a String
  //     Data is a collection of Object out of the database
  //     i is an index of Data
  //     j is an index of search_string
  //post: return true if search_tab[j] is in Data[i].by
  data_array = Data[i].date.toLowerCase().split("/")
  for(let idx = 0; idx < data_array.length; idx++){
    if(search_tab[j] == data_array[idx]){
      return true
    }
  }
  return false
}

function isPartOfSurname(search_tab, Data, i,j){
  //pré: search_tab is the splitted representation of a String
  //     Data is a collection of Object out of the database
  //     i is an index of Data
  //     j is an index of search_string
  //post: return true if search_tab[j] is in Data[i].description
  data_array = Data[i].surname.toLowerCase().split(" ")
  for(let idx = 0; idx < data_array.length; idx++){
    if(search_tab[j] == data_array[idx]){
      return true
    }
  }
  return false
}

function isPartOfGroupement(search_tab, Data, i,j){
  //pré: search_tab is the splitted representation of a String
  //     Data is a collection of Object out of the database
  //     i is an index of Data
  //     j is an index of search_string
  //post: return true if search_tab[j] is in Data[i].description
  data_array = Data[i].groupement.toLowerCase().split(" ")
  for(let idx = 0; idx < data_array.length; idx++){
    if(search_tab[j] == data_array[idx]){
      return true
    }
  }
  return false
}


function notInResult(search_result, Data, i){
  //pré: search_result is an Array of object out of Data
  //     Data is a collection of Object out of the database
  //     i is a index of Data
  //post: return true if Data[i] is not in search_result and false otherwise
  for(let e = 0; e < search_result.length; e++){
    if(Data[i] == search_result[e]){
      return false
    }
  }
  return true
}
}

//########// Post function //########################################################################################################################################################################################//
{
app.post('/Research_locations', (req, res) => {
  // What : Selects the right datas according to the research made
  // When : if the "Rechercher" button is pressed 
  // Where : on the rental_list page  
  dbo.collection('locations').find({}, { projection: { _id: 0, name : 1, member : 1, tool : 1, bail : 1, date : 1, comment : 1} }).toArray(function(err, Data) {
    if (err) throw err;
    var search_string = req.body.search
    search_string = search_string.toLowerCase()
    search_tab = search_string.split(" ")
    var search_result = []
    for(let i = 0; i < Data.length; i++){
      if (isWholeInData(search_string, Data, i, "locations") || isWholeInTool(search_string, Data, i, "locations")){
          if(notInResult(search_result, Data, i)){
            search_result.push(Data[i])
          }
      }
    } 
    if (search_result.length == 0){
      for(let i = 0; i < Data.length; i++){
        for(let j = 0; j < search_tab.length; j++){
          if (isPartInData(search_tab, Data, i, j, "locations") || isPartOfName(search_tab, Data, i, j) || isPartOfBail(search_tab, Data, i,j) || isPartOfTool(search_tab, Data, i,j) || isPartOfDate(search_tab, Data, i,j)){
            if(notInResult(search_result, Data, i)){
              search_result.push(Data[i])
            }
          }
        } 
      }
    }
  search_result = sortDate(search_result)
  globalThis.search = true
  req.session.search = search_result
  res.redirect('/rental_list'); 
  });
});


app.post('/Research_locations_modify', (req, res) => {
  // What : Selects the right datas according to the research made
  // When : if the "Rechercher" button is pressed 
  // Where : on the rental_new page  
  dbo.collection('locations').find({}, { projection: { _id: 0, name : 1, member : 1, tool : 1, bail : 1, date : 1, comment : 1} }).toArray(function(err, Data) {
    if (err) throw err;
    var search_string = req.body.search
    search_string = search_string.toLowerCase()
    search_tab = search_string.split(" ")
    var search_result = []
    for(let i = 0; i < Data.length; i++){
      if (isWholeInData(search_string, Data, i, "locations") || isWholeInTool(search_string, Data, i, "locations")){
          if(notInResult(search_result, Data, i)){
            search_result.push(Data[i])
          }
      }
    } 
    if (search_result.length == 0){
      for(let i = 0; i < Data.length; i++){
        for(let j = 0; j < search_tab.length; j++){
          if (isPartInData(search_tab, Data, i, j, "locations") || isPartOfName(search_tab, Data, i, j) || isPartOfBail(search_tab, Data, i,j) || isPartOfTool(search_tab, Data, i,j) || isPartOfDate(search_tab, Data, i,j)){
            if(notInResult(search_result, Data, i)){
              search_result.push(Data[i])
            }
          }
        } 
      }
    }
  search_result = sortDate(search_result)
  globalThis.search = true
  req.session.search = search_result
  res.redirect('/rental_new'); 
  });
});

app.post('/Research_inventory', (req, res) => {
  // What : Selects the right datas according to the research made
  // When : if the "Rechercher" button is pressed 
  // Where : on the inventory_list page  
  dbo.collection('inventaire').find({}, { projection: { _id: 0, name : 1, quantity : 1, price : 1, rented : 1} }).toArray(function(err, Data) {
    if (err) throw err;
    var search_string = req.body.search
    search_string = search_string.toLowerCase()
    search_tab = search_string.split(" ")
    const search_result = []
    for(let i = 0; i < Data.length; i++){
      if (isWholeInData(search_string, Data, i, "inventaire") || isWholeInName(search_string, Data, i, "inventaire")){
          if(notInResult(search_result, Data, i)){
            search_result.push(Data[i])
          }
      }
    } 
    if (search_result.length == 0){
      for(let i = 0; i < Data.length; i++){
        for(let j = 0; j < search_tab.length; j++){
          if (isPartInData(search_tab, Data, i, j, "inventaire") || isPartOfName(search_tab, Data, i, j)){
            if(notInResult(search_result, Data, i)){
              search_result.push(Data[i])
            }
          }
        } 
      }
    }
  globalThis.search = true
  req.session.search = search_result
  res.redirect('/inventory_list'); 
  });
});

app.post('/Research_inventory_modify', (req, res) => {
  // What : Selects the right datas according to the research made
  // When : if the "Rechercher" button is pressed 
  // Where : on the inventory_modify page  
  dbo.collection('inventaire').find({}, { projection: { _id: 0, name : 1, quantity : 1, price : 1, rented : 1} }).toArray(function(err, Data) {
    if (err) throw err;
    var search_string = req.body.search
    search_string = search_string.toLowerCase()
    search_tab = search_string.split(" ")
    const search_result = []
    for(let i = 0; i < Data.length; i++){
      if (isWholeInData(search_string, Data, i, "inventaire") || isWholeInName(search_string, Data, i, "inventaire")){
          if(notInResult(search_result, Data, i)){
            search_result.push(Data[i])
          }
      }
    } 
    if (search_result.length == 0){
      for(let i = 0; i < Data.length; i++){
        for(let j = 0; j < search_tab.length; j++){
          if (isPartInData(search_tab, Data, i, j, "inventaire") || isPartOfName(search_tab, Data, i, j)){
            if(notInResult(search_result, Data, i)){
              search_result.push(Data[i])
            }
          }
        } 
      }
    }
  globalThis.search = true
  req.session.search = search_result
  res.redirect('/inventory_modify'); 
  });
});

app.post('/Research_client', (req, res) => {
  // What : Selects the right datas according to the research made
  // When : if the "Rechercher" button is pressed 
  // Where : on the client page  
  dbo.collection('locataires').find({}, { projection: { _id: 0, surname : 1, firstname : 1, mail : 1, telephone : 1, groupement : 1, locations : 1} }).toArray(function(err, Data) {
    if (err) throw err;
    Data = decryptTelephone(Data)
    Data = decryptMail(Data)
    var search_string = req.body.search
    search_string = search_string.toLowerCase()
    search_tab = search_string.split(" ")
    const search_result = []
    for(let i = 0; i < Data.length; i++){
      for(let j = 0; j < search_string.length; j++){
        if (isWholeInData(search_string, Data, i, "locataires") || isPartInData(search_tab, Data, i, j, "locataires") || isPartOfSurname(search_tab, Data, i, j) || isPartOfGroupement(search_tab, Data, i, j)){
          if(notInResult(search_result, Data, i)){
            search_result.push(Data[i])
          }
        }
      } 
    }
  globalThis.search = true
  req.session.search = search_result
  res.redirect('/client'); 
  });
});

app.post('/Research_client_new', (req, res) => {
  // What : Selects the right datas according to the research made
  // When : if the "Rechercher" button is pressed 
  // Where : on the client_new page 
  dbo.collection('locataires').find({}, { projection: { _id: 0, surname : 1, firstname : 1, mail : 1, telephone : 1, groupement : 1, locations : 1} }).toArray(function(err, Data) {
    if (err) throw err;
    Data = decryptTelephone(Data)
    Data = decryptMail(Data)
    var search_string = req.body.search
    search_string = search_string.toLowerCase()
    search_tab = search_string.split(" ")
    const search_result = []
    for(let i = 0; i < Data.length; i++){
      for(let j = 0; j < search_string.length; j++){
        if (isWholeInData(search_string, Data, i, "locataires") || isPartInData(search_tab, Data, i, j, "locataires") || isPartOfSurname(search_tab, Data, i, j) || isPartOfGroupement(search_tab, Data, i, j)){
          if(notInResult(search_result, Data, i)){
            search_result.push(Data[i])
          }
        }
      } 
    }
  globalThis.search = true
  req.session.search = search_result
  res.redirect('/client_new'); 
  });
});
}

}


//#################################// lancer le server //#####################//
{
https.createServer({
 key: fs.readFileSync('./key.pem'),
 cert: fs.readFileSync('./cert.pem'),
 passphrase: 'ingi'
}, app).listen(8080);
console.log('Express server started on port 8080');
app.use(express.static('static'));
app.use(express.static('public'));
}


