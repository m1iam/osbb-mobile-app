const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ujobky', 
  database: 'digital_osbb' 
});

db.connect(err => {
  if (err) {
    console.error('--- ПОМИЛКА ПІДКЛЮЧЕННЯ ДО БД ---');
    console.error('Код помилки:', err.code); // Наприклад: ECONNREFUSED
    console.error('Повідомлення:', err.sqlMessage); // Тут буде текст причини
  } else {
    console.log('Сервер підключено до MySQL');
  }
});

app.post('/login', (req, res) => {
  const { email, phone, password } = req.body;

  // Логування для перевірки, що приходить від додатка
  console.log(`Спроба входу: Email: ${email}, Phone: ${phone}`);

  const query = 'SELECT * FROM residents WHERE email = ? AND phone = ? AND password = ?';

  db.execute(query, [email, phone, password], (err, results) => {
    if (err) {
        console.error('Деталі помилки MySQL:', err); // Це виведе реальну причину в термінал
        return res.status(500).json({ success: false, message: 'Помилка бази даних' });
    }

    if (results.length > 0) {
      console.log('Вхід успішний');
      return res.json({ success: true }); // Додали return тут
    } else {
      console.log('Невірні дані');
      return res.status(401).json({ success: false, message: 'Невірна пошта, телефон або пароль' }); // І тут
    }
  });
});

app.listen(3306, '0.0.0.0', () => {
  console.log('Сервер працює на порту 3000');
});