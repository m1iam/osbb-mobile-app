require('dotenv').config(); // Завантажуємо дані з .env
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

console.log('Перевірка рядка підключення:', process.env.DATABASE_URL ? 'ЗНАЙДЕНО' : 'НЕ ЗНАЙДЕНО (ПУСТО)');

if (!process.env.DATABASE_URL) {
  console.error('❌ ПОМИЛКА: DATABASE_URL не знайдено в .env файлі!');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// ПІДКЛЮЧЕННЯ ДО TiDB CLOUD
const db = mysql.createPool(process.env.DATABASE_URL);

// Перевірка підключення
db.getConnection((err, connection) => {
  if (err) {
    console.error('--- ПОМИЛКА TiDB ---', err.message);
  } else {
    console.log('✅ Успішне підключення до TiDB Cloud!');
    connection.release();
  }
});

// --- 1. ЕТАП: РЕЄСТРАЦІЯ (З токенами сповіщень) ---
app.post('/register', (req, res) => {
  // Приймаємо додаткові поля: deviceId та pushToken
  const { phone_number, pib, flat_number, password, email, deviceId, pushToken } = req.body;

  console.log(`Спроба реєстрації для: ${phone_number}`);
  console.log(`Токен пристрою: ${pushToken ? 'Отримано' : 'Відсутній'}`);

  // SQL запит з новими колонками для пристроїв
  const query = `
    INSERT INTO residents (
      phone_number, pib, flat_number, password, email, 
      initial_device_id, last_device_token
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.execute(
    query, 
    [phone_number, pib, flat_number, password, email, deviceId, pushToken], 
    (err, results) => {
      if (err) {
        console.error('Помилка реєстрації в БД:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, message: 'Цей номер телефону вже зареєстровано' });
        }
        return res.status(500).json({ success: false, message: 'Помилка сервера при реєстрації' });
      }

      console.log(`✅ Користувач ${pib} успішно зареєстрований з токеном!`);
      res.json({ success: true, message: 'Реєстрація успішна!' });
    }
  );
});

// --- 2. ЕТАП: ЛОГІН ---
app.post('/login', (req, res) => {
  const { phone, password } = req.body;
  console.log(`Спроба входу: ${phone}`);

  const query = 'SELECT * FROM residents WHERE phone_number = ? AND password = ?';

  db.execute(query, [phone, password], (err, results) => {
    if (err) {
      console.error('Помилка БД:', err);
      return res.status(500).json({ success: false, message: 'Помилка сервера' });
    }

    if (results.length > 0) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60000); 

      const updateQuery = 'UPDATE residents SET otp_code = ?, otp_expiry = ? WHERE phone_number = ?';
      
      db.execute(updateQuery, [otp, expiry, phone], (updErr) => {
        if (updErr) return res.status(500).json({ success: false });

        console.log(`-----------------------------------------`);
        console.log(`[SMS] Код для ${phone}: ${otp}`);
        console.log(`-----------------------------------------`);
        
        res.json({ 
          success: true, 
          requireOTP: true, 
          message: 'Пароль вірний. Введіть код підтвердження.' 
        });
      });
    } else {
      res.status(401).json({ success: false, message: 'Невірний номер або пароль' });
    }
  });
});

// --- 3. ЕТАП: ВЕРИФІКАЦІЯ OTP ---
app.post('/verify-otp', (req, res) => {
  const { phone, code } = req.body;
  const query = 'SELECT * FROM residents WHERE phone_number = ? AND otp_code = ? AND otp_expiry > NOW()';

  db.execute(query, [phone, code], (err, results) => {
    if (err) return res.status(500).json({ success: false });

    if (results.length > 0) {
      const user = results[0];
      db.execute('UPDATE residents SET otp_code = NULL, otp_expiry = NULL WHERE phone_number = ?', [phone]);
      
      console.log(`Користувач ${user.pib} увійшов!`);

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          pib: user.pib,
          phone: user.phone_number,
          flat: user.flat_number,
          email: user.email
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Код невірний або застарів' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запрацював! Порт: ${PORT}`);
});