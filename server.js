import { MongoClient, ObjectId } from 'mongodb';
import express from 'express';
const port = 666;
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: true}));


const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('employees');
const personCollection = db.collection('person');

app.get('/start', (req, res) => {
  res.render('start');
});

app.get('/persons', async (req, res) => {
  const persons = await personCollection.find({}).toArray();
  res.render('persons', {
    persons
  });
});

app.get('/persons/:id', async (req, res) => {
  const persons = await personCollection.find({}).toArray()
  const person = await personCollection.findOne({ _id: ObjectId(req.params.id) });
  res.render('person', {
    persons,
    person,
  });
});

//-----create-----//

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', async (req, res) => {
  await personCollection.insertOne(req.body);
  res.redirect('/persons');

});




//-----sort-----//


app.get('/persons/sort/1', async (req, res) => {
  const persons = await personCollection.find({}).sort({name: 1}).toArray();
  res.render('persons', {
    persons
  })
})
app.get('/persons/sort/2', async (req, res) => {
  const persons = await personCollection.find({}).sort({name: -1}).toArray();
  res.render('persons', {
    persons
  })
})

//-----update-----//

app.post('/persons/update/:id', async (req, res) => {
  console.log(req.body);
  await personCollection.updateOne({ _id: ObjectId(req.params.id)}, {$set: {...req.body}});
  res.redirect('/persons');
})

app.listen(port, () => console.log(`Listening on port ${port}`));

//-----delete-----//
 app.get('/persons/:id/delete', async (req, res) => {
   
  const deletePerson = await personCollection.findOne({ _id: ObjectId(req.params.id) });
  
  personCollection.deleteOne(deletePerson);
  res.redirect('/persons');
}) 