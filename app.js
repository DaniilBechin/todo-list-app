function updateProgress() {
  const todoList = document.querySelector('.todo-list');
  if (!todoList) return;

  const todos = todoList.querySelectorAll('li');
  const completed = todoList.querySelectorAll('li.completed');
  
  const total = todos.length;
  const done = completed.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  
  const bar = document.getElementById('progress-bar');
  const text = document.getElementById('progress-text');
  
  if (!bar || !text) return;

  let styleTag = document.getElementById('progress-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'progress-style';
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = '.progress-bar::after { width: ' + percent + '%; }';
  text.textContent = percent + '% выполнено (' + done + '/' + total + ')';
}

document.addEventListener('click', function(e) {
  if (
    e.target.classList.contains('toggle') ||
    e.target.classList.contains('destroy') ||
    e.target.classList.contains('clear-completed') ||
    e.target.closest('.clear-completed')
  ) {
    setTimeout(updateProgress, 50);
  }
});

document.addEventListener('keyup', function(e) {
  if (e.keyCode === 13) {
    setTimeout(updateProgress, 50);
  }
});

setTimeout(updateProgress, 300);

// Тёмная тема
const themeToggle = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark');
  
  if (document.body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '🌙';
  }
});