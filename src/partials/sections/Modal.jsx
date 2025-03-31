const Modal = ({ children, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <p>Modal content here</p>
        {children}
      </div>
    </div>
  );
};

export default Modal;
