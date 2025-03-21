const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const mongoURI = 'mongodb+srv://kumarpatelrakesh222:5rqdGjk2vBtKdVob@uploads.tc9np.mongodb.net/echosealDB?retryWrites=true&w=majority&appName=uploads';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ File Schema
const fileSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
  uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

// ✅ Fetch all uploaded files
app.get('/uploads', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 }); // ✅ Latest first
    res.json(files.map(file => ({
      filename: file.filename,
      uploadDate: file.uploadDate.toISOString() // ✅ Convert to readable format
    })));
  } catch (error) {
    console.error('❌ Error fetching uploads:', error);
    res.status(500).json({ error: 'Failed to fetch uploads.' });
  }
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
