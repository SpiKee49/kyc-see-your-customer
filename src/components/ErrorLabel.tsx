import React, { PropsWithChildren } from "react"

export default function ErrorLabel(props: PropsWithChildren) {
  return (
    <small className="w-full text-center font-normal text-red-600 text-sm">
      {props.children}
    </small>
  )
}
