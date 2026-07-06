import Modal from 'react-modal'
import { useState } from 'react';
import { toast } from 'sonner';

const LibPaperModal = ({ isOpen, onClose, paper, onPaperChange }) => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [bookmark, setBookmark] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(paper._id);
    const res = await fetch(`/api/user/library/paper/${paper._id}/update`, {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        category: category,
        bookmark: bookmark,
      }),
    })
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
      onPaperChange();
      onClose();
    } else {
      toast.error(data.message);
      console.error(data.message);
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/user/library/paper/${paper._id}/delete`, {
      credentials: 'include',
      method: 'DELETE',
    })
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
      onPaperChange();
      onClose();
    } else {
      toast.error(data.message);
      console.error(data.message);
    }
  }

  const handleClose = async () => {
    const res = await fetch('/api/user/libmodal/close', {
      credentials: 'include',
      method: 'GET',
    })
    onClose();
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

      {/* Book Metadata Display */}
      <div className="mb-4 text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
        {paper.authors && paper.authors.length > 0 && (
          <p className="mb-1"><strong>Authors:</strong> {paper.authors.join(", ")}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-4">
          {paper.pdfLink && paper.pdfLink !== "N/A" && (
            <a href={paper.pdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
              View PDF
            </a>
          )}
          {paper.doi && paper.doi !== "N/A" && (
            <a href={paper.doi} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
              DOI Link
            </a>
          )}
        </div>
      </div>

      <form className="flex flex-col gap-4">
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
            onClick={handleClose}
            className="px-4 py-2 !bg-gray-300 rounded !hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 !bg-blue-500 text-white rounded hover:!bg-blue-600"
            onClick={handleUpdate}
          >
            Update
          </button>
          <button type="button" onClick={handleDelete} className="px-4 py-2 !bg-red-500 text-white rounded hover:!bg-red-600">
            Delete
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default LibPaperModal
