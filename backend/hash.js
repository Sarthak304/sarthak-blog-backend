const bcrypt = require("bcrypt");
async function generateHash() {
    const tec = "Singh@l123";
    const hash = await bcrypt.hash(tec,10); 
    console.log("genearte has",hash);
    
}

generateHash();