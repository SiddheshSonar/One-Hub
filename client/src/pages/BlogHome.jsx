import * as React from 'react';
import Button from '@mui/material/Button';
import Home from '../components/blog/pages/Home'
import { useNavigate } from 'react-router-dom';


const BlogHome = () => {
const navigate = useNavigate()
    function goToAddBlog(){
    navigate("/AddBlog")
}
    return (
        <div className="">
            <Button variant="contained" onClick={goToAddBlog} className=" items-center mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
      Add a new blog 
    </Button>
           <Home />
          
            
        </div>
    );
};

export default BlogHome;