const rpc = require("node-json-rpc");

const options = {
  port: 4444,
  host: "127.0.0.1",
  path: "./",
  strict: false,
};

const server = new rpc.Server(options);

server.addMethod("test", (params, callback) => {
  const error = null;
  const result = { msg: "success" };
  callback(error, result);
});

server.start((err) => {
  if (err) throw err;
  else console.log("RPC server started");
});
