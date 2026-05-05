# Guess Number Game

Game doan so tu 1 den 5.

Project gom:

- Backend: Java 21, Spring Boot 3, REST API, Spring Security, JWT, Spring Data JPA, MySQL, Maven.
- Frontend: React, Vite, TypeScript, Tailwind CSS, Axios, React Router.
- Authentication: JWT Bearer token.
- Database: luu user, mat khau da hash, score va turns.

## 1. Cau Truc Project

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

## 2. Clone Va Mo Project Bang VS Code

Clone project tu GitHub:

```bash
git clone https://github.com/thanhcong4135/mini-game-guess-number.git GuessNumberGame
cd GuessNumberGame
```

Mo project bang VS Code:

```bash
code .
```

Neu chua dung duoc lenh `code .`, co the mo thu cong:

1. Mo VS Code.
2. Chon `File -> Open Folder`.
3. Chon thu muc project vua clone.

Sau khi mo project, mo Terminal tich hop trong VS Code:

```text
Terminal -> New Terminal
```

Hoac dung phim tat:

```text
Ctrl + `
```

Tat ca lenh backend/frontend ben duoi chay trong terminal o thu muc root cua project.

## 3. Moi Truong Can Co

Backend:

- Java 21
- Maven 3.9+
- MySQL 8+

Frontend:

- Node.js
- npm

Kiem tra nhanh:

```bash
java -version
mvn -version
node -v
npm -v
```

## 4. Setup Database

Backend doc cau hinh database tai:

```text
backend/src/main/resources/application.yml
```

Cau hinh mac dinh:

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/guess_number_game?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:123456}
```

Neu MySQL tren may ban dung username/password khac, sua `username` va `password` trong `application.yml`, hoac set bien moi truong `DB_USERNAME` va `DB_PASSWORD`.

Neu user MySQL khong co quyen tao database, backend se loi khi start. Khi do can tao database thu cong:

```sql
CREATE DATABASE guess_number_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hibernate se tao bang `users` tu entity khi database dang trong. Cot `username` dung collation `utf8mb4_bin` de phan biet chu hoa va chu thuong khi register/login:

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

## 5. Chay Backend

Tu thu muc root project:

```bash
cd backend
mvn spring-boot:run
```

Backend chay tai:

```text
http://localhost:8080
```

Build backend:

```bash
cd backend
mvn clean package
```

Neu terminal dang nam trong thu muc `backend`, chi can chay:

```bash
mvn spring-boot:run
```

## 6. Chay Frontend

Mo mot terminal moi tu thu muc root project:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

File `.env` can co:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Frontend mac dinh chay tai:

```text
http://localhost:5173
```

Neu port `5173` dang ban, Vite co the chay o port khac nhu `5174`. Backend da cau hinh CORS cho phep `localhost:*`.

Build frontend:

```bash
cd frontend
npm run build
```

Neu terminal dang nam trong thu muc `frontend`, chi can chay:

```bash
npm install
npm run dev
```

## 7. REST API

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| `POST` | `/register` | Dang ky user moi |
| `POST` | `/login` | Dang nhap va nhan JWT token |
| `GET` | `/me` | Lay thong tin user hien tai |
| `POST` | `/buy-turns` | Cong them 5 luot choi |
| `POST` | `/guess` | Doan so tu 1 den 5 |
| `GET` | `/leaderboard` | Lay top 10 user co score cao nhat |

`/register` va `/login` la public. Cac API con lai can header:

```text
Authorization: Bearer <token>
```

## 8. Test Bang UI

1. Mo frontend tai `http://localhost:5173`.
2. Vao Register page, tao user moi.
3. Vao Login page, dang nhap bang user vua tao.
4. Vao Game page, bam `Buy 5 Turns`.
5. Bam mot so tu `1` den `5` de doan.
6. Xem guessed number, server number, win/loss, score va turns con lai.
7. Bam Leaderboard de xem top 10.
8. Bam Logout de xoa token va quay ve login.
