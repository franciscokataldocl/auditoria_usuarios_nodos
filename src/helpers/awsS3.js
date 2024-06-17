const AWS = require('aws-sdk');
const { txtToJSON } = require('./txtToJson');

const fileName = {
    USERS: 'usuarios.txt',
    CURSOS: '_cursos.txt',
    USUARIOS_POR_CURSO: '_usuariosxcurso.txt',

}



AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();


const saveExcelOnS3 = async(workbook) =>{
    
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${process.env.AWS_FOLDER_NAME}/data.xlsx`,
        Body: workbook,
        ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error al subir el archivo a S3:", err);
        } else {
          console.log("Archivo subido exitosamente a S3:", data.Location);
        }
      });
}




const readOneFromS3 = async (fileName) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName
      };

      try {
        const data = await s3.getObject(params).promise();
        response = txtToJSON(data.Body.toString())
        return response;
      } catch (error) {
        console.error(`Error al leer el archivo ${fileName} desde S3:`, error);
        throw error;
      }


}




const readManyFromS3 = async (filesEndWith) => {
    console.log(`...Buscando ${filesEndWith}`)
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delimiter: '/'
    };

    try {
        const data = await s3.listObjectsV2(params).promise();


        const filesToRead = data.Contents.filter(file => file.Key.endsWith(filesEndWith));
        console.log(`...Archivos de ${filesEndWith} encontrados: ${filesToRead.length}`);

        const allResults = [];
        for (const file of filesToRead) {
            const fileParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file.Key
            };
            try {
                const fileData = await s3.getObject(fileParams).promise();
                const response = txtToJSON(fileData.Body.toString());
                response.forEach(item => {
                    allResults.push(item);
                })
                
            } catch (error) {
                console.error(`Error al leer el archivo ${file.Key} desde S3:`, error);
                throw error;
            }
        }
        return allResults;
    } catch (error) {
        console.error('Error al listar objetos en S3:', error);
        throw error;
    }
};


module.exports = { fileName, readOneFromS3, readManyFromS3, saveExcelOnS3};