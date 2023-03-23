const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
// let todosListEl = document.getElementById('todos-list');
let todosListEl = document.querySelector('#todos-list');
let showTodos;
let showSingleTodo;
let checkedBtn;

let EditTodoId = -1;

const getAllTodos = async () => {
	const res = await fetch('/api/todos', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await res.json();
	todos = data;
};

const getTodo = async id => {
	const res = await fetch(`/api/todos/${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await res.json();
	todo = data;
};

const postTodo = async newTodo => {
	const res = await fetch('/api/todos', {
		method: 'POST',
		body: JSON.stringify(newTodo),
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

const deleteTodo = async id => {
	const res = await fetch(`/api/todos/${id}`, {
		method: 'DELETE',
	});
};

const editTodo = async (id, todo) => {
	const res = await fetch(`/api/todos/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(todo),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await res.json();
	todo = data;
};

const renderTodos = async () => {
	todosListEl.textContent = '';

	await getAllTodos();

	todos.data.todos.forEach((todo, id) => {
		showTodos = document.createElement('div');
		showTodos.className = 'todo';
		showTodos.setAttribute('id', todo.id);

		checkedBtn = document.createElement('button');
		checkedBtn.innerHTML = `<i class="bi ${
			todo.checked ? 'bi-check-circle-fill' : 'bi-circle'
		}" data-action="check"></i>`;

		showSingleTodo = document.createElement('p');
		showSingleTodo.setAttribute('data-action', 'check');
		showSingleTodo.classList.add(todo.checked);
		// console.log(showSingleTodo.classList.value);
		// console.log(showSingleTodo.className);

		showSingleTodo.classList.value === 'true'
			? showSingleTodo.classList.add('checked')
			: showSingleTodo.classList.remove('checked');

		// showSingleTodo.classList.toggle(`${todo.checked ? 'checked' : ''}`);
		// console.log(showSingleTodo);

		showSingleTodo.textContent = todo.text;

		editBtn = document.createElement('button');
		editBtn.innerHTML = `<i class="bi bi-pencil-square" data-action="edit"></i>`;

		deleteBtn = document.createElement('button');
		deleteBtn.innerHTML = `<i class="bi bi-trash" data-action="delete"></i>`;
		showTodos.append(checkedBtn, showSingleTodo, editBtn, deleteBtn);

		// console.log(showTodos);
		// showTaskPanel();
		todosListEl.append(showTodos);

		// id = todo.id;
		// console.log(showTodos);
		// console.log(todo.text, id);
	});

	// const showTaskPanel = async () => {
	// 	showTask.textContent = todo.text;
	// 	showTodos.append(showTask);
	// };

	// todos.data.todos.forEach((todo, id) => {
	// 	todosListEl.innerHTML += `<div class="todo" id="${todo.id}">
	// 										<i class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}" data-action="check"></i>
	// 										<p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.text}</p>
	// 										<i class="bi bi-pencil-square" data-action="edit"></i>
	// 										<i class="bi bi-trash" data-action="delete"></i>
	// 									</div>`;
	// });

	if (todos.data.todos.length === 0) {
		todosListEl.textContent = 'Na razie nie masz żadnych zadań...';
		return;
	}
};
renderTodos();

form.addEventListener('submit', async e => {
	e.preventDefault();

	const todoValue = todoInput.value.trim();

	const isEmpty = todoValue === '';

	const isDuplicate = todos.data.todos.some(todo => todo.text.toUpperCase() === todoValue.toUpperCase());

	if (isEmpty) {
		return;
	} else if (isDuplicate) {
		// alert('Todo is duplicate');
		todoInput.value = '';
		return;
	} else {
		if (EditTodoId > 0) {
			await editTodo(EditTodoId, { text: todoValue });
			EditTodoId = -1;
			todoInput.value = '';
			renderTodos();
		} else {
			await postTodo({
				text: todoValue,
				checked: false,
			});
			todoInput.value = '';
			renderTodos();
		}
	}
});

todosListEl.addEventListener('click', async e => {
	const target = e.target;
	const parentElement = target.parentNode;

	if (parentElement.parentElement.className !== 'todo') return;

	const todo = parentElement.parentElement;
	const todoId = Number(todo.id);
	const action = target.dataset.action;
	// const taskAction = target.action;
	// console.log(action, target);

	let todoToUpdate = () => {
		if (action === 'edit') {
			let todoToEdit = todos.data.todos[todoId - 1];
			todoInput.value = todoToEdit.text;
			EditTodoId = todoToEdit.id;
		}
	};
	todoToUpdate();

	let todoToCheck = async () => {
		if (action === 'check') {
			let todoToCheck = todos.data.todos[todoId - 1];
			EditTodoId = todoToCheck.id;

			todoToCheck.checked !== false
				? await editTodo(EditTodoId, { checked: false })
				: await editTodo(EditTodoId, { checked: true });

			EditTodoId = -1;
		}
	};
	await todoToCheck();

	action === 'delete' && (await deleteTodo(todoId));

	renderTodos();
});

//poprzedni front z repla:

// const form = document.getElementById('todoform');
// const todoInput = document.getElementById('newtodo');
// const todosListEl = document.getElementById('todos-list');

// let EditTodoId = -1;

// const getAllTodos = async () => {
//   const res = await fetch('/api/todos', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await res.json();
//   todos = data;
// };

// const getTodo = async id => {
//   const res = await fetch(`/api/todos/${id}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await res.json();
//   todo = data;
// };

// const postTodo = async newTodo => {
//   const res = await fetch('/api/todos', {
//     method: 'POST',
//     body: JSON.stringify(newTodo),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// };

// const deleteTodo = async id => {
//   const res = await fetch(`/api/todos/${id}`, {
//     method: 'DELETE',
//   });
// };

// const editTodo = async (id, todo) => {
//   const res = await fetch(`/api/todos/${id}`, {
//     method: 'PATCH',
//     body: JSON.stringify(todo),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await res.json();
//   todo = data;
// };

// const renderTodos = async () => {
//   todosListEl.textContent = '';

//   await getAllTodos();

//   todos.data.todos.forEach((todo, id) => {
//     todosListEl.innerHTML += `<div class="todo" id="${todo.id}">
//   										<i class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}" data-action="check"></i>
//   										<p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.text}</p>
//   										<i class="bi bi-pencil-square" data-action="edit"></i>
//   										<i class="bi bi-trash" data-action="delete"></i>
//   									</div>`;
//   });

//   if (todos.data.todos.length === 0) {
//     todosListEl.textContent = 'Na razie nie masz żadnych zadań...';
//   }
// };
// renderTodos();

// form.addEventListener('submit', async e => {
//   e.preventDefault();

//   const todoValue = todoInput.value.trim();

//   const isEmpty = todoValue === '';

//   const isDuplicate = todos.data.todos.some(todo => todo.text.toUpperCase() === todoValue.toUpperCase());

//   if (isEmpty) {
//     return;
//   } else if (isDuplicate) {
//     // alert('Todo is duplicate');
//     todoInput.value = '';
//     return;
//   } else {
//     if (EditTodoId > 0) {
//       await editTodo(EditTodoId, { text: todoValue });
//       EditTodoId = -1;
//       todoInput.value = '';
//       renderTodos();
//     } else {
//       await postTodo({
//         text: todoValue,
//         checked: false,
//       });
//       todoInput.value = '';
//       renderTodos();
//     }
//   }
// });

// todosListEl.addEventListener('click', async e => {
//   const target = e.target;
//   const parentElement = target.parentNode;

//   if (parentElement.className !== 'todo') return;

//   const todo = parentElement;
//   const todoId = Number(todo.id);
//   const action = target.dataset.action;

//   let todoToUpdate = () => {
//     if (action === 'edit') {
//       let todoToEdit = todos.data.todos[todoId - 1];
//       todoInput.value = todoToEdit.text;
//       EditTodoId = todoToEdit.id;
//     }
//   };
//   todoToUpdate();

//   let todoToCheck = async () => {
//     if (action === 'check') {
//       let todoToCheck = todos.data.todos[todoId - 1];
//       EditTodoId = todoToCheck.id;

//       todoToCheck.checked !== false
//         ? await editTodo(EditTodoId, { checked: false })
//         : await editTodo(EditTodoId, { checked: true });

//       EditTodoId = -1;
//     }
//   };
//   await todoToCheck();

//   action === 'delete' && (await deleteTodo(todoId));

//   renderTodos();
// });
