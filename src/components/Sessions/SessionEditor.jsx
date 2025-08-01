import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { sessionAPI } from "../../utils/api";

const SessionEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState({
    title: "",
    tags: "",
    json_file_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load existing session if editing
  useEffect(() => {
    if (id) {
      fetchSession();
    }
  }, [id]);

  const fetchSession = async () => {
    try {
      const response = await sessionAPI.getMySession(id);
      const session = response.data;
      setSessionData({
        title: session.title,
        tags: session.tags.join(", "),
        json_file_url: session.json_file_url,
      });
    } catch (error) {
      toast.error("Failed to load session");
      navigate("/my-sessions");
    }
  };

  // Auto-save functionality with debounce
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges || !sessionData.title.trim()) return;

    setAutoSaving(true);
    try {
      await sessionAPI.saveDraft({
        id,
        ...sessionData,
      });
      setHasUnsavedChanges(false);
      toast.success("Draft auto-saved!", { duration: 2000 });
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setAutoSaving(false);
    }
  }, [id, sessionData, hasUnsavedChanges]);

  // Auto-save timer
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      autoSave();
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, [autoSave, hasUnsavedChanges]);

  const handleChange = (e) => {
    setSessionData({
      ...sessionData,
      [e.target.name]: e.target.value,
    });
    setHasUnsavedChanges(true);
  };

  const validateForm = () => {
    if (!sessionData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!sessionData.json_file_url.trim()) {
      toast.error("JSON file URL is required");
      return false;
    }
    try {
      new URL(sessionData.json_file_url);
    } catch {
      toast.error("Please enter a valid URL");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await sessionAPI.saveDraft({
        id,
        ...sessionData,
      });
      setHasUnsavedChanges(false);
      toast.success("Draft saved successfully!");
      navigate("/my-sessions");
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await sessionAPI.publishSession({
        id,
        ...sessionData,
      });
      setHasUnsavedChanges(false);
      toast.success("Session published successfully!");
      navigate("/my-sessions");
    } catch (error) {
      toast.error("Failed to publish session");
    } finally {
      setLoading(false);
    }
  };

  const previewJsonFile = async () => {
    if (!sessionData.json_file_url) {
      toast.error("Please enter a JSON file URL first");
      return;
    }

    try {
      const response = await fetch(sessionData.json_file_url);
      if (!response.ok) {
        throw new Error("Failed to fetch JSON file");
      }
      const data = await response.json();

      // Open preview in new window
      const previewWindow = window.open("", "_blank");
      previewWindow.document.write(`
        <html>
          <head>
            <title>JSON Preview - ${sessionData.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; }
            </style>
          </head>
          <body>
            <h2>JSON File Preview: ${sessionData.title}</h2>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </body>
        </html>
      `);
    } catch (error) {
      toast.error("Failed to preview JSON file. Please check the URL.");
    }
  };

  return (
    <div className="session-editor-container">
      <div className="editor-header">
        <h1>{id ? "Edit Session" : "Create New Session"}</h1>
        <div className="save-status">
          {autoSaving && <span className="auto-saving">Auto-saving...</span>}
          {hasUnsavedChanges && !autoSaving && (
            <span className="unsaved">Unsaved changes</span>
          )}
          {!hasUnsavedChanges && !autoSaving && (
            <span className="saved">All changes saved</span>
          )}
        </div>
      </div>

      <div className="editor-form">
        <div className="form-group">
          <label htmlFor="title">Session Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={sessionData.title}
            onChange={handleChange}
            placeholder="e.g., Morning Yoga Flow"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={sessionData.tags}
            onChange={handleChange}
            placeholder="e.g., yoga, morning, flexibility (comma separated)"
          />
          <small>Separate multiple tags with commas</small>
        </div>

        <div className="form-group">
          <label htmlFor="json_file_url">JSON File URL *</label>
          <input
            type="url"
            id="json_file_url"
            name="json_file_url"
            value={sessionData.json_file_url}
            onChange={handleChange}
            placeholder="https://example.com/session-data.json"
            required
          />
          <small>
            URL to a JSON file containing your session instructions and data
          </small>
          <button
            type="button"
            onClick={previewJsonFile}
            className="preview-btn"
            disabled={!sessionData.json_file_url}
          >
            Preview JSON File
          </button>
        </div>

        <div className="json-example">
          <h3>Example JSON Structure:</h3>
          <pre>
            {JSON.stringify(
              {
                duration: 30,
                difficulty: "beginner",
                instructions: [
                  {
                    step: 1,
                    title: "Mountain Pose",
                    duration: 60,
                    description: "Stand tall with feet hip-width apart...",
                  },
                ],
                equipment: ["yoga mat"],
                benefits: ["flexibility", "stress relief"],
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="draft-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="publish-btn"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Session"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionEditor;
