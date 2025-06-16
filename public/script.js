const form = document.getElementById('todo-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const loadTasks = async () => {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  taskList.innerHTML = '';
  tasks.forEach(addTaskToList);
};

const addTaskToList = (task) => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = task.content;
  li.appendChild(span);

  // 🔴 Edit Button
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => {
    const inputEdit = document.createElement('input');
    inputEdit.value = task.content;
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';

    // Save updated task to backend
    saveBtn.onclick = async () => {
      const updatedContent = inputEdit.value.trim();
      if (updatedContent) {
        await fetch(`/api/tasks/${task._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: updatedContent }),
        });
        loadTasks();
      }
    };

    // Replace current view with input field and save button
    li.innerHTML = '';
    li.appendChild(inputEdit);
    li.appendChild(saveBtn);
  };

  // ❌ Delete Button
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.onclick = async () => {
    await fetch(`/api/tasks/${task._id}`, { method: 'DELETE' });
    loadTasks();
  };

  li.appendChild(editBtn);
  li.appendChild(delBtn);
  taskList.appendChild(li);
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const taskContent = input.value.trim();
  if (taskContent) {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: taskContent }),
    });
    input.value = '';
    loadTasks();
  }
});

loadTasks();
