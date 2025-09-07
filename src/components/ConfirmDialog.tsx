export default function ConfirmDialog({message, onConfirm, ref}: {
  message: string,
  onConfirm: () => void,
  ref: React.RefObject<HTMLDialogElement | null>
}) {
  return (
    <dialog ref={ref}>
      <div className="modal-action">
        <button onClick={close}>Close</button>
      </div>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">{message}</h3>
        <p className="py-4">Press ESC key or click on the button below to close</p>
        <button className="btn" onClick={onConfirm}>Confirm</button>
      </form>
    </dialog>
  );

  function close(){
    ref.current?.close();
  }
}