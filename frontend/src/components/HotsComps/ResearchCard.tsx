import React from "react";
import { Mail, Users, Clock } from "lucide-react";

interface ResearchCardProps {
  title: string;
  description: string;
  skillsRequired: string[];
  membersNeeded: number;
  membersJoined: number;
  duration: string;
  status: string;
  createdByEmail: string;
  stipend?: string;
}

const ResearchCard: React.FC<ResearchCardProps> = ({
  title,
  description,
  skillsRequired,
  membersNeeded,
  membersJoined,
  duration,
  status,
  createdByEmail,
  stipend
}) => {
  const openMail = () => {
    window.location.href = `mailto:${createdByEmail}?subject=Interest in ${title}`;
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6">
      <div>
        <h2 className="mb-2 break-words text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {skillsRequired.map((skill, i) => (
            <span
              key={i}
              className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="text-sm text-gray-500 flex flex-col gap-1">
          <span className="flex items-center gap-1">
            <Users size={14} /> {membersJoined}/{membersNeeded} Members
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {duration}
          </span>
          {stipend && (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              💰 {stipend}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "open"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
            }`}
        >
          {status.toUpperCase()}
        </span>

        {status === "open" && (
          <button
            onClick={openMail}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"
          >
            <Mail size={14} /> Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default ResearchCard;
