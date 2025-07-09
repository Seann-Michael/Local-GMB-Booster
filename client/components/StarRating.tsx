import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            readonly ? "cursor-default" : "cursor-pointer"
          } transition-all duration-300 transform ${
            readonly ? "" : "hover:scale-110"
          } ${
            star <= rating
              ? "fill-yellow-400 text-yellow-500 drop-shadow-lg"
              : "text-gray-300 hover:text-yellow-400 hover:fill-yellow-200"
          }`}
          onClick={() => handleStarClick(star)}
        />
      ))}
    </div>
  );
};
