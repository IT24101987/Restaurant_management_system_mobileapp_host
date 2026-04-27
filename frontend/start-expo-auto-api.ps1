## Auto-detect LAN IPv4 and set EXPO_PUBLIC_API_URL before starting Expo.
## Run from repo root or from the "mobile app" folder.

$ErrorActionPreference = "Stop"

# Find the interface used for the default route, then pick its IPv4 address.
$route = Get-NetRoute -DestinationPrefix "0.0.0.0/0" |
  Sort-Object -Property RouteMetric, InterfaceMetric |
  Select-Object -First 1

if (-not $route) {
  throw "Could not determine default route. Is the network connected?"
}

$ip = Get-NetIPAddress -InterfaceIndex $route.InterfaceIndex -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike "169.254*" } |
  Select-Object -First 1 -ExpandProperty IPAddress

if (-not $ip) {
  throw "Could not determine LAN IPv4 address."
}

$env:EXPO_PUBLIC_API_URL = "http://$ip:3000"
Write-Host "EXPO_PUBLIC_API_URL set to $env:EXPO_PUBLIC_API_URL"

Push-Location $PSScriptRoot
try {
  npx expo start -c
}
finally {
  Pop-Location
}
