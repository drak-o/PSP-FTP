const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const os = require("os");

const PORT = 3000;

// Function to get the first non-internal IPv4 address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const adressList = []
  for (const iface in interfaces) {
    for (const alias of interfaces[iface]) {
      if (alias.family === 'IPv4' && !alias.internal) {
        adressList.push(alias.address);
      }
    }
  }
  return(adressList);
}

const serverIP = getLocalIP();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.static("media"))

app.get("/", (req, res) => {
  const publicDir = path.join(__dirname, "media");
  fs.readdir(publicDir, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading directory");
    }
    res.render("index", { files });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log("\nPSP-FTP is running and accessible at the following addresses:\n");
  serverIP.forEach(ip => {
    console.log(`  - Network:   http://${ip}:${PORT}/`);
  });
  console.log(`  - Localhost: http://localhost:${PORT}/\n`);
});
