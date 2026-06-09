// Прогресс-бар
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
  text.textContent = percent + '% completed (' + done + '/' + total + ')';
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

let scrollPos = 0;
document.addEventListener('click', function() {
  scrollPos = window.scrollY;
  setTimeout(function() {
    window.scrollTo(0, scrollPos);
  }, 100);
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

// Drag and drop
function initDragAndDrop() {
  var list = document.querySelector('.todo-list');
  if (!list || list.dataset.dragReady === 'true') return;
  list.dataset.dragReady = 'true';

  var items = list.querySelectorAll('li');
  items.forEach(function(item) {
    item.setAttribute('draggable', 'true');
  });

  var dragEl = null;
  var lastTarget = null;

  list.addEventListener('dragstart', function(e) {
    dragEl = e.target.closest('li');
    if (!dragEl) return;
    dragEl.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
  });

  list.addEventListener('dragover', function(e) {
    e.preventDefault();
    var li = e.target.closest('li');
    if (!li || li === dragEl) return;

    if (lastTarget && lastTarget !== li) {
      lastTarget.style.borderTop = '';
      lastTarget.style.borderBottom = '';
    }
    lastTarget = li;

    document.querySelectorAll('.todo-list li').forEach(function(el) {
      if (el !== li) {
        el.style.borderTop = '';
        el.style.borderBottom = '';
      }
    });

    var rect = li.getBoundingClientRect();
    if (e.clientY < rect.top + rect.height / 2) {
      li.style.borderTop = '2px solid #4caf50';
      li.style.borderBottom = '';
    } else {
      li.style.borderBottom = '2px solid #4caf50';
      li.style.borderTop = '';
    }
  });

  list.addEventListener('drop', function(e) {
    e.preventDefault();
    var li = e.target.closest('li');
    clearAllStyles();
    if (!li || !dragEl || li === dragEl) return;

    var rect = li.getBoundingClientRect();
    if (e.clientY < rect.top + rect.height / 2) {
      list.insertBefore(dragEl, li);
    } else {
      list.insertBefore(dragEl, li.nextSibling);
    }
    dragEl.style.opacity = '1';
    dragEl = null;
    lastTarget = null;
    updateProgress();
    saveOrder();
  });

  list.addEventListener('dragend', function(e) {
    clearAllStyles();
    if (dragEl) {
      dragEl.style.opacity = '1';
      dragEl = null;
    }
    lastTarget = null;
  });

  function clearAllStyles() {
    document.querySelectorAll('.todo-list li').forEach(function(el) {
      el.style.borderTop = '';
      el.style.borderBottom = '';
    });
  }
}

function saveOrder() {
  var items = document.querySelectorAll('.todo-list li');
  var key = Object.keys(localStorage).find(function(k) {
    return k.startsWith('todos-elmish_');
  });

  if (key) {
    try {
      var data = JSON.parse(localStorage.getItem(key));
      if (data && data.todos) {
        var newTodos = [];
        items.forEach(function(item, index) {
          var title = item.querySelector('label') ? item.querySelector('label').textContent : '';
          var done = item.classList.contains('completed');
          var id = parseInt(item.getAttribute('data-id') || item.id) || index;
          newTodos.push({ id: id, title: title, done: done });
        });
        data.todos = newTodos;
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {}
  }
}

setTimeout(initDragAndDrop, 500);

var appEl = document.getElementById('app');
if (appEl) {
  var observer = new MutationObserver(function() {
    var list = document.querySelector('.todo-list');
    if (list) list.dataset.dragReady = 'false';
    setTimeout(initDragAndDrop, 100);
  });
  observer.observe(appEl, { childList: true, subtree: true });
}