import { useMemo } from "react";

function ProfileStars() {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 6,
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, []);

  return (
    <div className="profile-stars" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="profile-star"
          style={{
            left: ` ${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default ProfileStars;
