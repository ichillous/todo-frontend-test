// Base URL for the API
const API_BASE_URL = 'http://localhost:8080/api/todos';

let todoCount = 0;

console.log('Script loaded successfully!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
});


// Function to update the todo counter display
function updateTodoCounter() {
    document.getElementById('todo-counter').textContent = `${todoCount} todos remaining`;
}

// Function to fetch all todos from the API
async function fetchTodos() {
    try {
        const response = await fetch(API_BASE_URL);
        const todos = await response.json();
        todoCount = todos.length;
        updateTodoCounter();
        todos.forEach(todo => createCard(todo));
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Function to create a new todo
async function createTodo(title, subtitle, description) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, subtitle, description }),
        });
        const newTodo = await response.json();
        createCard(newTodo);
        todoCount++;
        updateTodoCounter();
    } catch (error) {
        console.error('Error creating todo:', error);
    }
}

// Function to update a todo
async function updateTodo(id, title, subtitle, description) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, subtitle, description }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

// Function to delete a todo
async function deleteTodo(id) {
    try {
        await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        todoCount--;
        updateTodoCounter();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Function to create a card element
function createCard(todo) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = todo.id;

    card.innerHTML = `
        <div class="card-title">${todo.title}</div>
        <div class="card-subtitle">${todo.subtitle}</div>
        <div class="card-description">${todo.description}</div>
        <button onclick="editCard(this.parentNode)">Edit</button>
        <button onclick="deleteCard(this.parentNode)">Delete</button>
    `;

    document.getElementById('content').appendChild(card);
}

// Function to edit a card
function editCard(card) {
    const titleElem = card.querySelector('.card-title');
    const subtitleElem = card.querySelector('.card-subtitle');
    const descriptionElem = card.querySelector('.card-description');
    const editButton = card.querySelector('button');

    titleElem.innerHTML = `<input type="text" value="${titleElem.textContent}">`;
    subtitleElem.innerHTML = `<input type="text" value="${subtitleElem.textContent}">`;
    descriptionElem.innerHTML = `<textarea>${descriptionElem.textContent}</textarea>`;

    editButton.textContent = 'Save';
    editButton.onclick = function() { saveCard(card); };
}

// Function to save a card
async function saveCard(card) {
    const id = card.dataset.id;
    const titleInput = card.querySelector('.card-title input');
    const subtitleInput = card.querySelector('.card-subtitle input');
    const descriptionTextarea = card.querySelector('.card-description textarea');
    const saveButton = card.querySelector('button');

    const updatedTodo = await updateTodo(id, titleInput.value, subtitleInput.value, descriptionTextarea.value);

    card.querySelector('.card-title').textContent = updatedTodo.title;
    card.querySelector('.card-subtitle').textContent = updatedTodo.subtitle;
    card.querySelector('.card-description').textContent = updatedTodo.description;

    saveButton.textContent = 'Edit';
    saveButton.onclick = function() { editCard(card); };
}

// Function to delete a card
async function deleteCard(card) {
    const id = card.dataset.id;
    await deleteTodo(id);
    card.remove();
}

// Event listener for form submission
document.getElementById('card-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = this.title.value;
    const subtitle = this.subtitle.value;
    const description = this.description.value;
    createTodo(title, subtitle, description);
    this.reset();
});

// Initialize the application
document.addEventListener('DOMContentLoaded', fetchTodos);