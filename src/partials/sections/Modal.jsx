const Modal = ({ id, title, children, onClose, isOpen }) => {
  return (
    <div className={`modal ${isOpen ? "Flex" : "hide"}`} id={id}>
      <div className="modal-content">
        <header className="modal-header">
          <h2> {title}</h2>
          <button className="btn-close" onClick={onClose}></button>
        </header>
        <main className="modal-body">{children}</main>
      </div>
    </div>
  );
};

export default Modal;
