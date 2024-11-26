import PropTypes from "prop-types";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { useState } from "react";

const CommentComponent = ({ RatingDto, onDeleteClick, onSaveClick }) => {
  const [comment, setComment] = useState(RatingDto?.comment);
  const [rating, setRating] = useState(RatingDto?.rating);
  const [isEditing, setIsEditing] = useState(false);

  const userInformation = JSON.parse(localStorage.getItem("userInfo"));

  const isOwner = RatingDto?.userId === userInformation?.id;

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
    onDeleteClick(RatingDto.id);
  };

  const handleSave = () => {
    onSaveClick({id: RatingDto.id, rating, comment});
    setIsEditing(false);
  }

  if (!RatingDto) {
    RatingDto = {};
  }

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
      {isOwner && (
        <div className="comment-buttons">
          <Button onClick={toggleEdit}>{isEditing ? "Cancel" : "Edit"}</Button>
          <Button onClick={handleDelete}>Delete</Button>
          {isEditing && <Button onClick={handleSave}>Save</Button>}
        </div>
      )}
    </div>
  );
};

CommentComponent.propTypes = {
  RatingDto: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
};

export default CommentComponent;
