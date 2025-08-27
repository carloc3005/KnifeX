# PowerShell script to convert all knife filenames to lowercase
# This makes everything consistent and web-friendly

$knifeFolder = "d:\KnifeX\KnifeX\src\assets\knives"

# Get all knife subfolders
$knifeFolders = Get-ChildItem -Path $knifeFolder -Directory

foreach ($folder in $knifeFolders) {
    Write-Host "Processing folder: $($folder.Name)" -ForegroundColor Yellow
    
    # Get all PNG files in the folder
    $pngFiles = Get-ChildItem -Path $folder.FullName -Filter "*.png"
    
    foreach ($file in $pngFiles) {
        # Convert to lowercase and replace spaces with dashes
        $newName = $file.Name.ToLower()
        
        if ($newName -ne $file.Name) {
            $newPath = Join-Path $folder.FullName $newName
            
            # Check if target file already exists
            if (Test-Path $newPath) {
                Write-Host "  WARNING: Target file already exists: $newName" -ForegroundColor Red
            } else {
                Write-Host "  Converting to lowercase: $($file.Name) -> $newName" -ForegroundColor Green
                Rename-Item -Path $file.FullName -NewName $newName
            }
        }
    }
}

Write-Host "Lowercase conversion complete!" -ForegroundColor Cyan
