import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';

const JobPostList = () => {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        
        const requestData = {
          company_id: user.company_id,
        };

        const response = await axios.post('https://api.rightships.com/company/application/get', requestData );

        console.log(response.data.applications);

        if (response.data.code === 200) {
          setPosts(response.data.applications); // Assuming the response contains the list of posts
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
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Job Posts</h2>
      <ul>
       {posts.map((post) => (
          <li key={post.application_id}>
            <h3>{post.company_name}</h3>
            <p>Job Title: {post.jobTitle}</p>
            <p>Hiring for: {post.hiring_for.join(', ')}</p>
            <p>Description: {post.description}</p>
            <p>Email: {post.email || 'N/A'}</p>
            <p>Mobile No: {post.mobile_no}</p>
            <p>Open Positions: {post.open_positions.join(', ')}</p>
            <p>Ranks: {post.ranks.join(', ')}</p>
            <p>Benefits: {post.benefits.join(', ')}</p>
            <p>Ship Types: {post.ship_types.join(', ')}</p>
            <p>Status: {post.status}</p>
            <p>Created Date: {new Date(post.created_date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobPostList;
