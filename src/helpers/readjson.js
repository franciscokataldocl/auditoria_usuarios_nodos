const fs = require('fs');

function readJson(nombreArchivo) {
    try {
        const data = fs.readFileSync(nombreArchivo, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (error) {
        console.error(`Error al leer el archivo JSON "${nombreArchivo}":`, error);
        throw error;
    }
}



module.exports = {readJson};
