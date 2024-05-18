const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
// const {cors} = require('cors')
const app = express();
// cors(app);
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.get('/',(req,res)=>{
  res.json({hey:"shit"})
})
app.post('/api', (req, res) => {
  const userMessage = req.body.message;
 // console.log("dei")
  // Execute Python script as a subprocess
  const pythonProcess = spawn('python', ['../index.py', userMessage]);

  // Collect output from the Python script
  let botResponse = '';
  pythonProcess.stdout.on('data', (data) => {
    botResponse += data.toString();
  });
  console.log("---->"+ botResponse)
  // Send response when Python script finishes executing
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    res.json({ message: botResponse });
  });

  // Handle errors
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error from Python script: ${data}`);
    res.status(500).json({ error: 'Internal server error' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

