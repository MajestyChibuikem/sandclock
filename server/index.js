import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './database.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'sandclock-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(email, hashedPassword, name);

    const user = db.prepare('SELECT id, email, name, balance, role FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, name, balance, role, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PACKAGES ROUTES ====================

// Get all active packages (public)
app.get('/api/packages', (req, res) => {
  try {
    const packages = db.prepare('SELECT * FROM packages WHERE is_active = 1 ORDER BY created_at DESC').all();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single package
app.get('/api/packages/:id', (req, res) => {
  try {
    const pkg = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all packages (including inactive)
app.get('/api/admin/packages', authenticateToken, requireAdmin, (req, res) => {
  try {
    const packages = db.prepare('SELECT * FROM packages ORDER BY created_at DESC').all();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Create package
app.post('/api/admin/packages', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, min_investment, max_investment, roi_percentage, duration_days, clauses, gradient } = req.body;

    if (!name || !min_investment || !roi_percentage || !duration_days) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = db.prepare(`
      INSERT INTO packages (name, description, min_investment, max_investment, roi_percentage, duration_days, clauses, gradient)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, description, min_investment, max_investment, roi_percentage, duration_days, clauses, gradient || 'from-cyan-400 via-teal-300 to-blue-500');

    const pkg = db.prepare('SELECT * FROM packages WHERE id = ?').get(result.lastInsertRowid);
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update package
app.put('/api/admin/packages/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, min_investment, max_investment, roi_percentage, duration_days, clauses, gradient, is_active } = req.body;

    db.prepare(`
      UPDATE packages SET name = ?, description = ?, min_investment = ?, max_investment = ?,
      roi_percentage = ?, duration_days = ?, clauses = ?, gradient = ?, is_active = ?
      WHERE id = ?
    `).run(name, description, min_investment, max_investment, roi_percentage, duration_days, clauses, gradient, is_active ? 1 : 0, req.params.id);

    const pkg = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete package
app.delete('/api/admin/packages/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM packages WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== INVESTMENTS ROUTES ====================

// Get user's investments
app.get('/api/investments', authenticateToken, (req, res) => {
  try {
    const investments = db.prepare(`
      SELECT i.*, p.name as package_name, p.roi_percentage, p.gradient
      FROM investments i
      JOIN packages p ON i.package_id = p.id
      WHERE i.user_id = ?
      ORDER BY i.created_at DESC
    `).all(req.user.id);
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create investment
app.post('/api/investments', authenticateToken, (req, res) => {
  try {
    const { package_id, amount } = req.body;

    const pkg = db.prepare('SELECT * FROM packages WHERE id = ? AND is_active = 1').get(package_id);
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    if (amount < pkg.min_investment) {
      return res.status(400).json({ error: `Minimum investment is $${pkg.min_investment}` });
    }

    if (pkg.max_investment && amount > pkg.max_investment) {
      return res.status(400).json({ error: `Maximum investment is $${pkg.max_investment}` });
    }

    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(req.user.id);
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const expected_return = amount * (1 + pkg.roi_percentage / 100);
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + pkg.duration_days);

    // Deduct from balance
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(amount, req.user.id);

    // Create investment
    const result = db.prepare(`
      INSERT INTO investments (user_id, package_id, amount, expected_return, end_date)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.user.id, package_id, amount, expected_return, end_date.toISOString());

    // Record transaction
    db.prepare(`
      INSERT INTO transactions (user_id, type, amount, description)
      VALUES (?, 'investment', ?, ?)
    `).run(req.user.id, -amount, `Investment in ${pkg.name}`);

    const investment = db.prepare(`
      SELECT i.*, p.name as package_name, p.roi_percentage, p.gradient
      FROM investments i
      JOIN packages p ON i.package_id = p.id
      WHERE i.id = ?
    `).get(result.lastInsertRowid);

    res.json(investment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BALANCE/TRANSACTIONS ROUTES ====================

// Deposit (simulated)
app.post('/api/deposit', authenticateToken, (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(amount, req.user.id);
    db.prepare(`
      INSERT INTO transactions (user_id, type, amount, description)
      VALUES (?, 'deposit', ?, 'Deposit to account')
    `).run(req.user.id, amount);

    const user = db.prepare('SELECT id, email, name, balance, role FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transactions
app.get('/api/transactions', authenticateToken, (req, res) => {
  try {
    const transactions = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN STATS ====================

app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('user').count;
    const totalInvestments = db.prepare('SELECT COUNT(*) as count FROM investments').get().count;
    const totalValue = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM investments').get().total;
    const activeInvestments = db.prepare('SELECT COUNT(*) as count FROM investments WHERE status = ?').get('active').count;

    res.json({ totalUsers, totalInvestments, totalValue, activeInvestments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const users = db.prepare('SELECT id, email, name, balance, role, status, created_at FROM users WHERE role = ? ORDER BY created_at DESC').all('user');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get single user with their investments
app.get('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, name, balance, role, status, created_at FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const investments = db.prepare(`
      SELECT i.*, p.name as package_name, p.roi_percentage
      FROM investments i
      JOIN packages p ON i.package_id = p.id
      WHERE i.user_id = ?
      ORDER BY i.created_at DESC
    `).all(req.params.id);

    const transactions = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC').all(req.params.id);

    res.json({ user, investments, transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Suspend user
app.put('/api/admin/users/:id/suspend', authenticateToken, requireAdmin, (req, res) => {
  try {
    const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot suspend admin accounts' });
    }

    db.prepare('UPDATE users SET status = ? WHERE id = ?').run('suspended', req.params.id);
    const updatedUser = db.prepare('SELECT id, email, name, balance, role, status, created_at FROM users WHERE id = ?').get(req.params.id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Activate user
app.put('/api/admin/users/:id/activate', authenticateToken, requireAdmin, (req, res) => {
  try {
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run('active', req.params.id);
    const updatedUser = db.prepare('SELECT id, email, name, balance, role, status, created_at FROM users WHERE id = ?').get(req.params.id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update user balance
app.put('/api/admin/users/:id/balance', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { amount, type } = req.body; // type: 'set', 'add', 'subtract'

    if (type === 'set') {
      db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(amount, req.params.id);
    } else if (type === 'add') {
      db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(amount, req.params.id);
      db.prepare(`INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'admin_credit', ?, 'Admin credit')`).run(req.params.id, amount);
    } else if (type === 'subtract') {
      db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(amount, req.params.id);
      db.prepare(`INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'admin_debit', ?, 'Admin debit')`).run(req.params.id, -amount);
    }

    const updatedUser = db.prepare('SELECT id, email, name, balance, role, status, created_at FROM users WHERE id = ?').get(req.params.id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete user
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin accounts' });
    }

    // Delete user's transactions first (foreign key)
    db.prepare('DELETE FROM transactions WHERE user_id = ?').run(req.params.id);
    // Delete user's investments (foreign key)
    db.prepare('DELETE FROM investments WHERE user_id = ?').run(req.params.id);
    // Delete user
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all investments
app.get('/api/admin/investments', authenticateToken, requireAdmin, (req, res) => {
  try {
    const investments = db.prepare(`
      SELECT i.*, u.name as user_name, u.email as user_email, p.name as package_name
      FROM investments i
      JOIN users u ON i.user_id = u.id
      JOIN packages p ON i.package_id = p.id
      ORDER BY i.created_at DESC
    `).all();
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
