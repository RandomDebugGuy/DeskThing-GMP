# build.ps1
Get-ChildItem -Path dist, "GMP-app-v*" | Remove-Item -Recurse -Force
vite build
npm run build-server
cd dist
& ../../7z/7z.exe a ..\GMP-app-v${env:npm_package_version}.zip .
