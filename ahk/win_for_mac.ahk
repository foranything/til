toast("Started", "win_for_mac.ahk started")

^y:: reload
LWin::Ctrl
Alt::LWin
CapsLock:: setToEng()
^CapsLock:: setToKor()

^+h:: KeyHistory

Send_ImeControl(DefaultIMEWnd, wParam, lParam) {
  DetectSave := A_DetectHiddenWindows
  DetectHiddenWindows,ON
  SendMessage 0x283, wParam,lParam,,ahk_id %DefaultIMEWnd%
  if (DetectSave <> A_DetectHiddenWindows)
    DetectHiddenWindows,%DetectSave%
  return ErrorLevel
}

IME_CHECK(WinTitle) {
  WinGet,hWnd,ID,%WinTitle%
  return Send_ImeControl(ImmGetDefaultIMEWnd(hWnd),0x005,"")
}

ImmGetDefaultIMEWnd(hWnd) {
  return DllCall("imm32\ImmGetDefaultIMEWnd", Uint,hWnd, Uint)
}

toast(title, msg) {
  TrayTip, %title%, %msg%
  SetTimer, hideTrayTip, -1500
}

hideTrayTip() {
  TrayTip
}

isKor() {
  return IME_CHECK("A")
}

setToKor() {
  if (isKor() = 0)
    Send, {vk15sc138}
}

setToEng() {
  if (isKor() = 1)
    Send, {vk15sc138}
}





