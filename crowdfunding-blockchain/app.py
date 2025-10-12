from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from blockchain import Blockchain
from database import Database
from functools import wraps
import json

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this'

# Initialize blockchain and database
blockchain = Blockchain()
db = Database()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    # Show recent campaigns on homepage
    campaigns = db.get_all_campaigns()
    return render_template('index.html', campaigns=campaigns)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.json
        user_id = db.create_user(data['username'], data['email'], data['password'])
        if user_id:
            return jsonify({'success': True, 'message': 'Registration successful'})
        return jsonify({'success': False, 'message': 'Username or email already exists'}), 400
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        user = db.authenticate_user(data['username'], data['password'])
        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            return jsonify({'success': True, 'message': 'Login successful'})
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/campaigns')
def campaigns():
    all_campaigns = db.get_all_campaigns()
    return render_template('campaigns.html', campaigns=all_campaigns)

@app.route('/dashboard')
@login_required
def dashboard():
    campaigns = db.get_all_campaigns()
    wallet_balance = db.get_user_wallet(session['user_id'])
    return render_template('dashboard.html', campaigns=campaigns, wallet_balance=wallet_balance)

@app.route('/create-campaign', methods=['GET', 'POST'])
@login_required
def create_campaign():
    if request.method == 'POST':
        data = request.json
        campaign_id = db.create_campaign(
            session['user_id'],
            data['title'],
            data['description'],
            float(data['target_amount']),
            data['deadline']
        )
        return jsonify({'success': True, 'campaign_id': campaign_id})
    return render_template('create_campaign.html')

@app.route('/campaign/<int:campaign_id>')
def campaign_details(campaign_id):
    campaign = db.get_campaign(campaign_id)
    donations = db.get_campaign_donations(campaign_id)
    is_logged_in = 'user_id' in session
    return render_template('campaign_details.html', campaign=campaign, donations=donations, is_logged_in=is_logged_in)

@app.route('/donate', methods=['POST'])
@login_required
def donate():
    data = request.json
    campaign_id = data['campaign_id']
    amount = float(data['amount'])
    
    # Check wallet balance
    wallet_balance = db.get_user_wallet(session['user_id'])
    if wallet_balance < amount:
        return jsonify({'success': False, 'message': 'Insufficient wallet balance'}), 400
    
    # Create blockchain transaction
    last_block = blockchain.last_block
    last_proof = last_block['proof']
    proof = blockchain.proof_of_work(last_proof)
    
    blockchain.new_transaction(
        sender=session['username'],
        recipient=f"campaign_{campaign_id}",
        amount=amount,
        campaign_id=campaign_id
    )
    
    block = blockchain.new_block(proof)
    tx_hash = blockchain.hash(block)
    
    # Record donation in database
    db.add_donation(campaign_id, session['user_id'], amount, tx_hash)
    
    return jsonify({
        'success': True,
        'message': 'Donation successful',
        'transaction_hash': tx_hash,
        'block_index': block['index']
    })

@app.route('/blockchain/chain')
def get_chain():
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain),
    }
    return jsonify(response)

@app.route('/blockchain/mine', methods=['POST'])
@login_required
def mine_block():
    last_block = blockchain.last_block
    last_proof = last_block['proof']
    proof = blockchain.proof_of_work(last_proof)
    
    blockchain.new_transaction(
        sender="0",
        recipient=session['username'],
        amount=1,
        campaign_id=0
    )
    
    previous_hash = blockchain.hash(last_block)
    block = blockchain.new_block(proof, previous_hash)
    
    response = {
        'message': 'New Block Forged',
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash'],
    }
    return jsonify(response)

@app.route('/blockchain/validate')
def validate_chain():
    is_valid = blockchain.valid_chain(blockchain.chain)
    return jsonify({'valid': is_valid})

@app.route('/blockchain-view')
@login_required
def blockchain_view():
    return render_template('blockchain_view.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
