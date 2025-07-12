import { useParams } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const mockQuestion = {
  id: 1,
  title: "How do I use useEffect with dependencies?",
  description:
    "<p>I'm confused about how dependencies in <strong>useEffect</strong> work. When do I add a dependency and when should I not?</p>",
  tags: ["React", "Hooks"],
  answers: [
    {
      id: 1,
      content:
        "You need to include every value that changes inside the effect.",
      votes: 3,
      author: "user123",
      accepted: true,
    },
    {
      id: 2,
      content:
        "If you use a function or prop inside useEffect, add it as a dependency unless it's stable.",
      votes: 1,
      author: "devGuy",
      accepted: false,
    },
  ],
};

export default function QuestionDetail() {
  const { id } = useParams();
  const { user } = useUser();

  const [answers, setAnswers] = useState(
    mockQuestion.answers.map((ans) => ({
      ...ans,
      votesBy: {},
    }))
  );

  const [newAnswer, setNewAnswer] = useState("");

  const handleVote = (id, type) => {
    if (!user) {
      alert("Login to vote!");
      return;
    }

    setAnswers((prev) =>
      prev.map((ans) => {
        if (ans.id !== id) return ans;

        const userVote = ans.votesBy[user.email];
        let newVotes = ans.votes;
        const newVotesBy = { ...ans.votesBy };

        if (userVote === type) {
          newVotes += type === "up" ? -1 : 1;
          delete newVotesBy[user.email];
        } else if (userVote && userVote !== type) {
          newVotes += type === "up" ? 2 : -2;
          newVotesBy[user.email] = type;
        } else {
          newVotes += type === "up" ? 1 : -1;
          newVotesBy[user.email] = type;
        }

        return {
          ...ans,
          votes: newVotes,
          votesBy: newVotesBy,
        };
      })
    );
  };

  const handlePostAnswer = () => {
    if (!user) return;

    if (!newAnswer || newAnswer === "<p><br></p>") {
      alert("Answer cannot be empty.");
      return;
    }

    const answerToAdd = {
      id: Date.now(),
      content: newAnswer,
      votes: 0,
      votesBy: {},
      author: user.email,
      accepted: false,
    };

    setAnswers((prev) => [answerToAdd, ...prev]);
    setNewAnswer("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 space-y-6">
      <h1 className="text-2xl font-bold text-primary">{mockQuestion.title}</h1>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: mockQuestion.description }}
      />

      <div className="flex gap-2 flex-wrap">
        {mockQuestion.tags.map((tag) => (
          <span key={tag} className="badge badge-outline">
            {tag}
          </span>
        ))}
      </div>

      <div className="divider">Answers</div>

      {answers.map((ans) => (
        <div key={ans.id} className="flex gap-4 mb-6 items-start">
          <div className="flex flex-col items-center">
            <button
              className={`btn btn-xs mb-1 ${
                ans.votesBy[user?.email] === "up"
                  ? "btn-primary"
                  : "btn-outline"
              }`}
              onClick={() => handleVote(ans.id, "up")}
            >
              ⬆
            </button>
            <div className="font-bold">{ans.votes}</div>
            <button
              className={`btn btn-xs mt-1 ${
                ans.votesBy[user?.email] === "down"
                  ? "btn-error"
                  : "btn-outline"
              }`}
              onClick={() => handleVote(ans.id, "down")}
            >
              ⬇
            </button>
          </div>

          <div className="bg-base-100 border rounded p-4 shadow w-full">
            <div dangerouslySetInnerHTML={{ __html: ans.content }} />
            <div className="text-sm mt-2 text-gray-500">
              — {ans.author}
              {ans.accepted && (
                <span className="ml-2 text-success font-bold">(Accepted)</span>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="divider">Your Answer</div>

      {user ? (
        <>
          <ReactQuill
            theme="snow"
            value={newAnswer}
            onChange={setNewAnswer}
            className="quill-editor"
          />
          <button className="btn btn-primary mt-4" onClick={handlePostAnswer}>
            Post Answer
          </button>
        </>
      ) : (
        <p className="text-sm text-error mt-2">
          You must be logged in to answer.
        </p>
      )}
    </div>
  );
}
