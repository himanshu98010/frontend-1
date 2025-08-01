import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { sessionAPI } from "../../utils/api";
import SessionCard from "./SessionCard";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPublicSessions();
  }, []);

  const fetchPublicSessions = async () => {
    try {
      const response = await sessionAPI.getPublicSessions();
      setSessions(response.data);
    } catch (error) {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading wellness sessions...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Wellness Sessions</h1>
        <p>Discover published wellness sessions from our community</p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search sessions by title or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="sessions-grid">
        {filteredSessions.length === 0 ? (
          <div className="empty-state">
            <h3>No sessions found</h3>
            <p>
              Try adjusting your search or check back later for new sessions.
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <SessionCard key={session._id} session={session} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
