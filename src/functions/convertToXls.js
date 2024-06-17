const ExcelJS = require('exceljs');
const { saveExcelOnS3 } = require('../helpers/awsS3');
const { sendFileEmail } = require('../helpers/sendEmailData');


const saveToXls = async (
    userExistOnBlackBoard, 
    userNoExistOnBlackBoard, 
    courseExistOnBlackBoard, 
    courseNoExistOnBlackBoard,
    userCoursesNotExistOnBlacBoard) => {
   

    const workbook = new ExcelJS.Workbook();
    const worksheetUsersExistOnBlackboard = workbook.addWorksheet('users_exist_on_bb');
    const worksheetUsersNotExistOnBlackboard = workbook.addWorksheet('users_not_exist_on_bb');
    const worksheetCourseExistOnBlackBoard = workbook.addWorksheet('courses_exist_on_bb');
    const worksheetCourseNotExistOnBlackBoard = workbook.addWorksheet('courses_not_exist_on_bb');
    const worksheetUserCoursesNotExistOnBlacBoard = workbook.addWorksheet('user_courses_not_exist_on_bb');


    // userExistOnBlackBoard
    if (userExistOnBlackBoard.length > 0) {
        const headers = Object.keys(userExistOnBlackBoard[0]);
        worksheetUsersExistOnBlackboard.addRow(headers);

        userExistOnBlackBoard.forEach(user => {
            const rowValues = Object.values(user);
            worksheetUsersExistOnBlackboard.addRow(rowValues);
        });
    }
// UsersNotExistOnBlackboard
    if (userNoExistOnBlackBoard.length > 0) {
        const headers = Object.keys(userExistOnBlackBoard[0]);
        worksheetUsersNotExistOnBlackboard.addRow(headers);

        userExistOnBlackBoard.forEach(user => {
            const rowValues = Object.values(user);
            worksheetUsersNotExistOnBlackboard.addRow(rowValues);
        });
    }

    //courseExistOnBlackBoard
    if (courseExistOnBlackBoard.length > 0) {
        const headers = Object.keys(courseExistOnBlackBoard[0]);
        worksheetCourseExistOnBlackBoard.addRow(headers);

        courseExistOnBlackBoard.forEach(user => {
            const rowValues = Object.values(user);
            worksheetCourseExistOnBlackBoard.addRow(rowValues);
        });
    }

    //courseNotExistOnBlackBoard
    if (courseNoExistOnBlackBoard.length > 0) {
        const headers = Object.keys(courseNoExistOnBlackBoard[0]);
        worksheetCourseNotExistOnBlackBoard.addRow(headers);

        courseNoExistOnBlackBoard.forEach(user => {
            const rowValues = Object.values(user);
            worksheetCourseNotExistOnBlackBoard.addRow(rowValues);
        });
    }

    //userCoursesNotExistOnBlacBoard
    if (userCoursesNotExistOnBlacBoard.length > 0) {
        const headers = Object.keys(userCoursesNotExistOnBlacBoard[0]);
        worksheetUserCoursesNotExistOnBlacBoard.addRow(headers);

        userCoursesNotExistOnBlacBoard.forEach(user => {
            const rowValues = Object.values(user);
            worksheetUserCoursesNotExistOnBlacBoard.addRow(rowValues);
        });
    }

    try {
        const data = await workbook.xlsx.writeBuffer();
        await saveExcelOnS3(data);
        await sendFileEmail(data);
        console.log("Excel file saved successfully.");
    } catch (error) {
        console.error("Error saving Excel file:", error);
    }
}

module.exports = { saveToXls };
