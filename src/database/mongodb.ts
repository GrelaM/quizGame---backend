import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

MongoClient.connect(
	'mongodb+srv://<USER>:<PASSWORD>@cluster0.s37zq.mongodb.net/quizGameDatabase?retryWrites=true&w=majority'
)
	.then(result => console.log('MongoDB connected...'))
	.catch(err => console.log(err));
