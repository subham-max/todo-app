import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  trailing?: ReactNode
}

export function TextField({ label, trailing, ...inputProps }: TextFieldProps) {
  const generatedId = useId()
  const inputId = inputProps.id ?? generatedId

  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      {trailing ? (
        <span className="password-input">
          <input {...inputProps} id={inputId} />
          {trailing}
        </span>
      ) : (
        <input {...inputProps} id={inputId} />
      )}
    </div>
  )
}
