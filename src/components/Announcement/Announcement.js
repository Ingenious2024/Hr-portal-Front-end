import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Avatar } from 'antd';
import { Container, Grid, Paper, CircularProgress } from '@mui/material';
import '@mui/material';
const { Meta } = Card;
const { Title } = Typography;

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://hrportal-backend.onrender.com/api/announcement');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const announcements = await response.json();
        setData(announcements);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = (postId) => {
    console.log(`Liked post ${postId}`);
  };

  const handleComment = (postId) => {
    console.log(`Commented on post ${postId}`);
  };

  return (
    <Container style={{ height: '100vh', overflowY: 'scroll' }}>
      <Title style={{ textAlign: 'center', margin: '20px 0' }}>Posts</Title>
      <Grid container spacing={3} justifyContent="center">
        {loading ? (
          <CircularProgress style={{ margin: '100px auto' }} />
        ) : (
          data.map((post) => (
            <Grid item key={post.id}>
              <Paper style={{ padding: '20px' }}>
                <Card>
                  <Meta
                    avatar={<Avatar src={post.avatar} />}
                    title={<Title level={4}>{post.author}</Title>}
                    description={post.timestamp}
                  />
                  <p>{post.content}</p>
                  <Button icon={<span role="img" aria-label="like">👍</span>} onClick={() => handleLike(post.id)}>
                    Like ({post.likes})
                  </Button>
                  <Button icon={<span role="img" aria-label="comment">💬</span>} onClick={() => handleComment(post.id)}>
                    Comment ({post.comments.length})
                  </Button>
                </Card>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default App;
