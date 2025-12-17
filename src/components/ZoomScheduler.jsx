import { useState } from "react";
import axios from "axios";
import { Video, Calendar, Clock, Link as LinkIcon, Copy, Check } from 'lucide-react';

export default function ZoomScheduler() {
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("45"); // Default duration
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScheduleMeeting = async () => {
    if (!topic || !startTime || !duration) {
      setError("Please fill in all details before scheduling.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/zoom/create-meeting/",
        { topic, start_time: startTime, duration }
      );
      setMeetingInfo(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Connection to Zoom API failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="bg-primary p-4 text-white text-center">
          <Video size={40} className="mb-2" />
          <h3 className="fw-bold mb-0">Zoom Scheduler</h3>
          <p className="small opacity-75 mb-0">Create live sessions for your students</p>
        </div>

        <div className="card-body p-4">
          {error && <div className="alert alert-danger border-0 small">{error}</div>}

          <div className="mb-3">
            <label className="form-label fw-semibold small text-uppercase text-muted">Meeting Topic</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Video size={16} /></span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="e.g. Advanced React Patterns"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-7 mb-3">
              <label className="form-label fw-semibold small text-uppercase text-muted">Start Date & Time</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><Calendar size={16} /></span>
                <input
                  type="datetime-local"
                  className="form-control bg-light border-start-0"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-5 mb-3">
              <label className="form-label fw-semibold small text-uppercase text-muted">Duration (Min)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><Clock size={16} /></span>
                <select 
                  className="form-select bg-light border-start-0" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                </select>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary w-100 py-2 fw-bold mt-2"
            onClick={handleScheduleMeeting}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : "Generate Zoom Meeting"}
          </button>

          {meetingInfo && (
            <div className="mt-4 animate-fade-in">
              <div className="p-3 border rounded-3 bg-success bg-opacity-10 border-success border-opacity-20">
                <div className="d-flex align-items-center mb-3 text-success">
                  <CheckCircle size={20} className="me-2" />
                  <h6 className="mb-0 fw-bold">Meeting Successfully Scheduled</h6>
                </div>
                
                <div className="mb-3">
                  <label className="small fw-bold text-muted text-uppercase">Student Join Link</label>
                  <div className="input-group">
                    <input readOnly className="form-control form-control-sm bg-white" value={meetingInfo.join_url} />
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => copyToClipboard(meetingInfo.join_url)}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <a 
                  href={meetingInfo.start_url} 
                  target="_blank" 
                  className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  Start Meeting as Host <LinkIcon size={16} />
                </a>
                <p className="text-center x-small text-muted mt-2 mb-0">
                  Only the instructor can use the "Start" link.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}