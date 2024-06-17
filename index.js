// Imports
require('dotenv').config();
const { compareUsers, compareCourses, compareUserCourses } = require('./src/functions/compareData');
const { saveToXls } = require('./src/functions/convertToXls');
const { getDataSources } = require('./src/functions/fetchDataBlackBoard');
const { readOneFromS3, fileName, readManyFromS3 } = require('./src/helpers/awsS3');
const { getBlackBoardToken } = require('./src/helpers/getBlackBoardToken');




(async ( ) => {
  console.time('ejecución finalizada');
  
  console.log('...iniciando servidor');

 console.time('...obteniendo token blackboard');
 await getBlackBoardToken();
 console.timeEnd('...obteniendo token blackboard');



 console.time('...obteniendo dataSources desde blackboard');
 const dataSources = await getDataSources();
 console.timeEnd('...obteniendo dataSources desde blackboard');

 console.time('...obteniendo usuarios desde lms-s3');
 //________read users from s3
const users = await readOneFromS3(fileName.USERS);
console.timeEnd('...obteniendo usuarios desde lms-s3');


console.time('...comparando usuarios lms-s3 con blackboard');
//  //________compare s3 users with blackboard users
const [userExistOnBlackBoard, userNoExistOnBlackBoard] = await compareUsers(users, dataSources);
// const readyUsers = await readJson('userExistOnBlackBoard.json');
console.timeEnd('...comparando usuarios lms-s3 con blackboard');




console.time('...obteniendo cursos desde lms-s3');
//  //________read courses from s3
const courses = await readManyFromS3(fileName.CURSOS); 
console.timeEnd('...obteniendo cursos desde lms-s3');

console.time('...comparando cursos lms-s3 con blackboard');
// //________compare courses with blackboard courses
await getBlackBoardToken();
 const [courseExistOnBlackBoard, courseNoExistOnBlackBoard] = await compareCourses(courses, dataSources);
// const readyCourses = await readJson('courseExistOnBlackBoard.json');
 console.timeEnd('...comparando cursos lms-s3 con blackboard');





console.time('...obteniendo usuarios por curso desde lms-s3');
 const userCourses = await readManyFromS3(fileName.USUARIOS_POR_CURSO);
 console.timeEnd('...obteniendo usuarios por curso desde lms-s3');

 console.time('...comparando usuarios por curso lms-s3 con blackboard');
 await getBlackBoardToken();
const [userCoursesNotExistOnBlacBoard] = await compareUserCourses(userExistOnBlackBoard, courseExistOnBlackBoard, userCourses);
console.timeEnd('...comparando usuarios por curso lms-s3 con blackboard');


await saveToXls(
  userExistOnBlackBoard, 
  userNoExistOnBlackBoard,
  courseExistOnBlackBoard, 
  courseNoExistOnBlackBoard,
  userCoursesNotExistOnBlacBoard
)
  .then(() => console.log('Archivo Excel guardado con éxito.'))
  .catch(err => console.error('Error al guardar el archivo Excel:', err));




console.timeEnd('ejecución finalizada');
     

  }) ( );
