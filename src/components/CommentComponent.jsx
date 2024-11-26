import PropTypes from "prop-types";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { useState } from "react";

const CommentComponent = ({
  RatingDto,
  onDeleteClick,
  onSaveClick,
  onCancleClick,
}) => {
  const [comment, setComment] = useState(RatingDto?.comment);
  const [rating, setRating] = useState(RatingDto?.rating);
  const [isEditing, setIsEditing] = useState(RatingDto?.isEditting ?? false);

  const userInformation = JSON.parse(sessionStorage.getItem("userInfo"));

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
    onSaveClick({ id: RatingDto.id, rating, comment });
    setIsEditing(false);
  };

  const handleCancle = () => {
    onCancleClick();
    setIsEditing(false);
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
        readOnly={!isEditing}
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
          {isEditing ? (
            <div>
              <Button onClick={handleSave}>Lưu</Button>
              <Button onClick={handleCancle}>Hủy</Button>
            </div>
          ) : (
            <div>
              <Button onClick={toggleEdit}>Cập nhật</Button>
              <Button onClick={handleDelete}>Xóa</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

CommentComponent.propTypes = {
  RatingDto: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onCancleClick: PropTypes.func.isRequired,
};

export default CommentComponent;
