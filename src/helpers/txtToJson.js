
const txtToJSON =(txt) =>{
    const jsonContent = [];
    const cleanedContent = txt.replace(/^\uFEFF/, '');
    const lines = cleanedContent.trim().split('\n');
    const keys = lines.shift().split('|');

    lines.forEach(line => {
        const values = line.split('|');
        const obj = {};
        keys.forEach((key, index) => {
            obj[key] = values[index];
        });
        jsonContent.push(obj);
    });
return jsonContent;
}

module.exports = {txtToJSON};