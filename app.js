const express = require('express'),
      app = express();

app.use(express.static(__dirname + "/public"));

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist/umd'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

console.log("[RandomChess] Init");

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const port = 2909;
app.listen(port, () => {
  console.log(`[RandomChess] Listening on Port: ${port}`)
});
