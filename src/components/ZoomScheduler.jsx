import { useState } from "react";
import axios from "axios";

export default function ZoomScheduler() {
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScheduleMeeting = async () => {
    if (!topic || !startTime || !duration) {
      setError("All fields are required!");
      return;
    }

    setError("");
    setLoading(true);
    setMeetingInfo(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/zoom/create-meeting/",
        { topic, start_time: startTime, duration }
      );
      setMeetingInfo(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error?.message || "Failed to create meeting"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="card-title mb-4 text-center">Schedule Zoom Meeting</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Topic</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter meeting topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Start Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Duration (minutes)</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter duration in minutes"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleScheduleMeeting}
          disabled={loading}
        >
          {loading ? "Scheduling..." : "Schedule Meeting"}
        </button>

        {meetingInfo && (
          <div className="mt-4 p-3 border rounded bg-light">
            <h5>Meeting Created!</h5>
            <p>
              <strong>Join URL (Students): </strong>
              <a
                href={meetingInfo.join_url}
                target="_blank"
                rel="noreferrer"
              >
                {meetingInfo.join_url}
              </a>
            </p>
            <p>
              <strong>Start URL (Host/Admin): </strong>
              <a
                href={meetingInfo.start_url}
                target="_blank"
                rel="noreferrer"
              >
                {meetingInfo.start_url}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
