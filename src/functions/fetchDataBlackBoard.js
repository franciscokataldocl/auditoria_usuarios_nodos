const FetchDataBlackBoard = async (method, body = null, url, retryAttempts = 3, retryDelay = 3000) => {
    const contentType = method === 'PUT' ? 'application/json' : 'application/x-www-form-urlencoded';
    const requestOptions = {
        method,
        headers: {
            'Content-Type': contentType,
            'Authorization': `Bearer ${global.blackboardToken}`,
        },
        body: body ? (contentType === 'application/json' ? JSON.stringify(body) : body) : null,
    };

    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            if ((response.status === 503 || response.status === 429) && retryAttempts > 0) {
                console.log(`Error ${response.status} al realizar la solicitud a ${url}. Reintentando...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return await FetchDataBlackBoard(method, body, url, retryAttempts - 1, retryDelay); 
            } else {
                throw new Error(`Error ${response.status} al realizar la solicitud a ${url}`);
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en FetchDataBlackBoard:', error);
        throw error;
    }
};


const getDataSources= async () => {
    try {
        const response = await FetchDataBlackBoard(
            "GET",
            null,
            `${process.env.BLACKBOARD_URL}v1/dataSources`
        );
        return response
    } catch (error) {
        console.log(error)
    }
}



const fetchUsersFromBlackBoard= async (studentId) => {
    try {
        const response = await FetchDataBlackBoard(
            "GET",
            null,
            `${process.env.BLACKBOARD_URL}v1/users?studentId=${studentId}`
        );
        return response
    } catch (error) {
        console.log(error)
    }
}

const fetchCoursesFromBlackBoard= async (externalId) => {
    try {
        const response = await FetchDataBlackBoard(
            "GET",
            null,
            `${process.env.BLACKBOARD_URL}v3/courses?externalId=${externalId}`
        );
        return response
    } catch (error) {
        console.log(error)
    }
}


const fetchUserCoursesFromBlackBoard= async (courseId) => {
    try {
        const response = await FetchDataBlackBoard(
            "GET",
            null,
            `${process.env.BLACKBOARD_URL}v1/courses/${courseId}/users`
        );
        return response
    } catch (error) {
        console.log(error)
    }
}


module.exports = {getDataSources, FetchDataBlackBoard, fetchUsersFromBlackBoard, fetchCoursesFromBlackBoard, fetchUserCoursesFromBlackBoard};