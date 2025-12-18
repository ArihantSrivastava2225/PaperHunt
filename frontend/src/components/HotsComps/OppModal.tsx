import { useState } from "react";
import Modal from "react-modal";
import { toast } from "sonner";

interface OppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OppModal: React.FC<OppModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    membersNeeded: "",
    duration: "",
    status: "open",
    reachoutemail: "",
    stipend: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      title: form.title.trim(),
      description: form.description.trim(),
      skillsRequired: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      membersNeeded: parseInt(form.membersNeeded, 10) || 0,
      duration: form.duration.trim(),
      status: form.status,
      reachoutemail: form.reachoutemail,
      stipend: form.stipend.trim(),
    };

    const res = await fetch('/api/hots/research-opportunites/add', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    })
    const data = await res.json();
    if (data.success) {
      console.log(data.message);
      toast.success(data.message);
    } else {
      console.log(data.message);
      toast.error(data.message);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Research Opportunity"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 9999,
        },
        content: {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10000,
          width: "90%",
          maxWidth: "600px",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        },
      }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add Research Opportunity
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter research title"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief overview of your research"
            className="w-full p-2 border border-gray-300 rounded-md h-24"
            required
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Required Skills</label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="e.g. Python, Deep Learning, React"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Members Needed & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Members Needed</label>
            <input
              type="number"
              name="membersNeeded"
              value={form.membersNeeded}
              onChange={handleChange}
              placeholder="e.g. 3"
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 6 months"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Stipend */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Stipend</label>
          <input
            type="text"
            name="stipend"
            value={form.stipend}
            onChange={handleChange}
            placeholder="e.g. $1000/month or Unpaid"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Email to reach out to  */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email to Reach-Out-To</label>
          <input
            type="text"
            name="reachoutemail"
            value={form.reachoutemail}
            onChange={handleChange}
            placeholder="work@gmail.com"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default OppModal;
