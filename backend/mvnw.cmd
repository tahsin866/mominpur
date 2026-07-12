@REM Maven Wrapper startup script for Windows
@echo off
setlocal

set "MAVEN_PROJECTDIR=%~dp0"
set "WRAPPER_JAR=%MAVEN_PROJECTDIR%.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%MAVEN_PROJECTDIR%.mvn\wrapper\maven-wrapper.properties"
set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6"

if exist "%WRAPPER_JAR%" (
    java -jar "%WRAPPER_JAR%" %*
    goto end
)

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo Downloading Maven 3.9.6...
    mkdir "%MAVEN_HOME%" 2>nul
    for /f "tokens=2 delims==" %%a in ('findstr /i "distributionUrl" "%WRAPPER_PROPERTIES%"') do set "DOWNLOAD_URL=%%a"
    powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%TEMP%\maven.zip'"
    powershell -Command "Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%TEMP%\maven-extract' -Force"
    xcopy /E /I /Q /Y "%TEMP%\maven-extract\apache-maven-3.9.6\*" "%MAVEN_HOME%\" >nul
    rmdir /S /Q "%TEMP%\maven-extract" 2>nul
    del "%TEMP%\maven.zip" 2>nul
)

"%MAVEN_HOME%\bin\mvn.cmd" %*

:end
endlocal
