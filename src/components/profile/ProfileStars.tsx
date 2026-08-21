import { useMemo, type CSSProperties } from "react";

interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

function ProfileStars() {
  const stars = useMemo<Star[]>(() => {
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
      {stars.map((star) => {
        const style: CSSProperties = {
          left: ` ${star.left}%`,
          top: ` ${star.top}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: star.opacity,
          animationDelay: `${star.delay}s`,
          animationDuration: `${star.duration}s`,
        };

        return <span key={star.id} className="profile-star" style={style} />;
      })}
    </div>
  );
}

export default ProfileStars;
