const Modal = ({ id, title, children, onClose, isOpen }) => {
  return (
    <div className={`modal ${isOpen ? "Flex" : "hide"}`} id={id}>
      <div className="modal-content">
        <span className="modal-title">{title}</span>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
