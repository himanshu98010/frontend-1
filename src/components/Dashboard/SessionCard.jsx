import React from "react";

const SessionCard = ({ session }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewSession = () => {
    if (session.json_file_url) {
      window.open(session.json_file_url, "_blank");
    }
  };

  return (
    <div className="session-card">
      <div className="session-header">
        <h3 className="session-title">{session.title}</h3>
        <span className="session-status">{session.status}</span>
      </div>

      <div className="session-meta">
        <p className="session-author">
          By: {session.user_id?.email || "Unknown"}
        </p>
        <p className="session-date">
          Created: {formatDate(session.created_at)}
        </p>
      </div>

      {session.tags && session.tags.length > 0 && (
        <div className="session-tags">
          {session.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="session-actions">
        <button
          onClick={handleViewSession}
          className="view-btn"
          disabled={!session.json_file_url}
        >
          View Session
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
