const sql = require(`mysql2`);
const {
    database
} = require(`../Assets/Config.json`);
const color = require(`colors`);

const connection = sql.createConnection({
    host: database.host,
    user: database.username,
    database: database.database,
    password: database.password,
    port: database.port
});

module.exports = {

    async startDatabase() {
        await connection.connect(err => {

            if (err) {
                console.log(err);
                console.log(`Database Connection Failed!`.red)
                return;
            }

            console.log(`Databse Successfully Connected!`.green)

        });
    },

    async getConnection() {
        return connection;
    }

}