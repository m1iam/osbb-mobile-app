const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Налаштування підключення до БД
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ujobky', 
  database: 'digital_osbb' 
});

db.connect(err => {
  if (err) {
    console.error('--- ПОМИЛКА ПІДКЛЮЧЕННЯ ДО БД ---');
    console.error('Повідомлення:', err.sqlMessage);
  } else {
    console.log('Сервер успішно підключено до MySQL (база: digital_osbb)');
  }
});

// --- 1. ЕТАП: ЛОГІН (ПЕРЕВІРКА ТЕЛЕФОНУ ТА ПАРОЛЯ) ---
app.post('/login', (req, res) => {
  const { phone, password } = req.body;

  console.log(`Спроба входу для телефону: ${phone}`);

  // Шукаємо мешканця за номером телефону та паролем
  const query = 'SELECT * FROM residents WHERE phone = ? AND password = ?';

  db.execute(query, [phone, password], (err, results) => {
    if (err) {
      console.error('Помилка бази даних:', err);
      return res.status(500).json({ success: false, message: 'Помилка сервера' });
    }

    if (results.length > 0) {
      // Якщо пароль вірний — генеруємо 6-значний OTP код
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // Ставимо час дії коду (зараз + 5 хвилин)
      const expiry = new Date(Date.now() + 5 * 60000); 

      // Оновлюємо дані мешканця в базі: записуємо код та час дії
      const updateQuery = 'UPDATE residents SET otp_code = ?, otp_expiry = ? WHERE phone = ?';
      
      db.execute(updateQuery, [otp, expiry, phone], (updErr) => {
        if (updErr) {
          console.error('Помилка при збереженні OTP:', updErr);
          return res.status(500).json({ success: false });
        }

        // В РЕАЛЬНОМУ ПРОЄКТІ ТУТ МАЄ БУТИ ВІДПРАВКА СМС
        console.log(`-----------------------------------------`);
        console.log(`[СМС-ЦЕНТР] Код для входу ${phone}: ${otp}`);
        console.log(`-----------------------------------------`);
        
        // Кажемо додатку, що пароль ок, але тепер чекаємо код
        res.json({ 
          success: true, 
          requireOTP: true, 
          message: 'Пароль вірний. Код підтвердження надіслано.' 
        });
      });
    } else {
      console.log('Невдалий вхід: невірні дані');
      res.status(401).json({ success: false, message: 'Невірний номер телефону або пароль' });
    }
  });
});

// --- 2. ЕТАП: ВЕРИФІКАЦІЯ OTP КОДУ ---
app.post('/verify-otp', (req, res) => {
  const { phone, code } = req.body;

  console.log(`Перевірка коду для ${phone}: ${code}`);

  // Перевіряємо, чи збігається код і чи не минув час (otp_expiry > поточного часу)
  const query = 'SELECT * FROM residents WHERE phone = ? AND otp_code = ? AND otp_expiry > NOW()';

  db.execute(query, [phone, code], (err, results) => {
    if (err) {
      console.error('Помилка при верифікації:', err);
      return res.status(500).json({ success: false });
    }

    if (results.length > 0) {
      const user = results[0];
      
      // Після успішного входу очищуємо тимчасовий код у базі
      db.execute('UPDATE residents SET otp_code = NULL, otp_expiry = NULL WHERE phone = ?', [phone]);
      
      console.log(`Користувач ${user.full_name} успішно увійшов у систему`);

      // Повертаємо успіх і дані користувача (крім пароля)
      res.json({ 
        success: true, 
        message: 'Вхід успішний',
        user: {
          id: user.id,
          full_name: user.full_name,
          phone: user.phone,
          apartment: user.apartment_number
        }
      });
    } else {
      console.log('Помилка: код невірний або застарів');
      res.status(401).json({ success: false, message: 'Код невірний або термін його дії минув' });
    }
  });
});

// Запуск сервера на порту 3000
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`API Сервер запрацював на порту ${PORT}`);
  console.log(`Доступ локально: http://localhost:${PORT}`);
  console.log(`=========================================`);
});