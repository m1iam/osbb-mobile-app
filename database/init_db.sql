CREATE DATABASE digital_osbb;
USE digital_osbb;

-- 3. Таблиця МЕШКАНЦІВ (з полями під Дію)
CREATE TABLE residents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(10) UNIQUE NOT NULL, -- РНОКПП (ІПН)
    phone VARCHAR(15),
    apartment_number INT NOT NULL,
    role ENUM('resident', 'admin') DEFAULT 'resident',
    is_verified BOOLEAN DEFAULT FALSE,  -- Верифікація власника
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Таблиця ОГОЛОШЕНЬ (заміна Viber)
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('general', 'emergency', 'maintenance') DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Таблиця ГОЛОСУВАНЬ (цифрові рішення)
CREATE TABLE polls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Таблиця РЕЗУЛЬТАТІВ (з токеном підпису)
CREATE TABLE poll_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT,
    resident_id INT,
    vote_choice ENUM('yes', 'no', 'abstain'),
    diia_signature_token VARCHAR(512), -- Доказ Дія.Підпису
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poll_id) REFERENCES polls(id),
    FOREIGN KEY (resident_id) REFERENCES residents(id),
    UNIQUE(poll_id, resident_id)
);

-- 7. Таблиця ДОКУМЕНТІВ (PDF звіти)
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL, -- Шлях до файлу
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
