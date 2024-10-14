import { IconType } from "react-icons"

export type RequestingContent = {
  title: string
  Icon?: IconType | null
  action: VoidFunction
  show: boolean
}