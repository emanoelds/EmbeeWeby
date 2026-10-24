; Keep the installation folder aligned with the current product name.
; Custom folders and explicit /D selections remain under the user's control.
!macro customInit
  Push $R0
  Push $R1
  !insertmacro GetDParameter $R0
  ${If} $R0 == ""
    ${GetFileName} "$INSTDIR" $R0
    ${If} $R0 == "EmbeeWebi"
    ${OrIf} $R0 == "embeeweby"
      ${GetParent} "$INSTDIR" $R1
      StrCpy $INSTDIR "$R1\EmbeeWeby"
    ${EndIf}
  ${EndIf}
  Pop $R1
  Pop $R0
!macroend
