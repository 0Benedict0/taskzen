function LoadingState({ message = "Завантаження..." }) {
  return (
    <div className="loading-state">
      <div className="loading-spinner" />
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;
