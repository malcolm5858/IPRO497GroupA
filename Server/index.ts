import express from 'express';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// rest of the code remains same
const app = express();
const PORT = 8000;

const db_url = 'mongodb://localhost:27017';
const db_name = 'studentSurvey';

app.use(express.json());


// ROUTES
app.post('/surveyResponse', async (req, res) => {
  try {
    console.log(req.body);

    MongoClient.connect(db_url, function (err: any, client: { db: (arg0: string) => any; close: () => void; }) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
    
      const db = client.db(db_name);
      const responses = db.collection('Responses');
      responses.insertOne(req.body, function (err: any, result: any) {
        assert.equal(err, null);
      });


      client.close();
    });

    res.status(201).json({
      status:"ok"
    })
  }
  catch (error){
    console.error(error.message);
  }
})




app.get('/', (req, res) => res.send('Express + TypeScript Server'));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});