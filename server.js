const express = require('express');
const app = express();
const jwt=require('jsonwebtoken');

const bodyParser = require ('body-parser');

const path = require ('path');
const exjwt = require ('express-jwt');

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

const secretKey= 'My super secret key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms:['HS256']

});

let users = [
    {
		id: 1,
		username: "fabio",
		password: "123"
	},
	
    {
        id:2,
        username: 'roohi',
        password: '456'
    }
   
]

app.post('/api/login', (req,res) => {
    const { username, password} = req.body;
    
    for(let user of users){
        if(username == user.username && password == user.password){
            let token = jwt.sign({id: user.id, username: user.username}, secretKey, { expiresIn: "180000" });
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }
    }
            res.status[401].json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            });

        

    console.log('This is me',username,password);
    res.json({data: 'it works'});

}); 


app.get('/api/dashboard', jwtMW, (req,res) => {
    
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see.'
    })

});

app.get('/api/settings', jwtMW, (req,res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see, settings.'
    })

});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.use(function (err, req, res, next) {
	
	const token = req.headers.authorization;
	
	try {
	  var decoded = jwt.verify(token, secretKey);
	  res.json({
		success: true,
		myContent: "Secret content that only logged in people can see!!!",
	  });
	} catch (err) {
	  
	  res.status(401).json({
		success: false,
		officialError: err,
		err: "Incorrect token",
	  });
	}
  
	
  });
  
  app.listen(PORT, () => {
	console.log(`Serving on port ${PORT}`);
  });
  