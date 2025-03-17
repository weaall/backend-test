# Task2

ERD 작성

## Mysql Table

### User Table

| Column Name | Description | Data Type     | Constraints                |
|-------------|-------------|---------------|----------------------------|
| id          | PK          | INT           | AUTO_INCREMENT             |
| name        | -           | VARCHAR(255)  | NOT NULL                   |
| email       | UNIQ        | VARCHAR(255)  | NOT NULL                   |
| password    | -           | VARCHAR(255)  | NOT NULL                   |
| created_at  | -           | DATETIME      | DEFAULT CONVERT_TZ<br/>(CURRENT_TIMESTAMP, 'UTC', 'Asia/Seoul') |
| status      | -           | BOOLEAN       | DEFAULT TRUE               |

### Post Table

| Column Name | Description | Data Type     | Constraints                |
|-------------|-------------|---------------|----------------------------|
| id          | PK          | INT           | AUTO_INCREMENT             |
| title       | -           | VARCHAR(255)  | NOT NULL                   |
| content     | -           | TEXT          | NOT NULL                   |
| created_at  | -           | DATETIME      | DEFAULT CONVERT_TZ<br/>(CURRENT_TIMESTAMP, 'UTC', 'Asia/Seoul') |
| user_id     | FK          | INT           | REFERENCES user(id)        |

### Tag Table

| Column Name | Description | Data Type     | Constraints                |
|-------------|-------------|---------------|----------------------------|
| id          | PK          | INT           | AUTO_INCREMENT             |
| name        | UNIQ        | VARCHAR(255)  | NOT NULL                   |
| created_at  | -           | DATETIME      | DEFAULT CONVERT_TZ<br/>(CURRENT_TIMESTAMP, 'UTC', 'Asia/Seoul') |

### PostTag Table

| Column Name | Description | Data Type     | Constraints                |
|-------------|-------------|---------------|----------------------------|
| post_id     | PK, FK      | INT           | REFERENCES post(id)        |
| tag_id      | PK, FK      | INT           | REFERENCES tag(id)         |


### 스키마
```SQL
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', 'Asia/Seoul'),
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE Post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', 'Asia/Seoul'),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Tag (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', 'Asia/Seoul'),
);

CREATE TABLE PostTag (
    post_id INT,
    tag_id INT,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES Post(post_id),
    FOREIGN KEY (tag_id) REFERENCES Tag(tag_id)
);
```

### 인덱싱
```sql
CREATE INDEX idx_user_id ON Post(user_id);
CREATE INDEX idx_tag_id ON PostTag(tag_id);
```

## 성능개선사항

### 파티셔닝
DB의 사이즈가 커짐에 따라 파티셔닝을 진행 <br/>
ex) Post테이블을 created_at 필드를 기준으로 파티셔닝최근 게시물의 접근 빈도가 높으므로 데이터 활용 패턴에 맞춰 주기별로 파티셔닝을 수행

→  DB 성능 향상, 데이터 보관 정책이나 아카이빙, 삭제 작업에 용이

### 어플리케이션 레벨 캐싱 (redis 등)

자주 조회되거나 최신의 Post에 대해 어플리케이션 레벨에서 캐싱을 구현

→  DB 성능 향상, 빠른 응답 시간, 비용절감 등