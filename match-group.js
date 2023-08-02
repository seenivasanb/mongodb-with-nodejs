const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri");

const client = new MongoClient(uri);

const pipelines = [
    {
        $match: {
            balance: { $lt: 1000 }
        }
    },
    {
        $group: {
            _id: "$account_type",
            total_balance: { $sum: "$balance" },
            avg_balance: { $avg: "$balance" },
        }
    }

]

const main = async () => {
    try {
        await client.connect();
        console.log("Connect to the DB!");
        console.log(uri);

        const accounts = client.db("bank").collection("accounts");
        const result = await accounts.aggregate(pipelines);

        for await (const doc of result) {
            console.log(doc);
        }
    } catch (error) {
        console.error("Error connecting to the database: ", error);
    } finally {
        await client.close();
    }
}

main()