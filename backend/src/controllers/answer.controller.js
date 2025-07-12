import { db } from "../config/db.js";

export const addAnswer = async (req, res) => {
  const { content } = req.body;
  const { questionId } = req.params;

  const answer = await db.query(
    "INSERT INTO answers (content, question_id, author_id) VALUES ($1, $2, $3) RETURNING *",
    [content, questionId, req.user.id]
  );

  await db.query(
    "INSERT INTO notifications (recipient_id, message) VALUES ($1, $2)",
    [questionOwnerId, `Your question "${questionTitle}" got a new answer.`]
  );
  res.status(201).json(answer.rows[0]);
};

export const markAccepted = async (req, res) => {
  const { id } = req.params;
  await db.query("UPDATE answers SET is_accepted = TRUE WHERE id = $1", [id]);

  await db.query(
    "INSERT INTO notifications (recipient_id, message) VALUES ($1, $2)",
    [answerAuthorId, `Your answer was accepted!`]
  );
  res.json({ message: "Answer marked as accepted" });
};
