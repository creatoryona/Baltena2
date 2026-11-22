$port = 4000
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($connections) {
    foreach ($conn in $connections) {
        $pid = $conn.OwningProcess
        if ($pid -and $pid -ne 0) {
            Write-Host "Killing PID $pid on port $port"
            taskkill /pid $pid /T /F
        }
    }
} else {
    Write-Host "Port $port is free"
}

