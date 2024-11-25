import PropTypes from "prop-types";
import { FaEdit, FaTrash } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import { useState } from "react";

const CommentComponent = ({ RatingDto, onDeleteClick }) => {
  const [comment, setComment] = useState(RatingDto?.comment);
  const [rating, setRating] = useState(RatingDto?.rating);
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
    onDeleteClick(RatingDto.id);
  };

  return (
    <div className="comment-component">
      <div className="comment-header">
        <h3>{RatingDto?.username}</h3>
      </div>
      <Rating
        name="rating"
        value={rating}
        onChange={(event, newRating) => {
          handleRatingChange(newRating);
        }}
      />
      {isEditing ? (
        <div>
          <textarea cols={70} value={comment} onChange={handleCommentChange} />
        </div>
      ) : (
        <p>{comment}</p>
      )}
      <div className="comment-actions">
        <FaEdit onClick={toggleEdit} />
        <FaTrash onClick={handleDelete} />
      </div>
    </div>
  );
};

CommentComponent.propTypes = {
  RatingDto: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default CommentComponent;
