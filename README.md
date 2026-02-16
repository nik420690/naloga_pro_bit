## Car Manager – run locally

### Prerequisites

- Python 3.9+
- Node.js
- MySQL running on `localhost:3306` (with a database and user)

### 1. Start the backend

```bash
cd server
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # set SQLALCHEMY_DATABASE_URI + SECRET_KEY
python run.py                   # API: http://localhost:5001
```

### 2. Create admin user (one time)

```bash
cd server
source venv/bin/activate
export ADMIN_EMAIL=admin@example.com
export ADMIN_PASSWORD=admin123
python seed_admin.py
```

### 3. Start the frontend

```bash
cd client
npm install
npm run dev                     # app: http://localhost:3000
```

Then open `http://localhost:3000` and log in with `admin@example.com` / `admin123`.

## Car Manager

Simple full‑stack app to browse and manage car listings (React SPA + Flask API + MySQL).

## Run locally

```bash
# backend
cd server
python3 -m venv venv
source venv/bin/activate         # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # set SQLALCHEMY_DATABASE_URI + SECRET_KEY
python run.py                    # API on http://localhost:5001

# seed admin (one time)
export ADMIN_EMAIL=admin@example.com
export ADMIN_PASSWORD=admin123
python seed_admin.py

# frontend
cd ../client
npm install
npm run dev                      # app on http://localhost:3000
```

Log in with the seeded admin to access the admin panel and manage cars.

### 1. Create the MySQL database and user

In your MySQL client:

```sql
CREATE DATABASE cars_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cars_user'@'localhost' IDENTIFIED BY 'cars_pass';
GRANT ALL ON cars_db.* TO 'cars_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend (Flask API)

```bash
cd server
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Run the API:

```bash
python run.py
```

The API will listen on **http://localhost:5001**.

Create the first admin user (one‑time):

```bash
cd server
source venv/bin/activate
export ADMIN_EMAIL=admin@example.com
export ADMIN_PASSWORD=admin123
python seed_admin.py
```

### 3. Frontend (React SPA)

In another terminal:

```bash
cd client
npm install
npm run dev
```

The app will be available at **http://localhost:3000**. The Vite dev server proxies `/api` calls to `http://localhost:5001`.

Log in as admin:

- **Email**: `admin@example.com`
- **Password**: `admin123`


