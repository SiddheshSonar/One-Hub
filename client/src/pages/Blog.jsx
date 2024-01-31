import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';

const Blog = ({ onAddBlog }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const editor = useRef(null)
  

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content.');
      return;
    }

    // Create a new blog object
    const newBlog = {
      title,
      content,
      date: new Date().toLocaleDateString(),
    };

    // Call the onAddBlog function passed from the parent component
    onAddBlog(newBlog);

    // Clear the form
    setTitle('');
    setContent('');
  };

  return (
    <form className="max-w-2xl mx-auto mt-8" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-600 font-medium">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleTitleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue"
        />
      </div>
      <div className="mb-4" >
     
      <JoditEditor
        ref={editor}
        value={content}
        onChange={newContent=>setContent (newContent)}
      />
       <button
          type="submit"
          onClick={SubmitEvent}
          className="bg-blue text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        >
          Add Blog
        </button>
      </div>
     
    </form>
  );
};

export default Blog;
