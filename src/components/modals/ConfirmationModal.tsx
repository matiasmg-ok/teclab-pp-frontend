import { useEffect, useState } from "react";
import Button from "../Button";
type ConfirmationModalProps = {
  verificationMethod: 'random_code' | 'none';
  title: string;
  Icon?: any;
  message?: string;
  cancelMessage?: string;
  errorMessage?: string;
  verificationCode?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export default function ConfirmationModal({ title, Icon, message, verificationMethod, onCancel, onConfirm }: ConfirmationModalProps) {
  const [randomCode, setRandomCode] = useState(Math.floor(Math.random() * 8090 + 1000));
  const [inputValue, setInputValue] = useState('');
  const [failedCode, setFailedCode] = useState(false);

  useEffect(() => {
    setFailedCode(randomCode.toString() !== inputValue)
  }, [inputValue, randomCode])

  function _onConfirm() {
    if (verificationMethod === 'random_code' && inputValue === randomCode.toString() && onConfirm) {
      setRandomCode(Math.floor(Math.random() * 8090 + 1000));
      onConfirm();
    }
  }

  function _onCancel() {
    setRandomCode(Math.floor(Math.random() * 8090 + 1000));
    if (onCancel) {
      onCancel();
    }
  }

  return <>
    <div className="fixed rounded-lg text-black dark:text-white font-roboto min-w-[20rem] px-10 py-10 min-h-[15rem] flex flex-col items-center justify-center top-[50%] translate-x-[-50%] translate-y-[-50%] left-[50%] bg-blue-100 dark:bg-slate-700 z-10">
      <p className="text-xl mb-2">{title}</p>
      {Icon && <span className="text-blue-500 dark:text-white"><Icon size={120} /></span>}
      <p>{message}</p>
      {
        verificationMethod === 'random_code' && <>
          <p className="mt-4">El código de confirmación es:</p>
          <p className="text-4xl mb-4 font-semibold text-blue-500 dark:text-white">{randomCode}</p>
          <input
            type="text"
            placeholder="Ingresa el código"
            className={`text-center text-2xl font-roboto py-2 bg-blue-50 dark:bg-slate-800 border-2 ${failedCode ? 'border-transparent' : 'border-green-500 outline-green-500'}`}
            value={inputValue}
            onChange={(e) => {
              if(isNaN(Number(e.target.value))) return;
              setInputValue(e.target.value)
            }}
          />
        </>
      }
      <div className="flex gap-4 mt-10">
        <Button onClick={_onCancel}>Cancelar</Button>
        {
          !failedCode &&
          <Button onClick={_onConfirm}>Confirmar</Button>
        }
      </div>
    </div>
  </>
}