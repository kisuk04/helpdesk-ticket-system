# 🎫 Helpdesk Ticket System

*Helpdesk Ticket System* เป็นระบบสำหรับจัดการคำร้องและปัญหาภายในองค์กร พัฒนาโดยใช้ *Golang (Backend) + React (Frontend) + PostgreSQL* พร้อมรองรับการใช้งานผ่าน Docker

---

## 🛠 *เทคโนโลยีที่ใช้*
- *Backend:* Golang 
- *Frontend:* React + Bootstrap
- *Database:* PostgreSQL + pgAdmin
- *Containerization:* Docker & Docker Compose

---

## 🚀 *การติดตั้งและใช้งาน*

### *Clone โปรเจกต์*
```bash
git clone git@github.com:kisuk04/helpdesk-ticket-system.git
```
### *ดาวน์โหลด โปรเจกต์*

ไฟล์ .env และใส่ข้อมูลจากด้านล่าง
# App
APP_PORT=8080
# Database
```bash
#พิมพ์คำสั่ง ipconfig เพื่อค้นหา IP address ของ IPv4
DATABASE_HOST= ...
DATABASE_PORT=5432
DATABASE_USER=helpdesk_user
DATABASE_PASSWORD=123456
DATABASE_NAME=helpdesk
DATABASE_SSLMODE=disable

# PostgreSQL 
POSTGRES_DB=helpdesk
POSTGRES_USER=helpdesk_user
POSTGRES_PASSWORD=123456
POSTGRES_PORT=5432

# pgAdmin Environment Variables
PGADMIN_DEFAULT_EMAIL=samanya.kisuk4@gmail.com
PGADMIN_DEFAULT_PASSWORD=password
PGADMIN_PORT=5055
```

- กด save File จากนั้น Run Folder ด้วย Docker ใช้คำสั่ง
```bash
docker-compose build
docker-compose up -d 
```

- สำหรับ PostgreSQL เปิด localhost:5050
#FrontEnd
- Run Server
```bash
npm start
```
- หากเกิดปัญหา error

```bash
npm install
npm start
```
- สำหรับ React เปิด localhost:3000 
