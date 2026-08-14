function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state-icon">!</div>

      <h3>Щось пішло не так</h3>

      <p>{message}</p>

      <button type="button" onClick={onRetry}>
        Спробувати ще раз
      </button>
    </div>
  );
}

export default ErrorState;
