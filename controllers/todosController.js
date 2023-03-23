const { readFile, writeFile } = require('fs').promises;

const FILE_NAME = `./src/data.json`;

exports.getAllTodos = async (req, res) => {
	const todos = JSON.parse(await readFile(FILE_NAME, 'utf8')) ?? [];
	// if (!todos) {
	// 	return res.status(200).json({
	// 		status: 'success',
	// 		results: todos.length,
	// 		data: {
	// 			todos: [],
	// 		},
	// 	});
	// }

	res.status(200).json({
		status: 'success',
		results: todos.length,
		data: {
			todos,
		},
	});
};

exports.getTodo = async (req, res) => {
	const todos = JSON.parse(await readFile(FILE_NAME, 'utf8'));
	const id = Number(req.params.id);
	const todo = todos.find(el => el.id === id);

	if (!todo) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}

	res.status(200).json({
		status: 'success',
		data: {
			todo,
		},
	});
};

exports.createTodo = async (req, res) => {
	let todos = JSON.parse(await readFile(FILE_NAME, 'utf8'));

	if (todos.length === 0) {
		const newId = 1;

		const newTodo = { id: newId, text: req.body.text, checked: false };

		todos.push(newTodo);

		await writeFile(FILE_NAME, JSON.stringify(todos), 'utf8');
		res.status(201).json({
			status: 'success',
			data: {
				todo: newTodo,
			},
		});
	} else {
		todos = todos.map((todo, index) => ({ id: index + 1, text: todo.text, checked: todo.checked }));
		const newId = todos[todos.length - 1].id + 1;
		const newTodo = Object.assign({ id: newId }, req.body);

		todos.push(newTodo);

		await writeFile(FILE_NAME, JSON.stringify(todos), 'utf8');
		res.status(201).json({
			status: 'success',
			data: {
				todo: newTodo,
			},
		});
	}
	// res.send();
};

exports.updateTodo = async (req, res) => {
	let todos = JSON.parse(await readFile(FILE_NAME, 'utf8'));
	const id = Number(req.params.id);
	const todoToUpdate = todos.find(el => el.id === id);

	if (!todoToUpdate) {
		return res.status(404).json({
			status: 'fail',
			message: 'invalid ID',
		});
	}
	const todoIndex = todos.indexOf(todoToUpdate);

	Object.assign(todoToUpdate, req.body);

	todos[todoIndex] = todoToUpdate;

	await writeFile(FILE_NAME, JSON.stringify(todos), 'utf8');
	res.status(200).json({
		status: 'success',
		data: {
			data: {
				todo: todoToUpdate,
			},
		},
	});
	// res.send();
};

exports.deleteTodo = async (req, res) => {
	let todos = JSON.parse(await readFile(FILE_NAME, 'utf8'));
	const id = Number(req.params.id);
	const todoToDelete = todos.find(el => el.id === id);

	if (!todoToDelete) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}

	const todoIndex = todos.indexOf(todoToDelete);

	todos.splice(todoIndex, 1);

	todos = todos.map((todo, index) => ({ id: index + 1, text: todo.text, checked: todo.checked }));

	await writeFile(FILE_NAME, JSON.stringify(todos), 'utf8');
	res.status(204).json({
		status: 'success',
		data: {
			data: {
				todo: null,
			},
		},
	});
	// res.send();
};
