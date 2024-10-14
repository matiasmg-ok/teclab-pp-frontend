import { IconType } from "react-icons"

export type PopupContent = {
  message: string
  Icon?: IconType | null
  show: boolean
  hideAcceptButton?: boolean
}