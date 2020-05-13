var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session')

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var users = new Array();
users[0] = {
	"userId" : 0,
	"name" : "jin",
	"password" : "abc",
	"isAdmin" : true
}

app.get('/login', function (req, res) {
	// users 배열에서 찾도록 처리 해야 함
	// admin 여부를 확인하여 체크
	// req.body.id : ID
	// req.body.name : 패스워드
	var id = req.body.userId;
	var password = req.body.password;

	if(users[id] == id && users[id].password == password){
		req.session.userId = id;
		req.session.isAdmin = users[id].isAdmin;
		res.send("Hello, " + users[id].name);
	} 
	else {
		res.send("Login Failed");
	}
	
});

app.put('/logout', function (req, res) {
	// Logout
	// 세션 유효 여부를 체크하고 세션 Delete
	req.session.userId = null;
	res.send(req.session.userId);
	req.session.destroy(function(err) {
		
	});

});

var auth = function (req, res, next) {
	// Session Check
	// 어드민 여부 체크 필요
	if (req.session.userId != null && req.session.isAdmin == true)
		next();
	else
		res.send("Error");

};
app.get('/users/:userId', auth, function (req, res) {
	// get User Information
	console.log(users[req.params.userId]);
	res.send(user[req.params.userId]);
});

app.put('/users/:userId', auth, function (req, res) {
	// Update User Information
	users[req.params.userId] = req.body;
	console.log(users[req.body.userId]);
});

app.delete('/users/:userId', auth, function (req, res) {
	// Delete User Information
	users[req.params.userId] = null;
	res.send(users[req.body.userId]);
});

// 사용자 추가 시에 admin 여부도 추가해야 함
app.post('/users', auth, function (req, res){
	users[req.body.id] = req.body;
	res.send(users[req.body.id]);
});

var server = app.listen(81);
