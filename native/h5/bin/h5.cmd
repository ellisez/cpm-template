@SET sourceDir=%~dp0..\..\..\

@SET cwd=%cd%
@cd /d %sourceDir%
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%sourceDir%\node_modules\@cpm\core\bin\h5.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%sourceDir%\node_modules\@cpm\core\bin\h5.js" %*
  @ENDLOCAL
)

@cd /d %cwd%
