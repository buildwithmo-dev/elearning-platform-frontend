import { useState } from "react";
import axios from "axios";
import { Video, Calendar, Clock, Link as LinkIcon, Copy, Check } from "lucide-react";

export default function ZoomScheduler() {
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("45");
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
      const res = await axios.post(
        "https://elearning-platform-backend-seven.vercel.appapi/zoom/create-meeting/",
        { topic, start_time: startTime, duration }
      );
      setMeetingInfo(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 text-white text-center p-6">
          <Video size={40} className="mx-auto mb-2" />
          <h2 className="text-xl font-bold">Zoom Scheduler</h2>
          <p className="text-sm opacity-80">
            Create live sessions for your students
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Topic */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Meeting Topic
            </label>
            <div className="flex items-center mt-1 bg-gray-100 rounded-lg px-3">
              <Video size={16} className="text-gray-500" />
              <input
                type="text"
                className="w-full bg-transparent p-2 outline-none"
                placeholder="e.g. Advanced React Patterns"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          {/* Time + Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Start Time
              </label>
              <div className="flex items-center mt-1 bg-gray-100 rounded-lg px-3">
                <Calendar size={16} className="text-gray-500" />
                <input
                  type="datetime-local"
                  className="w-full bg-transparent p-2 outline-none"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Duration
              </label>
              <div className="flex items-center mt-1 bg-gray-100 rounded-lg px-3">
                <Clock size={16} className="text-gray-500" />
                <select
                  className="w-full bg-transparent p-2 outline-none"
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

          {/* Button */}
          <button
            onClick={handleScheduleMeeting}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Generate Zoom Meeting"
            )}
          </button>

          {/* Result */}
          {meetingInfo && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
              
              <div className="flex items-center text-green-600 mb-3">
                <Check size={18} className="mr-2" />
                <span className="font-semibold text-sm">
                  Meeting Successfully Scheduled
                </span>
              </div>

              {/* Join Link */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Student Join Link
                </label>
                <div className="flex mt-1">
                  <input
                    readOnly
                    value={meetingInfo.join_url}
                    className="flex-1 text-sm p-2 border rounded-l-lg"
                  />
                  <button
                    onClick={() => copyToClipboard(meetingInfo.join_url)}
                    className="px-3 border border-l-0 rounded-r-lg bg-gray-100"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <a
                href={meetingInfo.start_url}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
              >
                Start Meeting as Host
              </a>

              <p className="text-xs text-gray-500 text-center mt-2">
                Only the instructor can use the start link.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}