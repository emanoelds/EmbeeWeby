!include "nsDialogs.nsh"
!ifndef BUILD_UNINSTALLER
Var EmbeeDesktopChoice
Var EmbeeDesktopCheckbox
!endif
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
  ReadRegDWORD $EmbeeDesktopChoice HKCU "Software\EmbeeWeby" "CreateDesktopShortcut"
  ${If} ${Errors}
    StrCpy $EmbeeDesktopChoice 1
    ${If} ${FileExists} "$INSTDIR\EmbeeWeby.exe"
    ${AndIfNot} ${FileExists} "$DESKTOP\EmbeeWeby.lnk"
      StrCpy $EmbeeDesktopChoice 0
    ${EndIf}
  ${EndIf}
  ${If} ${isNoDesktopShortcut}
    StrCpy $EmbeeDesktopChoice 0
  ${EndIf}
!macroend
; Override electron-builder's directory-page append step, including upgrades.
!macro customPageAfterChangeDir
  !undef MUI_PAGE_CUSTOMFUNCTION_PRE
  !define MUI_PAGE_CUSTOMFUNCTION_PRE EmbeeInstFilesPre
  Page custom EmbeeOptionsCreate EmbeeOptionsLeave
  Function EmbeeOptionsCreate
    ${If} ${Silent}
    ${OrIf} ${isUpdated}
      Abort
    ${EndIf}
    !insertmacro MUI_HEADER_TEXT "Atalhos do EmbeeWeby" "Escolha como acessar o navegador."
    nsDialogs::Create 1018
    Pop $0
    ${If} $0 == error
      Abort
    ${EndIf}
    ${NSD_CreateCheckbox} 0 15u 100% 18u "Criar atalho na área de trabalho"
    Pop $EmbeeDesktopCheckbox
    ${NSD_SetState} $EmbeeDesktopCheckbox $EmbeeDesktopChoice
    nsDialogs::Show
  FunctionEnd
  Function EmbeeOptionsLeave
    ${NSD_GetState} $EmbeeDesktopCheckbox $EmbeeDesktopChoice
  FunctionEnd
  Function EmbeeInstFilesPre
    ; Keep the stock helper linked, but preserve the selected directory.
    Push $INSTDIR
    Call instFilesPre
    Pop $INSTDIR
    !insertmacro EmbeeNormalizeInstallDir files
  FunctionEnd
!macroend

!macro customInstall
  WriteRegDWORD HKCU "Software\EmbeeWeby" "CreateDesktopShortcut" $EmbeeDesktopChoice
  ${If} ${FileExists} "$newStartMenuLink"
    CreateShortCut "$newStartMenuLink" "$appExe" "" "$INSTDIR\resources\app-icon-${VERSION}.ico" 0
    WinShell::SetLnkAUMI "$newStartMenuLink" "${APP_ID}"
  ${EndIf}
  ${If} $EmbeeDesktopChoice == 1
    CreateShortCut "$newDesktopLink" "$appExe" "" "$INSTDIR\resources\app-icon-${VERSION}.ico" 0
    WinShell::SetLnkAUMI "$newDesktopLink" "${APP_ID}"
  ${Else}
    Delete "$newDesktopLink"
  ${EndIf}
  System::Call "Shell32::SHChangeNotify(i 0x8000000, i 0, i 0, i 0)"
!macroend
!macro customUnInstall
  Delete "$DESKTOP\EmbeeWeby.lnk"
!macroend
