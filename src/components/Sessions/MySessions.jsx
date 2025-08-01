import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { sessionAPI } from "../../utils/api";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'draft', 'published'

  useEffect(() => {
    fetchMySessions();
  }, []);

  const fetchMySessions = async () => {
    try {
      const response = await sessionAPI.getMySessions();
      setSessions(response.data);
    } catch (error) {
      toast.error("Failed to load your sessions");
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    if (filter === "all") return true;
    return session.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="my-sessions-container">
        <div className="loading">Loading your sessions...</div>
      </div>
    );
  }

  return (
    <div className="my-sessions-container">
      <div className="sessions-header">
        <h1>My Sessions</h1>
        <Link to="/session-editor" className="create-btn">
          + Create New Session
        </Link>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({sessions.length})
        </button>
        <button
          className={`filter-tab ${filter === "draft" ? "active" : ""}`}
          onClick={() => setFilter("draft")}
        >
          Drafts ({sessions.filter((s) => s.status === "draft").length})
        </button>
        <button
          className={`filter-tab ${filter === "published" ? "active" : ""}`}
          onClick={() => setFilter("published")}
        >
          Published ({sessions.filter((s) => s.status === "published").length})
        </button>
      </div>

      <div className="sessions-list">
        {filteredSessions.length === 0 ? (
          <div className="empty-state">
            <h3>No sessions found</h3>
            <p>
              {filter === "all"
                ? "You haven't created any sessions yet."
                : `No ${filter} sessions found.`}
            </p>
            <Link to="/session-editor" className="create-btn">
              Create Your First Session
            </Link>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div key={session._id} className="session-item">
              <div className="session-info">
                <h3 className="session-title">{session.title}</h3>
                <div className="session-meta">
                  <span className={`status-badge ${session.status}`}>
                    {session.status}
                  </span>
                  <span className="session-date">
                    Updated: {formatDate(session.updated_at)}
                  </span>
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
              </div>
              <div className="session-actions">
                <Link
                  to={`/session-editor/${session._id}`}
                  className="edit-btn"
                >
                  Edit
                </Link>
                {session.json_file_url && (
                  <button
                    onClick={() => window.open(session.json_file_url, "_blank")}
                    className="view-btn"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MySessions;
