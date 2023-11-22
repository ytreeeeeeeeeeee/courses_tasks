## Запуск проекта
Перед запуском проекта необходимо создать файл `.env`, перенести туда значения из `.env-example` и заполнить переменные окружения значениями.
### Запуск через docker compose
Для запуска проекта с помощью docker compose необходимо запустить терминал из папки проекта. Далее в терминале следует выполнить команду `docker compose up`, после чего проект запуститься и будет доступен для использования.
### Запуск на компьютере
Проект можно запустить на компьютере, если на нем установлен MongoDB и nodejs. Для запуска проекта необходимо запустить терминал из папки проекта. Далее выполнить команды `npm install` и `npm start`, после чего проект запуститься.
## Функциональные модули
### Регистрация
`POST /api/signup` - зарегистрироваться'.
Формат входных данных:
```
{
  "email": string,
  "password": string,
  "name": string,
  "contactPhone": string
}
```
Ответ в формате JSON:
```
{
    "data": {
        "_id": string
        "email": string,
        "name": string,
        "contactPhone": string,
    },
    "status": "ok"
}
```
### Аутентификация
`POST /api/signin` - залогиниться.
Формат входных данных:
```
{
  "email": string,
  "password": string
}
```
Ответ в формате JSON:
```
{
    "data": {
        "_id": string
        "email": string,
        "name": string,
        "contactPhone": string,
    },
    "status": "ok"
}
```
### Просмотр объявлений
`GET /api/advertisements` - получить список объявлений.
Ответ в формате JSON:
```
{
    "data": [
        {
            "_id": string,
            "shortTitle": string,
            "description": string,
            "images": [string],
            "createdAt": date,
            "user": {
                "_id": string,
                "name": string
            }
        }
    ],
    "status": "ok"
}
```
`GET /api/advertisements/:id` - получить данные объявления.
Ответ в формате JSON:
```
{
    "data": [
        {
            "_id": string,
            "shortTitle": string,
            "description": string,
            "images": string[],
            "createdAt": date,
            "user": {
                "_id": string,
                "name": string
            }
        }
    ],
    "status": "ok"
}
```
### Управление объявлениями
`POST /api/advertisements` - создать объявление.
Формат данных при отправке - `FormData`.
| Поле  | Тип |
| ------------- | ------------- |
| shortTitle  | string |
| description | string |
| images | files[] |
Ответ в формате JSON:
```
{
    "data": {
        "_id": string,
        "shortTitle": string,
        "description": string,
        "images": string[],
        "createdAt": date,
        "user": {
            "_id": string,
            "name": "string
        }
    },
    "status": "ok"
}
```
`DELETE /api/advertisements/:id` - удалить объявление. Возможно удалить только свое объявление
Ответ в формате JSON:
{
    "status": "ok"
}
### Общение
Реализована серверная часть с использованием библиотеки Socket.io.
Сообщения, приходящие в `socket`:
`getHistory` — получить историю сообщений из чата;
`sendMessage` — отправить сообщение пользователю.
События, отправляемые через `socket`:
`newMessage` — отправлено новое сообщение;
`chatHistory` — ответ на событие `getHistory`.
#### Событие `getHistory`
Событие `getHistory` принимает в данных ID собеседника.
#### Событие `sendMessage`
Событие `sendMessage` принимает следующие данные:
| Поле  | Тип |
| ------------- | ------------- |
| receiver  | string |
| text | string |
#### Событие `newMessage`
Событие `newMessage` вызывается каждый раз, когда в чат отправляется сообщение.

## P.S.
Реализован маршрут `GET /chat` с примером реализации чата. Для этого необходимо иметь как минимум 2 разных пользователей и создать чат в БД. Чтобы получить доступ к чату необходимо авторизоваться по маршруту `GET /signin`, а затем перейти по маршруту `GET /chat`.