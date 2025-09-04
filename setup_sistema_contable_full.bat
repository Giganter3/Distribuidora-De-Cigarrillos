@echo off
setlocal enabledelayedexpansion
echo ================================
echo  SISTEMA CONTABLE - INSTALADOR
echo ================================

:: -------- FUNCION PARA DESCARGAR --------
:download
powershell -Command "(New-Object Net.WebClient).DownloadFile('%1','%2')"
exit /b

:: -------- VERIFICAR PYTHON --------
echo.
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Python no encontrado. Instalando Python 3.12...
    call :download https://www.python.org/ftp/python/3.12.6/python-3.12.6-amd64.exe python_installer.exe
    start /wait python_installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
    del python_installer.exe
) ELSE (
    echo Python encontrado.
)

:: -------- VERIFICAR NODE.JS --------
echo.
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js no encontrado. Instalando Node.js LTS...
    call :download https://nodejs.org/dist/v20.15.1/node-v20.15.1-x64.msi node_installer.msi
    start /wait msiexec /i node_installer.msi /quiet
    del node_installer.msi
) ELSE (
    echo Node.js encontrado.
)

:: -------- VERIFICAR GIT --------
echo.
git --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Git no encontrado. Instalando Git...
    call :download https://github.com/git-for-windows/git/releases/download/v2.46.0.windows.1/Git-2.46.0-64-bit.exe git_installer.exe
    start /wait git_installer.exe /VERYSILENT /NORESTART
    del git_installer.exe
) ELSE (
    echo Git encontrado.
)

:: -------- BACKEND --------
echo.
echo ===== Preparando BACKEND =====
cd backend

python -m venv .venv
call .venv\Scripts\activate.bat

echo Instalando dependencias...
pip install --upgrade pip
pip install -r requirements.txt

echo Migrando base de datos...
python manage.py migrate

echo Creando superusuario admin/admin si no existe...
(
echo from django.contrib.auth.models import User;
echo User.objects.filter(username="admin").exists() or User.objects.create_superuser("admin","admin@example.com","admin")
) | python manage.py shell

:: Levantar backend en nueva ventana
start cmd /k "cd backend && call .venv\Scripts\activate.bat && python manage.py runserver"

cd ..

:: -------- FRONTEND --------
echo.
echo ===== Preparando FRONTEND =====
cd frontend
npm install

:: Levantar frontend en nueva ventana
start cmd /k "cd frontend && npm run dev"

cd ..

echo.
echo ================================
echo   SISTEMA CONTABLE listo!
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   Usuario:  admin
echo   Clave:    admin
echo ================================
pause
