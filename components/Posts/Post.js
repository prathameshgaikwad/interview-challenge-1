import React, { useRef } from 'react';

import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'relative',
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
  loading: 'lazy',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

// This will display the user info
const ContentHeader = styled.div(() => ({
  display: 'flex',
  padding: '10px',
  gap: '10px',
  '& > h4:first-of-type': {
    // User First and Last name - first letter in a circle
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#000',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    textAlign: 'center',
  },
}));

// User First and Last Name with email in small text
const ContentInfo = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const Button = styled.button(() => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)', // align the button to image center
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
}));

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

const Post = ({ post }) => {
  const carouselRef = useRef(null);

  // Extract first letter and last letter of user's name to use as placeholder
  const getUserInitials = () => {
    const names = post.user.name.split(' ');
    const firstNameInitial = names[0].charAt(0);
    const lastNameInitial = names[names.length - 1].charAt(0);
    return `${firstNameInitial}${lastNameInitial}`;
  };

  const handleNextClick = () => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.querySelector('div').offsetWidth; // get image item width
      carouselRef.current.scrollBy({
        left: itemWidth, // transform left by moving a distance equal to image item width
        behavior: 'smooth', // make behaviour smooth for better appearance
      });
    }
  };

  const handlePrevClick = () => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.querySelector('div').offsetWidth;
      carouselRef.current.scrollBy({
        left: -itemWidth, // transform in the opposite direction
        behavior: 'smooth',
      });
    }
  };

  return (
    <PostContainer>
      <ContentHeader>
        <h4>{getUserInitials()}</h4>
        <ContentInfo>
          <h4>{post.user.name}</h4>
          <p>
            <small>{post.user.email}</small>
          </p>
        </ContentInfo>
      </ContentHeader>
      <CarouselContainer>
        <Carousel ref={carouselRef}>
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <Image src={image.url} alt={post.title} />
            </CarouselItem>
          ))}
        </Carousel>
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    content: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      }),
    ),
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    }),
    title: PropTypes.string,
    body: PropTypes.string,
  }),
};

export default Post;
