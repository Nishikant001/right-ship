import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const JobPostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  // Unified Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('created_date');

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const requestData = {
          company_id: user.company_id,
        };

        const response = await axios.post(
          'https://api.rightships.com/company/application/get',
          requestData
        );

        if (response.data.code === 200) {
          setPosts(response.data.applications);
          setLoading(false);
        } else {
          console.error('Failed to fetch posts:', response.data);
          setError('Failed to fetch posts.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error while fetching posts:', error);
        setError('An error occurred while fetching posts.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user.company_id]);

  const handleActionClick = (action, postId) => {
    console.log(`Action: ${action} on post ID: ${postId}`);
    // Implement your logic here based on the action (e.g., pause, delete, start)
  };

  // Filter Logic based on search term
  const filteredPosts = posts
    .filter((post) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
    
        (post.ranks && post.ranks.join(', ').toLowerCase().includes(lowerCaseSearchTerm)) ||
        (post.benefits && post.benefits.join(', ').toLowerCase().includes(lowerCaseSearchTerm))
      );
    })
    .sort((a, b) => {
      if (sortField === 'created_date') {
        return sortOrder === 'asc'
          ? new Date(a.created_date) - new Date(b.created_date)
          : new Date(b.created_date) - new Date(a.created_date);
      } else if (sortField === 'status') {
        return sortOrder === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Job Posts</h2>

      {/* Search and Sorting */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by Job Title, Rank, or Benefits"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-full md:w-1/2"
        />
        <div className="flex items-center gap-4">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="created_date">Sort by Posted Date</option>
            <option value="status">Sort by Job Status</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>            
              <th className="px-4 py-2 border-b text-left">Hiring For Ship</th>
              <th className="px-4 py-2 border-b text-left">Open Positions</th>
              <th className="px-4 py-2 border-b text-left">Created Date</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
                <tr key={post.application_id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{post.hiring_for.join(', ')}</td>
                <td className="px-4 py-2 border-b">{post.open_positions.join(', ')}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(post.created_date).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b">{post.status}</td>
                <td className="px-4 py-2 border-b">
                  <div className="relative inline-block text-left">
                    <button className="inline-flex justify-center w-full px-2 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none">
                      Actions
                    </button>
                    <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                      <div className="py-1">
                        <button
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleActionClick('pause', post.application_id)}
                        >
                          Pause
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleActionClick('delete', post.application_id)}
                        >
                          Delete
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleActionClick('start', post.application_id)}
                        >
                          Start
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 ${
              currentPage === index + 1 ? 'bg-blue-700' : ''
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
          className={`px-3 py-1 mx-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 ${
            currentPage === Math.ceil(filteredPosts.length / postsPerPage)
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobPostList;
