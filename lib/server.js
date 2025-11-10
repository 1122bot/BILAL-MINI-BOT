const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // serve main.html

const configPath = path.join(__dirname, '../config');

// Load config
let config = fs.existsSync(configPath) ? require(configPath) : {
    OWNER_NAME: "Owner",
    OWNER_NUMBER: "",
    PREFIX: ".",
    AUTO_TYPING: true,
    AUTO_RECORDING: false,
    AUTO_VIEW_STATUS: true,
    AUTO_REACT_STATUS: true,
    ALWAYS_ONLINE: true
};

// Save config helper
function saveConfig(data){
    const content = `module.exports = ${JSON.stringify(data, null, 4)};`;
    fs.writeFileSync(configPath, content, 'utf-8');
    console.log('⚙️ Config saved!');
}

// Serve main.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'main.html')));

// Receive settings from main.html
app.post('/update-config', (req, res) => {
    const newData = req.body;
    config = {...config, ...newData};
    saveConfig(config);

    // optional: restart bot automatically
    setTimeout(()=> process.exit(0), 2000);
    res.json({success:true, message:"Config updated!"});
});

app.listen(process.env.PORT || 3000, ()=>console.log("🌐 Web server running..."));
