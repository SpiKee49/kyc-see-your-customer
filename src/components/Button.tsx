import React, { PropsWithChildren } from "react"

type Props = {
  disabled: boolean
  handleClick: () => void
}

function Button(props: PropsWithChildren<Props>) {
  return (
    <button
      disabled={props.disabled}
      onClick={() => props.handleClick()}
      className="w-full border-sky-600 border-2 rounded-xl py-3 mt-2 text-sky-600 enabled:hover:bg-sky-600 enabled:hover:text-white transition-all duration-200 enabled:hover:border-sky-600 disabled:opacity-50 disabled:bg-slate-200"
    >
      {props.children}
    </button>
  )
}

export default Button
