import React, { useEffect, useState } from 'react';

import Container from '../common/Container';
import Post from './Post';
import axios from 'axios';
import styled from '@emotion/styled';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(0);
  const { isSmallerDevice } = useWindowWidth();
  const [limit, setLimit] = useState(isSmallerDevice ? 5 : 10); // Number of posts to load each time based on device type
  const [hasMore, setHasMore] = useState(true); // flag to track if there are more items that can be loaded

  // load posts on initial page render
  useEffect(() => {
    setLimit(isSmallerDevice ? 5 : 10);
    setStart(0); // Reset start when limit changes
    setPosts([]); // Reset posts when limit changes
    setHasMore(true); // Reset hasMore when limit changes
    fetchPosts(); // Fetch posts with the new limit
  }, [isSmallerDevice]);

  // load posts from server
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data: newPosts } = await axios.get('/api/v1/posts', {
        params: { start, limit },
      });

      if (newPosts.length > 0) {
        setPosts([...posts, ...newPosts]); // Append new posts to the existing ones
        setStart(start + limit); // Increment start for the next fetch
      } else {
        setHasMore(false); // No more posts to load
      }
    } catch (error) {
      console.error('Error in fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // load more button onClick handler
  const handleClick = () => {
    if (!isLoading && hasMore) {
      fetchPosts();
    }
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map((post, i) => (
          <Post post={post} key={i} />
        ))}
      </PostListContainer>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {hasMore && ( // show option to load more posts only when more posts are available
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        )}
      </div>
    </Container>
  );
}
