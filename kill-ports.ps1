$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
$port4000 = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue

if ($port3001) {
    foreach ($conn in $port3001) {
        Write-Host "Port 3001: PID $($conn.OwningProcess) State: $($conn.State)"
        if ($conn.OwningProcess -and $conn.OwningProcess -ne 0) {
            taskkill /pid $conn.OwningProcess /T /F
        }
    }
} else {
    Write-Host "Port 3001 is free"
}

if ($port4000) {
    foreach ($conn in $port4000) {
        Write-Host "Port 4000: PID $($conn.OwningProcess) State: $($conn.State)"
        if ($conn.OwningProcess -and $conn.OwningProcess -ne 0) {
            taskkill /pid $conn.OwningProcess /T /F
        }
    }
} else {
    Write-Host "Port 4000 is free"
}
