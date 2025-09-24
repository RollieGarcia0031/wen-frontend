import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function FormInput({type, label, value, onChange, defaultValue}: {
  type: string,
  label: string,
  value?: string,
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const [showPassword, setShowPassword] = useState(false);

  if (type === "password"){
    return (
      <>
      <label className="font-semibold">
        {label}:
      </label>
      <div
        className="flex-row-center gap-2"
      >
        <input type={`${showPassword ? "text" : "password"}`}
          value={value}
          defaultValue={defaultValue}
          name={label}
          onChange={onChange}
          required
        />
        <button
          type='button'
          onClick={() => setShowPassword(x=>!x)}
        >
          {showPassword ? <IoMdEyeOff/> : <IoMdEye/>}
        </button>
      </div>
      </>
    );
  }

  return (
    <>
    <label className="font-semibold">
      {label}:
    </label>
    <input type={type}
      value={value}
      defaultValue={defaultValue}
      name={label}
      onChange={onChange}
      required
    />
    </>
  );
}