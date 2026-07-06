import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify"

const AddPaperModal = ({ isOpen, onClose, paper }) => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [bookmark, setBookmark] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/user/library/add', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: category,
        title: title,
        bookmark: bookmark,
        doi: paper.doi,
        pdfLink: paper.pdfLink,
        authors: paper.authors,
      }),
    });

    if (res.ok) {
      toast.success('Paper added successfully!');
      onClose();
    } else {
      toast.error('Failed to add paper.');
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add To Library"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 9999,
        },
        content: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          zIndex: 10000,
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '550px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
        },
      }}
    >
      <h2 className="text-2xl font-bold !mb-4 text-center">Add this book to Library</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Input field for petname for book if any in mind */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='If you wish to call this something else you may give a title...'
          className="w-full p-2 border rounded mb-4"
        />
        {/* Textarea for book description or bookmarks */}
        <textarea
          value={bookmark}
          onChange={(e) => setBookmark(e.target.value)}
          placeholder="Type your book description here or a bookmark like on which page you left..."
          className="w-full p-2 border rounded mb-4"
        // rows="5"
        ></textarea>

        {/* Category Selection */}
        <select name="Category" id="" className="rounded-2xl outline-2 !p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select a Category</option>
          <option value="currently-reading">Currently Reading</option>
          <option value="next-up">Next Up</option>
          <option value="finished">Finished</option>
        </select>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 !bg-gray-300 rounded !hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 !bg-blue-500 text-white rounded hover:!bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddPaperModal
