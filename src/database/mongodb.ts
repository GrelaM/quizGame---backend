import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

MongoClient.connect(
	'mongodb+srv://quizgameadmin:zFzcAHbtaVv6wwt6@cluster0.s37zq.mongodb.net/quizDatabase?retryWrites=true&w=majority'
)
	.then(result => {
        console.log('Connected...')
    })
	.catch(err => console.log(err));
