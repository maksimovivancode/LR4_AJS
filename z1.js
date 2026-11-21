const https = require('https');
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Task 1
function getData(url, callback) {
    https.get(url, (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
            try {
                callback(null, JSON.parse(raw));
            } catch (err) {
                callback(err);
            }
        });
    }).on('error', (err) => callback(err));
}
function sortPostsByTitleLength (posts){
    return [...posts].sort((a, b) => b.title.length - a.title.length);
}
function sortByCommentsByName(comments) {
    return [...comments].sort((a, b) => a.name.localeCompare(b.name));
}
function getSortedPosts(callback) {
    getData(BASE_URL + '/posts', (err, posts) => {
        if (err) return callback(err);
        callback(null, sortPostsByTitleLength(posts));
        });
}
function getSortedComments(callback) {
    getData(BASE_URL + '/comments', (err, comments) => {
        if (err) return callback(err);
        callback(null, sortByCommentsByName(comments));
    });
}
// сортировки
getSortedPosts((err, posts) => {
    if (err) return console.error('Ошибка: ', err.message);
    console.log('Посты по убыванию длины title: ');
    console.log(posts)
})
getSortedComments((err, comments) => {
    if (err) return console.error(err);
    console.log('Комментарии по name: ');
    console.log(comments)
})
// Task 2
function getDataPromise(url) {
    return new Promise((resolve, reject) =>
    {
        https.get(url, (res) => {
            let raw = '';
            res.on('data', (chunk) => (raw += chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(raw));
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', (err) => reject(err));
    })
}
function pickUserFields(users) {
    return users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
    }));
}
function filterNotCompleted(todos){
    return todos.filter((todo) => todo.completed === false);
}
function getUncompletedTodos() {
    return getDataPromise(BASE_URL + '/todos').then(filterNotCompleted);
}
function getUsers() {
    return getDataPromise(BASE_URL + '/users').then(pickUserFields);
}
getUsers().then((users) => {
    console.log('Пользователи: ')
    console.log(users);
}).catch((err) => console.error('Ошибка: ', err.message));
getUncompletedTodos().then((todos) => {
    console.log('Невыполненные todos: ', todos);
}).catch((err) => console.error('Ошибка', err.message));
// Task 3
async function getUsersAsync() {
    const users = await getDataPromise(BASE_URL + '/users');
    return pickUserFields(users);
}
async function getSortedPostsAsync() {
    const posts = await getDataPromise(BASE_URL + '/posts');
    return sortPostsByTitleLength(posts);
}
async function getSortedCommentsAsync(){
    const posts = await getDataPromise(BASE_URL + '/comments');
    return sortByCommentsByName(posts);
}
async function getUncompletedTodosAsync() {
    const posts = await getDataPromise(BASE_URL + '/todos');
    return filterNotCompleted(posts);
}
async function main() {
    try {
        const posts = await getSortedPostsAsync();
        console.log('Посты по убыванию длины title: ');
        console.log(posts);

        const comments = await getSortedCommentsAsync();
        console.log('Комментарии по name: ');
        console.log(comments);

        const users = await getUsersAsync();
        console.log('Пользователи: ');
        console.log(users);

        const todos = await getUncompletedTodosAsync();
        console.log('Невыполненные todos: ', todos.slice(0, 3));
    } catch (err) {
        console.error('Ошибка: ', err.message);
    }
}

main();
