const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri");

console.log(uri);

const client = new MongoClient(uri);

const dbName = "bank";

const connectToDatabe = async () => {
    try {
        await client.connect();
        console.log(`Connect to the DB ${dbName} Successfully`);
    } catch (error) {
        console.log(`Error connecting to the DB ${dbName}`);
        console.log(error);
    }
}

const insertManyAccount = async () => {
    try {
        const newAccounts = [
            {
                account_holder: "Seeni",
                account_id: "123456",
                account_type: "checking",
                balance: 100000,
                last_updated: new Date()
            },
            {
                account_holder: "Jeni",
                account_id: "123456",
                account_type: "checking",
                balance: 100000,
                last_updated: new Date()
            }
        ];

        const collectionName = "accounts";
        const accountCollection = client.db(dbName).collection(collectionName);

        const result = await accountCollection.insertMany(newAccounts);
        console.log("Many Document Inserted Successfully!");
        console.log(result);
    } catch (error) {
        console.log("Error Inserting Many Documents");
        console.log(error);
    }
}

const main = async () => {
    try {
        await connectToDatabe();
        await insertManyAccount();
    } catch (error) {
        console.log(`Error connecting to the DataBase ${dbName}`);
        console.log(error);
    } finally {
        await client.close();
    }
}

main();