const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'users' });

        this.router = this.express.Router();

        this.routers();
    }

    routers() {

        this.router.post('/auth', async (req, res) => {
            let { email, password, token } = req.query;
            if (token) {
                let user = this.db.get('users').list.find(item => item?.token === token);
                res.send(user ? { status: 200, ...user } : { status: 404, message: 'This user does not exist' });
            } else {
                if (!email || !password) return res.send({ status: 401 });
                let user = this.db.get('users').list.find(item => item?.email === email);
                if (!user) return res.send({ status: 404, message: 'This user does not exist' });
                if (user.password === password) return res.send({ status: 200, ...user });
                else return res.send({ status: 409, message: 'You entered the wrong password' });
            }
        });

    }
}