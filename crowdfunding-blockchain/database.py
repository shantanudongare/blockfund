import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Database:
    def __init__(self, db_name='crowdfunding.db'):
        self.db_name = db_name
        self.init_db()

    def get_connection(self):
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                wallet_balance REAL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Campaigns table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS campaigns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                creator_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                target_amount REAL NOT NULL,
                current_amount REAL DEFAULT 0,
                deadline TEXT NOT NULL,
                status TEXT DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (creator_id) REFERENCES users (id)
            )
        ''')
        
        # Donations table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS donations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                campaign_id INTEGER NOT NULL,
                donor_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                transaction_hash TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (campaign_id) REFERENCES campaigns (id),
                FOREIGN KEY (donor_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        conn.close()

    def create_user(self, username, email, password):
        conn = self.get_connection()
        cursor = conn.cursor()
        password_hash = generate_password_hash(password)
        try:
            cursor.execute(
                'INSERT INTO users (username, email, password_hash, wallet_balance) VALUES (?, ?, ?, ?)',
                (username, email, password_hash, 1000.0)  # Starting balance
            )
            conn.commit()
            user_id = cursor.lastrowid
            conn.close()
            return user_id
        except sqlite3.IntegrityError:
            conn.close()
            return None

    def authenticate_user(self, username, password):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        conn.close()
        if user and check_password_hash(user['password_hash'], password):
            return dict(user)
        return None

    def create_campaign(self, creator_id, title, description, target_amount, deadline):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO campaigns (creator_id, title, description, target_amount, deadline) VALUES (?, ?, ?, ?, ?)',
            (creator_id, title, description, target_amount, deadline)
        )
        conn.commit()
        campaign_id = cursor.lastrowid
        conn.close()
        return campaign_id

    def get_all_campaigns(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM campaigns ORDER BY created_at DESC')
        campaigns = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return campaigns

    def get_campaign(self, campaign_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM campaigns WHERE id = ?', (campaign_id,))
        campaign = cursor.fetchone()
        conn.close()
        return dict(campaign) if campaign else None

    def add_donation(self, campaign_id, donor_id, amount, tx_hash):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Add donation
        cursor.execute(
            'INSERT INTO donations (campaign_id, donor_id, amount, transaction_hash) VALUES (?, ?, ?, ?)',
            (campaign_id, donor_id, amount, tx_hash)
        )
        
        # Update campaign amount
        cursor.execute(
            'UPDATE campaigns SET current_amount = current_amount + ? WHERE id = ?',
            (amount, campaign_id)
        )
        
        # Update user wallet
        cursor.execute(
            'UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?',
            (amount, donor_id)
        )
        
        conn.commit()
        conn.close()

    def get_user_wallet(self, user_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT wallet_balance FROM users WHERE id = ?', (user_id,))
        result = cursor.fetchone()
        conn.close()
        return result['wallet_balance'] if result else 0

    def get_campaign_donations(self, campaign_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT d.*, u.username 
            FROM donations d 
            JOIN users u ON d.donor_id = u.id 
            WHERE d.campaign_id = ? 
            ORDER BY d.created_at DESC
        ''', (campaign_id,))
        donations = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return donations
