import React from 'react'

interface Value {}

const initialValue = {}

export const Context = React.createContext<Value>(initialValue)

export function Provider({ value, children }: { value: Value; children: any }) {
  return <Context.Provider value={value}>{children}</Context.Provider>
}
