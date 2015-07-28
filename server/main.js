import koa from 'koa';
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import koaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import config from './config';

const app = koa();
const router = koaRouter();
const env = process.env.NODE_ENV || 'development';

var AWS = require("dynamise/node_modules/aws-sdk");

AWS.config.update(config.aws);

var db = require("dynamise");
var client = db(config.dynamise.endpoint);
var tables = require("./tables");

// set tables
client.set(tables);


client.create("Articles")

.then(function(data) {
  console.log("Wait for Articles to be Active");
  return client.active("Articles")
})
.then(function(data) {
  console.log(data)
})
.catch(function(err) {
  // if( err.code === "ResourceNotFoundException") {
  //   console.log("Example is gone");
  // }
  // else {
  console.log(err, err.stack);
  // }
});

app.use(responseTime());
app.use(logger());
app.use(bodyParser());


function dayMark(date) {
   var yyyy = date.getFullYear().toString();
   var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = date.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
  };

router.post('/articles', function*(next){
  var token = Math.random().toString(36).substr(2);
  var data = this.request.body;
  data.id = token;
  var now = new Date();
  data.createdAt = now.getTime()
  data.dayMark = dayMark(now);
  // data.dayMark = '20110728';
  console.log(data);
  var article = yield client.table("Articles").create(this.request.body)
  return this.body = article;
});

router.get('/articles', function*(next) {
  var articles = yield client.table("Articles").scan(
    {IndexName: "CreatedIndex",
     Limit: 20
    } // DateIndex
  );
  return this.body = articles;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Application started on port ${port}`);
if (process.send) {
  process.send('online');
}
