const users = [];

//add User
const addUser = ({ id, username, room }) => {
	//clean the data
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	//validate
	if (!username || !room) {
		return {
			success: false,
			error: "Username and room are reqired",
		};
	}

	//Check for existing user
	const existingUser = users.find((user) => {
		return user.room === room && user.username === username;
	});

	if (existingUser) {
		return {
			success: false,
			error: "Username is in use",
		};
	}

	//Store user
	const user = { id, username, room };
	users.push(user);

	return { user };
};

//remove User
const removeUser = (id) => {
	const index = users.findIndex((user) => {
		return user.id === id;
	});

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

//get User
const getUser = (id) => {
	return users.find((user) => user.id === id);
};

//get Users
const getUsersInRoom = (room) => {
	return users.filter((user) => user.room === room);
};

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
};
