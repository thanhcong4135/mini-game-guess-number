# Guess Number Game

Game đoán số từ 1 đến 5.

Dự án gồm:

- Backend: Java 21, Spring Boot 3, REST API, Spring Security, JWT, Spring Data JPA, MySQL, Maven.
- Frontend: React, Vite, TypeScript, Tailwind CSS, Axios, React Router.
- Authentication: JWT Bearer token.
- Database: lưu user, mật khẩu đã hash, score và turns.

## 1. Cấu Trúc Project

```text
GuessNumberGame/
  backend/
    src/main/java/com/example/guessnumber/
      config/
      controller/
      dto/
      entity/
      exception/
      repository/
      security/
      service/
    src/main/resources/application.yml
    pom.xml
  frontend/
    src/
      api/
      components/
      pages/
      types/
    package.json
    .env.example
  README.md
```

## 2. Clone Và Mở Project Bằng VS Code

Clone project từ GitHub:

```bash
git clone https://github.com/thanhcong4135/mini-game-guess-number.git GuessNumberGame
cd GuessNumberGame
```

Mở project bằng VS Code:

```bash
code .
```

Sau khi mở project, mở Terminal tích hợp trong VS Code:

```text
Terminal -> New Terminal
```

Các lệnh chạy backend/frontend bên dưới đều chạy trong terminal ở thư mục root của project.

## 3. Môi Trường Cần Có

Backend:

- Java 21
- Maven 3.9+
- MySQL 8+

Frontend:

- Node.js
- npm

Kiểm tra nhanh:

```bash
java -version
mvn -version
node -v
npm -v
```

## 4. Setup Database

Backend đọc cấu hình database tại:

```text
backend/src/main/resources/application.yml
```

Cấu hình mặc định:

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/guess_number_game?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:123456}
```

Nếu MySQL trên máy bạn dùng username/password khác, sửa `username` và `password` trong `application.yml`, hoặc set biến môi trường `DB_USERNAME` và `DB_PASSWORD`.

Nếu user MySQL không có quyền tạo database, backend sẽ lỗi khi start. Khi đó cần tạo database thủ công:

```sql
CREATE DATABASE guess_number_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hibernate sẽ tạo bảng `users` từ entity khi database đang trống. Cột `username` dùng collation `utf8mb4_bin` để phân biệt chữ hoa và chữ thường khi register/login:

```sql
users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  turns INT NOT NULL DEFAULT 0,
  INDEX idx_users_username (username),
  INDEX idx_users_score_username (score DESC, username ASC)
)
```

## 5. Chạy Backend

Từ thư mục root project:

```bash
cd backend
mvn spring-boot:run
```

Backend chạy tại:

```text
http://localhost:8080
```

Build backend:

```bash
cd backend
mvn clean package
```

## 6. Chạy Frontend

Mở một terminal mới từ thư mục root project:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

File `.env` cần có:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

Nếu port `5173` đang bận, Vite có thể chạy ở port khác như `5174`. Backend đã cấu hình CORS cho phép `localhost:*`.

Build frontend:

```bash
cd frontend
npm run build
```

## 7. REST API

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `POST` | `/register` | Đăng ký user mới |
| `POST` | `/login` | Đăng nhập và nhận JWT token |
| `GET` | `/me` | Lấy thông tin user hiện tại |
| `POST` | `/buy-turns` | Cộng thêm 5 lượt chơi |
| `POST` | `/guess` | Đoán số từ 1 đến 5 |
| `GET` | `/leaderboard` | Lấy top 10 user có score cao nhất |

`/register` và `/login` là public. Các API còn lại cần header:

```text
Authorization: Bearer <token>
```

## 8. Test Bằng UI

1. Mở frontend tại `http://localhost:5173`.
2. Vào Register page, tạo user mới.
3. Vào Login page, đăng nhập bằng user vừa tạo.
4. Vào Game page, bấm `Buy 5 Turns`.
5. Bấm một số từ `1` đến `5` để đoán.
6. Xem guessed number, server number, win/loss, score và turns còn lại.
7. Bấm Leaderboard để xem top 10.
8. Bấm Logout để xóa token và quay về login.
