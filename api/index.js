// import serverless from 'serverless-http';
import app from './app.js';

// export default serverless(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[dev] API listening on http://localhost:${PORT}/api`);
});

