import { useState } from 'react';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CommentComponent = ({ initialComment, initialRating, commentor }) => {
  const [comment, setComment] = useState(initialComment);
  const [rating, setRating] = useState(initialRating);
  const [isEditing, setIsEditing] = useState(false);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Comment deleted');
  };

  return (
    <div className="comment-component">
      <div className="comment-header">
        <h3>{commentor}</h3>
        <div className="comment-actions">
          <FaEdit onClick={toggleEdit} />
          <FaTrash onClick={handleDelete} />
        </div>
      </div>
      <StarRatings
        rating={rating}
        starRatedColor="gold"
        changeRating={handleRatingChange}
        numberOfStars={5}
        name='rating'
        starDimension="20px"
        starSpacing="2px"
        starHoverColor="gold"
        starEmptyColor="gray"
        starSelectingHoverColor="gold"
      />
      {isEditing ? (
        <textarea value={comment} onChange={handleCommentChange} />
      ) : (
        <p>{comment}</p>
      )}
    </div>
  );
};

CommentComponent.propTypes = {
  initialComment: PropTypes.string.isRequired,
  initialRating: PropTypes.number.isRequired,
  commentor: PropTypes.string.isRequired,
};

export default CommentComponent;