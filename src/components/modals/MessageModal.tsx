import Button from "../Button";
type MessageModalProps = {
  Icon?: any;
  message?: string;
  verificationCode?: string;
  onConfirm?: () => void;
  hideAcceptButton?: boolean;
}

export default function MessageModal({ Icon, message, onConfirm, hideAcceptButton }: MessageModalProps) {
  function _onConfirm() {
    onConfirm && onConfirm();
  }

  return message &&
    <>
      <div className="fixed rounded-lg text-black border-4 border-blue-400 dark:border-none dark:text-white font-roboto min-w-[20rem] px-10 py-10 min-h-[15rem] flex flex-col items-center justify-center top-[50%] translate-x-[-50%] translate-y-[-50%] left-[50%] bg-blue-100 dark:bg-slate-700 z-10">
        {Icon && <span className="text-blue-500 dark:text-white"><Icon size={120} /></span>}
        <p className="mt-4 whitespace-pre-line">{message}</p>
        <div className="flex gap-4 mt-4">
          {!hideAcceptButton && <Button onClick={_onConfirm}>Aceptar</Button>}
        </div>
      </div>
    </>
}