import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'kodicedu.db');
const db: DatabaseType = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('teacher', 'student')) NOT NULL,
      grade TEXT DEFAULT '1º Ano A — Ensino Médio',
      intelligence_role TEXT CHECK(intelligence_role IN ('Curador', 'Revisor', 'Comunicador')) DEFAULT 'Curador',
      is_leader INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      avatar_url TEXT,
      badges_json TEXT DEFAULT '[]',
      lgpd_consent INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      school TEXT NOT NULL,
      subject TEXT NOT NULL,
      goal_points INTEGER DEFAULT 8500,
      current_points INTEGER DEFAULT 0,
      reward_title TEXT DEFAULT 'Passeio Cultural Virtual 🏛️',
      onboarding_level INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS class_teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      teacher_id INTEGER NOT NULL,
      role_title TEXT DEFAULT 'Professor Titular',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(class_id, teacher_id),
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS class_enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(class_id, student_id),
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      group_type TEXT CHECK(group_type IN ('Oficial da Disciplina', 'Grupo de Estudo Livre (Foco ENEM)')) DEFAULT 'Oficial da Disciplina',
      objective TEXT,
      status TEXT CHECK(status IN ('approved', 'pending_approval')) DEFAULT 'approved',
      current_device_holder_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS group_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role_name TEXT CHECK(role_name IN ('Curador', 'Revisor', 'Comunicador')) DEFAULT 'Curador',
      has_phone INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      UNIQUE(group_id, user_id),
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      author_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      bncc_code TEXT NOT NULL,
      question TEXT NOT NULL,
      options_json TEXT NOT NULL,
      correct_index INTEGER NOT NULL,
      points_reward INTEGER DEFAULT 50,
      is_ai_generated INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quiz_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      group_id INTEGER,
      selected_index INTEGER NOT NULL,
      is_correct INTEGER NOT NULL,
      points_awarded INTEGER NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notebook_uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT CHECK(type IN ('HANDWRITTEN_NOTEBOOK', 'MIND_MAP', 'CURATED_LINK')) DEFAULT 'HANDWRITTEN_NOTEBOOK',
      image_url TEXT,
      badge TEXT DEFAULT 'Print de Caderno',
      status TEXT CHECK(status IN ('published', 'in_moderation')) DEFAULT 'published',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS moderation_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      ai_status TEXT NOT NULL,
      human_status TEXT NOT NULL,
      status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
      approved_by_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS gratitude_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      icon TEXT DEFAULT 'lightbulb',
      title TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bncc_skills_mastery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      skill_code TEXT NOT NULL,
      skill_desc TEXT NOT NULL,
      mastery_percentage INTEGER NOT NULL,
      level TEXT CHECK(level IN ('lvl-high', 'lvl-mid', 'lvl-low')) NOT NULL,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      tag TEXT NOT NULL,
      title TEXT NOT NULL,
      desc TEXT NOT NULL,
      color TEXT DEFAULT 'var(--kodic-fuchsia)',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
    );
  `);
}

initSchema();

export default db;
