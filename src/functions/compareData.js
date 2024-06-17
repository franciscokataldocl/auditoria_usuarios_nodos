const { getBlackBoardToken } = require("../helpers/getBlackBoardToken");
const {fetchUsersFromBlackBoard, fetchCoursesFromBlackBoard, fetchUserCoursesFromBlackBoard } = require("./fetchDataBlackBoard");

let userNoExistOnBlackBoard =[];
let userExistOnBlackBoard = [];
let courseNoExistOnBlackBoard=[];
let courseExistOnBlackBoard= [];


const compareUsers = async (users, dataSources) => {
  console.log('cantidad de usuarios totales', users.length)
  const batchSize = 200;

  for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await getBlackBoardToken();

      for (const user of batch) {
          try {
              const response = await fetchUsersFromBlackBoard(user.EXTERNAL_PERSON_KEY);
              const newUser = {
                  rut: user.EXTERNAL_PERSON_KEY.replace('USS', ''),
                  email: response.results.length === 0 ? user.EMAIL : response.results[0].userName,
                  id_blackboard: response.results.length === 0 ? null : response.results[0].id,
                  data_source: response.results.length === 0 ? null : dataSources.results.find(dataSource => dataSource.id === response.results[0].dataSourceId).externalId,
                  availability: response.results.length === 0 ? null : response.results[0].availability.available
              };
              
              (response.results.length === 0 ? userNoExistOnBlackBoard : userExistOnBlackBoard).push(newUser);
          } catch (error) {
              console.log('error', error);
          }
      }
      console.log('usuarios restantes por procesar', users.length - (i + batchSize));
  }

  // await Promise.all([
  //     saveFile('usersNotExistOnBlackBoard.json', userNoExistOnBlackBoard),
  //      saveFile('userExistOnBlackBoard.json', userExistOnBlackBoard)
  // ]);
  console.log('Usuarios almacenados');
  return [userExistOnBlackBoard, userNoExistOnBlackBoard];
};


const compareCourses = async (courses, dataSources) => {
  console.log('cantidad de courses totales', courses.length);
  const batchSize = 200;

  for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);
      
      for (const course of batch) {
          try {
              const response = await fetchCoursesFromBlackBoard(course.EXTERNAL_COURSE_KEY);
              const courseData = response.results.length === 0 ? {
                  externalCourseKey: course.EXTERNAL_COURSE_KEY,
                  name: course.COURSE_NAME,
                  courseId: course.COURSE_ID
              } : {
                  externalId: response.results[0].externalId,
                  courseId: response.results[0].courseId,
                  name: response.results[0].name,
                  blackboardId: response.results[0].id,
                  available: response.results[0].availability.available,
                  dataSource: dataSources.results.find(dataSource => dataSource.id === response.results[0].dataSourceId).externalId
              };
              
              (response.results.length === 0 ? courseNoExistOnBlackBoard : courseExistOnBlackBoard).push(courseData);
          } catch (error) {
              console.log('error', error);
          }
      }
      console.log('cursos restantes por procesar', courses.length - (i + batchSize));
  }

  // await Promise.all([
  //     saveFile('coursesNotExistOnBlackBoard.json', courseNoExistOnBlackBoard),
  //     saveFile('courseExistOnBlackBoard.json', courseExistOnBlackBoard)
  // ]);

  console.log('Cursos almacenados');
  return [courseExistOnBlackBoard, courseNoExistOnBlackBoard];
};

const compareUserCourses = async (readyUsers, readyCourses, userCourses) => {
  const userCoursesGrouped = await groupCourses(userCourses);
  
  const userCoursesWithId = userCoursesGrouped.map(item => {
    const foundCourse = readyCourses.find(course => course.externalId === item.EXTERNAL_COURSE_KEY);
    return foundCourse ? { EXTERNAL_COURSE_KEY: foundCourse.blackboardId, USERS: item.USERS } : null;
  }).filter(course => course !== null);

  const usersWithId = userCoursesWithId.map(course => {
    const courseWithId = {
      EXTERNAL_COURSE_KEY: course.EXTERNAL_COURSE_KEY,
      USERS: course.USERS.map(user => {
        const userRut = user.replace('USS', '');
        const matchingUser = readyUsers.find(readyUser => readyUser.rut === userRut);
        return matchingUser ? matchingUser.id_blackboard : user;
      })
    };
    return courseWithId;
  });

  const usersProcessed = await searchUserCoursesonBlackBoard(usersWithId);
  
  const groupedUsers = usersProcessed.reduce((acc, current) => {
    const existingCourse = acc.find(course => course.EXTERNAL_COURSE_KEY === current.EXTERNAL_COURSE_KEY);
    if (existingCourse) {
      existingCourse.USERS.push(current.USER_ID);
    } else {
      acc.push({ EXTERNAL_COURSE_KEY: current.EXTERNAL_COURSE_KEY, USERS: [current.USER_ID] });
    }
    return acc;
  }, []);
  
  // saveFile('usersCoursesNotExistOnBlackboard.json', groupedUsers);
  const  userCoursesNotExistOnBlacBoard= groupedUsers;
  return [userCoursesNotExistOnBlacBoard];
};


const groupCourses = (userCourses) =>{
    return userCourses.reduce((acc, curr) => {
        const existingCourse = acc.find(course => course.EXTERNAL_COURSE_KEY === curr.EXTERNAL_COURSE_KEY);
        if (existingCourse) {
          existingCourse.USERS.push(curr.EXTERNAL_PERSON_KEY);
        } else {
          acc.push({
            EXTERNAL_COURSE_KEY: curr.EXTERNAL_COURSE_KEY,
            USERS: [curr.EXTERNAL_PERSON_KEY]
          });
        }
        return acc;
      }, []);
    
}

const searchUserCoursesonBlackBoard = async (userCourses) =>{

  const userNotFound = [];

  for (const course of userCourses) {
      const { EXTERNAL_COURSE_KEY, USERS } = course;
      const response = await fetchUserCoursesFromBlackBoard(EXTERNAL_COURSE_KEY);
  
      for (const userId of USERS) {
          const foundUser = response.results.find(user => user.userId === userId);
          if (!foundUser) {
              userNotFound.push({
                  EXTERNAL_COURSE_KEY,
                  USER_ID: userId
              });
          }
      }
  }
return userNotFound;
}



module.exports = {compareUsers, compareCourses, compareUserCourses};