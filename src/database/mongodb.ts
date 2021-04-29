import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

MongoClient.connect(
	'url'
)
	.then(result => console.log('MongoDB connected...'))
	.catch(err => console.log(err));
