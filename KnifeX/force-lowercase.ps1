# PowerShell script to convert ALL knife filenames to lowercase
# This handles mixed case files that weren't converted before

$knifeFolder = "d:\KnifeX\KnifeX\src\assets\knives"

# Get all knife subfolders
$knifeFolders = Get-ChildItem -Path $knifeFolder -Directory

foreach ($folder in $knifeFolders) {
    Write-Host "Processing folder: $($folder.Name)" -ForegroundColor Yellow
    
    # Get all PNG files in the folder
    $pngFiles = Get-ChildItem -Path $folder.FullName -Filter "*.png"
    
    foreach ($file in $pngFiles) {
        # Convert to lowercase
        $newName = $file.Name.ToLower()
        
        if ($newName -ne $file.Name) {
            $tempName = $file.Name + ".temp"
            $tempPath = Join-Path $folder.FullName $tempName
            $newPath = Join-Path $folder.FullName $newName
            
            # Use temp rename to avoid case-only rename issues on Windows
            try {
                Write-Host "  Converting: $($file.Name) -> $newName" -ForegroundColor Green
                Rename-Item -Path $file.FullName -NewName $tempName
                Rename-Item -Path $tempPath -NewName $newName
            }
            catch {
                Write-Host "  ERROR converting $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
}

Write-Host "All files converted to lowercase!" -ForegroundColor Cyan
