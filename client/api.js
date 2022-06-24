module.exports = function (app, db) {

	app.get('/api/test', function (req, res) {
		res.json({
			name: 'joe'
		});
	});

    app.get('/api/login', async (req, res) => {

		const { username, hashPassword } = req.query;
		let user = await db.manyOrNone('select * from hearts_app');
		if (username) {
			user = await db.manyOrNone('select * from hearts_app where username = $1', [username]);
		}
		if (hashPassword) {
			user = await db.manyOrNone('select * from hearts_app where user_password = $1', [hashPassword])
		}
		if (username && hashPassword) {
			user = await db.manyOrNone('select * from hearts_app where username = $1 AND user_password = $2', [username, hashPassword])
		}
		console.log(user);
		res.json({
			data: user
		})
	});


	async function getUser(username) {
		const user = username
		console.log(user)
		return user;
	}
	app.post('/api/register', async (req, res) => {

	try {
		const { username, hashPassword } = req.body;
		const user = await getUser(username);
		
		user = await db.manyOrNone('select * from hearts_app where username = $1', [username]);

		
		if(user !== null) {
			throw Error('User exist')
		}

			// hashPassword using bcrypt
			const salt = await bcrypt.genSalt()
			const hashedPassword = await bcrypt.hash(req.body.hashPassword, salt)
			console.log(hashedPassword+ 'bongie') 
	
			//insert my users to database
			await db.none(`insert into hearts_app(username, user_password) values ($1,$2)`, [ username, hashPassword])
		
		res.json({
					hashPassword:hashPassword,
			        status: 'success',
			
			    });
	} catch (error) {
		console.log(error);
		    res.status(501).json({
		    status: 'error',
		    error: error.message
		})
	}
	});
}