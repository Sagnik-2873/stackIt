import { db } from "../config/db.js";

export const getAllQuestions = async (req, res) => {
  const result = await db.query(`
    SELECT q.*, u.username 
    FROM questions q 
    JOIN users u ON q.author_id = u.id
    ORDER BY q.created_at DESC
  `);
  res.json(result.rows);
};

export const getQuestionById = async (req, res) => {
  const { id } = req.params;

  const question = await db.query("SELECT * FROM questions WHERE id = $1", [
    id,
  ]);
  const answers = await db.query(
    `
    SELECT a.*, u.username 
    FROM answers a
    JOIN users u ON a.author_id = u.id
    WHERE question_id = $1
    ORDER BY created_at ASC
  `,
    [id]
  );

  res.json({ question: question.rows[0], answers: answers.rows });
};

export const createQuestion = async (req, res) => {
  const { title, description, tags } = req.body;
  const question = await db.query(
    "INSERT INTO questions (title, description, author_id) VALUES ($1, $2, $3) RETURNING *",
    [title, description, req.user.id]
  );

  const qid = question.rows[0].id;

  for (const tagName of tags) {
    let tagId;
    const tagCheck = await db.query("SELECT * FROM tags WHERE name = $1", [
      tagName,
    ]);
    if (tagCheck.rows.length) {
      tagId = tagCheck.rows[0].id;
    } else {
      const inserted = await db.query(
        "INSERT INTO tags (name) VALUES ($1) RETURNING id",
        [tagName]
      );
      tagId = inserted.rows[0].id;
    }
    await db.query(
      "INSERT INTO question_tags (question_id, tag_id) VALUES ($1, $2)",
      [qid, tagId]
    );
  }

  res.status(201).json(question.rows[0]);
};

export const searchQuestions = async (req, res) => {
  const { query, tag, userId, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT q.*, u.username FROM questions q
    JOIN users u ON u.id = q.author_id
    WHERE 1=1
  `;
  const params = [];

  if (query) {
    sql += ` AND (q.title ILIKE $${params.length + 1} OR q.description ILIKE $${
      params.length + 1
    })`;
    params.push(`%${query}%`);
  }

  if (tag) {
    sql += `
      AND q.id IN (
        SELECT question_id FROM question_tags qt
        JOIN tags t ON qt.tag_id = t.id
        WHERE t.name = $${params.length + 1}
      )
    `;
    params.push(tag);
  }

  if (userId) {
    sql += ` AND q.author_id = $${params.length + 1}`;
    params.push(userId);
  }

  sql += ` ORDER BY q.created_at DESC LIMIT $${params.length + 1} OFFSET $${
    params.length + 2
  }`;
  params.push(limit, offset);

  const result = await db.query(sql, params);
  res.json(result.rows);
};
