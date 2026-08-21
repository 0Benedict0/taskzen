interface LoadingStateProps {
  message?: string;
}

function LoadingState({ message = "Завантаження..." }: LoadingStateProps) {
  return (
    <div className="loading-state">
      <div className="loading-spinner" />

      <p>{message}</p>
    </div>
  );
}

export default LoadingState;
