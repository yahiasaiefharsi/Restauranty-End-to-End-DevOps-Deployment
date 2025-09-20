const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 6001
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const client = require('prom-client');
client.collectDefaultMetrics();

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
