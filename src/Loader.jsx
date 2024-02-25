export function Loader() {
  return <p className="loader">⏳ Loading data... ⏳</p>;
}

export function ErrorModal({ message }) {
  return <div className="loader">⛔️ {message} ⛔️</div>;
}
