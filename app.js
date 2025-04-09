document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');
    const offlineStatus = document.getElementById('offline-status');

    // Проверка онлайн-статуса
    function updateOnlineStatus() {
        if (navigator.onLine) {
            offlineStatus.classList.remove('visible');
        } else {
            offlineStatus.classList.add('visible');
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Загрузка заметок
    function loadNotes() {
        notesList.innerHTML = '';
        const notes = getNotes();
        
        if (notes.length === 0) {
            notesList.innerHTML = '<p class="empty-notes">Нет сохраненных заметок</p>';
            return;
        }
        
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <div class="note-content">${note.text}</div>
                <div class="note-actions">
                    <button class="delete-btn" data-id="${index}">Удалить</button>
                </div>
            `;
            notesList.appendChild(noteElement);
        });

        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                deleteNote(id);
                loadNotes();
            });
        });
    }

    // Получение заметок из localStorage
    function getNotes() {
        const notes = localStorage.getItem('notes');
        return notes ? JSON.parse(notes) : [];
    }

    // Сохранение заметки
    function saveNote(text) {
        const notes = getNotes();
        notes.push({ text, createdAt: new Date().toISOString() });
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Удаление заметки
    function deleteNote(id) {
        const notes = getNotes();
        notes.splice(id, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Обработчик добавления заметки
    addNoteBtn.addEventListener('click', () => {
        const text = noteInput.value.trim();
        if (text) {
            saveNote(text);
            noteInput.value = '';
            loadNotes();
        }
    });

    // Инициализация приложения
    loadNotes();

    // Регистрация Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});