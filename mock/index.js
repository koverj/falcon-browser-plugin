const jsonServer = require("json-server");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8086;
const resp = require("./locators.json");

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.get("/locators", (request, response) => {
  if (request.method === "GET") {
    const url = request.query.url;

    const f = filter(resp, (_, v) => {
      return v.urls.includes(url);
    });

    response.status(200).json(f);
  }
});

const filter = (obj, fun) =>
  Object.entries(obj).reduce(
    (prev, [key, value]) => ({
      ...prev,
      ...(fun(key, value) ? { [key]: value } : {})
    }),
    {}
  );

server.listen(port, () => {
  console.log("JSON Server is running");
});
