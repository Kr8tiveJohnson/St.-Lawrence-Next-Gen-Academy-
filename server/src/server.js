require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.error(`❌ Failed to start server:`, err.message);
    process.exit(1);
  }
  console.log(`🚀 Server running on port ${PORT}`);
});
