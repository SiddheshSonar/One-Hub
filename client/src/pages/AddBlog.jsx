import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function AddBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'], ['link', 'image']
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  const handlePost = () => {
    // You can handle the blog post submission here
    console.log("Title:", title);
    console.log("Content:", content);
    // Add your logic to send the blog post to the server or perform any necessary actions.
  };

  return (<>
    
    <div className="flex flex-col items-center justify-start mx-auto mt-8 space-y-4 w-full h-full">
      {/* Title */}
      <h3 className="w-1/2 p-2 ">Enter Title</h3>
      <input
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-1/2 p-2 border rounded"
      />

      {/* Quill Editor */}
      <ReactQuill
        modules={modules}
        theme="snow"
        value={content}
        onChange={setContent}
        className="w-1/2 h-64 p-4  rounded"
      />

      {/* Post Button */}
      <button
        onClick={handlePost}
        className="bg-blue-500 text-black px-4 py-2 border rounded hover:bg-blue-700 absolute bottom-0"
      >
        Add Post
      </button>
    </div>
    </>
  );
}

export default AddBlog;
