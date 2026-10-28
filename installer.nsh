; Use one application folder; do not append the product name to a selected app folder.
!macro EmbeeNormalizeInstallDir label
  Push $R0
  Push $R1
  Push $R2
  ${If} $INSTDIR == "$PROGRAMFILES"
  ${OrIf} $INSTDIR == "$PROGRAMFILES64"
  ${OrIf} $INSTDIR == "$LOCALAPPDATA\Programs"
    StrCpy $INSTDIR "$INSTDIR\EmbeeWeby"
  ${EndIf}
  ${GetFileName} "$INSTDIR" $R0
  ${If} $R0 == "EmbeeWeby"
  ${OrIf} $R0 == "EmbeeWebi"
    ${GetParent} "$INSTDIR" $R1
    embee_collapse_${label}:
    ${GetFileName} "$R1" $R2
    ${If} $R2 == "EmbeeWeby"
    ${OrIf} $R2 == "EmbeeWebi"
      ${GetParent} "$R1" $R1
      Goto embee_collapse_${label}
    ${EndIf}
    StrCpy $INSTDIR "$R1\EmbeeWeby"
  ${EndIf}
  Pop $R2
  Pop $R1
  Pop $R0
!macroend
!macro customInit
  !insertmacro EmbeeNormalizeInstallDir init
!macroend
; Override electron-builder's directory-page append step, including upgrades.
!macro customPageAfterChangeDir
  !undef MUI_PAGE_CUSTOMFUNCTION_PRE
  !define MUI_PAGE_CUSTOMFUNCTION_PRE EmbeeInstFilesPre
  Function EmbeeInstFilesPre
    ; Keep the stock helper linked, but preserve the selected directory.
    Push $INSTDIR
    Call instFilesPre
    Pop $INSTDIR
    !insertmacro EmbeeNormalizeInstallDir files
  FunctionEnd
!macroend
