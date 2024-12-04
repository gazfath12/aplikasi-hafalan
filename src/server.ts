import express from 'express';
import dotenv from 'dotenv';
import hafalanRoutes from './routes/menghafal-alquran';

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', hafalanRoutes);


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
